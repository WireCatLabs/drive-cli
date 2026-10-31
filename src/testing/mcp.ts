import { PassThrough } from "node:stream"
import { Client, ReadBuffer, serializeMessage, type Transport } from "@modelcontextprotocol/client"
import type { ProgramOptions } from "../program.js"
import { run } from "../program.js"

const overStreams = (input: PassThrough, output: PassThrough): Transport => {
  const buffer = new ReadBuffer()
  const transport: Transport = {
    start: async () => {
      output.on("data", (chunk: Buffer) => {
        buffer.append(chunk)
        for (let message = buffer.readMessage(); message; message = buffer.readMessage()) transport.onmessage?.(message)
      })
    },
    send: async (message) => {
      input.write(serializeMessage(message))
    },
    close: async () => {
      input.end()
      transport.onclose?.()
    },
  }
  return transport
}

/**
 * `drive default mcp serve <flags>` as an agent runs it, on streams of its own, with a connected client. `close` ends
 * the server and resolves to its exit code.
 */
export const mcpClient = async (
  options: ProgramOptions = {},
  flags: string[] = [],
  argv = ["default", "mcp", "serve"],
) => {
  const stdin = new PassThrough()
  const stdout = new PassThrough()
  const diagnostic: string[] = []
  const serving = run([...argv, ...flags], {
    tty: false,
    streams: { data: () => {}, diagnostic: (text) => diagnostic.push(text) },
    ...options,
    stdin,
    stdout,
  } as ProgramOptions)
  const client = new Client({ name: "test", version: "1.0.0" })
  const ended = serving.then((code) => {
    throw new Error(`mcp serve ended with ${code} before the client connected: ${diagnostic.join("")}`)
  })
  await Promise.race([client.connect(overStreams(stdin, stdout)), ended])
  ended.catch(() => {})
  return {
    client,
    diagnostic,
    close: async () => {
      await client.close()
      return serving
    },
  }
}

export interface ToolAnswer {
  isError?: boolean
  structuredContent: {
    item?: Record<string, unknown>
    items?: Record<string, unknown>[]
    error?: { code: string; message: string; permission?: string }
  }
}

type Connected = Pick<Client, "callTool">

/** One tool call as an agent makes it: `drive_read` or `drive_write` with a command and its arguments. */
export const callTool = async (
  client: Connected,
  name: "drive_read" | "drive_write",
  command: string,
  args: Record<string, unknown> = {},
) => (await client.callTool({ name, arguments: { command, arguments: args } })) as unknown as ToolAnswer
