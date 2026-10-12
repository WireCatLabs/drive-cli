// GENERATED. DO NOT EDIT.
// Source: spec/google/*.json, verified by provenance.json
// Run: pnpm generate

import type { ManifestOperation } from "@wirecat/cli-base/codegen"

export const operations: readonly ManifestOperation[] = [
  {
    id: "docs.documents.batchUpdate",
    command: "docs-documents-batch-update",
    binding: {
      kind: "http",
      method: "POST",
      path: "v1/documents/{documentId}:batchUpdate",
    },
    effect: "write",
    summary:
      "Applies one or more updates to the document. Each request is validated before being applied. If any request is not valid, then the entire request will fail and nothing will be applied. Some requests have replies to give you some information about how they are applied. Other requests do not need to return information; these each return an empty reply. The order of replies matches that of the requests. For example, suppose you call batchUpdate with four updates, and only the third one returns information. The response would have two empty replies, the reply to the third request, and another empty reply, in that order. Because other users may be editing the document, the document might not exactly reflect your changes: your changes may be altered with respect to collaborator changes. If there are no collaborators, the document should reflect your changes. In any case, the updates in your request are guaranteed to be applied together atomically.",
    description:
      "Applies one or more updates to the document. Each request is validated before being applied. If any request is not valid, then the entire request will fail and nothing will be applied. Some requests have replies to give you some information about how they are applied. Other requests do not need to return information; these each return an empty reply. The order of replies matches that of the requests. For example, suppose you call batchUpdate with four updates, and only the third one returns information. The response would have two empty replies, the reply to the third request, and another empty reply, in that order. Because other users may be editing the document, the document might not exactly reflect your changes: your changes may be altered with respect to collaborator changes. If there are no collaborators, the document should reflect your changes. In any case, the updates in your request are guaranteed to be applied together atomically.",
    tags: ["docs"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "documentId",
        in: "path",
        required: true,
        description: "The ID of the document to update.",
        schema: {
          description: "The ID of the document to update.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DocsBatchUpdateDocumentRequest",
    },
    response: {
      confidence: "contract",
      schema: "DocsBatchUpdateDocumentResponse",
    },
  },
  {
    id: "docs.documents.create",
    command: "docs-documents-create",
    binding: {
      kind: "http",
      method: "POST",
      path: "v1/documents",
    },
    effect: "write",
    summary:
      "Creates a blank document using the title given in the request. Other fields in the request, including any provided content, are ignored. Returns the created document.",
    description:
      "Creates a blank document using the title given in the request. Other fields in the request, including any provided content, are ignored. Returns the created document.",
    tags: ["docs"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DocsDocument",
    },
    response: {
      confidence: "contract",
      schema: "DocsDocument",
    },
  },
  {
    id: "docs.documents.get",
    command: "docs-documents-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "v1/documents/{documentId}",
    },
    effect: "read",
    summary: "Gets the latest version of the specified document.",
    description: "Gets the latest version of the specified document.",
    tags: ["docs"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "documentId",
        in: "path",
        required: true,
        description: "The ID of the document to retrieve.",
        schema: {
          description: "The ID of the document to retrieve.",
          type: "string",
        },
      },
      {
        name: "commentsViewMode",
        in: "query",
        required: false,
        description:
          "The comments view mode to apply to the document. This allows viewing the document with comments omitted or included. If one is not specified, COMMENTS_VIEW_MODE_OMITTED is used. If you set comments_view_mode to any value, you must also set include_tabs_content to `true` or use a field mask that references the Document.tabs field (or any subfield). If you set comments_view_mode to COMMENTS_VIEW_MODE_INCLUDED, you must also explicitly set suggestions_view_mode to SUGGESTIONS_INLINE. If you set comments_view_mode to COMMENTS_VIEW_MODE_INCLUDED or COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS, you may not set suggestions_view_mode to PREVIEW_WITHOUT_SUGGESTIONS or PREVIEW_SUGGESTIONS_ACCEPTED.",
        schema: {
          description:
            "The comments view mode to apply to the document. This allows viewing the document with comments omitted or included. If one is not specified, COMMENTS_VIEW_MODE_OMITTED is used. If you set comments_view_mode to any value, you must also set include_tabs_content to `true` or use a field mask that references the Document.tabs field (or any subfield). If you set comments_view_mode to COMMENTS_VIEW_MODE_INCLUDED, you must also explicitly set suggestions_view_mode to SUGGESTIONS_INLINE. If you set comments_view_mode to COMMENTS_VIEW_MODE_INCLUDED or COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS, you may not set suggestions_view_mode to PREVIEW_WITHOUT_SUGGESTIONS or PREVIEW_SUGGESTIONS_ACCEPTED.",
          type: "string",
          enum: [
            "COMMENTS_VIEW_MODE_UNSPECIFIED",
            "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS",
            "COMMENTS_VIEW_MODE_OMITTED",
            "COMMENTS_VIEW_MODE_INCLUDED",
          ],
        },
      },
      {
        name: "includeTabsContent",
        in: "query",
        required: false,
        description:
          "Whether to populate the `Document.tabs` field instead of the text content fields like `body` and `documentStyle` on `Document`. - When `true`: Document content populates in the `Document.tabs` field instead of the text content fields in `Document`. - When `false`: The content of the document's first tab populates the content fields in `Document` excluding `Document.tabs`. If a document has only one tab, then that tab is used to populate the document content. `Document.tabs` will be empty. If you use a field mask that references the `Document.tabs` field (or any subfield), the API implicitly treats the request as if you set `include_tabs_content` to `true`.",
        schema: {
          description:
            "Whether to populate the `Document.tabs` field instead of the text content fields like `body` and `documentStyle` on `Document`. - When `true`: Document content populates in the `Document.tabs` field instead of the text content fields in `Document`. - When `false`: The content of the document's first tab populates the content fields in `Document` excluding `Document.tabs`. If a document has only one tab, then that tab is used to populate the document content. `Document.tabs` will be empty. If you use a field mask that references the `Document.tabs` field (or any subfield), the API implicitly treats the request as if you set `include_tabs_content` to `true`.",
          type: "boolean",
        },
      },
      {
        name: "suggestionsViewMode",
        in: "query",
        required: false,
        description:
          "The suggestions view mode to apply to the document. This allows viewing the document with all suggestions inline, accepted or rejected. If one is not specified, DEFAULT_FOR_CURRENT_ACCESS is used.",
        schema: {
          description:
            "The suggestions view mode to apply to the document. This allows viewing the document with all suggestions inline, accepted or rejected. If one is not specified, DEFAULT_FOR_CURRENT_ACCESS is used.",
          type: "string",
          enum: [
            "DEFAULT_FOR_CURRENT_ACCESS",
            "SUGGESTIONS_INLINE",
            "PREVIEW_SUGGESTIONS_ACCEPTED",
            "PREVIEW_WITHOUT_SUGGESTIONS",
          ],
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DocsDocument",
    },
  },
  {
    id: "drive.about.get",
    command: "drive-about-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "about",
    },
    effect: "read",
    summary:
      "Gets information about the user, the user's Drive, and system capabilities. For more information, see [Return user info](https://developers.google.com/workspace/drive/api/guides/user-info). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    description:
      "Gets information about the user, the user's Drive, and system capabilities. For more information, see [Return user info](https://developers.google.com/workspace/drive/api/guides/user-info). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveAbout",
    },
  },
  {
    id: "drive.accessproposals.get",
    command: "drive-accessproposals-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/accessproposals/{proposalId}",
    },
    effect: "read",
    summary:
      "Retrieves an access proposal by ID. For more information, see [Manage pending access proposals](https://developers.google.com/workspace/drive/api/guides/pending-access).",
    description:
      "Retrieves an access proposal by ID. For more information, see [Manage pending access proposals](https://developers.google.com/workspace/drive/api/guides/pending-access).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "proposalId",
        in: "path",
        required: true,
        description: "Required. The ID of the access proposal to resolve.",
        schema: {
          description: "Required. The ID of the access proposal to resolve.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the item the request is on.",
        schema: {
          description: "Required. The ID of the item the request is on.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveAccessProposal",
    },
  },
  {
    id: "drive.accessproposals.list",
    command: "drive-accessproposals-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/accessproposals",
    },
    effect: "read",
    summary:
      "List the access proposals on a file. For more information, see [Manage pending access proposals](https://developers.google.com/workspace/drive/api/guides/pending-access). Note: Only approvers are able to list access proposals on a file. If the user isn't an approver, a 403 error is returned.",
    description:
      "List the access proposals on a file. For more information, see [Manage pending access proposals](https://developers.google.com/workspace/drive/api/guides/pending-access). Note: Only approvers are able to list access proposals on a file. If the user isn't an approver, a 403 error is returned.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description: "Optional. The continuation token on the list of access requests.",
        schema: {
          description: "Optional. The continuation token on the list of access requests.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the item the request is on.",
        schema: {
          description: "Required. The ID of the item the request is on.",
          type: "string",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description: "Optional. The number of results per page.",
        schema: {
          description: "Optional. The number of results per page.",
          type: "integer",
          format: "int32",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveListAccessProposalsResponse",
    },
  },
  {
    id: "drive.accessproposals.resolve",
    command: "drive-accessproposals-resolve",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/accessproposals/{proposalId}:resolve",
    },
    effect: "write",
    summary:
      "Approves or denies an access proposal. For more information, see [Manage pending access proposals](https://developers.google.com/workspace/drive/api/guides/pending-access).",
    description:
      "Approves or denies an access proposal. For more information, see [Manage pending access proposals](https://developers.google.com/workspace/drive/api/guides/pending-access).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the item the request is on.",
        schema: {
          description: "Required. The ID of the item the request is on.",
          type: "string",
        },
      },
      {
        name: "proposalId",
        in: "path",
        required: true,
        description: "Required. The ID of the access proposal to resolve.",
        schema: {
          description: "Required. The ID of the access proposal to resolve.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveResolveAccessProposalRequest",
    },
  },
  {
    id: "drive.approvals.approve",
    command: "drive-approvals-approve",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/approvals/{approvalId}:approve",
    },
    effect: "write",
    summary:
      "Approves an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). This is used to update the ReviewerResponse of the requesting user with a Response of `APPROVED`. If this is the last required reviewer response, this also completes the approval and sets the approval Status to `APPROVED`.",
    description:
      "Approves an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). This is used to update the ReviewerResponse of the requesting user with a Response of `APPROVED`. If this is the last required reviewer response, this also completes the approval and sets the approval Status to `APPROVED`.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the file that the approval is on.",
        schema: {
          description: "Required. The ID of the file that the approval is on.",
          type: "string",
        },
      },
      {
        name: "approvalId",
        in: "path",
        required: true,
        description: "Required. The ID of the approval to approve.",
        schema: {
          description: "Required. The ID of the approval to approve.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveApproveApprovalRequest",
    },
    response: {
      confidence: "contract",
      schema: "DriveApproval",
    },
  },
  {
    id: "drive.approvals.cancel",
    command: "drive-approvals-cancel",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/approvals/{approvalId}:cancel",
    },
    effect: "write",
    summary:
      "Cancels an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). Updates the approval Status to `CANCELLED`. This can be called by any user with the `writer` permission on the file while the approval Status is `IN_PROGRESS`.",
    description:
      "Cancels an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). Updates the approval Status to `CANCELLED`. This can be called by any user with the `writer` permission on the file while the approval Status is `IN_PROGRESS`.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the file that the approval is on.",
        schema: {
          description: "Required. The ID of the file that the approval is on.",
          type: "string",
        },
      },
      {
        name: "approvalId",
        in: "path",
        required: true,
        description: "Required. The ID of the approval to cancel.",
        schema: {
          description: "Required. The ID of the approval to cancel.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveCancelApprovalRequest",
    },
    response: {
      confidence: "contract",
      schema: "DriveApproval",
    },
  },
  {
    id: "drive.approvals.comment",
    command: "drive-approvals-comment",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/approvals/{approvalId}:comment",
    },
    effect: "write",
    summary:
      "Comments on an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). This sends a notification to both the initiator and the reviewers. Additionally, a message is also added to the approval activity log.",
    description:
      "Comments on an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). This sends a notification to both the initiator and the reviewers. Additionally, a message is also added to the approval activity log.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the file that the approval is on.",
        schema: {
          description: "Required. The ID of the file that the approval is on.",
          type: "string",
        },
      },
      {
        name: "approvalId",
        in: "path",
        required: true,
        description: "Required. The ID of the approval to comment on.",
        schema: {
          description: "Required. The ID of the approval to comment on.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveCommentApprovalRequest",
    },
    response: {
      confidence: "contract",
      schema: "DriveApproval",
    },
  },
  {
    id: "drive.approvals.decline",
    command: "drive-approvals-decline",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/approvals/{approvalId}:decline",
    },
    effect: "write",
    summary:
      "Declines an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). This is used to update the ReviewerResponse of the requesting user with a Response of `DECLINED`. This also completes the approval and sets the approval Status to `DECLINED`.",
    description:
      "Declines an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). This is used to update the ReviewerResponse of the requesting user with a Response of `DECLINED`. This also completes the approval and sets the approval Status to `DECLINED`.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the file that the approval is on.",
        schema: {
          description: "Required. The ID of the file that the approval is on.",
          type: "string",
        },
      },
      {
        name: "approvalId",
        in: "path",
        required: true,
        description: "Required. The ID of the approval to decline.",
        schema: {
          description: "Required. The ID of the approval to decline.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveDeclineApprovalRequest",
    },
    response: {
      confidence: "contract",
      schema: "DriveApproval",
    },
  },
  {
    id: "drive.approvals.get",
    command: "drive-approvals-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/approvals/{approvalId}",
    },
    effect: "read",
    summary:
      "Gets an approval by ID. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals).",
    description:
      "Gets an approval by ID. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the file that the approval is on.",
        schema: {
          description: "Required. The ID of the file that the approval is on.",
          type: "string",
        },
      },
      {
        name: "approvalId",
        in: "path",
        required: true,
        description: "Required. The ID of the approval.",
        schema: {
          description: "Required. The ID of the approval.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveApproval",
    },
  },
  {
    id: "drive.approvals.list",
    command: "drive-approvals-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/approvals",
    },
    effect: "read",
    summary:
      "Lists the approvals on a file. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). By default, this method returns a minimal response that may not include the items array. To retrieve approval details, you must explicitly specify the fields you want using the `fields` query parameter. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    description:
      "Lists the approvals on a file. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). By default, this method returns a minimal response that may not include the items array. To retrieve approval details, you must explicitly specify the fields you want using the `fields` query parameter. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the file that the approval is on.",
        schema: {
          description: "Required. The ID of the file that the approval is on.",
          type: "string",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description: "The maximum number of approvals to return. When not set, at most 100 approvals are returned.",
        schema: {
          description: "The maximum number of approvals to return. When not set, at most 100 approvals are returned.",
          type: "integer",
          format: "int32",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description:
          "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from a previous response.",
        schema: {
          description:
            "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from a previous response.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveApprovalList",
    },
  },
  {
    id: "drive.approvals.reassign",
    command: "drive-approvals-reassign",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/approvals/{approvalId}:reassign",
    },
    effect: "write",
    summary:
      "Reassigns the reviewers on an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). Adds or replaces reviewers in the ReviewerResponse of the approval. This can be called by any user with the `writer` permission on the file while the approval Status is `IN_PROGRESS` and the Response for the reviewer being reassigned is `NO_RESPONSE`. A user with the `reader` permission can only reassign an approval that's assigned to themselves. Removing a reviewer isn't allowed.",
    description:
      "Reassigns the reviewers on an approval. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals). Adds or replaces reviewers in the ReviewerResponse of the approval. This can be called by any user with the `writer` permission on the file while the approval Status is `IN_PROGRESS` and the Response for the reviewer being reassigned is `NO_RESPONSE`. A user with the `reader` permission can only reassign an approval that's assigned to themselves. Removing a reviewer isn't allowed.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "approvalId",
        in: "path",
        required: true,
        description: "Required. The ID of the approval to reassign.",
        schema: {
          description: "Required. The ID of the approval to reassign.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the file that the approval is on.",
        schema: {
          description: "Required. The ID of the file that the approval is on.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveReassignApprovalRequest",
    },
    response: {
      confidence: "contract",
      schema: "DriveApproval",
    },
  },
  {
    id: "drive.approvals.start",
    command: "drive-approvals-start",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/approvals:start",
    },
    effect: "write",
    summary:
      "Starts an approval on a file. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals).",
    description:
      "Starts an approval on a file. For more information, see [Manage approvals](https://developers.google.com/workspace/drive/api/guides/approvals).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the file that the approval is created on.",
        schema: {
          description: "Required. The ID of the file that the approval is created on.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveStartApprovalRequest",
    },
    response: {
      confidence: "contract",
      schema: "DriveApproval",
    },
  },
  {
    id: "drive.apps.get",
    command: "drive-apps-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "apps/{appId}",
    },
    effect: "read",
    summary:
      "Gets a specific app. For more information, see [Return user info](https://developers.google.com/workspace/drive/api/guides/user-info).",
    description:
      "Gets a specific app. For more information, see [Return user info](https://developers.google.com/workspace/drive/api/guides/user-info).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "appId",
        in: "path",
        required: true,
        description: "The ID of the app.",
        schema: {
          description: "The ID of the app.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveApp",
    },
  },
  {
    id: "drive.apps.list",
    command: "drive-apps-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "apps",
    },
    effect: "read",
    summary:
      "Lists a user's installed apps. For more information, see [Return user info](https://developers.google.com/workspace/drive/api/guides/user-info).",
    description:
      "Lists a user's installed apps. For more information, see [Return user info](https://developers.google.com/workspace/drive/api/guides/user-info).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "languageCode",
        in: "query",
        required: false,
        description:
          "A language or locale code, as defined by BCP 47, with some extensions from Unicode's LDML format (http://www.unicode.org/reports/tr35/).",
        schema: {
          description:
            "A language or locale code, as defined by BCP 47, with some extensions from Unicode's LDML format (http://www.unicode.org/reports/tr35/).",
          type: "string",
        },
      },
      {
        name: "appFilterExtensions",
        in: "query",
        required: false,
        description:
          "A comma-separated list of file extensions to limit returned results. All results within the given app query scope which can open any of the given file extensions are included in the response. If `appFilterMimeTypes` are provided as well, the result is a union of the two resulting app lists.",
        schema: {
          description:
            "A comma-separated list of file extensions to limit returned results. All results within the given app query scope which can open any of the given file extensions are included in the response. If `appFilterMimeTypes` are provided as well, the result is a union of the two resulting app lists.",
          default: "",
          type: "string",
        },
      },
      {
        name: "appFilterMimeTypes",
        in: "query",
        required: false,
        description:
          "A comma-separated list of file extensions to limit returned results. All results within the given app query scope which can open any of the given MIME types will be included in the response. If `appFilterExtensions` are provided as well, the result is a union of the two resulting app lists.",
        schema: {
          description:
            "A comma-separated list of file extensions to limit returned results. All results within the given app query scope which can open any of the given MIME types will be included in the response. If `appFilterExtensions` are provided as well, the result is a union of the two resulting app lists.",
          default: "",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveAppList",
    },
  },
  {
    id: "drive.changes.getStartPageToken",
    command: "drive-changes-get-start-page-token",
    binding: {
      kind: "http",
      method: "GET",
      path: "changes/startPageToken",
    },
    effect: "read",
    summary:
      "Gets the starting pageToken for listing future changes. For more information, see [Retrieve changes](https://developers.google.com/workspace/drive/api/guides/manage-changes).",
    description:
      "Gets the starting pageToken for listing future changes. For more information, see [Retrieve changes](https://developers.google.com/workspace/drive/api/guides/manage-changes).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "driveId",
        in: "query",
        required: false,
        description:
          "The ID of the shared drive for which the starting pageToken for listing future changes from that shared drive will be returned.",
        schema: {
          description:
            "The ID of the shared drive for which the starting pageToken for listing future changes from that shared drive will be returned.",
          type: "string",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "teamDriveId",
        in: "query",
        required: false,
        description: "Deprecated: Use `driveId` instead.",
        schema: {
          description: "Deprecated: Use `driveId` instead.",
          deprecated: true,
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveStartPageToken",
    },
  },
  {
    id: "drive.changes.list",
    command: "drive-changes-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "changes",
    },
    effect: "read",
    summary:
      "Lists the changes for a user or shared drive. For more information, see [Retrieve changes](https://developers.google.com/workspace/drive/api/guides/manage-changes).",
    description:
      "Lists the changes for a user or shared drive. For more information, see [Retrieve changes](https://developers.google.com/workspace/drive/api/guides/manage-changes).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "driveId",
        in: "query",
        required: false,
        description:
          "The shared drive from which changes will be returned. If specified the change IDs will be reflective of the shared drive; use the combined drive ID and change ID as an identifier.",
        schema: {
          description:
            "The shared drive from which changes will be returned. If specified the change IDs will be reflective of the shared drive; use the combined drive ID and change ID as an identifier.",
          type: "string",
        },
      },
      {
        name: "restrictToMyDrive",
        in: "query",
        required: false,
        description:
          "Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive.",
        schema: {
          description:
            "Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includeItemsFromAllDrives",
        in: "query",
        required: false,
        description: "Whether both My Drive and shared drive items should be included in results.",
        schema: {
          description: "Whether both My Drive and shared drive items should be included in results.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includeCorpusRemovals",
        in: "query",
        required: false,
        description:
          "Whether changes should include the file resource if the file is still accessible by the user at the time of the request, even when a file was removed from the list of changes and there will be no further change entries for this file.",
        schema: {
          description:
            "Whether changes should include the file resource if the file is still accessible by the user at the time of the request, even when a file was removed from the list of changes and there will be no further change entries for this file.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includeTeamDriveItems",
        in: "query",
        required: false,
        description: "Deprecated: Use `includeItemsFromAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `includeItemsFromAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includePermissionsForView",
        in: "query",
        required: false,
        description:
          "Specifies which additional view's permissions to include in the response. Only 'published' is supported.",
        schema: {
          description:
            "Specifies which additional view's permissions to include in the response. Only 'published' is supported.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: true,
        description:
          "The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method.",
        schema: {
          description:
            "The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method.",
          type: "string",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description:
          "The maximum number of changes to return. The service may return fewer than this value. If unspecified, at most 100 changes will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.",
        schema: {
          description:
            "The maximum number of changes to return. The service may return fewer than this value. If unspecified, at most 100 changes will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.",
          default: "100",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 1000,
        },
      },
      {
        name: "includeRemoved",
        in: "query",
        required: false,
        description:
          "Whether to include changes indicating that items have been removed from the list of changes, for example by deletion or loss of access.",
        schema: {
          description:
            "Whether to include changes indicating that items have been removed from the list of changes, for example by deletion or loss of access.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "includeLabels",
        in: "query",
        required: false,
        description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
        schema: {
          description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
          type: "string",
        },
      },
      {
        name: "teamDriveId",
        in: "query",
        required: false,
        description: "Deprecated: Use `driveId` instead.",
        schema: {
          description: "Deprecated: Use `driveId` instead.",
          deprecated: true,
          type: "string",
        },
      },
      {
        name: "spaces",
        in: "query",
        required: false,
        description:
          "A comma-separated list of spaces to query within the corpora. Supported values are 'drive' and 'appDataFolder'.",
        schema: {
          description:
            "A comma-separated list of spaces to query within the corpora. Supported values are 'drive' and 'appDataFolder'.",
          default: "drive",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveChangeList",
    },
  },
  {
    id: "drive.changes.watch",
    command: "drive-changes-watch",
    binding: {
      kind: "http",
      method: "POST",
      path: "changes/watch",
    },
    effect: "write",
    summary:
      "Subscribes to changes for a user. For more information, see [Notifications for resource changes](https://developers.google.com/workspace/drive/api/guides/push).",
    description:
      "Subscribes to changes for a user. For more information, see [Notifications for resource changes](https://developers.google.com/workspace/drive/api/guides/push).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "spaces",
        in: "query",
        required: false,
        description:
          "A comma-separated list of spaces to query within the corpora. Supported values are 'drive' and 'appDataFolder'.",
        schema: {
          description:
            "A comma-separated list of spaces to query within the corpora. Supported values are 'drive' and 'appDataFolder'.",
          default: "drive",
          type: "string",
        },
      },
      {
        name: "includeItemsFromAllDrives",
        in: "query",
        required: false,
        description: "Whether both My Drive and shared drive items should be included in results.",
        schema: {
          description: "Whether both My Drive and shared drive items should be included in results.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description:
          "The maximum number of changes to return. The service may return fewer than this value. If unspecified, at most 100 changes will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.",
        schema: {
          description:
            "The maximum number of changes to return. The service may return fewer than this value. If unspecified, at most 100 changes will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.",
          default: "100",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 1000,
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includeLabels",
        in: "query",
        required: false,
        description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
        schema: {
          description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
          type: "string",
        },
      },
      {
        name: "restrictToMyDrive",
        in: "query",
        required: false,
        description:
          "Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive.",
        schema: {
          description:
            "Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "teamDriveId",
        in: "query",
        required: false,
        description: "Deprecated: Use `driveId` instead.",
        schema: {
          description: "Deprecated: Use `driveId` instead.",
          deprecated: true,
          type: "string",
        },
      },
      {
        name: "includeCorpusRemovals",
        in: "query",
        required: false,
        description:
          "Whether changes should include the file resource if the file is still accessible by the user at the time of the request, even when a file was removed from the list of changes and there will be no further change entries for this file.",
        schema: {
          description:
            "Whether changes should include the file resource if the file is still accessible by the user at the time of the request, even when a file was removed from the list of changes and there will be no further change entries for this file.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includeTeamDriveItems",
        in: "query",
        required: false,
        description: "Deprecated: Use `includeItemsFromAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `includeItemsFromAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includeRemoved",
        in: "query",
        required: false,
        description:
          "Whether to include changes indicating that items have been removed from the list of changes, for example by deletion or loss of access.",
        schema: {
          description:
            "Whether to include changes indicating that items have been removed from the list of changes, for example by deletion or loss of access.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "driveId",
        in: "query",
        required: false,
        description:
          "The shared drive from which changes will be returned. If specified the change IDs will be reflective of the shared drive; use the combined drive ID and change ID as an identifier.",
        schema: {
          description:
            "The shared drive from which changes will be returned. If specified the change IDs will be reflective of the shared drive; use the combined drive ID and change ID as an identifier.",
          type: "string",
        },
      },
      {
        name: "includePermissionsForView",
        in: "query",
        required: false,
        description:
          "Specifies which additional view's permissions to include in the response. Only 'published' is supported.",
        schema: {
          description:
            "Specifies which additional view's permissions to include in the response. Only 'published' is supported.",
          type: "string",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: true,
        description:
          "The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method.",
        schema: {
          description:
            "The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveChannel",
    },
    response: {
      confidence: "contract",
      schema: "DriveChannel",
    },
  },
  {
    id: "drive.channels.stop",
    command: "drive-channels-stop",
    binding: {
      kind: "http",
      method: "POST",
      path: "channels/stop",
    },
    effect: "write",
    summary:
      "Stops watching resources through this channel. For more information, see [Notifications for resource changes](https://developers.google.com/workspace/drive/api/guides/push).",
    description:
      "Stops watching resources through this channel. For more information, see [Notifications for resource changes](https://developers.google.com/workspace/drive/api/guides/push).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveChannel",
    },
  },
  {
    id: "drive.comments.create",
    command: "drive-comments-create",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/comments",
    },
    effect: "write",
    summary:
      "Creates a comment on a file. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    description:
      "Creates a comment on a file. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveComment",
    },
    response: {
      confidence: "contract",
      schema: "DriveComment",
    },
  },
  {
    id: "drive.comments.delete",
    command: "drive-comments-delete",
    binding: {
      kind: "http",
      method: "DELETE",
      path: "files/{fileId}/comments/{commentId}",
    },
    effect: "destructive",
    summary:
      "Deletes a comment. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    description:
      "Deletes a comment. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "commentId",
        in: "path",
        required: true,
        description: "The ID of the comment.",
        schema: {
          description: "The ID of the comment.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
    ],
  },
  {
    id: "drive.comments.get",
    command: "drive-comments-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/comments/{commentId}",
    },
    effect: "read",
    summary:
      "Gets a comment by ID. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    description:
      "Gets a comment by ID. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "includeDeleted",
        in: "query",
        required: false,
        description: "Whether to return deleted comments. Deleted comments will not include their original content.",
        schema: {
          description: "Whether to return deleted comments. Deleted comments will not include their original content.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "commentId",
        in: "path",
        required: true,
        description: "The ID of the comment.",
        schema: {
          description: "The ID of the comment.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveComment",
    },
  },
  {
    id: "drive.comments.list",
    command: "drive-comments-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/comments",
    },
    effect: "read",
    summary:
      "Lists a file's comments. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    description:
      "Lists a file's comments. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "includeDeleted",
        in: "query",
        required: false,
        description: "Whether to include deleted comments. Deleted comments will not include their original content.",
        schema: {
          description: "Whether to include deleted comments. Deleted comments will not include their original content.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description:
          "The maximum number of comments to return. The service may return fewer than this value. If unspecified, at most 20 comments will be returned. The maximum value is 100; values above 100 will be coerced to 100.",
        schema: {
          description:
            "The maximum number of comments to return. The service may return fewer than this value. If unspecified, at most 20 comments will be returned. The maximum value is 100; values above 100 will be coerced to 100.",
          default: "20",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 100,
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description:
          "The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.",
        schema: {
          description:
            "The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "startModifiedTime",
        in: "query",
        required: false,
        description: "The minimum value of 'modifiedTime' for the result comments (RFC 3339 date-time).",
        schema: {
          description: "The minimum value of 'modifiedTime' for the result comments (RFC 3339 date-time).",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveCommentList",
    },
  },
  {
    id: "drive.comments.update",
    command: "drive-comments-update",
    binding: {
      kind: "http",
      method: "PATCH",
      path: "files/{fileId}/comments/{commentId}",
    },
    effect: "write",
    summary:
      "Updates a comment with patch semantics. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    description:
      "Updates a comment with patch semantics. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments). Required: The `fields` parameter must be set. To return the exact fields you need, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "commentId",
        in: "path",
        required: true,
        description: "The ID of the comment.",
        schema: {
          description: "The ID of the comment.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveComment",
    },
    response: {
      confidence: "contract",
      schema: "DriveComment",
    },
  },
  {
    id: "drive.drives.create",
    command: "drive-drives-create",
    binding: {
      kind: "http",
      method: "POST",
      path: "drives",
    },
    effect: "write",
    summary:
      "Creates a shared drive. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    description:
      "Creates a shared drive. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "requestId",
        in: "query",
        required: true,
        description:
          "Required. An ID, such as a random UUID, which uniquely identifies this user's request for idempotent creation of a shared drive. A repeated request by the same user and with the same request ID will avoid creating duplicates by attempting to create the same shared drive. If the shared drive already exists a 409 error will be returned.",
        schema: {
          description:
            "Required. An ID, such as a random UUID, which uniquely identifies this user's request for idempotent creation of a shared drive. A repeated request by the same user and with the same request ID will avoid creating duplicates by attempting to create the same shared drive. If the shared drive already exists a 409 error will be returned.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveDrive",
    },
    response: {
      confidence: "contract",
      schema: "DriveDrive",
    },
  },
  {
    id: "drive.drives.delete",
    command: "drive-drives-delete",
    binding: {
      kind: "http",
      method: "DELETE",
      path: "drives/{driveId}",
    },
    effect: "destructive",
    summary:
      "Permanently deletes a shared drive for which the user is an `organizer`. The shared drive cannot contain any untrashed items. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    description:
      "Permanently deletes a shared drive for which the user is an `organizer`. The shared drive cannot contain any untrashed items. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "driveId",
        in: "path",
        required: true,
        description: "The ID of the shared drive.",
        schema: {
          description: "The ID of the shared drive.",
          type: "string",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs.",
        schema: {
          description:
            "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "allowItemDeletion",
        in: "query",
        required: false,
        description:
          "Whether any items inside the shared drive should also be deleted. This option is only supported when `useDomainAdminAccess` is also set to `true`.",
        schema: {
          description:
            "Whether any items inside the shared drive should also be deleted. This option is only supported when `useDomainAdminAccess` is also set to `true`.",
          default: "false",
          type: "boolean",
        },
      },
    ],
  },
  {
    id: "drive.drives.get",
    command: "drive-drives-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "drives/{driveId}",
    },
    effect: "read",
    summary:
      "Gets a shared drive's metadata by ID. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    description:
      "Gets a shared drive's metadata by ID. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "driveId",
        in: "path",
        required: true,
        description: "The ID of the shared drive.",
        schema: {
          description: "The ID of the shared drive.",
          type: "string",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs.",
        schema: {
          description:
            "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs.",
          default: "false",
          type: "boolean",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveDrive",
    },
  },
  {
    id: "drive.drives.hide",
    command: "drive-drives-hide",
    binding: {
      kind: "http",
      method: "POST",
      path: "drives/{driveId}/hide",
    },
    effect: "write",
    summary:
      "Hides a shared drive from the default view. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    description:
      "Hides a shared drive from the default view. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "driveId",
        in: "path",
        required: true,
        description: "The ID of the shared drive.",
        schema: {
          description: "The ID of the shared drive.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveDrive",
    },
  },
  {
    id: "drive.drives.list",
    command: "drive-drives-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "drives",
    },
    effect: "read",
    summary:
      " Lists the user's shared drives. This method accepts the `q` parameter, which is a search query combining one or more search terms. For more information, see the [Search for shared drives](https://developers.google.com/workspace/drive/api/guides/search-shareddrives) guide.",
    description:
      " Lists the user's shared drives. This method accepts the `q` parameter, which is a search query combining one or more search terms. For more information, see the [Search for shared drives](https://developers.google.com/workspace/drive/api/guides/search-shareddrives) guide.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "q",
        in: "query",
        required: false,
        description: "Query string for searching shared drives.",
        schema: {
          description: "Query string for searching shared drives.",
          type: "string",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description: "Page token for shared drives.",
        schema: {
          description: "Page token for shared drives.",
          type: "string",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description:
          "The maximum number of shared drives to return. The service may return fewer than this value. If unspecified, at most 10 shared drives will be returned. The maximum value is 100; values above 100 will be coerced to 100.",
        schema: {
          description:
            "The maximum number of shared drives to return. The service may return fewer than this value. If unspecified, at most 10 shared drives will be returned. The maximum value is 100; values above 100 will be coerced to 100.",
          default: "10",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 100,
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator; if set to true, then all shared drives of the domain in which the requester is an administrator are returned.",
        schema: {
          description:
            "Issue the request as a domain administrator; if set to true, then all shared drives of the domain in which the requester is an administrator are returned.",
          default: "false",
          type: "boolean",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveDriveList",
    },
  },
  {
    id: "drive.drives.unhide",
    command: "drive-drives-unhide",
    binding: {
      kind: "http",
      method: "POST",
      path: "drives/{driveId}/unhide",
    },
    effect: "write",
    summary:
      "Restores a shared drive to the default view. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    description:
      "Restores a shared drive to the default view. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "driveId",
        in: "path",
        required: true,
        description: "The ID of the shared drive.",
        schema: {
          description: "The ID of the shared drive.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveDrive",
    },
  },
  {
    id: "drive.drives.update",
    command: "drive-drives-update",
    binding: {
      kind: "http",
      method: "PATCH",
      path: "drives/{driveId}",
    },
    effect: "write",
    summary:
      "Updates the metadata for a shared drive. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    description:
      "Updates the metadata for a shared drive. For more information, see [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs.",
        schema: {
          description:
            "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "driveId",
        in: "path",
        required: true,
        description: "The ID of the shared drive.",
        schema: {
          description: "The ID of the shared drive.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveDrive",
    },
    response: {
      confidence: "contract",
      schema: "DriveDrive",
    },
  },
  {
    id: "drive.files.copy",
    command: "drive-files-copy",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/copy",
    },
    effect: "write",
    summary:
      "Creates a copy of a file and applies any requested updates with patch semantics. For more information, see [Create and manage files](https://developers.google.com/workspace/drive/api/guides/create-file).",
    description:
      "Creates a copy of a file and applies any requested updates with patch semantics. For more information, see [Create and manage files](https://developers.google.com/workspace/drive/api/guides/create-file).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "ignoreDefaultVisibility",
        in: "query",
        required: false,
        description:
          "Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders.",
        schema: {
          description:
            "Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "keepRevisionForever",
        in: "query",
        required: false,
        description:
          "Whether to set the `keepForever` field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions.",
        schema: {
          description:
            "Whether to set the `keepForever` field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "copyComments",
        in: "query",
        required: false,
        description: "Whether to copy the open (unresolved) comments associated with the file.",
        schema: {
          description: "Whether to copy the open (unresolved) comments associated with the file.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "enforceSingleParent",
        in: "query",
        required: false,
        description: "Deprecated: Copying files into multiple folders is no longer supported. Use shortcuts instead.",
        schema: {
          description: "Deprecated: Copying files into multiple folders is no longer supported. Use shortcuts instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "ocrLanguage",
        in: "query",
        required: false,
        description: "A language hint for OCR processing during image import (ISO 639-1 code).",
        schema: {
          description: "A language hint for OCR processing during image import (ISO 639-1 code).",
          type: "string",
        },
      },
      {
        name: "includeLabels",
        in: "query",
        required: false,
        description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
        schema: {
          description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
          type: "string",
        },
      },
      {
        name: "includePermissionsForView",
        in: "query",
        required: false,
        description:
          "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
        schema: {
          description:
            "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveFile",
    },
    response: {
      confidence: "contract",
      schema: "DriveFile",
    },
  },
  {
    id: "drive.files.create",
    command: "drive-files-create",
    binding: {
      kind: "http",
      method: "POST",
      path: "files",
    },
    effect: "write",
    summary:
      ' Creates a file. For more information, see [Create and manage files](https://developers.google.com/workspace/drive/api/guides/create-file). This method supports an */upload* URI and accepts uploaded media with the following characteristics: - *Maximum file size:* 5,120 GB - *Accepted Media MIME types:* `*/*` (Specify a valid MIME type, rather than the literal `*/*` value. The literal `*/*` is only used to indicate that any valid MIME type can be uploaded. For more information, see [Google Workspace and Google Drive supported MIME types](https://developers.google.com/workspace/drive/api/guides/mime-types).) For more information on uploading files, see [Upload file data](https://developers.google.com/workspace/drive/api/guides/manage-uploads). Apps creating shortcuts with the `create` method must specify the MIME type `application/vnd.google-apps.shortcut`. Apps should specify a file extension in the `name` property when inserting files with the API. For example, an operation to insert a JPEG file should specify something like `"name": "cat.jpg"` in the metadata. Subsequent `GET` requests include the read-only `fileExtension` property populated with the extension originally specified in the `name` property. When a Google Drive user requests to download a file, or when the file is downloaded through the sync client, Drive builds a full filename (with extension) based on the name. In cases where the extension is missing, Drive attempts to determine the extension based on the file\'s MIME type.',
    description:
      ' Creates a file. For more information, see [Create and manage files](https://developers.google.com/workspace/drive/api/guides/create-file). This method supports an */upload* URI and accepts uploaded media with the following characteristics: - *Maximum file size:* 5,120 GB - *Accepted Media MIME types:* `*/*` (Specify a valid MIME type, rather than the literal `*/*` value. The literal `*/*` is only used to indicate that any valid MIME type can be uploaded. For more information, see [Google Workspace and Google Drive supported MIME types](https://developers.google.com/workspace/drive/api/guides/mime-types).) For more information on uploading files, see [Upload file data](https://developers.google.com/workspace/drive/api/guides/manage-uploads). Apps creating shortcuts with the `create` method must specify the MIME type `application/vnd.google-apps.shortcut`. Apps should specify a file extension in the `name` property when inserting files with the API. For example, an operation to insert a JPEG file should specify something like `"name": "cat.jpg"` in the metadata. Subsequent `GET` requests include the read-only `fileExtension` property populated with the extension originally specified in the `name` property. When a Google Drive user requests to download a file, or when the file is downloaded through the sync client, Drive builds a full filename (with extension) based on the name. In cases where the extension is missing, Drive attempts to determine the extension based on the file\'s MIME type.',
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "enforceSingleParent",
        in: "query",
        required: false,
        description: "Deprecated: Creating files in multiple folders is no longer supported.",
        schema: {
          description: "Deprecated: Creating files in multiple folders is no longer supported.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includeLabels",
        in: "query",
        required: false,
        description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
        schema: {
          description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
          type: "string",
        },
      },
      {
        name: "ignoreDefaultVisibility",
        in: "query",
        required: false,
        description:
          "Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders.",
        schema: {
          description:
            "Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "ocrLanguage",
        in: "query",
        required: false,
        description: "A language hint for OCR processing during image import (ISO 639-1 code).",
        schema: {
          description: "A language hint for OCR processing during image import (ISO 639-1 code).",
          type: "string",
        },
      },
      {
        name: "includePermissionsForView",
        in: "query",
        required: false,
        description:
          "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
        schema: {
          description:
            "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "useContentAsIndexableText",
        in: "query",
        required: false,
        description: "Whether to use the uploaded content as indexable text.",
        schema: {
          description: "Whether to use the uploaded content as indexable text.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "keepRevisionForever",
        in: "query",
        required: false,
        description:
          "Whether to set the `keepForever` field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions.",
        schema: {
          description:
            "Whether to set the `keepForever` field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions.",
          default: "false",
          type: "boolean",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveFile",
    },
    response: {
      confidence: "contract",
      schema: "DriveFile",
    },
  },
  {
    id: "drive.files.delete",
    command: "drive-files-delete",
    binding: {
      kind: "http",
      method: "DELETE",
      path: "files/{fileId}",
    },
    effect: "destructive",
    summary:
      "Permanently deletes a file owned by the user without moving it to the trash. For more information, see [Trash or delete files and folders](https://developers.google.com/workspace/drive/api/guides/delete). If the file belongs to a shared drive, the user must be an `organizer` on the parent folder. If the target is a folder, all descendants owned by the user are also deleted.",
    description:
      "Permanently deletes a file owned by the user without moving it to the trash. For more information, see [Trash or delete files and folders](https://developers.google.com/workspace/drive/api/guides/delete). If the file belongs to a shared drive, the user must be an `organizer` on the parent folder. If the target is a folder, all descendants owned by the user are also deleted.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "enforceSingleParent",
        in: "query",
        required: false,
        description:
          "Deprecated: If an item isn't in a shared drive and its last parent is deleted but the item itself isn't, the item will be placed under its owner's root.",
        schema: {
          description:
            "Deprecated: If an item isn't in a shared drive and its last parent is deleted but the item itself isn't, the item will be placed under its owner's root.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
    ],
  },
  {
    id: "drive.files.download",
    command: "drive-files-download",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/download",
    },
    effect: "read",
    summary:
      "Downloads the content of a file. For more information, see [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads). Operations are valid for 24 hours from the time of creation.",
    description:
      "Downloads the content of a file. For more information, see [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads). Operations are valid for 24 hours from the time of creation.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "Required. The ID of the file to download.",
        schema: {
          description: "Required. The ID of the file to download.",
          type: "string",
        },
      },
      {
        name: "mimeType",
        in: "query",
        required: false,
        description:
          "Optional. The MIME type the file should be downloaded as. This field can only be set when downloading Google Workspace documents. For a list of supported MIME types, see [Export MIME types for Google Workspace documents](https://developers.google.com/workspace/drive/api/guides/ref-export-formats). If not set, a Google Workspace document is downloaded with a default MIME type. The default MIME type might change in the future.",
        schema: {
          description:
            "Optional. The MIME type the file should be downloaded as. This field can only be set when downloading Google Workspace documents. For a list of supported MIME types, see [Export MIME types for Google Workspace documents](https://developers.google.com/workspace/drive/api/guides/ref-export-formats). If not set, a Google Workspace document is downloaded with a default MIME type. The default MIME type might change in the future.",
          type: "string",
        },
      },
      {
        name: "revisionId",
        in: "query",
        required: false,
        description:
          "Optional. The revision ID of the file to download. This field can only be set when downloading blob files, Google Docs, and Google Sheets. Returns `INVALID_ARGUMENT` if downloading a specific revision on the file is unsupported.",
        schema: {
          description:
            "Optional. The revision ID of the file to download. This field can only be set when downloading blob files, Google Docs, and Google Sheets. Returns `INVALID_ARGUMENT` if downloading a specific revision on the file is unsupported.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveOperation",
    },
  },
  {
    id: "drive.files.emptyTrash",
    command: "drive-files-empty-trash",
    binding: {
      kind: "http",
      method: "DELETE",
      path: "files/trash",
    },
    effect: "destructive",
    summary:
      "Permanently deletes all of the user's trashed files. For more information, see [Trash or delete files and folders](https://developers.google.com/workspace/drive/api/guides/delete).",
    description:
      "Permanently deletes all of the user's trashed files. For more information, see [Trash or delete files and folders](https://developers.google.com/workspace/drive/api/guides/delete).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "enforceSingleParent",
        in: "query",
        required: false,
        description:
          "Deprecated: If an item isn't in a shared drive and its last parent is deleted but the item itself isn't, the item will be placed under its owner's root.",
        schema: {
          description:
            "Deprecated: If an item isn't in a shared drive and its last parent is deleted but the item itself isn't, the item will be placed under its owner's root.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "driveId",
        in: "query",
        required: false,
        description: "If set, empties the trash of the provided shared drive.",
        schema: {
          description: "If set, empties the trash of the provided shared drive.",
          type: "string",
        },
      },
    ],
  },
  {
    id: "drive.files.export",
    command: "drive-files-export",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/export",
    },
    effect: "read",
    summary:
      "Exports a Google Workspace document to the requested MIME type and returns exported byte content. For more information, see [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads). Note that the exported content is limited to 10 MB.",
    description:
      "Exports a Google Workspace document to the requested MIME type and returns exported byte content. For more information, see [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads). Note that the exported content is limited to 10 MB.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "mimeType",
        in: "query",
        required: true,
        description:
          "Required. The MIME type of the format requested for this export. For a list of supported MIME types, see [Export MIME types for Google Workspace documents](https://developers.google.com/workspace/drive/api/guides/ref-export-formats).",
        schema: {
          description:
            "Required. The MIME type of the format requested for this export. For a list of supported MIME types, see [Export MIME types for Google Workspace documents](https://developers.google.com/workspace/drive/api/guides/ref-export-formats).",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
    ],
  },
  {
    id: "drive.files.generateCseToken",
    command: "drive-files-generate-cse-token",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/generateCseToken",
    },
    effect: "read",
    summary: "Generates a CSE token which can be used to create or update CSE files.",
    description: "Generates a CSE token which can be used to create or update CSE files.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "parent",
        in: "query",
        required: false,
        description:
          "The ID of the expected parent of the file. Used when generating a JWT for a new CSE file. If specified, the parent will be fetched, and if the parent is a shared drive item, the shared drive's policy will be used to determine the KACLS that should be used. It is invalid to specify both file_id and parent in a single request.",
        schema: {
          description:
            "The ID of the expected parent of the file. Used when generating a JWT for a new CSE file. If specified, the parent will be fetched, and if the parent is a shared drive item, the shared drive's policy will be used to determine the KACLS that should be used. It is invalid to specify both file_id and parent in a single request.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "query",
        required: false,
        description:
          "The ID of the file for which the JWT should be generated. If not provided, an id will be generated.",
        schema: {
          description:
            "The ID of the file for which the JWT should be generated. If not provided, an id will be generated.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveGenerateCseTokenResponse",
    },
  },
  {
    id: "drive.files.generateIds",
    command: "drive-files-generate-ids",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/generateIds",
    },
    effect: "read",
    summary:
      "Generates a set of file IDs which can be provided in create or copy requests. For more information, see [Create and manage files](https://developers.google.com/workspace/drive/api/guides/create-file).",
    description:
      "Generates a set of file IDs which can be provided in create or copy requests. For more information, see [Create and manage files](https://developers.google.com/workspace/drive/api/guides/create-file).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "space",
        in: "query",
        required: false,
        description:
          "The space in which the IDs can be used to create files. Supported values are `drive` and `appDataFolder`. (Default: `drive`.) For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization).",
        schema: {
          description:
            "The space in which the IDs can be used to create files. Supported values are `drive` and `appDataFolder`. (Default: `drive`.) For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization).",
          default: "drive",
          type: "string",
        },
      },
      {
        name: "type",
        in: "query",
        required: false,
        description:
          "The type of items which the IDs can be used for. Supported values are `files` and `shortcuts`. Note that `shortcuts` are only supported in the `drive` `space`. (Default: `files`.) For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization).",
        schema: {
          description:
            "The type of items which the IDs can be used for. Supported values are `files` and `shortcuts`. Note that `shortcuts` are only supported in the `drive` `space`. (Default: `files`.) For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization).",
          default: "files",
          type: "string",
        },
      },
      {
        name: "count",
        in: "query",
        required: false,
        description: "The number of IDs to return.",
        schema: {
          description: "The number of IDs to return.",
          default: "10",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 1000,
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveGeneratedIds",
    },
  },
  {
    id: "drive.files.get",
    command: "drive-files-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}",
    },
    effect: "read",
    summary:
      " Gets a file's metadata or content by ID. For more information, see [Search for files and folders](https://developers.google.com/workspace/drive/api/guides/search-files). If you provide the URL parameter `alt=media`, then the response includes the file contents in the response body. Downloading content with `alt=media` only works if the file is stored in Drive. To download Google Docs, Sheets, and Slides use [`files.export`](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/export) instead. For more information, see [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads).",
    description:
      " Gets a file's metadata or content by ID. For more information, see [Search for files and folders](https://developers.google.com/workspace/drive/api/guides/search-files). If you provide the URL parameter `alt=media`, then the response includes the file contents in the response body. Downloading content with `alt=media` only works if the file is stored in Drive. To download Google Docs, Sheets, and Slides use [`files.export`](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/export) instead. For more information, see [Download and export files](https://developers.google.com/workspace/drive/api/guides/manage-downloads).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "acknowledgeAbuse",
        in: "query",
        required: false,
        description:
          "Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the `alt` parameter is set to `media` and the user is the owner of the file or an organizer of the shared drive in which the file resides.",
        schema: {
          description:
            "Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the `alt` parameter is set to `media` and the user is the owner of the file or an organizer of the shared drive in which the file resides.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includeLabels",
        in: "query",
        required: false,
        description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
        schema: {
          description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
          type: "string",
        },
      },
      {
        name: "includePermissionsForView",
        in: "query",
        required: false,
        description:
          "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
        schema: {
          description:
            "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveFile",
    },
  },
  {
    id: "drive.files.list",
    command: "drive-files-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "files",
    },
    effect: "read",
    summary:
      " Lists the user's files. For more information, see [Search for files and folders](https://developers.google.com/workspace/drive/api/guides/search-files). This method accepts the `q` parameter, which is a search query combining one or more search terms. This method returns *all* files by default, including trashed files. If you don't want trashed files to appear in the list, use the `trashed=false` query parameter to remove trashed files from the results.",
    description:
      " Lists the user's files. For more information, see [Search for files and folders](https://developers.google.com/workspace/drive/api/guides/search-files). This method accepts the `q` parameter, which is a search query combining one or more search terms. This method returns *all* files by default, including trashed files. If you don't want trashed files to appear in the list, use the `trashed=false` query parameter to remove trashed files from the results.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "corpus",
        in: "query",
        required: false,
        description: "Deprecated: The source of files to list. Use `corpora` instead.",
        schema: {
          description: "Deprecated: The source of files to list. Use `corpora` instead.",
          deprecated: true,
          type: "string",
          enum: ["domain", "user"],
        },
      },
      {
        name: "includePermissionsForView",
        in: "query",
        required: false,
        description:
          "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
        schema: {
          description:
            "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "corpora",
        in: "query",
        required: false,
        description:
          "Specifies a collection of items (files or documents) to which the query applies. Supported items include: * `user` * `domain` * `drive` * `allDrives` Prefer `user` or `drive` to `allDrives` for efficiency. By default, corpora is set to `user`. However, this can change depending on the filter set through the `q` parameter. For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization).",
        schema: {
          description:
            "Specifies a collection of items (files or documents) to which the query applies. Supported items include: * `user` * `domain` * `drive` * `allDrives` Prefer `user` or `drive` to `allDrives` for efficiency. By default, corpora is set to `user`. However, this can change depending on the filter set through the `q` parameter. For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization).",
          type: "string",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description:
          "The maximum number of files to return. The service may return fewer than this value. If unspecified, at most 100 files will be returned for shared drives, and the entire list of files for non-shared drives. The maximum value is 1000; values above 1000 will be coerced to 1000.",
        schema: {
          description:
            "The maximum number of files to return. The service may return fewer than this value. If unspecified, at most 100 files will be returned for shared drives, and the entire list of files for non-shared drives. The maximum value is 1000; values above 1000 will be coerced to 1000.",
          default: "100",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 1000,
        },
      },
      {
        name: "spaces",
        in: "query",
        required: false,
        description:
          "A comma-separated list of spaces to query within the corpora. Supported values are `drive` and `appDataFolder`. For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization).",
        schema: {
          description:
            "A comma-separated list of spaces to query within the corpora. Supported values are `drive` and `appDataFolder`. For more information, see [File organization](https://developers.google.com/workspace/drive/api/guides/about-files#file-organization).",
          default: "drive",
          type: "string",
        },
      },
      {
        name: "teamDriveId",
        in: "query",
        required: false,
        description: "Deprecated: Use `driveId` instead.",
        schema: {
          description: "Deprecated: Use `driveId` instead.",
          deprecated: true,
          type: "string",
        },
      },
      {
        name: "orderBy",
        in: "query",
        required: false,
        description:
          "A comma-separated list of sort keys. Valid keys are: * `createdTime`: When the file was created. Avoid using this key for queries on large item collections as it might result in timeouts or other issues. For time-related sorting on large item collections, use `modifiedTime desc` instead. * `folder`: The folder ID. This field is sorted using alphabetical ordering. * `modifiedByMeTime`: The last time the file was modified by the user. * `modifiedTime`: The last time the file was modified by anyone. * `name`: The name of the file. This field is sorted using alphabetical ordering, so 1, 12, 2, 22. * `name_natural`: The name of the file. This field is sorted using natural sort ordering, so 1, 2, 12, 22. * `quotaBytesUsed`: The number of storage quota bytes used by the file. * `recency`: The most recent timestamp from the file's date-time fields. * `sharedWithMeTime`: When the file was shared with the user, if applicable. * `starred`: Whether the user has starred the file. * `viewedByMeTime`: The last time the file was viewed by the user. Each key sorts ascending by default, but can be reversed with the `desc` modifier. Example usage: `?orderBy=folder,modifiedTime desc,name`.",
        schema: {
          description:
            "A comma-separated list of sort keys. Valid keys are: * `createdTime`: When the file was created. Avoid using this key for queries on large item collections as it might result in timeouts or other issues. For time-related sorting on large item collections, use `modifiedTime desc` instead. * `folder`: The folder ID. This field is sorted using alphabetical ordering. * `modifiedByMeTime`: The last time the file was modified by the user. * `modifiedTime`: The last time the file was modified by anyone. * `name`: The name of the file. This field is sorted using alphabetical ordering, so 1, 12, 2, 22. * `name_natural`: The name of the file. This field is sorted using natural sort ordering, so 1, 2, 12, 22. * `quotaBytesUsed`: The number of storage quota bytes used by the file. * `recency`: The most recent timestamp from the file's date-time fields. * `sharedWithMeTime`: When the file was shared with the user, if applicable. * `starred`: Whether the user has starred the file. * `viewedByMeTime`: The last time the file was viewed by the user. Each key sorts ascending by default, but can be reversed with the `desc` modifier. Example usage: `?orderBy=folder,modifiedTime desc,name`.",
          type: "string",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description:
          "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response.",
        schema: {
          description:
            "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response.",
          type: "string",
        },
      },
      {
        name: "includeTeamDriveItems",
        in: "query",
        required: false,
        description: "Deprecated: Use `includeItemsFromAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `includeItemsFromAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includeLabels",
        in: "query",
        required: false,
        description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
        schema: {
          description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
          type: "string",
        },
      },
      {
        name: "includeItemsFromAllDrives",
        in: "query",
        required: false,
        description: "Whether both My Drive and shared drive items should be included in results.",
        schema: {
          description: "Whether both My Drive and shared drive items should be included in results.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "q",
        in: "query",
        required: false,
        description:
          "A query for filtering the file results. For supported syntax, see [Search for files and folders](https://developers.google.com/workspace/drive/api/guides/search-files).",
        schema: {
          description:
            "A query for filtering the file results. For supported syntax, see [Search for files and folders](https://developers.google.com/workspace/drive/api/guides/search-files).",
          type: "string",
        },
      },
      {
        name: "driveId",
        in: "query",
        required: false,
        description: "ID of the shared drive to search.",
        schema: {
          description: "ID of the shared drive to search.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveFileList",
    },
  },
  {
    id: "drive.files.listLabels",
    command: "drive-files-list-labels",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/listLabels",
    },
    effect: "read",
    summary:
      "Lists the labels on a file. For more information, see [List labels on a file](https://developers.google.com/workspace/drive/api/guides/list-labels).",
    description:
      "Lists the labels on a file. For more information, see [List labels on a file](https://developers.google.com/workspace/drive/api/guides/list-labels).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "maxResults",
        in: "query",
        required: false,
        description: "The maximum number of labels to return per page. When not set, defaults to 100.",
        schema: {
          description: "The maximum number of labels to return per page. When not set, defaults to 100.",
          default: "100",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 100,
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description:
          "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response.",
        schema: {
          description:
            "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID for the file.",
        schema: {
          description: "The ID for the file.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveLabelList",
    },
  },
  {
    id: "drive.files.modifyLabels",
    command: "drive-files-modify-labels",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/modifyLabels",
    },
    effect: "write",
    summary:
      "Modifies the set of labels applied to a file. For more information, see [Set a label field on a file](https://developers.google.com/workspace/drive/api/guides/set-label). Returns a list of the labels that were added or modified.",
    description:
      "Modifies the set of labels applied to a file. For more information, see [Set a label field on a file](https://developers.google.com/workspace/drive/api/guides/set-label). Returns a list of the labels that were added or modified.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file to which the labels belong.",
        schema: {
          description: "The ID of the file to which the labels belong.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveModifyLabelsRequest",
    },
    response: {
      confidence: "contract",
      schema: "DriveModifyLabelsResponse",
    },
  },
  {
    id: "drive.files.update",
    command: "drive-files-update",
    binding: {
      kind: "http",
      method: "PATCH",
      path: "files/{fileId}",
    },
    effect: "write",
    summary:
      " Updates a file's metadata, content, or both. When calling this method, only populate fields in the request that you want to modify. When updating fields, some fields might be changed automatically, such as `modifiedDate`. This method supports patch semantics. This method supports an */upload* URI and accepts uploaded media with the following characteristics: - *Maximum file size:* 5,120 GB - *Accepted Media MIME types:* `*/*` (Specify a valid MIME type, rather than the literal `*/*` value. The literal `*/*` is only used to indicate that any valid MIME type can be uploaded. For more information, see [Google Workspace and Google Drive supported MIME types](https://developers.google.com/workspace/drive/api/guides/mime-types).) For more information on uploading files, see [Upload file data](https://developers.google.com/workspace/drive/api/guides/manage-uploads).",
    description:
      " Updates a file's metadata, content, or both. When calling this method, only populate fields in the request that you want to modify. When updating fields, some fields might be changed automatically, such as `modifiedDate`. This method supports patch semantics. This method supports an */upload* URI and accepts uploaded media with the following characteristics: - *Maximum file size:* 5,120 GB - *Accepted Media MIME types:* `*/*` (Specify a valid MIME type, rather than the literal `*/*` value. The literal `*/*` is only used to indicate that any valid MIME type can be uploaded. For more information, see [Google Workspace and Google Drive supported MIME types](https://developers.google.com/workspace/drive/api/guides/mime-types).) For more information on uploading files, see [Upload file data](https://developers.google.com/workspace/drive/api/guides/manage-uploads).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "ocrLanguage",
        in: "query",
        required: false,
        description: "A language hint for OCR processing during image import (ISO 639-1 code).",
        schema: {
          description: "A language hint for OCR processing during image import (ISO 639-1 code).",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "enforceSingleParent",
        in: "query",
        required: false,
        description: "Deprecated: Adding files to multiple folders is no longer supported. Use shortcuts instead.",
        schema: {
          description: "Deprecated: Adding files to multiple folders is no longer supported. Use shortcuts instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "addParents",
        in: "query",
        required: false,
        description: "A comma-separated list of parent IDs to add.",
        schema: {
          description: "A comma-separated list of parent IDs to add.",
          type: "string",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "keepRevisionForever",
        in: "query",
        required: false,
        description:
          "Whether to set the `keepForever` field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions.",
        schema: {
          description:
            "Whether to set the `keepForever` field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "includeLabels",
        in: "query",
        required: false,
        description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
        schema: {
          description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
          type: "string",
        },
      },
      {
        name: "includePermissionsForView",
        in: "query",
        required: false,
        description:
          "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
        schema: {
          description:
            "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
          type: "string",
        },
      },
      {
        name: "removeParents",
        in: "query",
        required: false,
        description: "A comma-separated list of parent IDs to remove.",
        schema: {
          description: "A comma-separated list of parent IDs to remove.",
          type: "string",
        },
      },
      {
        name: "useContentAsIndexableText",
        in: "query",
        required: false,
        description: "Whether to use the uploaded content as indexable text.",
        schema: {
          description: "Whether to use the uploaded content as indexable text.",
          default: "false",
          type: "boolean",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveFile",
    },
    response: {
      confidence: "contract",
      schema: "DriveFile",
    },
  },
  {
    id: "drive.files.watch",
    command: "drive-files-watch",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/watch",
    },
    effect: "write",
    summary:
      "Subscribes to changes to a file. For more information, see [Notifications for resource changes](https://developers.google.com/workspace/drive/api/guides/push).",
    description:
      "Subscribes to changes to a file. For more information, see [Notifications for resource changes](https://developers.google.com/workspace/drive/api/guides/push).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "includeLabels",
        in: "query",
        required: false,
        description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
        schema: {
          description: "A comma-separated list of IDs of labels to include in the `labelInfo` part of the response.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "includePermissionsForView",
        in: "query",
        required: false,
        description:
          "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
        schema: {
          description:
            "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
          type: "string",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "acknowledgeAbuse",
        in: "query",
        required: false,
        description:
          "Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the `alt` parameter is set to `media` and the user is the owner of the file or an organizer of the shared drive in which the file resides.",
        schema: {
          description:
            "Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the `alt` parameter is set to `media` and the user is the owner of the file or an organizer of the shared drive in which the file resides.",
          default: "false",
          type: "boolean",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveChannel",
    },
    response: {
      confidence: "contract",
      schema: "DriveChannel",
    },
  },
  {
    id: "drive.operations.get",
    command: "drive-operations-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "operations/{name}",
    },
    effect: "read",
    summary:
      "Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.",
    description:
      "Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "name",
        in: "path",
        required: true,
        description: "The name of the operation resource.",
        schema: {
          description: "The name of the operation resource.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveOperation",
    },
  },
  {
    id: "drive.permissions.create",
    command: "drive-permissions-create",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/permissions",
    },
    effect: "write",
    summary:
      "Creates a permission for a file or shared drive. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). **Warning:** Concurrent permission modifications (such as update or delete) on the same file, folder, or shared drive aren't supported across any users or clients; only the last update is applied.",
    description:
      "Creates a permission for a file or shared drive. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). **Warning:** Concurrent permission modifications (such as update or delete) on the same file, folder, or shared drive aren't supported across any users or clients; only the last update is applied.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "enforceExpansiveAccess",
        in: "query",
        required: false,
        description: "Deprecated: All requests use the expansive access rules.",
        schema: {
          description: "Deprecated: All requests use the expansive access rules.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "sendNotificationEmail",
        in: "query",
        required: false,
        description:
          "Whether to send a notification email when sharing to users or groups. This defaults to `true` for users and groups, and is not allowed for other requests. It must not be disabled for ownership transfers.",
        schema: {
          description:
            "Whether to send a notification email when sharing to users or groups. This defaults to `true` for users and groups, and is not allowed for other requests. It must not be disabled for ownership transfers.",
          type: "boolean",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
        schema: {
          description:
            "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "transferOwnership",
        in: "query",
        required: false,
        description:
          "Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect. For more information, see [Transfer file ownership](https://developers.google.com/workspace/drive/api/guides/transfer-file).",
        schema: {
          description:
            "Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect. For more information, see [Transfer file ownership](https://developers.google.com/workspace/drive/api/guides/transfer-file).",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file or shared drive.",
        schema: {
          description: "The ID of the file or shared drive.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "emailMessage",
        in: "query",
        required: false,
        description: "A plain text custom message to include in the notification email.",
        schema: {
          description: "A plain text custom message to include in the notification email.",
          type: "string",
        },
      },
      {
        name: "enforceSingleParent",
        in: "query",
        required: false,
        description: "Deprecated: See `moveToNewOwnersRoot` for details.",
        schema: {
          description: "Deprecated: See `moveToNewOwnersRoot` for details.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "moveToNewOwnersRoot",
        in: "query",
        required: false,
        description:
          "This parameter only takes effect if the item isn't in a shared drive and the request is attempting to transfer the ownership of the item. If set to `true`, the item is moved to the new owner's My Drive root folder and all prior parents removed. If set to `false`, parents aren't changed.",
        schema: {
          description:
            "This parameter only takes effect if the item isn't in a shared drive and the request is attempting to transfer the ownership of the item. If set to `true`, the item is moved to the new owner's My Drive root folder and all prior parents removed. If set to `false`, parents aren't changed.",
          default: "false",
          type: "boolean",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DrivePermission",
    },
    response: {
      confidence: "contract",
      schema: "DrivePermission",
    },
  },
  {
    id: "drive.permissions.delete",
    command: "drive-permissions-delete",
    binding: {
      kind: "http",
      method: "DELETE",
      path: "files/{fileId}/permissions/{permissionId}",
    },
    effect: "destructive",
    summary:
      "Deletes a permission. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). **Warning:** Concurrent permission modifications (such as update or delete) on the same file, folder, or shared drive aren't supported across any users or clients; only the last update is applied.",
    description:
      "Deletes a permission. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). **Warning:** Concurrent permission modifications (such as update or delete) on the same file, folder, or shared drive aren't supported across any users or clients; only the last update is applied.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
        schema: {
          description:
            "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "permissionId",
        in: "path",
        required: true,
        description: "The ID of the permission.",
        schema: {
          description: "The ID of the permission.",
          type: "string",
        },
      },
      {
        name: "enforceExpansiveAccess",
        in: "query",
        required: false,
        description: "Deprecated: All requests use the expansive access rules.",
        schema: {
          description: "Deprecated: All requests use the expansive access rules.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file or shared drive.",
        schema: {
          description: "The ID of the file or shared drive.",
          type: "string",
        },
      },
    ],
  },
  {
    id: "drive.permissions.get",
    command: "drive-permissions-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/permissions/{permissionId}",
    },
    effect: "read",
    summary:
      "Gets a permission by ID. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing).",
    description:
      "Gets a permission by ID. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "permissionId",
        in: "path",
        required: true,
        description: "The ID of the permission.",
        schema: {
          description: "The ID of the permission.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
        schema: {
          description:
            "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DrivePermission",
    },
  },
  {
    id: "drive.permissions.list",
    command: "drive-permissions-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/permissions",
    },
    effect: "read",
    summary:
      "Lists a file's or shared drive's permissions. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing).",
    description:
      "Lists a file's or shared drive's permissions. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
        schema: {
          description:
            "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description:
          "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response.",
        schema: {
          description:
            "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file or shared drive.",
        schema: {
          description: "The ID of the file or shared drive.",
          type: "string",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description:
          "The maximum number of permissions to return. The service may return fewer than this value. If unspecified, at most 100 permissions will be returned for shared drives, and the entire list of permissions for non-shared drives. The maximum value is 100; values above 100 will be coerced to 100.",
        schema: {
          description:
            "The maximum number of permissions to return. The service may return fewer than this value. If unspecified, at most 100 permissions will be returned for shared drives, and the entire list of permissions for non-shared drives. The maximum value is 100; values above 100 will be coerced to 100.",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 100,
        },
      },
      {
        name: "includePermissionsForView",
        in: "query",
        required: false,
        description:
          "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
        schema: {
          description:
            "Specifies which additional view's permissions to include in the response. Only `published` is supported.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DrivePermissionList",
    },
  },
  {
    id: "drive.permissions.update",
    command: "drive-permissions-update",
    binding: {
      kind: "http",
      method: "PATCH",
      path: "files/{fileId}/permissions/{permissionId}",
    },
    effect: "write",
    summary:
      "Updates a permission with patch semantics. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). **Warning:** Concurrent permission modifications (such as update or delete) on the same file, folder, or shared drive aren't supported across any users or clients; only the last update is applied.",
    description:
      "Updates a permission with patch semantics. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). **Warning:** Concurrent permission modifications (such as update or delete) on the same file, folder, or shared drive aren't supported across any users or clients; only the last update is applied.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
        schema: {
          description:
            "Issue the request as a domain administrator. If set to `true`, and if the following additional conditions are met, the requester is granted access: 1. The file ID parameter refers to a shared drive. 2. The requester is an administrator of the domain to which the shared drive belongs. For more information, see [Manage shared drives as domain administrators](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives#manage-administrators).",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "transferOwnership",
        in: "query",
        required: false,
        description:
          "Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect. For more information, see [Transfer file ownership](https://developers.google.com//workspace/drive/api/guides/transfer-file).",
        schema: {
          description:
            "Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect. For more information, see [Transfer file ownership](https://developers.google.com//workspace/drive/api/guides/transfer-file).",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "enforceExpansiveAccess",
        in: "query",
        required: false,
        description: "Deprecated: All requests use the expansive access rules.",
        schema: {
          description: "Deprecated: All requests use the expansive access rules.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "supportsAllDrives",
        in: "query",
        required: false,
        description: "Whether the requesting application supports both My Drives and shared drives.",
        schema: {
          description: "Whether the requesting application supports both My Drives and shared drives.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "supportsTeamDrives",
        in: "query",
        required: false,
        description: "Deprecated: Use `supportsAllDrives` instead.",
        schema: {
          description: "Deprecated: Use `supportsAllDrives` instead.",
          deprecated: true,
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file or shared drive.",
        schema: {
          description: "The ID of the file or shared drive.",
          type: "string",
        },
      },
      {
        name: "removeExpiration",
        in: "query",
        required: false,
        description: "Whether to remove the expiration date.",
        schema: {
          description: "Whether to remove the expiration date.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "permissionId",
        in: "path",
        required: true,
        description: "The ID of the permission.",
        schema: {
          description: "The ID of the permission.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DrivePermission",
    },
    response: {
      confidence: "contract",
      schema: "DrivePermission",
    },
  },
  {
    id: "drive.replies.create",
    command: "drive-replies-create",
    binding: {
      kind: "http",
      method: "POST",
      path: "files/{fileId}/comments/{commentId}/replies",
    },
    effect: "write",
    summary:
      "Creates a reply to a comment. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    description:
      "Creates a reply to a comment. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "commentId",
        in: "path",
        required: true,
        description: "The ID of the comment.",
        schema: {
          description: "The ID of the comment.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveReply",
    },
    response: {
      confidence: "contract",
      schema: "DriveReply",
    },
  },
  {
    id: "drive.replies.delete",
    command: "drive-replies-delete",
    binding: {
      kind: "http",
      method: "DELETE",
      path: "files/{fileId}/comments/{commentId}/replies/{replyId}",
    },
    effect: "destructive",
    summary:
      "Deletes a reply. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    description:
      "Deletes a reply. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "commentId",
        in: "path",
        required: true,
        description: "The ID of the comment.",
        schema: {
          description: "The ID of the comment.",
          type: "string",
        },
      },
      {
        name: "replyId",
        in: "path",
        required: true,
        description: "The ID of the reply.",
        schema: {
          description: "The ID of the reply.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
    ],
  },
  {
    id: "drive.replies.get",
    command: "drive-replies-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/comments/{commentId}/replies/{replyId}",
    },
    effect: "read",
    summary:
      "Gets a reply by ID. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    description:
      "Gets a reply by ID. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "includeDeleted",
        in: "query",
        required: false,
        description: "Whether to return deleted replies. Deleted replies don't include their original content.",
        schema: {
          description: "Whether to return deleted replies. Deleted replies don't include their original content.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "commentId",
        in: "path",
        required: true,
        description: "The ID of the comment.",
        schema: {
          description: "The ID of the comment.",
          type: "string",
        },
      },
      {
        name: "replyId",
        in: "path",
        required: true,
        description: "The ID of the reply.",
        schema: {
          description: "The ID of the reply.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveReply",
    },
  },
  {
    id: "drive.replies.list",
    command: "drive-replies-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/comments/{commentId}/replies",
    },
    effect: "read",
    summary:
      "Lists a comment's replies. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    description:
      "Lists a comment's replies. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description:
          "The maximum number of replies to return. The service may return fewer than this value. If unspecified, at most 20 replies will be returned. The maximum value is 100; values above 100 will be coerced to 100.",
        schema: {
          description:
            "The maximum number of replies to return. The service may return fewer than this value. If unspecified, at most 20 replies will be returned. The maximum value is 100; values above 100 will be coerced to 100.",
          default: "20",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 100,
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "commentId",
        in: "path",
        required: true,
        description: "The ID of the comment.",
        schema: {
          description: "The ID of the comment.",
          type: "string",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description:
          "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response.",
        schema: {
          description:
            "The token for continuing a previous list request on the next page. This should be set to the value of `nextPageToken` from the previous response.",
          type: "string",
        },
      },
      {
        name: "includeDeleted",
        in: "query",
        required: false,
        description: "Whether to include deleted replies. Deleted replies don't include their original content.",
        schema: {
          description: "Whether to include deleted replies. Deleted replies don't include their original content.",
          default: "false",
          type: "boolean",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveReplyList",
    },
  },
  {
    id: "drive.replies.update",
    command: "drive-replies-update",
    binding: {
      kind: "http",
      method: "PATCH",
      path: "files/{fileId}/comments/{commentId}/replies/{replyId}",
    },
    effect: "write",
    summary:
      "Updates a reply with patch semantics. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    description:
      "Updates a reply with patch semantics. For more information, see [Manage comments and replies](https://developers.google.com/workspace/drive/api/guides/manage-comments).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "commentId",
        in: "path",
        required: true,
        description: "The ID of the comment.",
        schema: {
          description: "The ID of the comment.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "replyId",
        in: "path",
        required: true,
        description: "The ID of the reply.",
        schema: {
          description: "The ID of the reply.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveReply",
    },
    response: {
      confidence: "contract",
      schema: "DriveReply",
    },
  },
  {
    id: "drive.revisions.delete",
    command: "drive-revisions-delete",
    binding: {
      kind: "http",
      method: "DELETE",
      path: "files/{fileId}/revisions/{revisionId}",
    },
    effect: "destructive",
    summary:
      "Permanently deletes a file version. You can only delete revisions for files with binary content in Google Drive, like images or videos. Revisions for other files, like Google Docs or Sheets, and the last remaining file version can't be deleted. For more information, see [Manage file revisions](https://developers.google.com/drive/api/guides/manage-revisions).",
    description:
      "Permanently deletes a file version. You can only delete revisions for files with binary content in Google Drive, like images or videos. Revisions for other files, like Google Docs or Sheets, and the last remaining file version can't be deleted. For more information, see [Manage file revisions](https://developers.google.com/drive/api/guides/manage-revisions).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "revisionId",
        in: "path",
        required: true,
        description: "The ID of the revision.",
        schema: {
          description: "The ID of the revision.",
          type: "string",
        },
      },
    ],
  },
  {
    id: "drive.revisions.get",
    command: "drive-revisions-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/revisions/{revisionId}",
    },
    effect: "read",
    summary:
      "Gets a revision's metadata or content by ID. For more information, see [Manage file revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions).",
    description:
      "Gets a revision's metadata or content by ID. For more information, see [Manage file revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "revisionId",
        in: "path",
        required: true,
        description: "The ID of the revision.",
        schema: {
          description: "The ID of the revision.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "acknowledgeAbuse",
        in: "query",
        required: false,
        description:
          "Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the `alt` parameter is set to `media` and the user is the owner of the file or an organizer of the shared drive in which the file resides.",
        schema: {
          description:
            "Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when the `alt` parameter is set to `media` and the user is the owner of the file or an organizer of the shared drive in which the file resides.",
          default: "false",
          type: "boolean",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveRevision",
    },
  },
  {
    id: "drive.revisions.list",
    command: "drive-revisions-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "files/{fileId}/revisions",
    },
    effect: "read",
    summary:
      "Lists a file's revisions. For more information, see [Manage file revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions). **Important:** The list of revisions returned by this method might be incomplete for files with a large revision history, including frequently edited Google Docs, Sheets, and Slides. Older revisions might be omitted from the response, meaning the first revision returned may not be the oldest existing revision. The revision history visible in the Workspace editor user interface might be more complete than the list returned by the API.",
    description:
      "Lists a file's revisions. For more information, see [Manage file revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions). **Important:** The list of revisions returned by this method might be incomplete for files with a large revision history, including frequently edited Google Docs, Sheets, and Slides. Older revisions might be omitted from the response, meaning the first revision returned may not be the oldest existing revision. The revision history visible in the Workspace editor user interface might be more complete than the list returned by the API.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description:
          "The maximum number of revisions to return. The service may return fewer than this value. If unspecified, at most 200 revisions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.",
        schema: {
          description:
            "The maximum number of revisions to return. The service may return fewer than this value. If unspecified, at most 200 revisions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.",
          default: "200",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 1000,
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description:
          "The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.",
        schema: {
          description:
            "The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveRevisionList",
    },
  },
  {
    id: "drive.revisions.update",
    command: "drive-revisions-update",
    binding: {
      kind: "http",
      method: "PATCH",
      path: "files/{fileId}/revisions/{revisionId}",
    },
    effect: "write",
    summary:
      "Updates a revision with patch semantics. For more information, see [Manage file revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions).",
    description:
      "Updates a revision with patch semantics. For more information, see [Manage file revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions).",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fileId",
        in: "path",
        required: true,
        description: "The ID of the file.",
        schema: {
          description: "The ID of the file.",
          type: "string",
        },
      },
      {
        name: "revisionId",
        in: "path",
        required: true,
        description: "The ID of the revision.",
        schema: {
          description: "The ID of the revision.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveRevision",
    },
    response: {
      confidence: "contract",
      schema: "DriveRevision",
    },
  },
  {
    id: "drive.teamdrives.create",
    command: "drive-teamdrives-create",
    binding: {
      kind: "http",
      method: "POST",
      path: "teamdrives",
    },
    effect: "write",
    summary: "Deprecated: Use `drives.create` instead.",
    description: "Deprecated: Use `drives.create` instead.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "requestId",
        in: "query",
        required: true,
        description:
          "Required. An ID, such as a random UUID, which uniquely identifies this user's request for idempotent creation of a Team Drive. A repeated request by the same user and with the same request ID will avoid creating duplicates by attempting to create the same Team Drive. If the Team Drive already exists a 409 error will be returned.",
        schema: {
          description:
            "Required. An ID, such as a random UUID, which uniquely identifies this user's request for idempotent creation of a Team Drive. A repeated request by the same user and with the same request ID will avoid creating duplicates by attempting to create the same Team Drive. If the Team Drive already exists a 409 error will be returned.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveTeamDrive",
    },
    response: {
      confidence: "contract",
      schema: "DriveTeamDrive",
    },
  },
  {
    id: "drive.teamdrives.delete",
    command: "drive-teamdrives-delete",
    binding: {
      kind: "http",
      method: "DELETE",
      path: "teamdrives/{teamDriveId}",
    },
    effect: "destructive",
    summary: "Deprecated: Use `drives.delete` instead.",
    description: "Deprecated: Use `drives.delete` instead.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "teamDriveId",
        in: "path",
        required: true,
        description: "The ID of the Team Drive",
        schema: {
          description: "The ID of the Team Drive",
          type: "string",
        },
      },
    ],
  },
  {
    id: "drive.teamdrives.get",
    command: "drive-teamdrives-get",
    binding: {
      kind: "http",
      method: "GET",
      path: "teamdrives/{teamDriveId}",
    },
    effect: "read",
    summary: "Deprecated: Use `drives.get` instead.",
    description: "Deprecated: Use `drives.get` instead.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "teamDriveId",
        in: "path",
        required: true,
        description: "The ID of the Team Drive",
        schema: {
          description: "The ID of the Team Drive",
          type: "string",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the Team Drive belongs.",
        schema: {
          description:
            "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the Team Drive belongs.",
          default: "false",
          type: "boolean",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveTeamDrive",
    },
  },
  {
    id: "drive.teamdrives.list",
    command: "drive-teamdrives-list",
    binding: {
      kind: "http",
      method: "GET",
      path: "teamdrives",
    },
    effect: "read",
    summary: "Deprecated: Use `drives.list` instead.",
    description: "Deprecated: Use `drives.list` instead.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "q",
        in: "query",
        required: false,
        description: "Query string for searching Team Drives.",
        schema: {
          description: "Query string for searching Team Drives.",
          type: "string",
        },
      },
      {
        name: "pageSize",
        in: "query",
        required: false,
        description: "Maximum number of Team Drives to return.",
        schema: {
          description: "Maximum number of Team Drives to return.",
          default: "10",
          type: "integer",
          format: "int32",
          minimum: 1,
          maximum: 100,
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator; if set to true, then all Team Drives of the domain in which the requester is an administrator are returned.",
        schema: {
          description:
            "Issue the request as a domain administrator; if set to true, then all Team Drives of the domain in which the requester is an administrator are returned.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "pageToken",
        in: "query",
        required: false,
        description: "Page token for Team Drives.",
        schema: {
          description: "Page token for Team Drives.",
          type: "string",
        },
      },
    ],
    response: {
      confidence: "contract",
      schema: "DriveTeamDriveList",
    },
  },
  {
    id: "drive.teamdrives.update",
    command: "drive-teamdrives-update",
    binding: {
      kind: "http",
      method: "PATCH",
      path: "teamdrives/{teamDriveId}",
    },
    effect: "write",
    summary: "Deprecated: Use `drives.update` instead.",
    description: "Deprecated: Use `drives.update` instead.",
    tags: ["drive"],
    parameters: [
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "useDomainAdminAccess",
        in: "query",
        required: false,
        description:
          "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the Team Drive belongs.",
        schema: {
          description:
            "Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the Team Drive belongs.",
          default: "false",
          type: "boolean",
        },
      },
      {
        name: "teamDriveId",
        in: "path",
        required: true,
        description: "The ID of the Team Drive",
        schema: {
          description: "The ID of the Team Drive",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveTeamDrive",
    },
    response: {
      confidence: "contract",
      schema: "DriveTeamDrive",
    },
  },
  {
    id: "driveactivity.activity.query",
    command: "driveactivity-activity-query",
    binding: {
      kind: "http",
      method: "POST",
      path: "v2/activity:query",
    },
    effect: "read",
    summary: "Query past activity in Google Drive.",
    description: "Query past activity in Google Drive.",
    tags: ["driveactivity"],
    parameters: [
      {
        name: "alt",
        in: "query",
        required: false,
        description: "Data format for response.",
        schema: {
          description: "Data format for response.",
          default: "json",
          type: "string",
          enum: ["json", "media", "proto"],
        },
      },
      {
        name: "callback",
        in: "query",
        required: false,
        description: "JSONP",
        schema: {
          description: "JSONP",
          type: "string",
        },
      },
      {
        name: "$.xgafv",
        in: "query",
        required: false,
        description: "V1 error format.",
        schema: {
          description: "V1 error format.",
          type: "string",
          enum: ["1", "2"],
        },
      },
      {
        name: "prettyPrint",
        in: "query",
        required: false,
        description: "Returns response with indentations and line breaks.",
        schema: {
          description: "Returns response with indentations and line breaks.",
          default: "true",
          type: "boolean",
        },
      },
      {
        name: "quotaUser",
        in: "query",
        required: false,
        description:
          "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
        schema: {
          description:
            "Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.",
          type: "string",
        },
      },
      {
        name: "fields",
        in: "query",
        required: false,
        description: "Selector specifying which fields to include in a partial response.",
        schema: {
          description: "Selector specifying which fields to include in a partial response.",
          type: "string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DriveactivityQueryDriveActivityRequest",
    },
    response: {
      confidence: "contract",
      schema: "DriveactivityQueryDriveActivityResponse",
    },
  },
]
