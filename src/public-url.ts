import { CliError } from "@wirecat/cli-base"

// A copy of cli-core src/http/public-url.ts, which no cli-core package entry exports yet:
// https://github.com/WireCatLabs/cli-core/issues/1902
const EXAMPLE = "--public-url https://<name>.ts.net"

export const publicUrlOf = (given: string | undefined): URL => {
  if (!given) throw new CliError("configuration_error", `--http needs the tunnel's address: ${EXAMPLE}`)
  let url: URL
  try {
    url = new URL(given)
  } catch {
    throw new CliError("validation_error", `--public-url is not an address: ${EXAMPLE}`)
  }
  const local = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)
  if (url.protocol !== "https:" && !local)
    throw new CliError("validation_error", "--public-url must be https — the browser apps reach drive through it")
  if (url.pathname !== "/" || url.search || url.hash)
    throw new CliError("validation_error", `--public-url is the tunnel's address only, without a path: ${EXAMPLE}`)
  return url
}

export const portOf = (given: string | undefined, fallback: number): number => {
  if (given === undefined) return fallback
  const port = Number(given)
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new CliError("validation_error", "--port takes 1–65535")
  return port
}
