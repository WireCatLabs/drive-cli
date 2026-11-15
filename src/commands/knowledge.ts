import { addDocumentKnowledgeCommands, type DocumentKnowledgeCommands } from "@wirecat/cli-core/documents/cli"
import type { Command } from "commander"
import type { DocumentKnowledge } from "../knowledge.js"
import { DRIVE_WORDS } from "./context.js"

export interface KnowledgeCommands extends Omit<DocumentKnowledgeCommands, "words" | "run"> {
  run<T>(input: string, fn: (knowledge: DocumentKnowledge, principal: string, ref: string) => Promise<T>): Promise<T>
}

export const installKnowledgeCommands = (program: Command, helpers: KnowledgeCommands) =>
  addDocumentKnowledgeCommands(program, { ...helpers, words: DRIVE_WORDS })
