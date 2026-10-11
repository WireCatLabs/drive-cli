import { describe, expect, it } from "vitest"
import { adaptDiscovery } from "./discovery-adapter.ts"

const fixture = () => ({
  drive: {
    name: "drive",
    schemas: {
      File: { type: "object", properties: { size: { type: "string", format: "int64" }, self: { $ref: "File" } } },
    },
    resources: {
      files: {
        methods: {
          get: {
            id: "drive.files.get",
            path: "files/{fileId}",
            httpMethod: "GET",
            scopes: ["scope"],
            parameters: { fileId: { type: "string", location: "path", required: true } },
            response: { $ref: "File" },
          },
        },
      },
    },
  },
})
describe("Discovery consumer adapter into shared codegen", () => {
  it("retains references, exact string IDs, required parameters and OAuth metadata", () => {
    const { model, metadata } = adaptDiscovery(fixture())
    expect(model.operations[0]).toMatchObject({
      id: "drive.files.get",
      effect: "read",
      parameters: [{ name: "fileId", required: true }],
    })
    expect(metadata.scopes["drive.files.get"]).toEqual(["scope"])
    expect(model.schemas[0]?.schema).toMatchObject({
      properties: { size: { type: "string", pattern: "^-?\\d+$" }, self: { type: "ref", ref: "drive_File" } },
    })
  })
  it("refuses unknown constraints instead of silently weakening validation", () => {
    const source = fixture()
    Object.assign(source.drive.schemas.File.properties.size, { inventedConstraint: true })
    expect(() => adaptDiscovery(source)).toThrow("unsupported schema keyword")
  })
})
