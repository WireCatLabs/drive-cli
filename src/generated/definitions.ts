// GENERATED. DO NOT EDIT.
// Source: spec/google/*.json, verified by provenance.json
// Run: pnpm generate

import type { SchemaNode } from "@wirecat/cli-core/codegen"

export const definitions: Readonly<Record<string, SchemaNode>> = {
  DriveOperation: {
    description: "This resource represents a long-running operation that is the result of a network API call.",
    type: "object",
    properties: {
      response: {
        description:
          "The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          description: "Properties of the object. Contains field @type with type URL.",
          type: "unknown",
        },
      },
      metadata: {
        description:
          "Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          description: "Properties of the object. Contains field @type with type URL.",
          type: "unknown",
        },
      },
      error: {
        description: "The error result of the operation in case of failure or cancellation.",
        type: "ref",
        ref: "drive_Status",
      },
      name: {
        description:
          "The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`.",
        type: "string",
      },
      done: {
        description:
          "If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.",
        type: "boolean",
      },
    },
    required: [],
  },
  DrivePermission: {
    description:
      "A permission for a file. A permission grants a user, group, domain, or the world access to a file or a folder hierarchy. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). By default, permission requests only return a subset of fields. Permission `kind`, `ID`, `type`, and `role` are always returned. To retrieve specific fields, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter). Some resource methods (such as `permissions.update`) require a `permissionId`. Use the `permissions.list` method to retrieve the ID for a file, folder, or shared drive.",
    type: "object",
    properties: {
      type: {
        description:
          "The type of the grantee. Supported values include: * `user` * `group` * `domain` * `anyone` When creating a permission, if `type` is `user` or `group`, you must provide an `emailAddress` for the user or group. If `type` is `domain`, you must provide a `domain`. If `type` is `anyone`, no extra information is required.",
        type: "string",
      },
      permissionDetails: {
        description:
          "Output only. Details of whether the permissions on this item are inherited or are directly on this item.",
        type: "array",
        items: {
          type: "object",
          properties: {
            role: {
              description:
                "Output only. The primary role for this user. Supported values include: * `owner` * `organizer` * `fileOrganizer` * `writer` * `commenter` * `reader` For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles).",
              type: "string",
            },
            inheritedFrom: {
              description:
                "Output only. The ID of the item from which this permission is inherited. This is only populated for items in shared drives.",
              type: "string",
            },
            inherited: {
              description:
                "Output only. Whether this permission is inherited. This field is always populated. This is an output-only field.",
              type: "boolean",
            },
            permissionType: {
              description:
                "Output only. The permission type for this user. Supported values include: * `file` * `member`",
              type: "string",
            },
          },
          required: [],
        },
      },
      teamDrivePermissionDetails: {
        description: "Output only. Deprecated: Output only. Use `permissionDetails` instead.",
        deprecated: true,
        type: "array",
        items: {
          type: "object",
          properties: {
            inherited: {
              description: "Deprecated: Output only. Use `permissionDetails/inherited` instead.",
              deprecated: true,
              type: "boolean",
            },
            inheritedFrom: {
              description: "Deprecated: Output only. Use `permissionDetails/inheritedFrom` instead.",
              deprecated: true,
              type: "string",
            },
            teamDrivePermissionType: {
              description: "Deprecated: Output only. Use `permissionDetails/permissionType` instead.",
              deprecated: true,
              type: "string",
            },
            role: {
              description: "Deprecated: Output only. Use `permissionDetails/role` instead.",
              deprecated: true,
              type: "string",
            },
          },
          required: [],
        },
      },
      deleted: {
        description:
          "Output only. Whether the account associated with this permission has been deleted. This field only pertains to permissions of type `user` or `group`.",
        type: "boolean",
      },
      allowFileDiscovery: {
        description:
          "Whether the permission allows the file to be discovered through search. This is only applicable for permissions of type `domain` or `anyone`.",
        type: "boolean",
      },
      kind: {
        description:
          'Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#permission"`.',
        default: "drive#permission",
        type: "string",
      },
      role: {
        description:
          "The role granted by this permission. Supported values include: * `owner` * `organizer` * `fileOrganizer` * `writer` * `commenter` * `reader` For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles).",
        type: "string",
      },
      id: {
        description:
          "Output only. The ID of this permission. This is a unique identifier for the grantee, and is published in the [User resource](https://developers.google.com/workspace/drive/api/reference/rest/v3/User) as `permissionId`. IDs should be treated as opaque values.",
        type: "string",
      },
      photoLink: {
        description: "Output only. A link to the user's profile photo, if available.",
        type: "string",
      },
      inheritedPermissionsDisabled: {
        description:
          "When `true`, only organizers, owners, and users with permissions added directly on the item can access it.",
        type: "boolean",
      },
      pendingOwner: {
        description:
          "Whether the account associated with this permission is a pending owner. Only populated for permissions of type `user` for files that aren't in a shared drive.",
        type: "boolean",
      },
      expirationTime: {
        description:
          "The time at which this permission will expire (RFC 3339 date-time). Expiration times have the following restrictions: - They can only be set on user and group permissions - The time must be in the future - The time cannot be more than a year in the future",
        type: "string",
      },
      emailAddress: {
        description: "Output only. The email address of the user or group to which this permission refers.",
        type: "string",
      },
      displayName: {
        description:
          'Output only. The "pretty" name of the value of the permission. The following is a list of examples for each type of permission: * `user` - User\'s full name, as defined for their Google Account, such as "Dana A." * `group` - Name of the Google Group, such as "The Company Administrators." * `domain` - String domain name, such as "cymbalgroup.com." * `anyone` - No `displayName` is present.',
        type: "string",
      },
      domain: {
        description: "Output only. The domain to which this permission refers.",
        type: "string",
      },
      view: {
        description:
          "Indicates the view for this permission. Only populated for permissions that belong to a view. The only supported values are `published` and `metadata`: * `published`: The permission's role is `publishedReader`. * `metadata`: The item is only visible to the `metadata` view because the item has limited access and the scope has at least read access to the parent. The `metadata` view is only supported on folders. For more information, see [Views](https://developers.google.com/workspace/drive/api/guides/ref-roles#views).",
        type: "string",
      },
    },
    required: [],
  },
  DriveAddReviewer: {
    description: "Representation of a reviewer addition.",
    type: "object",
    properties: {
      addedReviewerEmail: {
        description: "Required. The email of the reviewer to add.",
        type: "string",
      },
    },
    required: [],
  },
  DriveTeamDrive: {
    description: "Deprecated: use the drive collection instead. Next ID: 33",
    type: "object",
    properties: {
      capabilities: {
        description: "Capabilities the current user has on this Team Drive.",
        type: "object",
        properties: {
          canEdit: {
            description: "Whether the current user can edit files in this Team Drive",
            type: "boolean",
          },
          canListChildren: {
            description: "Whether the current user can list the children of folders in this Team Drive.",
            type: "boolean",
          },
          canRenameTeamDrive: {
            description: "Whether the current user can rename this Team Drive.",
            type: "boolean",
          },
          canChangeTeamMembersOnlyRestriction: {
            description: "Whether the current user can change the `teamMembersOnly` restriction of this Team Drive.",
            type: "boolean",
          },
          canChangeSharingFoldersRequiresOrganizerPermissionRestriction: {
            description:
              "Whether the current user can change the `sharingFoldersRequiresOrganizerPermission` restriction of this Team Drive.",
            type: "boolean",
          },
          canReadRevisions: {
            description: "Whether the current user can read the revisions resource of files in this Team Drive.",
            type: "boolean",
          },
          canChangeDomainUsersOnlyRestriction: {
            description: "Whether the current user can change the `domainUsersOnly` restriction of this Team Drive.",
            type: "boolean",
          },
          canDeleteChildren: {
            description: "Whether the current user can delete children from folders in this Team Drive.",
            type: "boolean",
          },
          canChangeDownloadRestriction: {
            description:
              "Output only. Whether the current user can change organizer-applied download restrictions of this shared drive.",
            type: "boolean",
          },
          canResetTeamDriveRestrictions: {
            description: "Whether the current user can reset the Team Drive restrictions to defaults.",
            type: "boolean",
          },
          canShare: {
            description: "Whether the current user can share files or folders in this Team Drive.",
            type: "boolean",
          },
          canRename: {
            description: "Whether the current user can rename files or folders in this Team Drive.",
            type: "boolean",
          },
          canManageMembers: {
            description:
              "Whether the current user can add members to this Team Drive or remove them or change their role.",
            type: "boolean",
          },
          canChangeTeamDriveBackground: {
            description: "Whether the current user can change the background of this Team Drive.",
            type: "boolean",
          },
          canChangeCopyRequiresWriterPermissionRestriction: {
            description:
              "Whether the current user can change the `copyRequiresWriterPermission` restriction of this Team Drive.",
            type: "boolean",
          },
          canAddChildren: {
            description: "Whether the current user can add children to folders in this Team Drive.",
            type: "boolean",
          },
          canDownload: {
            description: "Whether the current user can download files in this Team Drive.",
            type: "boolean",
          },
          canDeleteTeamDrive: {
            description:
              "Whether the current user can delete this Team Drive. Attempting to delete the Team Drive may still fail if there are untrashed items inside the Team Drive.",
            type: "boolean",
          },
          canCopy: {
            description: "Whether the current user can copy files in this Team Drive.",
            type: "boolean",
          },
          canComment: {
            description: "Whether the current user can comment on files in this Team Drive.",
            type: "boolean",
          },
          canTrashChildren: {
            description: "Whether the current user can trash children from folders in this Team Drive.",
            type: "boolean",
          },
          canRemoveChildren: {
            description: "Deprecated: Use `canDeleteChildren` or `canTrashChildren` instead.",
            deprecated: true,
            type: "boolean",
          },
        },
        required: [],
      },
      id: {
        description: "The ID of this Team Drive which is also the ID of the top level folder of this Team Drive.",
        type: "string",
      },
      restrictions: {
        description: "A set of restrictions that apply to this Team Drive or items inside this Team Drive.",
        type: "object",
        properties: {
          sharingFoldersRequiresOrganizerPermission: {
            description:
              "If true, only users with the organizer role can share folders. If false, users with either the organizer role or the file organizer role can share folders.",
            type: "boolean",
          },
          teamMembersOnly: {
            description: "Whether access to items inside this Team Drive is restricted to members of this Team Drive.",
            type: "boolean",
          },
          copyRequiresWriterPermission: {
            description:
              "Whether the options to copy, print, or download files inside this Team Drive, should be disabled for readers and commenters. When this restriction is set to `true`, it will override the similarly named field to `true` for any file inside this Team Drive.",
            type: "boolean",
          },
          adminManagedRestrictions: {
            description: "Whether administrative privileges on this Team Drive are required to modify restrictions.",
            type: "boolean",
          },
          downloadRestriction: {
            description: "Download restrictions applied by shared drive managers.",
            type: "ref",
            ref: "drive_DownloadRestriction",
          },
          domainUsersOnly: {
            description:
              "Whether access to this Team Drive and items inside this Team Drive is restricted to users of the domain to which this Team Drive belongs. This restriction may be overridden by other sharing policies controlled outside of this Team Drive.",
            type: "boolean",
          },
        },
        required: [],
      },
      orgUnitId: {
        description:
          "The organizational unit of this shared drive. This field is only populated on `drives.list` responses when the `useDomainAdminAccess` parameter is set to `true`.",
        type: "string",
      },
      themeId: {
        description:
          "The ID of the theme from which the background image and color will be set. The set of possible `teamDriveThemes` can be retrieved from a `drive.about.get` response. When not specified on a `drive.teamdrives.create` request, a random theme is chosen from which the background image and color are set. This is a write-only field; it can only be set on requests that don't set `colorRgb` or `backgroundImageFile`.",
        type: "string",
      },
      name: {
        description: "The name of this Team Drive.",
        type: "string",
      },
      backgroundImageFile: {
        description: "The background image file for a Team Drive.",
        type: "object",
        properties: {
          width: {
            description:
              "The width of the cropped image in the closed range of 0 to 1. This value represents the width of the cropped image divided by the width of the entire image. The height is computed by applying a width to height aspect ratio of 80 to 9. The resulting image must be at least 1280 pixels wide and 144 pixels high.",
            type: "number",
          },
          id: {
            description: "The ID of an image file in Drive to use for the background image.",
            type: "string",
          },
          xCoordinate: {
            description:
              "The X coordinate of the upper left corner of the cropping area in the background image. This is a value in the closed range of 0 to 1. This value represents the horizontal distance from the left side of the entire image to the left side of the cropping area divided by the width of the entire image.",
            type: "number",
          },
          yCoordinate: {
            description:
              "The Y coordinate of the upper left corner of the cropping area in the background image. This is a value in the closed range of 0 to 1. This value represents the vertical distance from the top side of the entire image to the top side of the cropping area divided by the height of the entire image.",
            type: "number",
          },
        },
        required: [],
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#teamDrive"`.',
        default: "drive#teamDrive",
        type: "string",
      },
      backgroundImageLink: {
        description: "A short-lived link to this Team Drive's background image.",
        type: "string",
      },
      createdTime: {
        description: "The time at which the Team Drive was created (RFC 3339 date-time).",
        type: "string",
      },
      colorRgb: {
        description:
          "The color of this Team Drive as an RGB hex string. It can only be set on a `drive.teamdrives.update` request that does not set `themeId`.",
        type: "string",
      },
    },
    required: [],
  },
  DriveListAccessProposalsResponse: {
    description: "The response to an access proposal list request.",
    type: "object",
    properties: {
      nextPageToken: {
        description:
          "The continuation token for the next page of results. This will be absent if the end of the results list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results.",
        type: "string",
      },
      accessProposals: {
        description: "The list of access proposals. This field is only populated in Drive API v3.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_AccessProposal",
        },
      },
    },
    required: [],
  },
  DriveReply: {
    description:
      "A reply to a comment on a file. Some resource methods (such as `replies.update`) require a `replyId`. Use the `replies.list` method to retrieve the ID for a reply.",
    type: "object",
    properties: {
      createdTime: {
        description: "The time at which the reply was created (RFC 3339 date-time).",
        type: "string",
      },
      mentionedEmailAddresses: {
        description:
          "Output only. A list of email addresses for users mentioned in this comment. If no users are mentioned, the list is empty.",
        type: "array",
        items: {
          type: "string",
        },
      },
      assigneeEmailAddress: {
        description:
          "Output only. The email address of the user assigned to this comment. If no user is assigned, the field is unset.",
        type: "string",
      },
      content: {
        description:
          "The plain text content of the reply. This field is used for setting the content, while `htmlContent` should be displayed. This field is required by the `create` method if no `action` value is specified.",
        type: "string",
      },
      id: {
        description: "Output only. The ID of the reply.",
        type: "string",
      },
      author: {
        description:
          "Output only. The author of the reply. The author's email address and permission ID won't be populated.",
        type: "ref",
        ref: "drive_User",
      },
      action: {
        description:
          "The action the reply performed to the parent comment. The supported values are: * `resolve` * `reopen`",
        type: "string",
      },
      deleted: {
        description: "Output only. Whether the reply has been deleted. A deleted reply has no content.",
        type: "boolean",
      },
      kind: {
        description: 'Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#reply"`.',
        default: "drive#reply",
        type: "string",
      },
      modifiedTime: {
        description: "The last time the reply was modified (RFC 3339 date-time).",
        type: "string",
      },
      htmlContent: {
        description: "Output only. The content of the reply with HTML formatting.",
        type: "string",
      },
    },
    required: [],
  },
  DriveComment: {
    description:
      "A comment on a file. Some resource methods (such as `comments.update`) require a `commentId`. Use the `comments.list` method to retrieve the ID for a comment in a file.",
    type: "object",
    properties: {
      resolved: {
        description: "Output only. Whether the comment has been resolved by one of its replies.",
        type: "boolean",
      },
      replies: {
        description: "Output only. The full list of replies to the comment in chronological order.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Reply",
        },
      },
      quotedFileContent: {
        description:
          "The file content to which the comment refers, typically within the anchor region. For a text file, for example, this would be the text at the location of the comment.",
        type: "object",
        properties: {
          value: {
            description: "The quoted content itself. This is interpreted as plain text if set through the API.",
            type: "string",
          },
          mimeType: {
            description: "The MIME type of the quoted content.",
            type: "string",
          },
        },
        required: [],
      },
      kind: {
        description:
          'Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#comment"`.',
        default: "drive#comment",
        type: "string",
      },
      anchor: {
        description:
          "A region of the document represented as a JSON string. For details on defining anchor properties, refer to [Manage comments and replies](https://developers.google.com/workspace/drive/api/v3/manage-comments).",
        type: "string",
      },
      modifiedTime: {
        description: "The last time the comment or any of its replies was modified (RFC 3339 date-time).",
        type: "string",
      },
      htmlContent: {
        description: "Output only. The content of the comment with HTML formatting.",
        type: "string",
      },
      author: {
        description:
          "Output only. The author of the comment. The author's email address and permission ID will not be populated.",
        type: "ref",
        ref: "drive_User",
      },
      content: {
        description:
          "The plain text content of the comment. This field is used for setting the content, while `htmlContent` should be displayed.",
        type: "string",
      },
      assigneeEmailAddress: {
        description:
          "Output only. The email address of the user assigned to this comment. If no user is assigned, the field is unset.",
        type: "string",
      },
      mentionedEmailAddresses: {
        description:
          "Output only. A list of email addresses for users mentioned in this comment. If no users are mentioned, the list is empty.",
        type: "array",
        items: {
          type: "string",
        },
      },
      deleted: {
        description: "Output only. Whether the comment has been deleted. A deleted comment has no content.",
        type: "boolean",
      },
      id: {
        description: "Output only. The ID of the comment.",
        type: "string",
      },
      createdTime: {
        description: "The time at which the comment was created (RFC 3339 date-time).",
        type: "string",
      },
    },
    required: [],
  },
  DriveChange: {
    description: "A change to a file or shared drive.",
    type: "object",
    properties: {
      drive: {
        description:
          "The updated state of the shared drive. Present if the changeType is drive, the user is still a member of the shared drive, and the shared drive has not been deleted.",
        type: "ref",
        ref: "drive_Drive",
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#change"`.',
        default: "drive#change",
        type: "string",
      },
      removed: {
        description:
          "Whether the file or shared drive has been removed from this list of changes, for example by deletion or loss of access.",
        type: "boolean",
      },
      time: {
        description: "The time of this change (RFC 3339 date-time).",
        type: "string",
      },
      teamDrive: {
        description: "Deprecated: Use `drive` instead.",
        deprecated: true,
        type: "ref",
        ref: "drive_TeamDrive",
      },
      driveId: {
        description: "The ID of the shared drive associated with this change.",
        type: "string",
      },
      type: {
        description: "Deprecated: Use `changeType` instead.",
        deprecated: true,
        type: "string",
      },
      teamDriveId: {
        description: "Deprecated: Use `driveId` instead.",
        deprecated: true,
        type: "string",
      },
      fileId: {
        description: "The ID of the file which has changed.",
        type: "string",
      },
      changeType: {
        description: "The type of the change. Possible values are `file` and `drive`.",
        type: "string",
      },
      file: {
        description:
          "The updated state of the file. Present if the type is file and the file has not been removed from this list of changes.",
        type: "ref",
        ref: "drive_File",
      },
    },
    required: [],
  },
  DriveDecryptionMetadata: {
    description: "Representation of the CSE DecryptionMetadata.",
    type: "object",
    properties: {
      kaclsId: {
        description: "The ID of the KACLS (Key ACL Service) used to encrypt the file.",
        type: "string",
        pattern: "^-?\\d+$",
      },
      jwt: {
        description:
          "The signed JSON Web Token (JWT) which can be used to authorize the requesting user with the Key ACL Service (KACLS). The JWT asserts that the requesting user has at least read permissions on the file.",
        type: "string",
      },
      kaclsName: {
        description: "The name of the KACLS (Key ACL Service) used to encrypt the file.",
        type: "string",
      },
      keyFormat: {
        description: "Key format for the unwrapped key. Must be `tinkAesGcmKey`.",
        type: "string",
      },
      wrappedKey: {
        description: "The URL-safe Base64 encoded wrapped key used to encrypt the contents of the file.",
        type: "string",
      },
      encryptionResourceKeyHash: {
        description:
          "The URL-safe Base64 encoded HMAC-SHA256 digest of the resource metadata with its DEK (Data Encryption Key); see https://developers.google.com/workspace/cse/reference",
        type: "string",
      },
      aes256GcmChunkSize: {
        description:
          "Chunk size used if content was encrypted with the AES 256 GCM Cipher. Possible values are: - default - small ",
        type: "string",
      },
    },
    required: [],
  },
  DriveLabelFieldModification: {
    description: "A modification to a label's field.",
    type: "object",
    properties: {
      setDateValues: {
        description:
          "Replaces the value of a dateString Field with these new values. The string must be in the RFC 3339 full-date format: YYYY-MM-DD.",
        type: "array",
        items: {
          type: "string",
        },
      },
      setTextValues: {
        description: "Sets the value of a `text` field.",
        type: "array",
        items: {
          type: "string",
        },
      },
      setIntegerValues: {
        description: "Replaces the value of an `integer` field with these new values.",
        type: "array",
        items: {
          type: "string",
          pattern: "^-?\\d+$",
        },
      },
      unsetValues: {
        description: "Unsets the values for this field.",
        type: "boolean",
      },
      kind: {
        description: 'This is always `"drive#labelFieldModification"`.',
        type: "string",
      },
      fieldId: {
        description: "The ID of the field to be modified.",
        type: "string",
      },
      setSelectionValues: {
        description: "Replaces a `selection` field with these new values.",
        type: "array",
        items: {
          type: "string",
        },
      },
      setUserValues: {
        description: "Replaces a `user` field with these new values. The values must be a valid email addresses.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DriveApprovalList: {
    description: "The response of an approvals list request.",
    type: "object",
    properties: {
      nextPageToken: {
        description:
          "The page token for the next page of approvals. This is absent if the end of the approvals list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results.",
        type: "string",
      },
      items: {
        description:
          "The list of approvals. If `nextPageToken` is populated, then this list may be incomplete and an additional page of results should be fetched.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Approval",
        },
      },
      kind: {
        description: "This is always drive#approvalList",
        type: "string",
      },
    },
    required: [],
  },
  DriveDriveList: {
    description: "A list of shared drives.",
    type: "object",
    properties: {
      drives: {
        description:
          "The list of shared drives. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Drive",
        },
      },
      nextPageToken: {
        description:
          "The page token for the next page of shared drives. This will be absent if the end of the list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ.",
        type: "string",
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#driveList"`.',
        default: "drive#driveList",
        type: "string",
      },
    },
    required: [],
  },
  DriveStartPageToken: {
    type: "object",
    properties: {
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#startPageToken"`.',
        default: "drive#startPageToken",
        type: "string",
      },
      startPageToken: {
        description: "The starting page token for listing future changes. The page token doesn't expire.",
        type: "string",
      },
    },
    required: [],
  },
  DriveCommentApprovalRequest: {
    description: "Request for commenting on an approval.",
    type: "object",
    properties: {
      message: {
        description:
          "Required. A message to comment on the approval. This message is included in notifications for the action and in the approval activity log.",
        type: "string",
      },
    },
    required: [],
  },
  DriveDownloadRestriction: {
    description: "A restriction for copy and download of the file.",
    type: "object",
    properties: {
      restrictedForWriters: {
        description:
          "Whether download and copy is restricted for writers. If true, download is also restricted for readers.",
        type: "boolean",
      },
      restrictedForReaders: {
        description: "Whether download and copy is restricted for readers.",
        type: "boolean",
      },
    },
    required: [],
  },
  DriveTeamDriveList: {
    description: "A list of Team Drives.",
    type: "object",
    properties: {
      nextPageToken: {
        description:
          "The page token for the next page of Team Drives. This will be absent if the end of the Team Drives list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ.",
        type: "string",
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#teamDriveList"`.',
        default: "drive#teamDriveList",
        type: "string",
      },
      teamDrives: {
        description:
          "The list of Team Drives. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_TeamDrive",
        },
      },
    },
    required: [],
  },
  DriveReassignApprovalRequest: {
    description: "Request for reassigning an approval. Reviewers can be added or replaced, but not removed.",
    type: "object",
    properties: {
      replaceReviewers: {
        description: "Optional. The list of reviewer replacements.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_ReplaceReviewer",
        },
      },
      addReviewers: {
        description: "Optional. The list of reviewers to add.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_AddReviewer",
        },
      },
      message: {
        description:
          "Optional. A message to send to the new reviewers. This message is included in notifications for the action and in the approval activity log.",
        type: "string",
      },
    },
    required: [],
  },
  DriveReplaceReviewer: {
    description: "Representation of a reviewer replacement.",
    type: "object",
    properties: {
      addedReviewerEmail: {
        description: "Required. The email of the reviewer to add.",
        type: "string",
      },
      removedReviewerEmail: {
        description: "Required. The email of the reviewer to remove.",
        type: "string",
      },
    },
    required: [],
  },
  DriveLabelField: {
    description: "Representation of field, which is a typed key-value pair.",
    type: "object",
    properties: {
      dateString: {
        description: "Only present if valueType is dateString. RFC 3339 formatted date: YYYY-MM-DD.",
        type: "array",
        items: {
          type: "string",
        },
      },
      kind: {
        description: "This is always drive#labelField.",
        type: "string",
      },
      valueType: {
        description:
          "The field type. While new values may be supported in the future, the following are currently allowed: * `dateString` * `integer` * `selection` * `text` * `user`",
        type: "string",
      },
      id: {
        description: "The identifier of this label field.",
        type: "string",
      },
      user: {
        description: "Only present if `valueType` is `user`.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_User",
        },
      },
      text: {
        description: "Only present if `valueType` is `text`.",
        type: "array",
        items: {
          type: "string",
        },
      },
      integer: {
        description: "Only present if `valueType` is `integer`.",
        type: "array",
        items: {
          type: "string",
          pattern: "^-?\\d+$",
        },
      },
      selection: {
        description: "Only present if `valueType` is `selection`",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DriveApproval: {
    description: "Metadata for an approval. An approval is a review or approve process for a Drive item.",
    type: "object",
    properties: {
      reviewerResponses: {
        description: "The responses made on the approval by reviewers.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_ReviewerResponse",
        },
      },
      targetFileId: {
        description: "Target file id of the approval.",
        type: "string",
      },
      createTime: {
        description: "Output only. The time the approval was created.",
        type: "string",
      },
      dueTime: {
        description: "The time that the approval is due.",
        type: "string",
      },
      approvalId: {
        description: "The approval ID.",
        type: "string",
      },
      kind: {
        description: "This is always drive#approval.",
        type: "string",
      },
      status: {
        description: "Output only. The status of the approval at the time this resource was requested.",
        type: "string",
        enum: ["STATUS_UNSPECIFIED", "IN_PROGRESS", "APPROVED", "CANCELLED", "DECLINED"],
      },
      modifyTime: {
        description: "Output only. The most recent time the approval was modified.",
        type: "string",
      },
      fileContentChangeBehavior: {
        description: "Output only. The behavior of the approval when the file content changes.",
        type: "string",
        enum: ["FILE_CONTENT_CHANGE_BEHAVIOR_UNSPECIFIED", "RESET_APPROVAL", "NO_APPROVAL_ACTION"],
      },
      initiator: {
        description: "The user that requested the approval.",
        type: "ref",
        ref: "drive_User",
      },
      completeTime: {
        description: "Output only. The time the approval was completed.",
        type: "string",
      },
    },
    required: [],
  },
  DriveChangeList: {
    description: "A list of changes for a user.",
    type: "object",
    properties: {
      nextPageToken: {
        description:
          "The page token for the next page of changes. This will be absent if the end of the changes list has been reached. The page token doesn't expire.",
        type: "string",
      },
      newStartPageToken: {
        description:
          "The starting page token for future changes. This will be present only if the end of the current changes list has been reached. The page token doesn't expire.",
        type: "string",
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#changeList"`.',
        default: "drive#changeList",
        type: "string",
      },
      changes: {
        description:
          "The list of changes. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Change",
        },
      },
    },
    required: [],
  },
  DriveDeclineApprovalRequest: {
    description: "Request for declining an approval as a reviewer.",
    type: "object",
    properties: {
      message: {
        description:
          "Optional. A message to accompany the reviewer response on the approval. This message is included in notifications for the action and in the approval activity log.",
        type: "string",
      },
    },
    required: [],
  },
  DriveGeneratedIds: {
    description: "A list of generated file IDs which can be provided in create requests.",
    type: "object",
    properties: {
      ids: {
        description: "The IDs generated for the requesting user in the specified space.",
        type: "array",
        items: {
          type: "string",
        },
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#generatedIds"`.',
        default: "drive#generatedIds",
        type: "string",
      },
      space: {
        description: "The type of file that can be created with these IDs.",
        type: "string",
      },
    },
    required: [],
  },
  DriveClientEncryptionDetails: {
    description: "Details about the client-side encryption applied to the file.",
    type: "object",
    properties: {
      encryptionState: {
        description: "The encryption state of the file. The values expected here are: - encrypted - unencrypted ",
        type: "string",
      },
      decryptionMetadata: {
        description: "The metadata used for client-side operations.",
        type: "ref",
        ref: "drive_DecryptionMetadata",
      },
    },
    required: [],
  },
  DriveRevisionList: {
    description: "A list of revisions of a file.",
    type: "object",
    properties: {
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#revisionList"`.',
        default: "drive#revisionList",
        type: "string",
      },
      nextPageToken: {
        description:
          "The page token for the next page of revisions. This will be absent if the end of the revisions list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ.",
        type: "string",
      },
      revisions: {
        description:
          "The list of revisions. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Revision",
        },
      },
    },
    required: [],
  },
  DriveLabelModification: {
    description:
      "A modification to a label on a file. A `LabelModification` can be used to apply a label to a file, update an existing label on a file, or remove a label from a file.",
    type: "object",
    properties: {
      labelId: {
        description: "The ID of the label to modify.",
        type: "string",
      },
      kind: {
        description: 'This is always `"drive#labelModification"`.',
        type: "string",
      },
      removeLabel: {
        description: "If true, the label will be removed from the file.",
        type: "boolean",
      },
      fieldModifications: {
        description: "The list of modifications to this label's fields.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_LabelFieldModification",
        },
      },
    },
    required: [],
  },
  DriveChannel: {
    description: "A notification channel used to watch for resource changes.",
    type: "object",
    properties: {
      address: {
        description: "The address where notifications are delivered for this channel.",
        type: "string",
      },
      type: {
        description: 'The type of delivery mechanism used for this channel. Valid values are "web_hook" or "webhook".',
        type: "string",
      },
      id: {
        description: "A UUID or similar unique string that identifies this channel.",
        type: "string",
      },
      resourceUri: {
        description: "A version-specific identifier for the watched resource.",
        type: "string",
      },
      payload: {
        description: "A Boolean value to indicate whether payload is wanted. Optional.",
        type: "boolean",
      },
      params: {
        description: "Additional parameters controlling delivery channel behavior. Optional.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "string",
        },
      },
      expiration: {
        description:
          "Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional.",
        type: "string",
        pattern: "^-?\\d+$",
      },
      token: {
        description:
          "An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.",
        type: "string",
      },
      resourceId: {
        description:
          "An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.",
        type: "string",
      },
      kind: {
        description:
          "Identifies this as a notification channel used to watch for changes to a resource, which is `api#channel`.",
        default: "api#channel",
        type: "string",
      },
    },
    required: [],
  },
  DriveModifyLabelsResponse: {
    description:
      "Response to a `ModifyLabels` request. This contains only those labels which were added or updated by the request.",
    type: "object",
    properties: {
      kind: {
        description: 'This is always `"drive#modifyLabelsResponse"`.',
        type: "string",
      },
      modifiedLabels: {
        description: "The list of labels which were added or updated by the request.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Label",
        },
      },
    },
    required: [],
  },
  DriveReplyList: {
    description: "A list of replies to a comment on a file.",
    type: "object",
    properties: {
      nextPageToken: {
        description:
          "The page token for the next page of replies. This will be absent if the end of the replies list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ.",
        type: "string",
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#replyList"`.',
        default: "drive#replyList",
        type: "string",
      },
      replies: {
        description:
          "The list of replies. If `nextPageToken` is populated, then this list may be incomplete and an additional page of results should be fetched.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Reply",
        },
      },
    },
    required: [],
  },
  DriveFileList: {
    description: "A list of files.",
    type: "object",
    properties: {
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#fileList"`.',
        default: "drive#fileList",
        type: "string",
      },
      incompleteSearch: {
        description:
          "Whether the search process was incomplete. If true, then some search results might be missing, since all documents were not searched. This can occur when searching multiple drives with the `allDrives` corpora, but all corpora couldn't be searched. When this happens, it's suggested that clients narrow their query by choosing a different corpus such as `user` or `drive`.",
        type: "boolean",
      },
      nextPageToken: {
        description:
          "The page token for the next page of files. This will be absent if the end of the files list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ.",
        type: "string",
      },
      files: {
        description:
          "The list of files. If `nextPageToken` is populated, then this list may be incomplete and an additional page of results should be fetched.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_File",
        },
      },
    },
    required: [],
  },
  DriveRevision: {
    description:
      "The metadata for a revision to a file. Some resource methods (such as `revisions.update`) require a `revisionId`. Use the `revisions.list` method to retrieve the ID for a revision.",
    type: "object",
    properties: {
      publishedLink: {
        description: "Output only. A link to the published revision. This is only populated for Docs Editors files.",
        type: "string",
      },
      kind: {
        description:
          'Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#revision"`.',
        default: "drive#revision",
        type: "string",
      },
      size: {
        description:
          "Output only. The size of the revision's content in bytes. This is only applicable to files with binary content in Drive.",
        type: "string",
        pattern: "^-?\\d+$",
      },
      publishedOutsideDomain: {
        description:
          "Whether this revision is published outside the domain. This is only applicable to Docs Editors files.",
        type: "boolean",
      },
      id: {
        description: "Output only. The ID of the revision.",
        type: "string",
      },
      md5Checksum: {
        description:
          "Output only. The MD5 checksum of the revision's content. This is only applicable to files with binary content in Drive.",
        type: "string",
      },
      exportLinks: {
        description: "Output only. Links for exporting Docs Editors files to specific formats.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "string",
        },
      },
      mimeType: {
        description: "Output only. The MIME type of the revision.",
        type: "string",
      },
      published: {
        description: "Whether this revision is published. This is only applicable to Docs Editors files.",
        type: "boolean",
      },
      modifiedTime: {
        description: "The last time the revision was modified (RFC 3339 date-time).",
        type: "string",
      },
      publishAuto: {
        description:
          "Whether subsequent revisions will be automatically republished. This is only applicable to Docs Editors files.",
        type: "boolean",
      },
      lastModifyingUser: {
        description:
          "Output only. The last user to modify this revision. This field is only populated when the last modification was performed by a signed-in user.",
        type: "ref",
        ref: "drive_User",
      },
      originalFilename: {
        description:
          "Output only. The original filename used to create this revision. This is only applicable to files with binary content in Drive.",
        type: "string",
      },
      keepForever: {
        description:
          "Whether to keep this revision forever, even if it is no longer the head revision. If not set, the revision will be automatically purged 30 days after newer content is uploaded. This can be set on a maximum of 200 revisions for a file. This field is only applicable to files with binary content in Drive.",
        type: "boolean",
      },
    },
    required: [],
  },
  DriveAppIcons: {
    type: "object",
    properties: {
      iconUrl: {
        description: "URL for the icon.",
        type: "string",
      },
      category: {
        description:
          "Category of the icon. Allowed values are: * `application` - The icon for the application. * `document` - The icon for a file associated with the app. * `documentShared` - The icon for a shared file associated with the app.",
        type: "string",
      },
      size: {
        description: "Size of the icon. Represented as the maximum of the width and height.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DriveAccessProposal: {
    description: "Manage outstanding access proposals on a file.",
    type: "object",
    properties: {
      requesterEmailAddress: {
        description: "The email address of the requesting user.",
        type: "string",
      },
      recipientEmailAddress: {
        description: "The email address of the user that will receive permissions, if accepted.",
        type: "string",
      },
      requestMessage: {
        description: "The message that the requester added to the proposal.",
        type: "string",
      },
      fileId: {
        description: "The file ID that the proposal for access is on.",
        type: "string",
      },
      proposalId: {
        description: "The ID of the access proposal.",
        type: "string",
      },
      createTime: {
        description: "The creation time.",
        type: "string",
      },
      rolesAndViews: {
        description:
          "A wrapper for the role and view of an access proposal. For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles).",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_AccessProposalRoleAndView",
        },
      },
    },
    required: [],
  },
  DriveDownloadRestrictionsMetadata: {
    description: "Download restrictions applied to the file.",
    type: "object",
    properties: {
      itemDownloadRestriction: {
        description:
          "The download restriction of the file applied directly by the owner or organizer. This doesn't take into account shared drive settings or DLP rules.",
        type: "ref",
        ref: "drive_DownloadRestriction",
      },
      effectiveDownloadRestrictionWithContext: {
        description:
          "Output only. The effective download restriction applied to this file. This considers all restriction settings and DLP rules.",
        type: "ref",
        ref: "drive_DownloadRestriction",
      },
    },
    required: [],
  },
  DriveUser: {
    description: "Information about a Drive user.",
    type: "object",
    properties: {
      displayName: {
        description: "Output only. A plain text displayable name for this user.",
        type: "string",
      },
      photoLink: {
        description: "Output only. A link to the user's profile photo, if available.",
        type: "string",
      },
      permissionId: {
        description: "Output only. The user's ID as visible in Permission resources.",
        type: "string",
      },
      me: {
        description: "Output only. Whether this user is the requesting user.",
        type: "boolean",
      },
      emailAddress: {
        description:
          "Output only. The email address of the user. This may not be present in certain contexts if the user has not made their email address visible to the requester.",
        type: "string",
      },
      kind: {
        description: "Output only. Identifies what kind of resource this is. Value: the fixed string `drive#user`.",
        default: "drive#user",
        type: "string",
      },
    },
    required: [],
  },
  DriveAccessProposalRoleAndView: {
    description:
      "A wrapper for the role and view of an access proposal. For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles).",
    type: "object",
    properties: {
      role: {
        description:
          "The role that was proposed by the requester. The supported values are: * `writer` * `commenter` * `reader`",
        type: "string",
      },
      view: {
        description:
          "Indicates the view for this access proposal. Only populated for proposals that belong to a view. Only `published` is supported.",
        type: "string",
      },
    },
    required: [],
  },
  DriveLabelList: {
    description: "A list of labels applied to a file.",
    type: "object",
    properties: {
      labels: {
        description: "The list of labels.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Label",
        },
      },
      kind: {
        description: 'This is always `"drive#labelList"`.',
        type: "string",
      },
      nextPageToken: {
        description:
          "The page token for the next page of labels. This field will be absent if the end of the list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ.",
        type: "string",
      },
    },
    required: [],
  },
  DriveAppList: {
    description: "A list of third-party applications which the user has installed or given access to Google Drive.",
    type: "object",
    properties: {
      selfLink: {
        description: "A link back to this list.",
        type: "string",
      },
      defaultAppIds: {
        description:
          "The list of app IDs that the user has specified to use by default. The list is in reverse-priority order (lowest to highest).",
        type: "array",
        items: {
          type: "string",
        },
      },
      kind: {
        description: 'Output only. Identifies what kind of resource this is. Value: the fixed string "drive#appList".',
        default: "drive#appList",
        type: "string",
      },
      items: {
        description: "The list of apps.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_App",
        },
      },
    },
    required: [],
  },
  DriveGenerateCseTokenResponse: {
    description: "JWT and associated metadata used to generate CSE files.",
    type: "object",
    properties: {
      fileId: {
        description: "The fileId for which the JWT was generated.",
        type: "string",
      },
      currentKaclsName: {
        description: "Name of the KACLs that the returned KACLs ID points to.",
        type: "string",
      },
      kind: {
        description:
          'Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#generateCseTokenResponse"`.',
        type: "string",
      },
      currentKaclsId: {
        description: "The current Key ACL Service (KACLS) ID associated with the JWT.",
        type: "string",
        pattern: "^-?\\d+$",
      },
      jwt: {
        description: "The signed JSON Web Token (JWT) for the file.",
        type: "string",
      },
    },
    required: [],
  },
  DriveStatus: {
    description:
      "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
    type: "object",
    properties: {
      code: {
        description: "The status code, which should be an enum value of google.rpc.Code.",
        type: "integer",
        format: "int32",
      },
      details: {
        description:
          "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
        type: "array",
        items: {
          type: "object",
          properties: {},
          required: [],
          additionalProperties: {
            description: "Properties of the object. Contains field @type with type URL.",
            type: "unknown",
          },
        },
      },
      message: {
        description:
          "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.",
        type: "string",
      },
    },
    required: [],
  },
  DrivePermissionList: {
    description: "A list of permissions for a file.",
    type: "object",
    properties: {
      permissions: {
        description:
          "The list of permissions. If `nextPageToken` is populated, then this list may be incomplete and an additional page of results should be fetched.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Permission",
        },
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#permissionList"`.',
        default: "drive#permissionList",
        type: "string",
      },
      nextPageToken: {
        description:
          "The page token for the next page of permissions. This field will be absent if the end of the permissions list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ.",
        type: "string",
      },
    },
    required: [],
  },
  DriveStartApprovalRequest: {
    description: "Allows creating an approval on a file.",
    type: "object",
    properties: {
      fileContentChangeBehavior: {
        description: "Optional. The behavior of the approval when the file content changes.",
        type: "string",
        enum: ["FILE_CONTENT_CHANGE_BEHAVIOR_UNSPECIFIED", "RESET_APPROVAL", "NO_APPROVAL_ACTION"],
      },
      reviewerEmails: {
        description: "Required. The emails of the users who are set to review the approval.",
        type: "array",
        items: {
          type: "string",
        },
      },
      lockFile: {
        description: "Optional. Whether to lock the file when starting the approval.",
        type: "boolean",
      },
      dueTime: {
        description: "Optional. The time that the approval is due.",
        type: "string",
      },
      message: {
        description: "Optional. A message to send to reviewers when notifying them of the approval request.",
        type: "string",
      },
    },
    required: [],
  },
  DriveCommentList: {
    description: "A list of comments on a file.",
    type: "object",
    properties: {
      comments: {
        description:
          "The list of comments. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Comment",
        },
      },
      nextPageToken: {
        description:
          "The page token for the next page of comments. This will be absent if the end of the comments list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ.",
        type: "string",
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#commentList"`.',
        default: "drive#commentList",
        type: "string",
      },
    },
    required: [],
  },
  DriveLabel: {
    description: "Representation of label and label fields.",
    type: "object",
    properties: {
      kind: {
        description: "This is always drive#label",
        type: "string",
      },
      id: {
        description: "The ID of the label.",
        type: "string",
      },
      fields: {
        description: "A map of the fields on the label, keyed by the field's ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "drive_LabelField",
        },
      },
      revisionId: {
        description: "The revision ID of the label.",
        type: "string",
      },
    },
    required: [],
  },
  DriveCancelApprovalRequest: {
    description: "Request for cancelling an approval as an initiator.",
    type: "object",
    properties: {
      message: {
        description:
          "Optional. A message to accompany the cancellation of the approval. This message is included in notifications for the action and in the approval activity log.",
        type: "string",
      },
    },
    required: [],
  },
  DriveReviewerResponse: {
    description: "A response on an approval made by a specific reviewer.",
    type: "object",
    properties: {
      kind: {
        description: "This is always drive#reviewerResponse.",
        type: "string",
      },
      reviewer: {
        description: "The user that's responsible for this response.",
        type: "ref",
        ref: "drive_User",
      },
      response: {
        description: "A reviewer’s response for the approval.",
        type: "string",
        enum: ["RESPONSE_UNSPECIFIED", "NO_RESPONSE", "APPROVED", "DECLINED"],
      },
    },
    required: [],
  },
  DriveContentRestriction: {
    description: "A restriction for accessing the content of the file.",
    type: "object",
    properties: {
      systemRestricted: {
        description:
          "Output only. Whether the content restriction was applied by the system, for example due to an esignature. Users cannot modify or remove system restricted content restrictions.",
        type: "boolean",
      },
      restrictingUser: {
        description: "Output only. The user who set the content restriction. Only populated if `readOnly=true`.",
        type: "ref",
        ref: "drive_User",
      },
      readOnly: {
        description:
          "Whether the content of the file is read-only. If a file is read-only, a new revision of the file may not be added, comments may not be added or modified, and the title of the file may not be modified.",
        type: "boolean",
      },
      ownerRestricted: {
        description:
          "Whether the content restriction can only be modified or removed by a user who owns the file. For files in shared drives, any user with `organizer` capabilities can modify or remove this content restriction.",
        type: "boolean",
      },
      reason: {
        description:
          "Reason for why the content of the file is restricted. This is only mutable on requests that also set `readOnly=true`.",
        type: "string",
      },
      type: {
        description:
          "Output only. The type of the content restriction. Currently the only possible value is `globalContentRestriction`.",
        type: "string",
      },
      restrictionTime: {
        description:
          "The time at which the content restriction was set (formatted RFC 3339 timestamp). Only populated if readOnly is true.",
        type: "string",
      },
    },
    required: [],
  },
  DriveApproveApprovalRequest: {
    description: "Request for approving an approval as a reviewer.",
    type: "object",
    properties: {
      message: {
        description:
          "Optional. A message to accompany the reviewer response on the approval. This message is included in notifications for the action and in the approval activity log.",
        type: "string",
      },
    },
    required: [],
  },
  DriveApp: {
    description:
      "The `apps` resource provides a list of apps that a user has installed, with information about each app's supported MIME types, file extensions, and other details. Some resource methods (such as `apps.get`) require an `appId`. Use the `apps.list` method to retrieve the ID for an installed application.",
    type: "object",
    properties: {
      longDescription: {
        description: "A long description of the app.",
        type: "string",
      },
      supportsOfflineCreate: {
        description: "Whether this app supports creating files when offline.",
        type: "boolean",
      },
      primaryFileExtensions: {
        description: "The list of primary file extensions.",
        type: "array",
        items: {
          type: "string",
        },
      },
      name: {
        description: "The name of the app.",
        type: "string",
      },
      createUrl: {
        description: "The URL to create a file with this app.",
        type: "string",
      },
      authorized: {
        description: "Whether the app is authorized to access data on the user's Drive.",
        type: "boolean",
      },
      useByDefault: {
        description: "Whether the app is selected as the default handler for the types it supports.",
        type: "boolean",
      },
      createInFolderTemplate: {
        description:
          "The template URL to create a file with this app in a given folder. The template contains the {folderId} to be replaced by the folder ID house the new file.",
        type: "string",
      },
      icons: {
        description: "The various icons for the app.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_AppIcons",
        },
      },
      objectType: {
        description:
          "The type of object this app creates such as a Chart. If empty, the app name should be used instead.",
        type: "string",
      },
      id: {
        description: "The ID of the app.",
        type: "string",
      },
      secondaryMimeTypes: {
        description: "The list of secondary MIME types.",
        type: "array",
        items: {
          type: "string",
        },
      },
      productId: {
        description: "The ID of the product listing for this app.",
        type: "string",
      },
      openUrlTemplate: {
        description:
          "The template URL for opening files with this app. The template contains {ids} or {exportIds} to be replaced by the actual file IDs. For more information, see Open Files for the full documentation.",
        type: "string",
      },
      supportsMultiOpen: {
        description: "Whether this app supports opening more than one file.",
        type: "boolean",
      },
      supportsImport: {
        description: "Whether this app supports importing from Google Docs.",
        type: "boolean",
      },
      kind: {
        description: 'Output only. Identifies what kind of resource this is. Value: the fixed string "drive#app".',
        default: "drive#app",
        type: "string",
      },
      hasDriveWideScope: {
        description:
          "Whether the app has Drive-wide scope. An app with Drive-wide scope can access all files in the user's Drive.",
        type: "boolean",
      },
      productUrl: {
        description: "A link to the product listing for this app.",
        type: "string",
      },
      secondaryFileExtensions: {
        description: "The list of secondary file extensions.",
        type: "array",
        items: {
          type: "string",
        },
      },
      installed: {
        description: "Whether the app is installed.",
        type: "boolean",
      },
      shortDescription: {
        description: "A short description of the app.",
        type: "string",
      },
      primaryMimeTypes: {
        description: "The list of primary MIME types.",
        type: "array",
        items: {
          type: "string",
        },
      },
      supportsCreate: {
        description: "Whether this app supports creating objects.",
        type: "boolean",
      },
    },
    required: [],
  },
  DriveFile: {
    description:
      "The metadata for a file. Some resource methods (such as `files.update`) require a `fileId`. Use the `files.list` method to retrieve the ID for a file.",
    type: "object",
    properties: {
      hasAugmentedPermissions: {
        description:
          "Output only. Whether there are permissions directly on this file. This field is only populated for items in shared drives.",
        type: "boolean",
      },
      starred: {
        description: "Whether the user has starred the file.",
        type: "boolean",
      },
      trashed: {
        description:
          "Whether the file has been trashed, either explicitly or from a trashed parent folder. Only the owner may trash a file, but other users can still access the file in the owner's trash until it's permanently deleted.",
        type: "boolean",
      },
      sha1Checksum: {
        description:
          "Output only. The SHA1 checksum associated with this file, if available. This field is only populated for files with content stored in Google Drive; it's not populated for Docs Editors or shortcut files.",
        type: "string",
      },
      originalFilename: {
        description:
          "The original filename of the uploaded content if available, or else the original value of the `name` field. This is only available for files with binary content in Google Drive.",
        type: "string",
      },
      permissionIds: {
        description: "Output only. List of permission IDs for users with access to this file.",
        type: "array",
        items: {
          type: "string",
        },
      },
      modifiedByMeTime: {
        description: "The last time the file was modified by the user (RFC 3339 date-time).",
        type: "string",
      },
      videoMediaMetadata: {
        description:
          "Output only. Additional metadata about video media. This may not be available immediately upon upload.",
        type: "object",
        properties: {
          durationMillis: {
            description: "Output only. The duration of the video in milliseconds.",
            type: "string",
            pattern: "^-?\\d+$",
          },
          width: {
            description: "Output only. The width of the video in pixels.",
            type: "integer",
            format: "int32",
          },
          height: {
            description: "Output only. The height of the video in pixels.",
            type: "integer",
            format: "int32",
          },
        },
        required: [],
      },
      isAppAuthorized: {
        description: "Output only. Whether the file was created or opened by the requesting app.",
        type: "boolean",
      },
      shared: {
        description: "Output only. Whether the file has been shared. Not populated for items in shared drives.",
        type: "boolean",
      },
      explicitlyTrashed: {
        description:
          "Output only. Whether the file has been explicitly trashed, as opposed to recursively trashed from a parent folder.",
        type: "boolean",
      },
      permissions: {
        description:
          "Output only. The full list of permissions for the file. This is only available if the requesting user can share the file. Not populated for items in shared drives.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_Permission",
        },
      },
      clientEncryptionDetails: {
        description:
          "Client Side Encryption related details. Contains details about the encryption state of the file and details regarding the encryption mechanism that clients need to use when decrypting the contents of this item. This will only be present on files and not on folders or shortcuts.",
        type: "ref",
        ref: "drive_ClientEncryptionDetails",
      },
      contentHints: {
        description:
          "Additional information about the content of the file. These fields are never populated in responses.",
        type: "object",
        properties: {
          thumbnail: {
            description:
              "A thumbnail for the file. This will only be used if Google Drive cannot generate a standard thumbnail.",
            type: "object",
            properties: {
              image: {
                description:
                  "The thumbnail data encoded with URL-safe Base64 ([RFC 4648 section 5](https://datatracker.ietf.org/doc/html/rfc4648#section-5)).",
                type: "string",
              },
              mimeType: {
                description: "The MIME type of the thumbnail.",
                type: "string",
              },
            },
            required: [],
          },
          indexableText: {
            description:
              "Text to be indexed for the file to improve fullText queries. This is limited to 128 KB in length and may contain HTML elements.",
            type: "string",
          },
        },
        required: [],
      },
      sharingUser: {
        description: "Output only. The user who shared the file with the requesting user, if applicable.",
        type: "ref",
        ref: "drive_User",
      },
      linkShareMetadata: {
        description: "Contains details about the link URLs that clients are using to refer to this item.",
        type: "object",
        properties: {
          securityUpdateEnabled: {
            description: "Output only. Whether the security update is enabled for this file.",
            type: "boolean",
          },
          securityUpdateEligible: {
            description: "Output only. Whether the file is eligible for security update.",
            type: "boolean",
          },
        },
        required: [],
      },
      viewersCanCopyContent: {
        description: "Deprecated: Use `copyRequiresWriterPermission` instead.",
        deprecated: true,
        type: "boolean",
      },
      sha256Checksum: {
        description:
          "Output only. The SHA256 checksum associated with this file, if available. This field is only populated for files with content stored in Google Drive; it's not populated for Docs Editors or shortcut files.",
        type: "string",
      },
      copyRequiresWriterPermission: {
        description:
          "Whether the options to copy, print, or download this file should be disabled for readers and commenters.",
        type: "boolean",
      },
      md5Checksum: {
        description:
          "Output only. The MD5 checksum for the content of the file. This is only applicable to files with binary content in Google Drive.",
        type: "string",
      },
      viewedByMeTime: {
        description: "The last time the file was viewed by the user (RFC 3339 date-time).",
        type: "string",
      },
      lastModifyingUser: {
        description:
          "Output only. The last user to modify the file. This field is only populated when the last modification was performed by a signed-in user.",
        type: "ref",
        ref: "drive_User",
      },
      exportLinks: {
        description: "Output only. Links for exporting Docs Editors files to specific formats.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "string",
        },
      },
      createdTime: {
        description: "The time at which the file was created (RFC 3339 date-time).",
        type: "string",
      },
      name: {
        description:
          "The name of the file. This isn't necessarily unique within a folder. Note that for immutable items such as the top-level folders of shared drives, the My Drive root folder, and the Application Data folder, the name is constant.",
        type: "string",
      },
      spaces: {
        description:
          "Output only. The list of spaces which contain the file. The currently supported values are `drive`, `appDataFolder`, and `photos`.",
        type: "array",
        items: {
          type: "string",
        },
      },
      viewedByMe: {
        description: "Output only. Whether the file has been viewed by this user.",
        type: "boolean",
      },
      fileExtension: {
        description:
          "Output only. The final component of `fullFileExtension`. This is only available for files with binary content in Google Drive.",
        type: "string",
      },
      imageMediaMetadata: {
        description: "Output only. Additional metadata about image media, if available.",
        type: "object",
        properties: {
          exposureMode: {
            description: "Output only. The exposure mode used to create the photo.",
            type: "string",
          },
          cameraMake: {
            description: "Output only. The make of the camera used to create the photo.",
            type: "string",
          },
          aperture: {
            description: "Output only. The aperture used to create the photo (f-number).",
            type: "number",
          },
          exposureTime: {
            description: "Output only. The length of the exposure, in seconds.",
            type: "number",
          },
          sensor: {
            description: "Output only. The type of sensor used to create the photo.",
            type: "string",
          },
          subjectDistance: {
            description: "Output only. The distance to the subject of the photo, in meters.",
            type: "integer",
            format: "int32",
          },
          focalLength: {
            description: "Output only. The focal length used to create the photo, in millimeters.",
            type: "number",
          },
          width: {
            description: "Output only. The width of the image in pixels.",
            type: "integer",
            format: "int32",
          },
          isoSpeed: {
            description: "Output only. The ISO speed used to create the photo.",
            type: "integer",
            format: "int32",
          },
          lens: {
            description: "Output only. The lens used to create the photo.",
            type: "string",
          },
          rotation: {
            description:
              "Output only. The number of clockwise 90 degree rotations applied from the image's original orientation.",
            type: "integer",
            format: "int32",
          },
          height: {
            description: "Output only. The height of the image in pixels.",
            type: "integer",
            format: "int32",
          },
          whiteBalance: {
            description: "Output only. The white balance mode used to create the photo.",
            type: "string",
          },
          cameraModel: {
            description: "Output only. The model of the camera used to create the photo.",
            type: "string",
          },
          time: {
            description: "Output only. The date and time the photo was taken (EXIF DateTime).",
            type: "string",
          },
          flashUsed: {
            description: "Output only. Whether a flash was used to create the photo.",
            type: "boolean",
          },
          location: {
            description: "Output only. Geographic location information stored in the image.",
            type: "object",
            properties: {
              altitude: {
                description: "Output only. The altitude stored in the image.",
                type: "number",
              },
              latitude: {
                description: "Output only. The latitude stored in the image.",
                type: "number",
              },
              longitude: {
                description: "Output only. The longitude stored in the image.",
                type: "number",
              },
            },
            required: [],
          },
          maxApertureValue: {
            description:
              "Output only. The smallest f-number of the lens at the focal length used to create the photo (APEX value).",
            type: "number",
          },
          colorSpace: {
            description: "Output only. The color space of the photo.",
            type: "string",
          },
          meteringMode: {
            description: "Output only. The metering mode used to create the photo.",
            type: "string",
          },
          exposureBias: {
            description: "Output only. The exposure bias of the photo (APEX value).",
            type: "number",
          },
        },
        required: [],
      },
      description: {
        description: "A short description of the file.",
        type: "string",
      },
      labelInfo: {
        description: "Label information on the file.",
        type: "object",
        properties: {
          labels: {
            description:
              "Output only. The set of labels on the file as requested by the label IDs in the `includeLabels` parameter. By default, no labels are returned.",
            type: "array",
            items: {
              type: "ref",
              ref: "drive_Label",
            },
          },
        },
        required: [],
      },
      ownedByMe: {
        description: "Output only. Whether the user owns the file. Not populated for items in shared drives.",
        type: "boolean",
      },
      folderColorRgb: {
        description:
          "The color for a folder or a shortcut to a folder as an RGB hex string. The supported colors are published in the `folderColorPalette` field of the [`about`](https://developers.google.com/workspace/drive/api/reference/rest/v3/about) resource. If an unsupported color is specified, the closest color in the palette is used instead.",
        type: "string",
      },
      writersCanShare: {
        description:
          "Whether users with only `writer` permission can modify the file's permissions. Not populated for items in shared drives.",
        type: "boolean",
      },
      webContentLink: {
        description:
          "Output only. A link for downloading the content of the file in a browser. This is only available for files with binary content in Google Drive.",
        type: "string",
      },
      trashingUser: {
        description:
          "Output only. If the file has been explicitly trashed, the user who trashed it. Only populated for items in shared drives.",
        type: "ref",
        ref: "drive_User",
      },
      driveId: {
        description:
          "Output only. ID of the shared drive the file resides in. Only populated for items in shared drives.",
        type: "string",
      },
      shortcutDetails: {
        description: "Information about a shortcut file.",
        type: "object",
        properties: {
          targetId: {
            description: "The ID of the file that this shortcut points to. Can only be set on `files.create` requests.",
            type: "string",
          },
          targetMimeType: {
            description:
              "Output only. The MIME type of the file that this shortcut points to. The value of this field is a snapshot of the target's MIME type, captured when the shortcut is created.",
            type: "string",
          },
          targetResourceKey: {
            description: "Output only. The `resourceKey` for the target file.",
            type: "string",
          },
        },
        required: [],
      },
      contentRestrictions: {
        description: "Restrictions for accessing the content of the file. Only populated if such a restriction exists.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_ContentRestriction",
        },
      },
      hasThumbnail: {
        description:
          "Output only. Whether this file has a thumbnail. This doesn't indicate whether the requesting app has access to the thumbnail. To check access, look for the presence of the thumbnailLink field.",
        type: "boolean",
      },
      teamDriveId: {
        description: "Deprecated: Output only. Use `driveId` instead.",
        deprecated: true,
        type: "string",
      },
      modifiedTime: {
        description:
          "he last time the file was modified by anyone (RFC 3339 date-time). Note that setting modifiedTime will also update modifiedByMeTime for the user.",
        type: "string",
      },
      sharedWithMeTime: {
        description: "The time at which the file was shared with the user, if applicable (RFC 3339 date-time).",
        type: "string",
      },
      resourceKey: {
        description: "Output only. A key needed to access the item via a shared link.",
        type: "string",
      },
      kind: {
        description: 'Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#file"`.',
        default: "drive#file",
        type: "string",
      },
      owners: {
        description:
          "Output only. The owner of this file. Only certain legacy files may have more than one owner. This field isn't populated for items in shared drives.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_User",
        },
      },
      parents: {
        description:
          "The ID of the parent folder containing the file. A file can only have one parent folder; specifying multiple parents isn't supported. If not specified as part of a create request, the file is placed directly in the user's My Drive folder. If not specified as part of a copy request, the file inherits any discoverable parent of the source file. Update requests must use the `addParents` and `removeParents` parameters to modify the parents list.",
        type: "array",
        items: {
          type: "string",
        },
      },
      thumbnailLink: {
        description:
          "Output only. A short-lived link to the file's thumbnail, if available. Typically lasts on the order of hours. Not intended for direct usage on web applications due to [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) policies. Consider using a proxy server. Only populated when the requesting app can access the file's content. If the file isn't shared publicly, the URL returned in `files.thumbnailLink` must be fetched using a credentialed request.",
        type: "string",
      },
      headRevisionId: {
        description:
          "Output only. The ID of the file's head revision. This is currently only available for files with binary content in Google Drive.",
        type: "string",
      },
      trashedTime: {
        description:
          "The time that the item was trashed (RFC 3339 date-time). Only populated for items in shared drives.",
        type: "string",
      },
      appProperties: {
        description:
          "A collection of arbitrary key-value pairs which are private to the requesting app.\nEntries with null values are cleared in update and copy requests. These properties can only be retrieved using an authenticated request. An authenticated request uses an access token obtained with a OAuth 2 client ID. You cannot use an API key to retrieve private properties.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "string",
        },
      },
      capabilities: {
        description:
          "Output only. Capabilities the current user has on this file. Each capability corresponds to a fine-grained action that a user may take. For more information, see [Understand file capabilities](https://developers.google.com/workspace/drive/api/guides/manage-sharing#capabilities).",
        type: "object",
        properties: {
          canDeleteChildren: {
            description:
              "Output only. Whether the current user can delete children of this folder. This is `false` when the item isn't a folder. Only populated for items in shared drives.",
            type: "boolean",
          },
          canChangeSecurityUpdateEnabled: {
            description:
              "Output only. Whether the current user can change the `securityUpdateEnabled` field on link share metadata.",
            type: "boolean",
          },
          canTrashChildren: {
            description:
              "Output only. Whether the current user can trash children of this folder. This is `false` when the item isn't a folder. Only populated for items in shared drives.",
            type: "boolean",
          },
          canChangeViewersCanCopyContent: {
            description: "Deprecated: Output only.",
            deprecated: true,
            type: "boolean",
          },
          canAcceptOwnership: {
            description:
              "Output only. Whether the current user is the pending owner of the file. Not populated for shared drive files.",
            type: "boolean",
          },
          canListChildren: {
            description:
              "Output only. Whether the current user can list the children of this folder. This is always `false` when the item isn't a folder.",
            type: "boolean",
          },
          canMoveItemWithinDrive: {
            description:
              "Output only. Whether the current user can move this item within this drive. Note that a request to change the parent of the item may still fail depending on the new parent that's being added and the parent that is being removed.",
            type: "boolean",
          },
          canRemoveContentRestriction: {
            description:
              "Output only. Whether there's a content restriction on the file that can be removed by the current user.",
            type: "boolean",
          },
          canReadLabels: {
            description: "Output only. Whether the current user can read the labels on the file.",
            type: "boolean",
          },
          canUntrash: {
            description: "Output only. Whether the current user can restore this file from trash.",
            type: "boolean",
          },
          canTrash: {
            description: "Output only. Whether the current user can move this file to trash.",
            type: "boolean",
          },
          canMoveTeamDriveItem: {
            description: "Deprecated: Output only. Use `canMoveItemWithinDrive` or `canMoveItemOutOfDrive` instead.",
            deprecated: true,
            type: "boolean",
          },
          canAddChildren: {
            description:
              "Output only. Whether the current user can add children to this folder. This is always `false` when the item isn't a folder.",
            type: "boolean",
          },
          canStartApproval: {
            description: "Whether the current user can start an approval on the file.",
            type: "boolean",
          },
          canRemoveChildren: {
            description:
              "Output only. Whether the current user can remove children from this folder. This is always `false` when the item isn't a folder. For a folder in a shared drive, use `canDeleteChildren` or `canTrashChildren` instead.",
            type: "boolean",
          },
          canReadRevisions: {
            description:
              "Output only. Whether the current user can read the revisions resource of this file. For a shared drive item, whether revisions of non-folder descendants of this item, or this item if it's not a folder, can be read.",
            type: "boolean",
          },
          canMoveItemIntoTeamDrive: {
            description: "Deprecated: Output only. Use `canMoveItemOutOfDrive` instead.",
            deprecated: true,
            type: "boolean",
          },
          canAccessViaGenAi: {
            description:
              "Whether the current user can access this file via Gen AI features. For more information, see [Drive MCP file eligibility](https://developers.google.com/workspace/drive/api/guides/drive-mcp-server-file-eligibility).",
            type: "boolean",
          },
          canModifyLabels: {
            description: "Output only. Whether the current user can modify the labels on the file.",
            type: "boolean",
          },
          canChangeItemDownloadRestriction: {
            description:
              "Output only. Whether the current user can change the owner or organizer-applied download restrictions of the file.",
            type: "boolean",
          },
          canRemoveMyDriveParent: {
            description:
              "Output only. Whether the current user can remove a parent from the item without adding another parent in the same request. Not populated for shared drive files.",
            type: "boolean",
          },
          canRename: {
            description: "Output only. Whether the current user can rename this file.",
            type: "boolean",
          },
          canMoveChildrenWithinDrive: {
            description:
              "Output only. Whether the current user can move children of this folder within this drive. This is `false` when the item isn't a folder. Note that a request to move the child may still fail depending on the current user's access to the child and to the destination folder.",
            type: "boolean",
          },
          canDelete: {
            description: "Output only. Whether the current user can delete this file.",
            type: "boolean",
          },
          canCopy: {
            description:
              "Output only. Whether the current user can copy this file. For an item in a shared drive, whether the current user can copy non-folder descendants of this item, or this item if it's not a folder.",
            type: "boolean",
          },
          canMoveChildrenWithinTeamDrive: {
            description: "Deprecated: Output only. Use `canMoveChildrenWithinDrive` instead.",
            deprecated: true,
            type: "boolean",
          },
          canModifyEditorContentRestriction: {
            description:
              "Output only. Whether the current user can add or modify content restrictions on the file which are editor restricted.",
            type: "boolean",
          },
          canEnableInheritedPermissions: {
            description: "Whether a user can re-enable inherited permissions.",
            type: "boolean",
          },
          canMoveChildrenOutOfTeamDrive: {
            description: "Deprecated: Output only. Use `canMoveChildrenOutOfDrive` instead.",
            deprecated: true,
            type: "boolean",
          },
          canMoveItemWithinTeamDrive: {
            description: "Deprecated: Output only. Use `canMoveItemWithinDrive` instead.",
            deprecated: true,
            type: "boolean",
          },
          canModifyOwnerContentRestriction: {
            description:
              "Output only. Whether the current user can add or modify content restrictions which are owner restricted.",
            type: "boolean",
          },
          canModifyContentRestriction: {
            description:
              "Deprecated: Output only. Use one of `canModifyEditorContentRestriction`, `canModifyOwnerContentRestriction`, or `canRemoveContentRestriction`.",
            deprecated: true,
            type: "boolean",
          },
          canMoveItemOutOfTeamDrive: {
            description: "Deprecated: Output only. Use `canMoveItemOutOfDrive` instead.",
            deprecated: true,
            type: "boolean",
          },
          canAddFolderFromAnotherDrive: {
            description:
              "Output only. Whether the current user can add a folder from another drive (different shared drive or My Drive) to this folder. This is `false` when the item isn't a folder. Only populated for items in shared drives.",
            type: "boolean",
          },
          canModifyContent: {
            description: "Output only. Whether the current user can modify the content of this file.",
            type: "boolean",
          },
          canMoveChildrenOutOfDrive: {
            description:
              "Output only. Whether the current user can move children of this folder outside of the shared drive. This is `false` when the item isn't a folder. Only populated for items in shared drives.",
            type: "boolean",
          },
          canDownload: {
            description: "Output only. Whether the current user can download this file.",
            type: "boolean",
          },
          canReadTeamDrive: {
            description: "Deprecated: Output only. Use `canReadDrive` instead.",
            deprecated: true,
            type: "boolean",
          },
          canShare: {
            description: "Output only. Whether the current user can modify the sharing settings for this file.",
            type: "boolean",
          },
          canMoveItemOutOfDrive: {
            description:
              "Output only. Whether the current user can move this item outside of this drive by changing its parent. Note that a request to change the parent of the item may still fail depending on the new parent that's being added.",
            type: "boolean",
          },
          canReadDrive: {
            description:
              "Output only. Whether the current user can read the shared drive to which this file belongs. Only populated for items in shared drives.",
            type: "boolean",
          },
          canChangeCopyRequiresWriterPermission: {
            description:
              "Output only. Whether the current user can change the `copyRequiresWriterPermission` restriction of this file.",
            type: "boolean",
          },
          canDisableInheritedPermissions: {
            description: "Whether a user can disable inherited permissions.",
            type: "boolean",
          },
          canEdit: {
            description:
              "Output only. Whether the current user can edit this file. Other factors may limit the type of changes a user can make to a file. For example, see `canChangeCopyRequiresWriterPermission` or `canModifyContent`.",
            type: "boolean",
          },
          canAddMyDriveParent: {
            description:
              "Output only. Whether the current user can add a parent for the item without removing an existing parent in the same request. Not populated for shared drive files.",
            type: "boolean",
          },
          canComment: {
            description: "Output only. Whether the current user can comment on this file.",
            type: "boolean",
          },
        },
        required: [],
      },
      properties: {
        description:
          "A collection of arbitrary key-value pairs which are visible to all apps.\nEntries with null values are cleared in update and copy requests.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "string",
        },
      },
      mimeType: {
        description:
          "The MIME type of the file. Google Drive attempts to automatically detect an appropriate value from uploaded content, if no value is provided. The value cannot be changed unless a new revision is uploaded. If a file is created with a Google Doc MIME type, the uploaded content is imported, if possible. The supported import formats are published in the [`about`](https://developers.google.com/workspace/drive/api/reference/rest/v3/about) resource.",
        type: "string",
      },
      webViewLink: {
        description: "Output only. A link for opening the file in a relevant Google editor or viewer in a browser.",
        type: "string",
      },
      thumbnailVersion: {
        description: "Output only. The thumbnail version for use in thumbnail cache invalidation.",
        type: "string",
        pattern: "^-?\\d+$",
      },
      inheritedPermissionsDisabled: {
        description:
          "Whether this file has inherited permissions disabled. Inherited permissions are enabled by default.",
        type: "boolean",
      },
      quotaBytesUsed: {
        description:
          "Output only. The number of storage quota bytes used by the file. This includes the head revision as well as previous revisions with `keepForever` enabled.",
        type: "string",
        pattern: "^-?\\d+$",
      },
      size: {
        description:
          "Output only. Size in bytes of blobs and Google Workspace editor files. Won't be populated for files that have no size, like shortcuts and folders.",
        type: "string",
        pattern: "^-?\\d+$",
      },
      modifiedByMe: {
        description: "Output only. Whether the file has been modified by this user.",
        type: "boolean",
      },
      fullFileExtension: {
        description:
          "Output only. The full file extension extracted from the `name` field. May contain multiple concatenated extensions, such as \"tar.gz\". This is only available for files with binary content in Google Drive. This is automatically updated when the `name` field changes, however it's not cleared if the new name doesn't contain a valid extension.",
        type: "string",
      },
      version: {
        description:
          "Output only. A monotonically increasing version number for the file. This reflects every change made to the file on the server, even those not visible to the user.",
        type: "string",
        pattern: "^-?\\d+$",
      },
      downloadRestrictions: {
        description: "Download restrictions applied on the file.",
        type: "ref",
        ref: "drive_DownloadRestrictionsMetadata",
      },
      id: {
        description: "The ID of the file.",
        type: "string",
      },
      iconLink: {
        description: "Output only. A static, unauthenticated link to the file's icon.",
        type: "string",
      },
    },
    required: [],
  },
  DriveAbout: {
    description: "Information about the user, the user's Drive, and system capabilities.",
    type: "object",
    properties: {
      importFormats: {
        description: "A map of source MIME type to possible targets for all supported imports.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      maxUploadSize: {
        description: "The maximum upload size in bytes.",
        type: "string",
        pattern: "^-?\\d+$",
      },
      canCreateTeamDrives: {
        description: "Deprecated: Use `canCreateDrives` instead.",
        deprecated: true,
        type: "boolean",
      },
      maxImportSizes: {
        description: "A map of maximum import sizes by MIME type, in bytes.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "string",
          pattern: "^-?\\d+$",
        },
      },
      teamDriveThemes: {
        description: "Deprecated: Use `driveThemes` instead.",
        deprecated: true,
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              description: "Deprecated: Use `driveThemes/id` instead.",
              deprecated: true,
              type: "string",
            },
            colorRgb: {
              description: "Deprecated: Use `driveThemes/colorRgb` instead.",
              deprecated: true,
              type: "string",
            },
            backgroundImageLink: {
              description: "Deprecated: Use `driveThemes/backgroundImageLink` instead.",
              deprecated: true,
              type: "string",
            },
          },
          required: [],
        },
      },
      storageQuota: {
        description:
          "The user's storage quota limits and usage. For users that are part of an organization with pooled storage, information about the limit and usage across all services is for the organization, rather than the individual user. All fields are measured in bytes.",
        type: "object",
        properties: {
          usageInDrive: {
            description: "The usage by all files in Google Drive.",
            type: "string",
            pattern: "^-?\\d+$",
          },
          usage: {
            description:
              "The total usage across all services. For users that are part of an organization with pooled storage, this is the usage across all services for the organization, rather than the individual user.",
            type: "string",
            pattern: "^-?\\d+$",
          },
          usageInDriveTrash: {
            description: "The usage by trashed files in Google Drive.",
            type: "string",
            pattern: "^-?\\d+$",
          },
          limit: {
            description:
              "The usage limit, if applicable. This will not be present if the user has unlimited storage. For users that are part of an organization with pooled storage, this is the limit for the organization, rather than the individual user.",
            type: "string",
            pattern: "^-?\\d+$",
          },
        },
        required: [],
      },
      canCreateDrives: {
        description: "Whether the user can create shared drives.",
        type: "boolean",
      },
      exportFormats: {
        description: "A map of source MIME type to possible targets for all supported exports.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      kind: {
        description: 'Identifies what kind of resource this is. Value: the fixed string `"drive#about"`.',
        default: "drive#about",
        type: "string",
      },
      appInstalled: {
        description: "Whether the user has installed the requesting app.",
        type: "boolean",
      },
      folderColorPalette: {
        description: "The currently supported folder colors as RGB hex strings.",
        type: "array",
        items: {
          type: "string",
        },
      },
      driveThemes: {
        description: "A list of themes that are supported for shared drives.",
        type: "array",
        items: {
          type: "object",
          properties: {
            colorRgb: {
              description: "The color of this theme as an RGB hex string.",
              type: "string",
            },
            id: {
              description: "The ID of the theme.",
              type: "string",
            },
            backgroundImageLink: {
              description: "A link to this theme's background image.",
              type: "string",
            },
          },
          required: [],
        },
      },
      user: {
        description: "The authenticated user.",
        type: "ref",
        ref: "drive_User",
      },
    },
    required: [],
  },
  DriveDrive: {
    description:
      "Representation of a shared drive. Some resource methods (such as `drives.update`) require a `driveId`. Use the `drives.list` method to retrieve the ID for a shared drive.",
    type: "object",
    properties: {
      name: {
        description: "The name of this shared drive.",
        type: "string",
      },
      capabilities: {
        description: "Output only. Capabilities the current user has on this shared drive.",
        type: "object",
        properties: {
          canManageMembers: {
            description:
              "Output only. Whether the current user can add members to this shared drive or remove them or change their role.",
            type: "boolean",
          },
          canRename: {
            description: "Output only. Whether the current user can rename files or folders in this shared drive.",
            type: "boolean",
          },
          canChangeDriveMembersOnlyRestriction: {
            description:
              "Output only. Whether the current user can change the `driveMembersOnly` restriction of this shared drive.",
            type: "boolean",
          },
          canListChildren: {
            description: "Output only. Whether the current user can list the children of folders in this shared drive.",
            type: "boolean",
          },
          canAddChildren: {
            description: "Output only. Whether the current user can add children to folders in this shared drive.",
            type: "boolean",
          },
          canChangeSharingFoldersRequiresOrganizerPermissionRestriction: {
            description:
              "Output only. Whether the current user can change the `sharingFoldersRequiresOrganizerPermission` restriction of this shared drive.",
            type: "boolean",
          },
          canChangeCopyRequiresWriterPermissionRestriction: {
            description:
              "Output only. Whether the current user can change the `copyRequiresWriterPermission` restriction of this shared drive.",
            type: "boolean",
          },
          canChangeDomainUsersOnlyRestriction: {
            description:
              "Output only. Whether the current user can change the `domainUsersOnly` restriction of this shared drive.",
            type: "boolean",
          },
          canDownload: {
            description: "Output only. Whether the current user can download files in this shared drive.",
            type: "boolean",
          },
          canDeleteDrive: {
            description:
              "Output only. Whether the current user can delete this shared drive. Attempting to delete the shared drive may still fail if there are untrashed items inside the shared drive.",
            type: "boolean",
          },
          canShare: {
            description: "Output only. Whether the current user can share files or folders in this shared drive.",
            type: "boolean",
          },
          canRenameDrive: {
            description: "Output only. Whether the current user can rename this shared drive.",
            type: "boolean",
          },
          canReadRevisions: {
            description:
              "Output only. Whether the current user can read the revisions resource of files in this shared drive.",
            type: "boolean",
          },
          canCopy: {
            description: "Output only. Whether the current user can copy files in this shared drive.",
            type: "boolean",
          },
          canTrashChildren: {
            description: "Output only. Whether the current user can trash children from folders in this shared drive.",
            type: "boolean",
          },
          canChangeDownloadRestriction: {
            description:
              "Output only. Whether the current user can change organizer-applied download restrictions of this shared drive.",
            type: "boolean",
          },
          canComment: {
            description: "Output only. Whether the current user can comment on files in this shared drive.",
            type: "boolean",
          },
          canEdit: {
            description: "Output only. Whether the current user can edit files in this shared drive",
            type: "boolean",
          },
          canDeleteChildren: {
            description: "Output only. Whether the current user can delete children from folders in this shared drive.",
            type: "boolean",
          },
          canChangeDriveBackground: {
            description: "Output only. Whether the current user can change the background of this shared drive.",
            type: "boolean",
          },
          canResetDriveRestrictions: {
            description: "Output only. Whether the current user can reset the shared drive restrictions to defaults.",
            type: "boolean",
          },
        },
        required: [],
      },
      restrictions: {
        description:
          "A set of restrictions that apply to this shared drive or items inside this shared drive. Note that restrictions can't be set when creating a shared drive. To add a restriction, first create a shared drive and then use `drives.update` to add restrictions.",
        type: "object",
        properties: {
          adminManagedRestrictions: {
            description: "Whether administrative privileges on this shared drive are required to modify restrictions.",
            type: "boolean",
          },
          sharingFoldersRequiresOrganizerPermission: {
            description:
              "If true, only users with the organizer role can share folders. If false, users with either the organizer role or the file organizer role can share folders.",
            type: "boolean",
          },
          driveMembersOnly: {
            description: "Whether access to items inside this shared drive is restricted to its members.",
            type: "boolean",
          },
          downloadRestriction: {
            description: "Download restrictions applied by shared drive managers.",
            type: "ref",
            ref: "drive_DownloadRestriction",
          },
          copyRequiresWriterPermission: {
            description:
              "Whether the options to copy, print, or download files inside this shared drive, should be disabled for readers and commenters. When this restriction is set to `true`, it will override the similarly named field to `true` for any file inside this shared drive.",
            type: "boolean",
          },
          domainUsersOnly: {
            description:
              "Whether access to this shared drive and items inside this shared drive is restricted to users of the domain to which this shared drive belongs. This restriction may be overridden by other sharing policies controlled outside of this shared drive.",
            type: "boolean",
          },
        },
        required: [],
      },
      hidden: {
        description: "Whether the shared drive is hidden from default view.",
        type: "boolean",
      },
      backgroundImageLink: {
        description: "Output only. A short-lived link to this shared drive's background image.",
        type: "string",
      },
      colorRgb: {
        description:
          "The color of this shared drive as an RGB hex string. It can only be set on a `drive.drives.update` request that does not set `themeId`.",
        type: "string",
      },
      kind: {
        description: 'Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#drive"`.',
        default: "drive#drive",
        type: "string",
      },
      id: {
        description:
          "Output only. The ID of this shared drive which is also the ID of the top level folder of this shared drive.",
        type: "string",
      },
      backgroundImageFile: {
        description:
          "An image file and cropping parameters from which a background image for this shared drive is set. This is a write only field; it can only be set on `drive.drives.update` requests that don't set `themeId`. When specified, all fields of the `backgroundImageFile` must be set.",
        type: "object",
        properties: {
          id: {
            description: "The ID of an image file in Google Drive to use for the background image.",
            type: "string",
          },
          xCoordinate: {
            description:
              "The X coordinate of the upper left corner of the cropping area in the background image. This is a value in the closed range of 0 to 1. This value represents the horizontal distance from the left side of the entire image to the left side of the cropping area divided by the width of the entire image.",
            type: "number",
          },
          yCoordinate: {
            description:
              "The Y coordinate of the upper left corner of the cropping area in the background image. This is a value in the closed range of 0 to 1. This value represents the vertical distance from the top side of the entire image to the top side of the cropping area divided by the height of the entire image.",
            type: "number",
          },
          width: {
            description:
              "The width of the cropped image in the closed range of 0 to 1. This value represents the width of the cropped image divided by the width of the entire image. The height is computed by applying a width to height aspect ratio of 80 to 9. The resulting image must be at least 1280 pixels wide and 144 pixels high.",
            type: "number",
          },
        },
        required: [],
      },
      themeId: {
        description:
          "The ID of the theme from which the background image and color will be set. The set of possible `driveThemes` can be retrieved from a `drive.about.get` response. When not specified on a `drive.drives.create` request, a random theme is chosen from which the background image and color are set. This is a write-only field; it can only be set on requests that don't set `colorRgb` or `backgroundImageFile`.",
        type: "string",
      },
      orgUnitId: {
        description:
          "Output only. The organizational unit of this shared drive. This field is only populated on `drives.list` responses when the `useDomainAdminAccess` parameter is set to `true`.",
        type: "string",
      },
      createdTime: {
        description: "The time at which the shared drive was created (RFC 3339 date-time).",
        type: "string",
      },
    },
    required: [],
  },
  DriveModifyLabelsRequest: {
    description:
      "A request to modify the set of labels on a file. This request may contain many modifications that will either all succeed or all fail atomically.",
    type: "object",
    properties: {
      labelModifications: {
        description: "The list of modifications to apply to the labels on the file.",
        type: "array",
        items: {
          type: "ref",
          ref: "drive_LabelModification",
        },
      },
      kind: {
        description: 'This is always `"drive#modifyLabelsRequest"`.',
        type: "string",
      },
    },
    required: [],
  },
  DriveResolveAccessProposalRequest: {
    description: "Request message for resolving an AccessProposal on a file.",
    type: "object",
    properties: {
      sendNotification: {
        description:
          "Optional. Whether to send an email to the requester when the access proposal is denied or accepted.",
        type: "boolean",
      },
      role: {
        description:
          "Optional. The roles that the approver has allowed, if any. For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles). Note: This field is required for the `ACCEPT` action.",
        type: "array",
        items: {
          type: "string",
        },
      },
      view: {
        description:
          "Optional. Indicates the view for this access proposal. This should only be set when the proposal belongs to a view. Only `published` is supported.",
        type: "string",
      },
      action: {
        description: "Required. The action to take on the access proposal.",
        type: "string",
        enum: ["ACTION_UNSPECIFIED", "ACCEPT", "DENY"],
      },
    },
    required: [],
  },
  DocsBullet: {
    description: "Describes the bullet of a paragraph.",
    type: "object",
    properties: {
      textStyle: {
        description: "The paragraph-specific text style applied to this bullet.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      nestingLevel: {
        description: "The nesting level of this paragraph in the list.",
        type: "integer",
        format: "int32",
      },
      listId: {
        description: "The ID of the list this paragraph belongs to.",
        type: "string",
      },
    },
    required: [],
  },
  DocsLinkedContentReference: {
    description: "A reference to the external linked source content.",
    type: "object",
    properties: {
      sheetsChartReference: {
        description: "A reference to the linked chart.",
        type: "ref",
        ref: "docs_SheetsChartReference",
      },
    },
    required: [],
  },
  DocsPositionedObjectProperties: {
    description: "Properties of a PositionedObject.",
    type: "object",
    properties: {
      positioning: {
        description:
          "The positioning of this positioned object relative to the newline of the Paragraph that references this positioned object.",
        type: "ref",
        ref: "docs_PositionedObjectPositioning",
      },
      embeddedObject: {
        description: "The embedded object of this positioned object.",
        type: "ref",
        ref: "docs_EmbeddedObject",
      },
    },
    required: [],
  },
  DocsPositionedObject: {
    description:
      "An object that's tethered to a Paragraph and positioned relative to the beginning of the paragraph. A PositionedObject contains an EmbeddedObject such as an image.",
    type: "object",
    properties: {
      suggestedPositionedObjectPropertiesChanges: {
        description: "The suggested changes to the positioned object properties, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedPositionedObjectProperties",
        },
      },
      suggestedInsertionId: {
        description: "The suggested insertion ID. If empty, then this is not a suggested insertion.",
        type: "string",
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      objectId: {
        description: "The ID of this positioned object.",
        type: "string",
      },
      positionedObjectProperties: {
        description: "The properties of this positioned object.",
        type: "ref",
        ref: "docs_PositionedObjectProperties",
      },
    },
    required: [],
  },
  DocsRgbColor: {
    description: "An RGB color.",
    type: "object",
    properties: {
      red: {
        description: "The red component of the color, from 0.0 to 1.0.",
        type: "number",
      },
      blue: {
        description: "The blue component of the color, from 0.0 to 1.0.",
        type: "number",
      },
      green: {
        description: "The green component of the color, from 0.0 to 1.0.",
        type: "number",
      },
    },
    required: [],
  },
  DocsTableCell: {
    description: "The contents and style of a cell in a Table.",
    type: "object",
    properties: {
      tableCellStyle: {
        description: "The style of the cell.",
        type: "ref",
        ref: "docs_TableCellStyle",
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A TableCell may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedTableCellStyleChanges: {
        description: "The suggested changes to the table cell style, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTableCellStyle",
        },
      },
      content: {
        description: "The content of the cell.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_StructuralElement",
        },
      },
      startIndex: {
        description: "The zero-based start index of this cell, in UTF-16 code units.",
        type: "integer",
        format: "int32",
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      endIndex: {
        description: "The zero-based end index of this cell, exclusive, in UTF-16 code units.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DocsReplaceImageRequest: {
    description:
      "Replaces an existing image with a new image. Replacing an image removes some image effects from the existing image in order to mirror the behavior of the Docs editor.",
    type: "object",
    properties: {
      uri: {
        description:
          "The URI of the new image. The image is fetched once at insertion time and a copy is stored for display inside the document. Images must be less than 50MB, cannot exceed 25 megapixels, and must be in PNG, JPEG, or GIF format. The provided URI can't surpass 2 KB in length. The URI is saved with the image, and exposed through the ImageProperties.source_uri field.",
        type: "string",
      },
      imageReplaceMethod: {
        description: "The replacement method.",
        type: "string",
        enum: ["IMAGE_REPLACE_METHOD_UNSPECIFIED", "CENTER_CROP"],
      },
      tabId: {
        description:
          "The tab that the image to be replaced is in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
      imageObjectId: {
        description:
          "The ID of the existing image that will be replaced. The ID can be retrieved from the response of a get request.",
        type: "string",
      },
    },
    required: [],
  },
  DocsTableRowStyleSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base TableRowStyle have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      minRowHeightSuggested: {
        description: "Indicates if there was a suggested change to min_row_height.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsBackground: {
    description: "Represents the background of a document.",
    type: "object",
    properties: {
      color: {
        description: "The background color.",
        type: "ref",
        ref: "docs_OptionalColor",
      },
    },
    required: [],
  },
  DocsAutoText: {
    description:
      "A ParagraphElement representing a spot in the text that's dynamically replaced with content that can change over time, like a page number.",
    type: "object",
    properties: {
      textStyle: {
        description: "The text style of this AutoText.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      type: {
        description: "The type of this auto text.",
        type: "string",
        enum: ["TYPE_UNSPECIFIED", "PAGE_NUMBER", "PAGE_COUNT"],
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. An AutoText may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this AutoText, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
    },
    required: [],
  },
  DocsDropdown: {
    description:
      "A dropdown in the document. The chip is displayed as a dropdown menu that allows users to select an option from a configurable list of options.",
    type: "object",
    properties: {
      textStyle: {
        description: "The text style of this dropdown.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      suggestedDeletionIds: {
        description:
          "IDs for suggestions that remove this dropdown from the document. If empty, then this dropdown isn't suggested for deletion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedInsertionIds: {
        description:
          "IDs for suggestions that insert this dropdown into the document. If empty, then this dropdown isn't a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      dropdownId: {
        description: "The ID of this dropdown.",
        type: "string",
      },
      suggestedDropdownPropertiesChanges: {
        description: "The suggested properties changes to this dropdown, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedDropdownProperties",
        },
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this dropdown, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
      dropdownProperties: {
        description: "The properties of this dropdown.",
        type: "ref",
        ref: "docs_DropdownProperties",
      },
    },
    required: [],
  },
  DocsReplaceAllTextResponse: {
    description: "The result of replacing text.",
    type: "object",
    properties: {
      occurrencesChanged: {
        description: "The number of occurrences changed by replacing all text.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DocsUpdateNamedStyleRequest: {
    description: "Updates a named style.",
    type: "object",
    properties: {
      tabId: {
        description: "The document tab to update. By default, the update is applied to the first tab.",
        type: "string",
      },
      namedStyle: {
        description: "The document style to update.",
        type: "ref",
        ref: "docs_NamedStyle",
      },
      fields: {
        description:
          'The NamedStyle fields that should be updated. At least `named_style_type` must be specified. The root `named_style` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example, to update the text style to bold, set `fields` to include `"text_style"` and `"text_style.bold"`. To update the paragraph style\'s alignment property, set `fields` to include `"paragraph_style"` and `"paragraph_style.alignment"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset. Specifying `"text_style"` or `"paragraph_style"` with an empty TextStyle or ParagraphStyle will reset all of its nested fields.',
        type: "string",
      },
    },
    required: [],
  },
  DocsSuggestedTextStyle: {
    description: "A suggested change to a TextStyle.",
    type: "object",
    properties: {
      textStyle: {
        description:
          "A TextStyle that only includes the changes made in this suggestion. This can be used along with the text_style_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      textStyleSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base TextStyle have been changed in this suggestion.",
        type: "ref",
        ref: "docs_TextStyleSuggestionState",
      },
    },
    required: [],
  },
  DocsRichLinkProperties: {
    description: "Properties specific to a RichLink.",
    type: "object",
    properties: {
      uri: {
        description: "The URI to the RichLink. This is always present.",
        type: "string",
      },
      title: {
        description:
          "The title of the RichLink as displayed in the link. This title matches the title of the linked resource at the time of the insertion or last update of the link. This field is always present.",
        type: "string",
      },
      mimeType: {
        description:
          "The [MIME type](https://developers.google.com/drive/api/v3/mime-types) of the RichLink, if there's one (for example, when it's a file in Drive).",
        type: "string",
      },
    },
    required: [],
  },
  DocsPageBreak: {
    description:
      "A ParagraphElement representing a page break. A page break makes the subsequent text start at the top of the next page.",
    type: "object",
    properties: {
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A PageBreak may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this PageBreak, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
      textStyle: {
        description:
          "The text style of this PageBreak. Similar to text content, like text runs and footnote references, the text style of a page break can affect content layout as well as the styling of text inserted next to it.",
        type: "ref",
        ref: "docs_TextStyle",
      },
    },
    required: [],
  },
  DocsDropdownProperties: {
    description: "Properties specific to a dropdown.",
    type: "object",
    properties: {
      selectedOptionId: {
        description: "The ID of the selected option in this dropdown.",
        type: "string",
      },
      displayValue: {
        description:
          "The human-readable display text of the currently selected item. This field is populated by the server based on the dropdown definition and the selected option ID. It may differ from `DropdownOption.display_value` if the underlying option definition was modified or deleted, or during pending suggested changes.",
        type: "string",
      },
      dropdownDefinitionId: {
        description: "The ID of the DropdownDefinition that defines the options for this dropdown.",
        type: "string",
      },
    },
    required: [],
  },
  DocsSheetsChartReferenceSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base SheetsChartReference have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      spreadsheetIdSuggested: {
        description: "Indicates if there was a suggested change to spreadsheet_id.",
        type: "boolean",
      },
      chartIdSuggested: {
        description: "Indicates if there was a suggested change to chart_id.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsShading: {
    description: "The shading of a paragraph.",
    type: "object",
    properties: {
      backgroundColor: {
        description: "The background color of this paragraph shading.",
        type: "ref",
        ref: "docs_OptionalColor",
      },
    },
    required: [],
  },
  DocsReplaceAllTextRequest: {
    description: "Replaces all instances of text matching a criteria with replace text.",
    type: "object",
    properties: {
      containsText: {
        description: "Finds text in the document matching this substring.",
        type: "ref",
        ref: "docs_SubstringMatchCriteria",
      },
      replaceText: {
        description: "The text that will replace the matched text.",
        type: "string",
      },
      tabsCriteria: {
        description:
          "Optional. The criteria used to specify in which tabs the replacement occurs. When omitted, the replacement applies to all tabs. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the replacement applies to the singular tab. In a document containing multiple tabs: - If provided, the replacement applies to the specified tabs. - If omitted, the replacement applies to all tabs.",
        type: "ref",
        ref: "docs_TabsCriteria",
      },
    },
    required: [],
  },
  DocsSheetsChartReference: {
    description: "A reference to a linked chart embedded from Google Sheets.",
    type: "object",
    properties: {
      chartId: {
        description: "The ID of the specific chart in the Google Sheets spreadsheet that's embedded.",
        type: "integer",
        format: "int32",
      },
      spreadsheetId: {
        description: "The ID of the Google Sheets spreadsheet that contains the source chart.",
        type: "string",
      },
    },
    required: [],
  },
  DocsNestingLevel: {
    description: "Contains properties describing the look and feel of a list bullet at a given level of nesting.",
    type: "object",
    properties: {
      glyphType: {
        description:
          "The type of glyph used by bullets when paragraphs at this level of nesting is ordered. The glyph type determines the type of glyph used to replace placeholders within the glyph_format when paragraphs at this level of nesting are ordered. For example, if the nesting level is 0, the glyph_format is `%0.` and the glyph type is DECIMAL, then the rendered glyph would replace the placeholder `%0` in the glyph format with a number corresponding to the list item's order within the list.",
        type: "string",
        enum: [
          "GLYPH_TYPE_UNSPECIFIED",
          "NONE",
          "DECIMAL",
          "ZERO_DECIMAL",
          "UPPER_ALPHA",
          "ALPHA",
          "UPPER_ROMAN",
          "ROMAN",
        ],
      },
      indentStart: {
        description:
          "The amount of indentation for paragraphs at this level of nesting. Applied to the side that corresponds to the start of the text, based on the paragraph's content direction.",
        type: "ref",
        ref: "docs_Dimension",
      },
      textStyle: {
        description: "The text style of bullets at this level of nesting.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      startNumber: {
        description:
          "The number of the first list item at this nesting level. A value of 0 is treated as a value of 1 for lettered lists and Roman numeral lists. For values of both 0 and 1, lettered and Roman numeral lists will begin at `a` and `i` respectively. This value is ignored for nesting levels with unordered glyphs.",
        type: "integer",
        format: "int32",
      },
      glyphSymbol: {
        description:
          "A custom glyph symbol used by bullets when paragraphs at this level of nesting is unordered. The glyph symbol replaces placeholders within the glyph_format. For example, if the glyph_symbol is the solid circle corresponding to Unicode U+25cf code point and the glyph_format is `%0`, the rendered glyph would be the solid circle.",
        type: "string",
      },
      glyphFormat: {
        description:
          "The format string used by bullets at this level of nesting. The glyph format contains one or more placeholders, and these placeholders are replaced with the appropriate values depending on the glyph_type or glyph_symbol. The placeholders follow the pattern `%[nesting_level]`. Furthermore, placeholders can have prefixes and suffixes. Thus, the glyph format follows the pattern `%[nesting_level]`. Note that the prefix and suffix are optional and can be arbitrary strings. For example, the glyph format `%0.` indicates that the rendered glyph will replace the placeholder with the corresponding glyph for nesting level 0 followed by a period as the suffix. So a list with a glyph type of UPPER_ALPHA and glyph format `%0.` at nesting level 0 will result in a list with rendered glyphs `A.` `B.` `C.` The glyph format can contain placeholders for the current nesting level as well as placeholders for parent nesting levels. For example, a list can have a glyph format of `%0.` at nesting level 0 and a glyph format of `%0.%1.` at nesting level 1. Assuming both nesting levels have DECIMAL glyph types, this would result in a list with rendered glyphs `1.` `2.` ` 2.1.` ` 2.2.` `3.` For nesting levels that are ordered, the string that replaces a placeholder in the glyph format for a particular paragraph depends on the paragraph's order within the list.",
        type: "string",
      },
      indentFirstLine: {
        description: "The amount of indentation for the first line of paragraphs at this level of nesting.",
        type: "ref",
        ref: "docs_Dimension",
      },
      bulletAlignment: {
        description: "The alignment of the bullet within the space allotted for rendering the bullet.",
        type: "string",
        enum: ["BULLET_ALIGNMENT_UNSPECIFIED", "START", "CENTER", "END"],
      },
    },
    required: [],
  },
  DocsSuggestionResponse: {
    description: "The suggestions which were affected by a given update.",
    type: "object",
    properties: {
      deletedSuggestionIds: {
        description: "The IDs of suggestions which were deleted during the update.",
        type: "array",
        items: {
          type: "string",
        },
      },
      createdSuggestionIds: {
        description: "The IDs of suggestions which were created during the update.",
        type: "array",
        items: {
          type: "string",
        },
      },
      acceptedSuggestionIds: {
        description: "The IDs of suggestions which were accepted during the update.",
        type: "array",
        items: {
          type: "string",
        },
      },
      rejectedSuggestionIds: {
        description: "The IDs of suggestions which were rejected during the update.",
        type: "array",
        items: {
          type: "string",
        },
      },
      updatedSummarySuggestionIds: {
        description: "The IDs of suggestions whose summaries were updated during the update.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsFootnoteReference: {
    description:
      "A ParagraphElement representing a footnote reference. A footnote reference is the inline content rendered with a number and is used to identify the footnote.",
    type: "object",
    properties: {
      footnoteNumber: {
        description: "The rendered number of this footnote.",
        type: "string",
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      textStyle: {
        description: "The text style of this FootnoteReference.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this FootnoteReference, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
      footnoteId: {
        description: "The ID of the footnote that contains the content of this footnote reference.",
        type: "string",
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A FootnoteReference may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsTextStyleSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base TextStyle have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      italicSuggested: {
        description: "Indicates if there was a suggested change to italic.",
        type: "boolean",
      },
      smallCapsSuggested: {
        description: "Indicates if there was a suggested change to small_caps.",
        type: "boolean",
      },
      weightedFontFamilySuggested: {
        description: "Indicates if there was a suggested change to weighted_font_family.",
        type: "boolean",
      },
      linkSuggested: {
        description: "Indicates if there was a suggested change to link.",
        type: "boolean",
      },
      fontSizeSuggested: {
        description: "Indicates if there was a suggested change to font_size.",
        type: "boolean",
      },
      backgroundColorSuggested: {
        description: "Indicates if there was a suggested change to background_color.",
        type: "boolean",
      },
      foregroundColorSuggested: {
        description: "Indicates if there was a suggested change to foreground_color.",
        type: "boolean",
      },
      boldSuggested: {
        description: "Indicates if there was a suggested change to bold.",
        type: "boolean",
      },
      underlineSuggested: {
        description: "Indicates if there was a suggested change to underline.",
        type: "boolean",
      },
      baselineOffsetSuggested: {
        description: "Indicates if there was a suggested change to baseline_offset.",
        type: "boolean",
      },
      strikethroughSuggested: {
        description: "Indicates if there was a suggested change to strikethrough.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsDropdownPropertiesSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base DropdownProperties have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      selectedOptionIdSuggested: {
        description: "Indicates if there was a suggested change to selected_option_id.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsNestingLevelSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base NestingLevel have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      textStyleSuggestionState: {
        description: "A mask that indicates which of the fields in text style have been changed in this suggestion.",
        type: "ref",
        ref: "docs_TextStyleSuggestionState",
      },
      glyphFormatSuggested: {
        description: "Indicates if there was a suggested change to glyph_format.",
        type: "boolean",
      },
      glyphTypeSuggested: {
        description: "Indicates if there was a suggested change to glyph_type.",
        type: "boolean",
      },
      bulletAlignmentSuggested: {
        description: "Indicates if there was a suggested change to bullet_alignment.",
        type: "boolean",
      },
      startNumberSuggested: {
        description: "Indicates if there was a suggested change to start_number.",
        type: "boolean",
      },
      indentStartSuggested: {
        description: "Indicates if there was a suggested change to indent_start.",
        type: "boolean",
      },
      glyphSymbolSuggested: {
        description: "Indicates if there was a suggested change to glyph_symbol.",
        type: "boolean",
      },
      indentFirstLineSuggested: {
        description: "Indicates if there was a suggested change to indent_first_line.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsTable: {
    description: "A StructuralElement representing a table.",
    type: "object",
    properties: {
      rows: {
        description: "Number of rows in the table.",
        type: "integer",
        format: "int32",
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A Table may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      tableRows: {
        description: "The contents and style of each row.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_TableRow",
        },
      },
      columns: {
        description:
          "Number of columns in the table. It's possible for a table to be non-rectangular, so some rows may have a different number of cells.",
        type: "integer",
        format: "int32",
      },
      tableStyle: {
        description: "The style of the table.",
        type: "ref",
        ref: "docs_TableStyle",
      },
    },
    required: [],
  },
  DocsTableCellLocation: {
    description: "Location of a single cell within a table.",
    type: "object",
    properties: {
      rowIndex: {
        description: "The zero-based row index. For example, the second row in the table has a row index of 1.",
        type: "integer",
        format: "int32",
      },
      columnIndex: {
        description:
          "The zero-based column index. For example, the second column in the table has a column index of 1.",
        type: "integer",
        format: "int32",
      },
      tableStartLocation: {
        description: "The location where the table starts in the document.",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsResponse: {
    description: "A single response from an update.",
    type: "object",
    properties: {
      addCommentReply: {
        description: "The result of adding a reply to a comment or suggestion.",
        type: "ref",
        ref: "docs_AddCommentReplyResponse",
      },
      addDocumentTab: {
        description: "The result of adding a document tab.",
        type: "ref",
        ref: "docs_AddDocumentTabResponse",
      },
      insertDropdown: {
        description: "The result of inserting a dropdown.",
        type: "ref",
        ref: "docs_InsertDropdownResponse",
      },
      replaceAllText: {
        description: "The result of replacing text.",
        type: "ref",
        ref: "docs_ReplaceAllTextResponse",
      },
      insertInlineImage: {
        description: "The result of inserting an inline image.",
        type: "ref",
        ref: "docs_InsertInlineImageResponse",
      },
      insertInlineSheetsChart: {
        description: "The result of inserting an inline Google Sheets chart.",
        type: "ref",
        ref: "docs_InsertInlineSheetsChartResponse",
      },
      createDropdownDefinition: {
        description: "The result of creating a dropdown definition.",
        type: "ref",
        ref: "docs_CreateDropdownDefinitionResponse",
      },
      createFootnote: {
        description: "The result of creating a footnote.",
        type: "ref",
        ref: "docs_CreateFootnoteResponse",
      },
      createFooter: {
        description: "The result of creating a footer.",
        type: "ref",
        ref: "docs_CreateFooterResponse",
      },
      createHeader: {
        description: "The result of creating a header.",
        type: "ref",
        ref: "docs_CreateHeaderResponse",
      },
      insertComment: {
        description: "The result of inserting a comment.",
        type: "ref",
        ref: "docs_InsertCommentResponse",
      },
      createNamedRange: {
        description: "The result of creating a named range.",
        type: "ref",
        ref: "docs_CreateNamedRangeResponse",
      },
    },
    required: [],
  },
  DocsDocumentStyle: {
    description: "The style of the document.",
    type: "object",
    properties: {
      marginHeader: {
        description:
          "The amount of space between the top of the page and the contents of the header. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "ref",
        ref: "docs_Dimension",
      },
      marginTop: {
        description:
          "The top page margin. Updating the top page margin on the document style clears the top page margin on all section styles. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "ref",
        ref: "docs_Dimension",
      },
      marginLeft: {
        description:
          "The left page margin. Updating the left page margin on the document style clears the left page margin on all section styles. It may also cause columns to resize in all sections. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "ref",
        ref: "docs_Dimension",
      },
      defaultHeaderId: {
        description:
          "The ID of the default header. If not set, there's no default header. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      marginFooter: {
        description:
          "The amount of space between the bottom of the page and the contents of the footer. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "ref",
        ref: "docs_Dimension",
      },
      background: {
        description: "The background of the document. Documents cannot have a transparent background color.",
        type: "ref",
        ref: "docs_Background",
      },
      useFirstPageHeaderFooter: {
        description:
          "Indicates whether to use the first page header / footer IDs for the first page. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "boolean",
      },
      evenPageFooterId: {
        description:
          "The ID of the footer used only for even pages. The value of use_even_page_header_footer determines whether to use the default_footer_id or this value for the footer on even pages. If not set, there's no even page footer. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      marginBottom: {
        description:
          "The bottom page margin. Updating the bottom page margin on the document style clears the bottom page margin on all section styles. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "ref",
        ref: "docs_Dimension",
      },
      flipPageOrientation: {
        description:
          "Optional. Indicates whether to flip the dimensions of the page_size, which allows changing the page orientation between portrait and landscape. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "boolean",
      },
      pageNumberStart: {
        description:
          "The page number from which to start counting the number of pages. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "integer",
        format: "int32",
      },
      marginRight: {
        description:
          "The right page margin. Updating the right page margin on the document style clears the right page margin on all section styles. It may also cause columns to resize in all sections. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "ref",
        ref: "docs_Dimension",
      },
      evenPageHeaderId: {
        description:
          "The ID of the header used only for even pages. The value of use_even_page_header_footer determines whether to use the default_header_id or this value for the header on even pages. If not set, there's no even page header. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      pageSize: {
        description:
          "The size of a page in the document. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "ref",
        ref: "docs_Size",
      },
      defaultFooterId: {
        description:
          "The ID of the default footer. If not set, there's no default footer. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      firstPageHeaderId: {
        description:
          "The ID of the header used only for the first page. If not set then a unique header for the first page does not exist. The value of use_first_page_header_footer determines whether to use the default_header_id or this value for the header on the first page. If not set, there's no first page header. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      firstPageFooterId: {
        description:
          "The ID of the footer used only for the first page. If not set then a unique footer for the first page does not exist. The value of use_first_page_header_footer determines whether to use the default_footer_id or this value for the footer on the first page. If not set, there's no first page footer. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      useCustomHeaderFooterMargins: {
        description:
          "Indicates whether DocumentStyle margin_header, SectionStyle margin_header and DocumentStyle margin_footer, SectionStyle margin_footer are respected. When false, the default values in the Docs editor for header and footer margin is used. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "boolean",
      },
      useEvenPageHeaderFooter: {
        description:
          "Indicates whether to use the even page header / footer IDs for the even pages. If DocumentMode is PAGELESS, this property will not be rendered.",
        type: "boolean",
      },
      documentFormat: {
        description: "Specifies document-level format settings, such as the document mode (pages vs pageless).",
        type: "ref",
        ref: "docs_DocumentFormat",
      },
    },
    required: [],
  },
  DocsDeleteTableRowRequest: {
    description: "Deletes a row from a table.",
    type: "object",
    properties: {
      tableCellLocation: {
        description:
          "The reference table cell location from which the row will be deleted. The row this cell spans will be deleted. If this is a merged cell that spans multiple rows, all rows that the cell spans will be deleted. If no rows remain in the table after this deletion, the whole table is deleted.",
        type: "ref",
        ref: "docs_TableCellLocation",
      },
    },
    required: [],
  },
  DocsCreateFootnoteRequest: {
    description:
      "Creates a Footnote segment and inserts a new FootnoteReference to it at the given location. The new Footnote segment will contain a space followed by a newline character.",
    type: "object",
    properties: {
      endOfSegmentLocation: {
        description:
          "Inserts the footnote reference at the end of the document body. Footnote references cannot be inserted inside a header, footer or footnote. Since footnote references can only be inserted in the body, the segment ID field must be empty.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
      location: {
        description:
          "Inserts the footnote reference at a specific index in the document. The footnote reference must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Footnote references cannot be inserted inside an equation, header, footer or footnote. Since footnote references can only be inserted in the body, the segment ID field must be empty.",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsCreateHeaderRequest: {
    description:
      "Creates a Header. The new header is applied to the SectionStyle at the location of the SectionBreak if specified, otherwise it is applied to the DocumentStyle. If a header of the specified type already exists, a 400 bad request error is returned.",
    type: "object",
    properties: {
      type: {
        description: "The type of header to create.",
        type: "string",
        enum: ["HEADER_FOOTER_TYPE_UNSPECIFIED", "DEFAULT"],
      },
      sectionBreakLocation: {
        description:
          "The location of the SectionBreak which begins the section this header should belong to. If `section_break_location' is unset or if it refers to the first section break in the document body, the header applies to the DocumentStyle",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsAddCommentReplyRequest: {
    description: "Inserts a reply Post into a CommentThread or SuggestionThread.",
    type: "object",
    properties: {
      suggestionId: {
        description: "The ID of the SuggestionThread to add the reply to.",
        type: "string",
      },
      post: {
        description: "The Post representing the reply.",
        type: "ref",
        ref: "docs_Post",
      },
      commentId: {
        description: "The ID of the CommentThread to add the reply to.",
        type: "string",
      },
    },
    required: [],
  },
  DocsDeleteParagraphBulletsRequest: {
    description:
      "Deletes bullets from all of the paragraphs that overlap with the given range. The nesting level of each paragraph will be visually preserved by adding indent to the start of the corresponding paragraph.",
    type: "object",
    properties: {
      range: {
        description: "The range to delete bullets from.",
        type: "ref",
        ref: "docs_Range",
      },
    },
    required: [],
  },
  DocsNamedStylesSuggestionState: {
    description: "The suggestion state of a NamedStyles message.",
    type: "object",
    properties: {
      stylesSuggestionStates: {
        description:
          "A mask that indicates which of the fields on the corresponding NamedStyle in styles have been changed in this suggestion. The order of these named style suggestion states matches the order of the corresponding named style within the named styles suggestion.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_NamedStyleSuggestionState",
        },
      },
    },
    required: [],
  },
  DocsTabProperties: {
    description: "Properties of a tab.",
    type: "object",
    properties: {
      index: {
        description: "The zero-based index of the tab within the parent.",
        type: "integer",
        format: "int32",
      },
      nestingLevel: {
        description: "Output only. The depth of the tab within the document. Root-level tabs start at 0.",
        type: "integer",
        format: "int32",
      },
      tabId: {
        description: "The immutable ID of the tab.",
        type: "string",
      },
      parentTabId: {
        description:
          "Optional. The ID of the parent tab. Empty when the current tab is a root-level tab, which means it doesn't have any parents.",
        type: "string",
      },
      iconEmoji: {
        description:
          "Optional. The emoji icon displayed with the tab. A valid emoji icon is represented by a non-empty Unicode string. Any set of characters that don't represent a single emoji is invalid. If an emoji is invalid, a 400 bad request error is returned. If this value is unset or empty, the tab will display the default tab icon.",
        type: "string",
      },
      title: {
        description: "The user-visible name of the tab.",
        type: "string",
      },
    },
    required: [],
  },
  DocsSuggestedDocumentStyle: {
    description: "A suggested change to the DocumentStyle.",
    type: "object",
    properties: {
      documentStyleSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base DocumentStyle have been changed in this suggestion.",
        type: "ref",
        ref: "docs_DocumentStyleSuggestionState",
      },
      documentStyle: {
        description:
          "A DocumentStyle that only includes the changes made in this suggestion. This can be used along with the document_style_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_DocumentStyle",
      },
    },
    required: [],
  },
  DocsCreateNamedRangeRequest: {
    description: "Creates a NamedRange referencing the given range.",
    type: "object",
    properties: {
      name: {
        description:
          "The name of the NamedRange. Names do not need to be unique. Names must be at least 1 character and no more than 256 characters, measured in UTF-16 code units.",
        type: "string",
      },
      range: {
        description: "The range to apply the name to.",
        type: "ref",
        ref: "docs_Range",
      },
    },
    required: [],
  },
  DocsEmbeddedObject: {
    description: "An embedded object in the document.",
    type: "object",
    properties: {
      embeddedDrawingProperties: {
        description: "The properties of an embedded drawing.",
        type: "ref",
        ref: "docs_EmbeddedDrawingProperties",
      },
      marginRight: {
        description: "The right margin of the embedded object.",
        type: "ref",
        ref: "docs_Dimension",
      },
      size: {
        description: "The visible size of the image after cropping.",
        type: "ref",
        ref: "docs_Size",
      },
      embeddedObjectBorder: {
        description: "The border of the embedded object.",
        type: "ref",
        ref: "docs_EmbeddedObjectBorder",
      },
      marginLeft: {
        description: "The left margin of the embedded object.",
        type: "ref",
        ref: "docs_Dimension",
      },
      marginTop: {
        description: "The top margin of the embedded object.",
        type: "ref",
        ref: "docs_Dimension",
      },
      description: {
        description:
          "The description of the embedded object. The `title` and `description` are both combined to display alt text.",
        type: "string",
      },
      linkedContentReference: {
        description:
          "A reference to the external linked source content. For example, it contains a reference to the source Google Sheets chart when the embedded object is a linked chart. If unset, then the embedded object is not linked.",
        type: "ref",
        ref: "docs_LinkedContentReference",
      },
      title: {
        description:
          "The title of the embedded object. The `title` and `description` are both combined to display alt text.",
        type: "string",
      },
      marginBottom: {
        description: "The bottom margin of the embedded object.",
        type: "ref",
        ref: "docs_Dimension",
      },
      imageProperties: {
        description: "The properties of an image.",
        type: "ref",
        ref: "docs_ImageProperties",
      },
    },
    required: [],
  },
  DocsDeleteHeaderRequest: {
    description: "Deletes a Header from the document.",
    type: "object",
    properties: {
      tabId: {
        description:
          "The tab containing the header to delete. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
      headerId: {
        description:
          "The id of the header to delete. If this header is defined on DocumentStyle, the reference to this header is removed, resulting in no header of that type for the first section of the document. If this header is defined on a SectionStyle, the reference to this header is removed and the header of that type is now continued from the previous section.",
        type: "string",
      },
    },
    required: [],
  },
  DocsInsertTableRequest: {
    description:
      "Inserts a table at the specified location. A newline character will be inserted before the inserted table.",
    type: "object",
    properties: {
      rows: {
        description: "The number of rows in the table.",
        type: "integer",
        format: "int32",
      },
      endOfSegmentLocation: {
        description:
          "Inserts the table at the end of the given header, footer or document body. A newline character will be inserted before the inserted table. Tables cannot be inserted inside a footnote.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
      location: {
        description:
          "Inserts the table at a specific model index. A newline character will be inserted before the inserted table, therefore the table start index will be at the specified location index + 1. The table must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between an existing table and its preceding paragraph). Tables cannot be inserted inside a footnote or equation.",
        type: "ref",
        ref: "docs_Location",
      },
      columns: {
        description: "The number of columns in the table.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DocsInsertDropdownResponse: {
    description: "The result of inserting a Dropdown.",
    type: "object",
    properties: {
      dropdown: {
        description: "The newly-inserted Dropdown.",
        type: "ref",
        ref: "docs_Dropdown",
      },
    },
    required: [],
  },
  DocsInsertDateRequest: {
    description: "Inserts a date at the specified location.",
    type: "object",
    properties: {
      endOfSegmentLocation: {
        description: "Inserts the date at the end of the given header, footer or document body.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
      location: {
        description:
          "Inserts the date at a specific index in the document. The date must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between an existing table and its preceding paragraph).",
        type: "ref",
        ref: "docs_Location",
      },
      dateElementProperties: {
        description: "The properties of the date to insert.",
        type: "ref",
        ref: "docs_DateElementProperties",
      },
    },
    required: [],
  },
  DocsAddCommentReplyResponse: {
    description: "Response message for adding a reply.",
    type: "object",
    properties: {
      post: {
        description: "The newly-inserted reply Post.",
        type: "ref",
        ref: "docs_Post",
      },
    },
    required: [],
  },
  DocsTableRow: {
    description: "The contents and style of a row in a Table.",
    type: "object",
    properties: {
      suggestedTableRowStyleChanges: {
        description: "The suggested style changes to this row, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTableRowStyle",
        },
      },
      endIndex: {
        description: "The zero-based end index of this row, exclusive, in UTF-16 code units.",
        type: "integer",
        format: "int32",
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A TableRow may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      tableRowStyle: {
        description: "The style of the table row.",
        type: "ref",
        ref: "docs_TableRowStyle",
      },
      startIndex: {
        description: "The zero-based start index of this row, in UTF-16 code units.",
        type: "integer",
        format: "int32",
      },
      tableCells: {
        description:
          "The contents and style of each cell in this row. It's possible for a table to be non-rectangular, so some rows may have a different number of cells than other rows in the same table.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_TableCell",
        },
      },
    },
    required: [],
  },
  DocsListProperties: {
    description:
      "The properties of a list that describe the look and feel of bullets belonging to paragraphs associated with a list.",
    type: "object",
    properties: {
      nestingLevels: {
        description:
          "Describes the properties of the bullets at the associated level. A list has at most 9 levels of nesting with nesting level 0 corresponding to the top-most level and nesting level 8 corresponding to the most nested level. The nesting levels are returned in ascending order with the least nested returned first.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_NestingLevel",
        },
      },
    },
    required: [],
  },
  DocsImagePropertiesSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base ImageProperties have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      transparencySuggested: {
        description: "Indicates if there was a suggested change to transparency.",
        type: "boolean",
      },
      contrastSuggested: {
        description: "Indicates if there was a suggested change to contrast.",
        type: "boolean",
      },
      contentUriSuggested: {
        description: "Indicates if there was a suggested change to content_uri.",
        type: "boolean",
      },
      cropPropertiesSuggestionState: {
        description:
          "A mask that indicates which of the fields in crop_properties have been changed in this suggestion.",
        type: "ref",
        ref: "docs_CropPropertiesSuggestionState",
      },
      brightnessSuggested: {
        description: "Indicates if there was a suggested change to brightness.",
        type: "boolean",
      },
      sourceUriSuggested: {
        description: "Indicates if there was a suggested change to source_uri.",
        type: "boolean",
      },
      angleSuggested: {
        description: "Indicates if there was a suggested change to angle.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsNamedRange: {
    description:
      "A collection of Ranges with the same named range ID. Named ranges allow developers to associate parts of a document with an arbitrary user-defined label so their contents can be programmatically read or edited later. A document can contain multiple named ranges with the same name, but every named range has a unique ID. A named range is created with a single Range, and content inserted inside a named range generally expands that range. However, certain document changes can cause the range to be split into multiple ranges. Named ranges are not private. All applications and collaborators that have access to the document can see its named ranges.",
    type: "object",
    properties: {
      ranges: {
        description: "The ranges that belong to this named range.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_Range",
        },
      },
      namedRangeId: {
        description: "The ID of the named range.",
        type: "string",
      },
      name: {
        description: "The name of the named range.",
        type: "string",
      },
    },
    required: [],
  },
  DocsNamedStyle: {
    description:
      "A named style. Paragraphs in the document can inherit their TextStyle and ParagraphStyle from this named style when they have the same named style type.",
    type: "object",
    properties: {
      namedStyleType: {
        description: "The type of this named style.",
        type: "string",
        enum: [
          "NAMED_STYLE_TYPE_UNSPECIFIED",
          "NORMAL_TEXT",
          "TITLE",
          "SUBTITLE",
          "HEADING_1",
          "HEADING_2",
          "HEADING_3",
          "HEADING_4",
          "HEADING_5",
          "HEADING_6",
        ],
      },
      textStyle: {
        description: "The text style of this named style.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      paragraphStyle: {
        description: "The paragraph style of this named style.",
        type: "ref",
        ref: "docs_ParagraphStyle",
      },
    },
    required: [],
  },
  DocsEmbeddedDrawingProperties: {
    description:
      "The properties of an embedded drawing and used to differentiate the object type. An embedded drawing is one that's created and edited within a document. Note that extensive details are not supported.",
    type: "object",
    properties: {},
    required: [],
  },
  DocsDeleteSuggestionRequest: {
    description:
      "Deletes a suggestion. Returns a 403 forbidden error if the requesting user is not the author of the suggestion.",
    type: "object",
    properties: {
      suggestionId: {
        description: "The ID of the suggestion.",
        type: "string",
      },
    },
    required: [],
  },
  DocsUpdateDocumentTabPropertiesRequest: {
    description: "Update the properties of a document tab.",
    type: "object",
    properties: {
      tabProperties: {
        description: "The tab properties to update.",
        type: "ref",
        ref: "docs_TabProperties",
      },
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `tab_properties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field.',
        type: "string",
      },
    },
    required: [],
  },
  DocsDeleteContentRangeRequest: {
    description: "Deletes content from the document.",
    type: "object",
    properties: {
      range: {
        description:
          "The range of content to delete. Deleting text that crosses a paragraph boundary may result in changes to paragraph styles, lists, positioned objects and bookmarks as the two paragraphs are merged. Attempting to delete certain ranges can result in an invalid document structure in which case a 400 bad request error is returned. Some examples of invalid delete requests include: * Deleting one code unit of a surrogate pair. * Deleting the last newline character of a Body, Header, Footer, Footnote, TableCell or TableOfContents. * Deleting the start or end of a Table, TableOfContents or Equation without deleting the entire element. * Deleting the newline character before a Table, TableOfContents or SectionBreak without deleting the element. * Deleting individual rows or cells of a table. Deleting the content within a table cell is allowed.",
        type: "ref",
        ref: "docs_Range",
      },
    },
    required: [],
  },
  DocsAcceptSuggestionRequest: {
    description:
      "Accepts a suggestion. Returns a 403 forbidden error if the requesting user does not have edit access to the document.",
    type: "object",
    properties: {
      suggestionId: {
        description: "The ID of the suggestion.",
        type: "string",
      },
    },
    required: [],
  },
  DocsHorizontalRule: {
    description: "A ParagraphElement representing a horizontal line.",
    type: "object",
    properties: {
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this HorizontalRule, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
      textStyle: {
        description:
          "The text style of this HorizontalRule. Similar to text content, like text runs and footnote references, the text style of a horizontal rule can affect content layout as well as the styling of text inserted next to it.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A HorizontalRule may have multiple insertion IDs if it is a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsHeadingLink: {
    description: "A reference to a heading in this document.",
    type: "object",
    properties: {
      tabId: {
        description: "The ID of the tab containing this heading.",
        type: "string",
      },
      id: {
        description: "The ID of a heading in this document.",
        type: "string",
      },
    },
    required: [],
  },
  DocsUpdateTextStyleRequest: {
    description: "Update the styling of text.",
    type: "object",
    properties: {
      range: {
        description:
          "The range of text to style. The range may be extended to include adjacent newlines. If the range fully contains a paragraph belonging to a list, the paragraph's bullet is also updated with the matching text style. Ranges cannot be inserted inside a relative UpdateTextStyleRequest.",
        type: "ref",
        ref: "docs_Range",
      },
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `text_style` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example, to update the text style to bold, set `fields` to `"bold"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset.',
        type: "string",
      },
      textStyle: {
        description:
          "The styles to set on the text. If the value for a particular style matches that of the parent, that style will be set to inherit. Certain text style changes may cause other changes in order to to mirror the behavior of the Docs editor. See the documentation of TextStyle for more information.",
        type: "ref",
        ref: "docs_TextStyle",
      },
    },
    required: [],
  },
  DocsUpdateDocumentStyleRequest: {
    description: "Updates the DocumentStyle.",
    type: "object",
    properties: {
      tabId: {
        description:
          "The tab that contains the style to update. When omitted, the request applies to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If not provided, the request applies to the first tab in the document.",
        type: "string",
      },
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `document_style` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the background, set `fields` to `"background"`.',
        type: "string",
      },
      documentStyle: {
        description:
          "The styles to set on the document. Certain document style changes may cause other changes in order to mirror the behavior of the Docs editor. See the documentation of DocumentStyle for more information.",
        type: "ref",
        ref: "docs_DocumentStyle",
      },
    },
    required: [],
  },
  DocsOptionalColor: {
    description: "A color that can either be fully opaque or fully transparent.",
    type: "object",
    properties: {
      color: {
        description: "If set, this will be used as an opaque color. If unset, this represents a transparent color.",
        type: "ref",
        ref: "docs_Color",
      },
    },
    required: [],
  },
  DocsEndOfSegmentLocation: {
    description:
      "Location at the end of a body, header, footer or footnote. The location is immediately before the last newline in the document segment.",
    type: "object",
    properties: {
      segmentId: {
        description:
          "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
        type: "string",
      },
      tabId: {
        description:
          "The tab that the location is in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
    },
    required: [],
  },
  DocsSuggestedInlineObjectProperties: {
    description: "A suggested change to InlineObjectProperties.",
    type: "object",
    properties: {
      inlineObjectProperties: {
        description:
          "An InlineObjectProperties that only includes the changes made in this suggestion. This can be used along with the inline_object_properties_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_InlineObjectProperties",
      },
      inlineObjectPropertiesSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base InlineObjectProperties have been changed in this suggestion.",
        type: "ref",
        ref: "docs_InlineObjectPropertiesSuggestionState",
      },
    },
    required: [],
  },
  DocsInsertTextRequest: {
    description: "Inserts text at the specified location.",
    type: "object",
    properties: {
      endOfSegmentLocation: {
        description: "Inserts the text at the end of a header, footer, footnote or the document body.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
      location: {
        description:
          "Inserts the text at a specific index in the document. Text must be inserted inside the bounds of an existing Paragraph. For instance, text cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). The text must be inserted in the preceding paragraph.",
        type: "ref",
        ref: "docs_Location",
      },
      text: {
        description:
          "The text to be inserted. Inserting a newline character will implicitly create a new Paragraph at that index. The paragraph style of the new paragraph will be copied from the paragraph at the current insertion index, including lists and bullets. Text styles for inserted text will be determined automatically, generally preserving the styling of neighboring text. In most cases, the text style for the inserted text will match the text immediately before the insertion index. Some control characters (U+0000-U+0008, U+000C-U+001F) and characters from the Unicode Basic Multilingual Plane Private Use Area (U+E000-U+F8FF) will be stripped out of the inserted text.",
        type: "string",
      },
    },
    required: [],
  },
  DocsCreateFooterRequest: {
    description:
      "Creates a Footer. The new footer is applied to the SectionStyle at the location of the SectionBreak if specified, otherwise it is applied to the DocumentStyle. If a footer of the specified type already exists, a 400 bad request error is returned.",
    type: "object",
    properties: {
      type: {
        description: "The type of footer to create.",
        type: "string",
        enum: ["HEADER_FOOTER_TYPE_UNSPECIFIED", "DEFAULT"],
      },
      sectionBreakLocation: {
        description:
          "The location of the SectionBreak immediately preceding the section whose SectionStyle this footer should belong to. If this is unset or refers to the first section break in the document, the footer applies to the document style.",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsSubstringMatchCriteria: {
    description: "A criteria that matches a specific string of text in the document.",
    type: "object",
    properties: {
      searchByRegex: {
        description:
          "Optional. True if the find value should be treated as a regular expression. Any backslashes in the pattern should be escaped. - `True`: the search text is treated as a regular expressions. - `False`: the search text is treated as a substring for matching.",
        type: "boolean",
      },
      matchCase: {
        description:
          "Indicates whether the search should respect case: - `True`: the search is case sensitive. - `False`: the search is case insensitive.",
        type: "boolean",
      },
      text: {
        description: "The text to search for in the document.",
        type: "string",
      },
    },
    required: [],
  },
  DocsNamedStyles: {
    description:
      "The named styles. Paragraphs in the document can inherit their TextStyle and ParagraphStyle from these named styles.",
    type: "object",
    properties: {
      styles: {
        description: "The named styles. There's an entry for each of the possible named style types.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_NamedStyle",
        },
      },
    },
    required: [],
  },
  DocsTableCellStyle: {
    description:
      "The style of a TableCell. Inherited table cell styles are represented as unset fields in this message. A table cell style can inherit from the table's style.",
    type: "object",
    properties: {
      columnSpan: {
        description: "The column span of the cell. This property is read-only.",
        type: "integer",
        format: "int32",
      },
      borderBottom: {
        description: "The bottom border of the cell.",
        type: "ref",
        ref: "docs_TableCellBorder",
      },
      borderTop: {
        description: "The top border of the cell.",
        type: "ref",
        ref: "docs_TableCellBorder",
      },
      paddingRight: {
        description: "The right padding of the cell.",
        type: "ref",
        ref: "docs_Dimension",
      },
      paddingBottom: {
        description: "The bottom padding of the cell.",
        type: "ref",
        ref: "docs_Dimension",
      },
      backgroundColor: {
        description: "The background color of the cell.",
        type: "ref",
        ref: "docs_OptionalColor",
      },
      paddingLeft: {
        description: "The left padding of the cell.",
        type: "ref",
        ref: "docs_Dimension",
      },
      borderLeft: {
        description: "The left border of the cell.",
        type: "ref",
        ref: "docs_TableCellBorder",
      },
      paddingTop: {
        description: "The top padding of the cell.",
        type: "ref",
        ref: "docs_Dimension",
      },
      rowSpan: {
        description: "The row span of the cell. This property is read-only.",
        type: "integer",
        format: "int32",
      },
      contentAlignment: {
        description:
          "The alignment of the content in the table cell. The default alignment matches the alignment for newly created table cells in the Docs editor.",
        type: "string",
        enum: ["CONTENT_ALIGNMENT_UNSPECIFIED", "CONTENT_ALIGNMENT_UNSUPPORTED", "TOP", "MIDDLE", "BOTTOM"],
      },
      borderRight: {
        description: "The right border of the cell.",
        type: "ref",
        ref: "docs_TableCellBorder",
      },
    },
    required: [],
  },
  DocsSuggestedPositionedObjectProperties: {
    description: "A suggested change to PositionedObjectProperties.",
    type: "object",
    properties: {
      positionedObjectPropertiesSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base PositionedObjectProperties have been changed in this suggestion.",
        type: "ref",
        ref: "docs_PositionedObjectPropertiesSuggestionState",
      },
      positionedObjectProperties: {
        description:
          "A PositionedObjectProperties that only includes the changes made in this suggestion. This can be used along with the positioned_object_properties_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_PositionedObjectProperties",
      },
    },
    required: [],
  },
  DocsSectionColumnProperties: {
    description: "Properties that apply to a section's column.",
    type: "object",
    properties: {
      width: {
        description: "Output only. The width of the column.",
        type: "ref",
        ref: "docs_Dimension",
      },
      paddingEnd: {
        description: "The padding at the end of the column.",
        type: "ref",
        ref: "docs_Dimension",
      },
    },
    required: [],
  },
  DocsDeleteCommentReplyRequest: {
    description:
      "Deletes a reply Post from a CommentThread or SuggestionThread. Returns a 400 bad request error if: - The requesting user is not the author of the post. - The reply post contains an action. - The reply post contains an assignee.",
    type: "object",
    properties: {
      postId: {
        description: "The ID of the reply Post being deleted.",
        type: "string",
      },
      suggestionId: {
        description: "The ID of the SuggestionThread which the post belongs to.",
        type: "string",
      },
      commentId: {
        description: "The ID of the CommentThread which the post belongs to.",
        type: "string",
      },
    },
    required: [],
  },
  DocsEmbeddedObjectBorder: {
    description: "A border around an EmbeddedObject.",
    type: "object",
    properties: {
      dashStyle: {
        description: "The dash style of the border.",
        type: "string",
        enum: ["DASH_STYLE_UNSPECIFIED", "SOLID", "DOT", "DASH"],
      },
      propertyState: {
        description: "The property state of the border property.",
        type: "string",
        enum: ["RENDERED", "NOT_RENDERED"],
      },
      width: {
        description: "The width of the border.",
        type: "ref",
        ref: "docs_Dimension",
      },
      color: {
        description: "The color of the border.",
        type: "ref",
        ref: "docs_OptionalColor",
      },
    },
    required: [],
  },
  DocsInlineObjectPropertiesSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base InlineObjectProperties have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      embeddedObjectSuggestionState: {
        description:
          "A mask that indicates which of the fields in embedded_object have been changed in this suggestion.",
        type: "ref",
        ref: "docs_EmbeddedObjectSuggestionState",
      },
    },
    required: [],
  },
  DocsNamedRanges: {
    description: "A collection of all the NamedRanges in the document that share a given name.",
    type: "object",
    properties: {
      namedRanges: {
        description: "The NamedRanges that share the same name.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_NamedRange",
        },
      },
      name: {
        description: "The name that all the named ranges share.",
        type: "string",
      },
    },
    required: [],
  },
  DocsInlineObject: {
    description:
      "An object that appears inline with text. An InlineObject contains an EmbeddedObject such as an image.",
    type: "object",
    properties: {
      objectId: {
        description: "The ID of this inline object. Can be used to update an object’s properties.",
        type: "string",
      },
      suggestedInlineObjectPropertiesChanges: {
        description: "The suggested changes to the inline object properties, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedInlineObjectProperties",
        },
      },
      suggestedInsertionId: {
        description: "The suggested insertion ID. If empty, then this is not a suggested insertion.",
        type: "string",
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      inlineObjectProperties: {
        description: "The properties of this inline object.",
        type: "ref",
        ref: "docs_InlineObjectProperties",
      },
    },
    required: [],
  },
  DocsInsertTableColumnRequest: {
    description: "Inserts an empty column into a table.",
    type: "object",
    properties: {
      insertRight: {
        description:
          "Whether to insert new column to the right of the reference cell location. - `True`: insert to the right. - `False`: insert to the left.",
        type: "boolean",
      },
      tableCellLocation: {
        description:
          "The reference table cell location from which columns will be inserted. A new column will be inserted to the left (or right) of the column where the reference cell is. If the reference cell is a merged cell, a new column will be inserted to the left (or right) of the merged cell.",
        type: "ref",
        ref: "docs_TableCellLocation",
      },
    },
    required: [],
  },
  DocsTableCellBorder: {
    description:
      "A border around a table cell. Table cell borders cannot be transparent. To hide a table cell border, make its width 0.",
    type: "object",
    properties: {
      dashStyle: {
        description: "The dash style of the border.",
        type: "string",
        enum: ["DASH_STYLE_UNSPECIFIED", "SOLID", "DOT", "DASH"],
      },
      width: {
        description: "The width of the border.",
        type: "ref",
        ref: "docs_Dimension",
      },
      color: {
        description: "The color of the border. This color cannot be transparent.",
        type: "ref",
        ref: "docs_OptionalColor",
      },
    },
    required: [],
  },
  DocsHeader: {
    description: "A document header.",
    type: "object",
    properties: {
      headerId: {
        description: "The ID of the header.",
        type: "string",
      },
      content: {
        description: "The contents of the header. The indexes for a header's content begin at zero.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_StructuralElement",
        },
      },
    },
    required: [],
  },
  DocsInsertCommentResponse: {
    description: "Response message for inserting a comment.",
    type: "object",
    properties: {
      commentThread: {
        description: "The newly-inserted comment thread.",
        type: "ref",
        ref: "docs_CommentThread",
      },
    },
    required: [],
  },
  DocsUpdateDropdownPropertiesRequest: {
    description: "Updates the properties of a Dropdown.",
    type: "object",
    properties: {
      tabId: {
        description:
          "The ID of the tab that contains the dropdown to update. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
      dropdownProperties: {
        description: "The properties to update.",
        type: "ref",
        ref: "docs_DropdownProperties",
      },
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `dropdown_properties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field.',
        type: "string",
      },
      dropdownId: {
        description: "Required. The Dropdown ID.",
        type: "string",
      },
    },
    required: [],
  },
  DocsTab: {
    description: "A tab in a document.",
    type: "object",
    properties: {
      childTabs: {
        description: "The child tabs nested within this tab.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_Tab",
        },
      },
      tabProperties: {
        description: "The properties of the tab, like ID and title.",
        type: "ref",
        ref: "docs_TabProperties",
      },
      documentTab: {
        description: "A tab with document contents, like text and images.",
        type: "ref",
        ref: "docs_DocumentTab",
      },
    },
    required: [],
  },
  DocsColor: {
    description: "A solid color.",
    type: "object",
    properties: {
      rgbColor: {
        description: "The RGB color value.",
        type: "ref",
        ref: "docs_RgbColor",
      },
    },
    required: [],
  },
  DocsFooter: {
    description: "A document footer.",
    type: "object",
    properties: {
      footerId: {
        description: "The ID of the footer.",
        type: "string",
      },
      content: {
        description: "The contents of the footer. The indexes for a footer's content begin at zero.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_StructuralElement",
        },
      },
    },
    required: [],
  },
  DocsSuggestedDropdownDefinitionProperties: {
    description: "A suggested change to dropdown definition properties.",
    type: "object",
    properties: {
      dropdownDefinitionProperties: {
        description:
          "A DropdownDefinitionProperties that only includes the changes made in this suggestion. This can be used along with the dropdown_definition_properties_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_DropdownDefinitionProperties",
      },
      dropdownDefinitionPropertiesSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base DropdownDefinitionProperties have been changed in this suggestion.",
        type: "ref",
        ref: "docs_DropdownDefinitionPropertiesSuggestionState",
      },
    },
    required: [],
  },
  DocsObjectReferences: {
    description: "A collection of object IDs.",
    type: "object",
    properties: {
      objectIds: {
        description: "The object IDs.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsTableOfContents: {
    description: "A StructuralElement representing a table of contents.",
    type: "object",
    properties: {
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A TableOfContents may have multiple insertion IDs if it is a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      content: {
        description: "The content of the table of contents.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_StructuralElement",
        },
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsListPropertiesSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base ListProperties have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      nestingLevelsSuggestionStates: {
        description:
          "A mask that indicates which of the fields on the corresponding NestingLevel in nesting_levels have been changed in this suggestion. The nesting level suggestion states are returned in ascending order of the nesting level with the least nested returned first.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_NestingLevelSuggestionState",
        },
      },
    },
    required: [],
  },
  DocsStructuralElement: {
    description: "A StructuralElement describes content that provides structure to the document.",
    type: "object",
    properties: {
      startIndex: {
        description: "The zero-based start index of this structural element, in UTF-16 code units.",
        type: "integer",
        format: "int32",
      },
      table: {
        description: "A table type of structural element.",
        type: "ref",
        ref: "docs_Table",
      },
      tableOfContents: {
        description: "A table of contents type of structural element.",
        type: "ref",
        ref: "docs_TableOfContents",
      },
      sectionBreak: {
        description: "A section break type of structural element.",
        type: "ref",
        ref: "docs_SectionBreak",
      },
      paragraph: {
        description: "A paragraph type of structural element.",
        type: "ref",
        ref: "docs_Paragraph",
      },
      endIndex: {
        description: "The zero-based end index of this structural element, exclusive, in UTF-16 code units.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DocsInsertInlineImageRequest: {
    description: "Inserts an InlineObject containing an image at the given location.",
    type: "object",
    properties: {
      endOfSegmentLocation: {
        description:
          "Inserts the text at the end of a header, footer or the document body. Inline images cannot be inserted inside a footnote.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
      objectSize: {
        description:
          "The size that the image should appear as in the document. This property is optional and the final size of the image in the document is determined by the following rules: * If neither width nor height is specified, then a default size of the image is calculated based on its resolution. * If one dimension is specified then the other dimension is calculated to preserve the aspect ratio of the image. * If both width and height are specified, the image is scaled to fit within the provided dimensions while maintaining its aspect ratio.",
        type: "ref",
        ref: "docs_Size",
      },
      uri: {
        description:
          "The image URI. The image is fetched once at insertion time and a copy is stored for display inside the document. Images must be less than 50MB in size, cannot exceed 25 megapixels, and must be in one of PNG, JPEG, or GIF format. The provided URI must be publicly accessible and at most 2 kB in length. The URI itself is saved with the image, and exposed via the ImageProperties.content_uri field.",
        type: "string",
      },
      location: {
        description:
          "Inserts the image at a specific index in the document. The image must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Inline images cannot be inserted inside a footnote or equation.",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsBody: {
    description:
      "The document body. The body typically contains the full document contents except for headers, footers, and footnotes.",
    type: "object",
    properties: {
      content: {
        description: "The contents of the body. The indexes for the body's content begin at zero.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_StructuralElement",
        },
      },
    },
    required: [],
  },
  DocsInsertTableRowRequest: {
    description: "Inserts an empty row into a table.",
    type: "object",
    properties: {
      tableCellLocation: {
        description:
          "The reference table cell location from which rows will be inserted. A new row will be inserted above (or below) the row where the reference cell is. If the reference cell is a merged cell, a new row will be inserted above (or below) the merged cell.",
        type: "ref",
        ref: "docs_TableCellLocation",
      },
      insertBelow: {
        description:
          "Whether to insert new row below the reference cell location. - `True`: insert below the cell. - `False`: insert above the cell.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsWriteControl: {
    description: "Provides control over how write requests are executed.",
    type: "object",
    properties: {
      writeMode: {
        description:
          "How the request updates should be applied to the document. If unspecified, the request updates will be applied as normal edits.",
        type: "string",
        enum: ["WRITE_MODE_UNSPECIFIED", "EDIT", "SUGGEST"],
      },
      requiredRevisionId: {
        description:
          "The optional revision ID of the document the write request is applied to. If this is not the latest revision of the document, the request is not processed and returns a 400 bad request error. When a required revision ID is returned in a response, it indicates the revision ID of the document after the request was applied.",
        type: "string",
      },
      targetRevisionId: {
        description:
          "The optional target revision ID of the document the write request is applied to. If collaborator changes have occurred after the document was read using the API, the changes produced by this write request are applied against the collaborator changes. This results in a new revision of the document that incorporates both the collaborator changes and the changes in the request, with the Docs server resolving conflicting changes. When using target revision ID, the API client can be thought of as another collaborator of the document. The target revision ID can only be used to write to recent versions of a document. If the target revision is too far behind the latest revision, the request is not processed and returns a 400 bad request error. The request should be tried again after retrieving the latest version of the document. Usually a revision ID remains valid for use as a target revision for several minutes after it's read, but for frequently edited documents this window might be shorter.",
        type: "string",
      },
    },
    required: [],
  },
  DocsCreateFooterResponse: {
    description: "The result of creating a footer.",
    type: "object",
    properties: {
      footerId: {
        description: "The ID of the created footer.",
        type: "string",
      },
    },
    required: [],
  },
  DocsDropdownDefinition: {
    description: "A dropdown definition in the document.",
    type: "object",
    properties: {
      dropdownDefinitionProperties: {
        description: "The properties of this dropdown definition.",
        type: "ref",
        ref: "docs_DropdownDefinitionProperties",
      },
      dropdownDefinitionId: {
        description:
          "The ID of this dropdown definition. If you specify an ID, it must be unique among all IDs in the tab. The ID must start with `kix.` and match regex `^kix\\.[a-zA-Z0-9_-]{2,14}$` (length 6-18 chars). If you don't specify an ID, a unique one is generated.",
        type: "string",
      },
      suggestedDeletionId: {
        description: "ID for suggestion that deletes this dropdown definition.",
        type: "string",
      },
      suggestedInsertionId: {
        description: "ID for suggestion that inserts this dropdown definition.",
        type: "string",
      },
      suggestedDropdownDefinitionPropertiesChanges: {
        description: "Suggested property changes to this definition, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedDropdownDefinitionProperties",
        },
      },
    },
    required: [],
  },
  DocsSectionStyle: {
    description: "The styling that applies to a section.",
    type: "object",
    properties: {
      contentDirection: {
        description:
          "The content direction of this section. If unset, the value defaults to LEFT_TO_RIGHT. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "string",
        enum: ["CONTENT_DIRECTION_UNSPECIFIED", "LEFT_TO_RIGHT", "RIGHT_TO_LEFT"],
      },
      marginHeader: {
        description:
          "The header margin of the section. If unset, the value defaults to margin_header from DocumentStyle. If updated, use_custom_header_footer_margins is set to true on DocumentStyle. The value of use_custom_header_footer_margins on DocumentStyle indicates if a header margin is being respected for this section. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "ref",
        ref: "docs_Dimension",
      },
      marginLeft: {
        description:
          "The left page margin of the section. If unset, the value defaults to margin_left from DocumentStyle. Updating the left margin causes columns in this section to resize. Since the margin affects column width, it's applied before column properties. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "ref",
        ref: "docs_Dimension",
      },
      evenPageHeaderId: {
        description:
          "The ID of the header used only for even pages. If the value of DocumentStyle's use_even_page_header_footer is true, this value is used for the headers on even pages in the section. If it is false, the headers on even pages use the default_header_id. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's even_page_header_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      marginTop: {
        description:
          "The top page margin of the section. If unset, the value defaults to margin_top from DocumentStyle. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "ref",
        ref: "docs_Dimension",
      },
      firstPageHeaderId: {
        description:
          "The ID of the header used only for the first page of the section. If use_first_page_header_footer is true, this value is used for the header on the first page of the section. If it's false, the header on the first page of the section uses the default_header_id. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's first_page_header_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      firstPageFooterId: {
        description:
          "The ID of the footer used only for the first page of the section. If use_first_page_header_footer is true, this value is used for the footer on the first page of the section. If it's false, the footer on the first page of the section uses the default_footer_id. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's first_page_footer_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      defaultFooterId: {
        description:
          "The ID of the default footer. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's default_footer_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      marginFooter: {
        description:
          "The footer margin of the section. If unset, the value defaults to margin_footer from DocumentStyle. If updated, use_custom_header_footer_margins is set to true on DocumentStyle. The value of use_custom_header_footer_margins on DocumentStyle indicates if a footer margin is being respected for this section If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "ref",
        ref: "docs_Dimension",
      },
      pageNumberStart: {
        description:
          "The page number from which to start counting the number of pages for this section. If unset, page numbering continues from the previous section. If the value is unset in the first SectionBreak, refer to DocumentStyle's page_number_start. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "integer",
        format: "int32",
      },
      marginBottom: {
        description:
          "The bottom page margin of the section. If unset, the value defaults to margin_bottom from DocumentStyle. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "ref",
        ref: "docs_Dimension",
      },
      flipPageOrientation: {
        description:
          "Optional. Indicates whether to flip the dimensions of DocumentStyle's page_size for this section, which allows changing the page orientation between portrait and landscape. If unset, the value inherits from DocumentStyle's flip_page_orientation. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "boolean",
      },
      evenPageFooterId: {
        description:
          "The ID of the footer used only for even pages. If the value of DocumentStyle's use_even_page_header_footer is true, this value is used for the footers on even pages in the section. If it is false, the footers on even pages use the default_footer_id. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's even_page_footer_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
      marginRight: {
        description:
          "The right page margin of the section. If unset, the value defaults to margin_right from DocumentStyle. Updating the right margin causes columns in this section to resize. Since the margin affects column width, it's applied before column properties. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "ref",
        ref: "docs_Dimension",
      },
      columnSeparatorStyle: {
        description:
          "The style of column separators. This style can be set even when there's one column in the section. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "string",
        enum: ["COLUMN_SEPARATOR_STYLE_UNSPECIFIED", "NONE", "BETWEEN_EACH_COLUMN"],
      },
      columnProperties: {
        description:
          "The section's columns properties. If empty, the section contains one column with the default properties in the Docs editor. A section can be updated to have no more than 3 columns. When updating this property, setting a concrete value is required. Unsetting this property will result in a 400 bad request error.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_SectionColumnProperties",
        },
      },
      useFirstPageHeaderFooter: {
        description:
          "Indicates whether to use the first page header / footer IDs for the first page of the section. If unset, it inherits from DocumentStyle's use_first_page_header_footer for the first section. If the value is unset for subsequent sectors, it should be interpreted as false. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error.",
        type: "boolean",
      },
      sectionType: {
        description: "Output only. The type of section.",
        type: "string",
        enum: ["SECTION_TYPE_UNSPECIFIED", "CONTINUOUS", "NEXT_PAGE"],
      },
      defaultHeaderId: {
        description:
          "The ID of the default header. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's default_header_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only.",
        type: "string",
      },
    },
    required: [],
  },
  DocsBatchUpdateDocumentRequest: {
    description: "Request message for BatchUpdateDocument.",
    type: "object",
    properties: {
      requests: {
        description: "A list of updates to apply to the document.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_Request",
        },
      },
      writeControl: {
        description: "Provides control over how write requests are executed.",
        type: "ref",
        ref: "docs_WriteControl",
      },
    },
    required: [],
  },
  DocsEmbeddedObjectSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base EmbeddedObject have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      linkedContentReferenceSuggestionState: {
        description:
          "A mask that indicates which of the fields in linked_content_reference have been changed in this suggestion.",
        type: "ref",
        ref: "docs_LinkedContentReferenceSuggestionState",
      },
      sizeSuggestionState: {
        description: "A mask that indicates which of the fields in size have been changed in this suggestion.",
        type: "ref",
        ref: "docs_SizeSuggestionState",
      },
      titleSuggested: {
        description: "Indicates if there was a suggested change to title.",
        type: "boolean",
      },
      marginLeftSuggested: {
        description: "Indicates if there was a suggested change to margin_left.",
        type: "boolean",
      },
      marginBottomSuggested: {
        description: "Indicates if there was a suggested change to margin_bottom.",
        type: "boolean",
      },
      descriptionSuggested: {
        description: "Indicates if there was a suggested change to description.",
        type: "boolean",
      },
      embeddedObjectBorderSuggestionState: {
        description:
          "A mask that indicates which of the fields in embedded_object_border have been changed in this suggestion.",
        type: "ref",
        ref: "docs_EmbeddedObjectBorderSuggestionState",
      },
      marginTopSuggested: {
        description: "Indicates if there was a suggested change to margin_top.",
        type: "boolean",
      },
      marginRightSuggested: {
        description: "Indicates if there was a suggested change to margin_right.",
        type: "boolean",
      },
      imagePropertiesSuggestionState: {
        description:
          "A mask that indicates which of the fields in image_properties have been changed in this suggestion.",
        type: "ref",
        ref: "docs_ImagePropertiesSuggestionState",
      },
      embeddedDrawingPropertiesSuggestionState: {
        description:
          "A mask that indicates which of the fields in embedded_drawing_properties have been changed in this suggestion.",
        type: "ref",
        ref: "docs_EmbeddedDrawingPropertiesSuggestionState",
      },
    },
    required: [],
  },
  DocsTextRun: {
    description: "A ParagraphElement that represents a run of text that all has the same styling.",
    type: "object",
    properties: {
      textStyle: {
        description: "The text style of this run.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A TextRun may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      content: {
        description:
          "The text of this run. Any non-text elements in the run are replaced with the Unicode character U+E907.",
        type: "string",
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this run, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
    },
    required: [],
  },
  DocsTabStop: {
    description: "A tab stop within a paragraph.",
    type: "object",
    properties: {
      alignment: {
        description: "The alignment of this tab stop. If unset, the value defaults to START.",
        type: "string",
        enum: ["TAB_STOP_ALIGNMENT_UNSPECIFIED", "START", "CENTER", "END"],
      },
      offset: {
        description: "The offset between this tab stop and the start margin.",
        type: "ref",
        ref: "docs_Dimension",
      },
    },
    required: [],
  },
  DocsDateElementProperties: {
    description: "Properties of a DateElement.",
    type: "object",
    properties: {
      displayText: {
        description: "Output only. Indicates how the DateElement is displayed in the document.",
        type: "string",
      },
      timeFormat: {
        description:
          "Determines how the time part of the DateElement will be displayed in the document. If unset, the default value is TIME_FORMAT_DISABLED, indicating no time should be shown.",
        type: "string",
        enum: [
          "TIME_FORMAT_UNSPECIFIED",
          "TIME_FORMAT_DISABLED",
          "TIME_FORMAT_HOUR_MINUTE",
          "TIME_FORMAT_HOUR_MINUTE_TIMEZONE",
        ],
      },
      timestamp: {
        description:
          "The point in time to represent, in seconds and nanoseconds since Unix epoch: January 1, 1970 at midnight UTC. Timestamp is expected to be in UTC. If time_zone_id is set, the timestamp is adjusted according to the time zone. For example, a timestamp of `18000` with a date format of `DATE_FORMAT_ISO8601` and time format of `TIME_FORMAT_HOUR_MINUTE` would be displayed as `1970-01-01 5:00 AM`. A timestamp of `18000` with date format of `DATE_FORMAT_ISO8601`, time format of `TIME_FORMAT_HOUR_MINUTE`, and time zone set to `America/New_York` will instead be `1970-01-01 12:00 AM`.",
        type: "string",
      },
      locale: {
        description:
          "The language code of the DateElement. For example, `en`. If unset, the default locale is `en`. Limited to the following locales: `af`, `am`, `ar`, `as`, `az`, `be`, `bg`, `bn`, `ca`, `cs`, `da`, `de`, `el`, `en`, `en-CA`, `en-GB`, `es`, `es-419`, `et`, `eu`, `fa`, `fi`, `fil`, `fr`, `fr-CA`, `gl`, `gu`, `hi`, `hr`, `hu`, `hy`, `id`, `is`, `it`, `iw`, `ja`, `ka`, `kk`, `km`, `kn`, `ko`, `lo`, `lt`, `lv`, `mk`, `ml`, `mn`, `mr`, `ms`, `ne`, `nl`, `no`, `or`, `pa`, `pl`, `pt-BR`, `pt-PT`, `ro`, `ru`, `si`, `sk`, `sl`, `sq`, `sr`, `sv`, `sw`, `ta`, `te`, `th`, `tr`, `uk`, `ur`, `uz`, `vi`, `zh-CN`, `zh-HK`, `zh-TW`, `zu`, `cy`, `my`.",
        type: "string",
      },
      timeZoneId: {
        description:
          "The time zone of the DateElement, as defined by the Unicode Common Locale Data Repository (CLDR) project. For example, `America/New_York`. If unset, the default time zone is `etc/UTC`.",
        type: "string",
      },
      dateFormat: {
        description:
          "Determines how the date part of the DateElement will be displayed in the document. If unset, the default value is DATE_FORMAT_MONTH_DAY_YEAR_ABBREVIATED, indicating the DateElement will be formatted as `MMM d, y` in `en`, or locale specific equivalent.",
        type: "string",
        enum: [
          "DATE_FORMAT_UNSPECIFIED",
          "DATE_FORMAT_CUSTOM",
          "DATE_FORMAT_MONTH_DAY_ABBREVIATED",
          "DATE_FORMAT_MONTH_DAY_FULL",
          "DATE_FORMAT_MONTH_DAY_YEAR_ABBREVIATED",
          "DATE_FORMAT_ISO8601",
        ],
      },
    },
    required: [],
  },
  DocsParagraphStyleSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base ParagraphStyle have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      indentStartSuggested: {
        description: "Indicates if there was a suggested change to indent_start.",
        type: "boolean",
      },
      borderBottomSuggested: {
        description: "Indicates if there was a suggested change to border_bottom.",
        type: "boolean",
      },
      spacingModeSuggested: {
        description: "Indicates if there was a suggested change to spacing_mode.",
        type: "boolean",
      },
      headingIdSuggested: {
        description: "Indicates if there was a suggested change to heading_id.",
        type: "boolean",
      },
      spaceBelowSuggested: {
        description: "Indicates if there was a suggested change to space_below.",
        type: "boolean",
      },
      shadingSuggestionState: {
        description: "A mask that indicates which of the fields in shading have been changed in this suggestion.",
        type: "ref",
        ref: "docs_ShadingSuggestionState",
      },
      directionSuggested: {
        description: "Indicates if there was a suggested change to direction.",
        type: "boolean",
      },
      pageBreakBeforeSuggested: {
        description: "Indicates if there was a suggested change to page_break_before.",
        type: "boolean",
      },
      avoidWidowAndOrphanSuggested: {
        description: "Indicates if there was a suggested change to avoid_widow_and_orphan.",
        type: "boolean",
      },
      keepLinesTogetherSuggested: {
        description: "Indicates if there was a suggested change to keep_lines_together.",
        type: "boolean",
      },
      namedStyleTypeSuggested: {
        description: "Indicates if there was a suggested change to named_style_type.",
        type: "boolean",
      },
      lineSpacingSuggested: {
        description: "Indicates if there was a suggested change to line_spacing.",
        type: "boolean",
      },
      borderRightSuggested: {
        description: "Indicates if there was a suggested change to border_right.",
        type: "boolean",
      },
      spaceAboveSuggested: {
        description: "Indicates if there was a suggested change to space_above.",
        type: "boolean",
      },
      alignmentSuggested: {
        description: "Indicates if there was a suggested change to alignment.",
        type: "boolean",
      },
      borderTopSuggested: {
        description: "Indicates if there was a suggested change to border_top.",
        type: "boolean",
      },
      borderBetweenSuggested: {
        description: "Indicates if there was a suggested change to border_between.",
        type: "boolean",
      },
      borderLeftSuggested: {
        description: "Indicates if there was a suggested change to border_left.",
        type: "boolean",
      },
      indentEndSuggested: {
        description: "Indicates if there was a suggested change to indent_end.",
        type: "boolean",
      },
      indentFirstLineSuggested: {
        description: "Indicates if there was a suggested change to indent_first_line.",
        type: "boolean",
      },
      keepWithNextSuggested: {
        description: "Indicates if there was a suggested change to keep_with_next.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsPersonProperties: {
    description: "Properties specific to a linked Person.",
    type: "object",
    properties: {
      name: {
        description: "The name of the person if it's displayed in the link text instead of the person's email address.",
        type: "string",
      },
      email: {
        description: "The email address linked to this Person. This field is always present.",
        type: "string",
      },
    },
    required: [],
  },
  DocsSuggestedTableRowStyle: {
    description: "A suggested change to a TableRowStyle.",
    type: "object",
    properties: {
      tableRowStyle: {
        description:
          "A TableRowStyle that only includes the changes made in this suggestion. This can be used along with the table_row_style_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_TableRowStyle",
      },
      tableRowStyleSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base TableRowStyle have been changed in this suggestion.",
        type: "ref",
        ref: "docs_TableRowStyleSuggestionState",
      },
    },
    required: [],
  },
  DocsUnmergeTableCellsRequest: {
    description: "Unmerges cells in a Table.",
    type: "object",
    properties: {
      tableRange: {
        description:
          'The table range specifying which cells of the table to unmerge. All merged cells in this range will be unmerged, and cells that are already unmerged will not be affected. If the range has no merged cells, the request will do nothing. If there is text in any of the merged cells, the text will remain in the "head" cell of the resulting block of unmerged cells. The "head" cell is the upper-left cell when the content direction is from left to right, and the upper-right otherwise.',
        type: "ref",
        ref: "docs_TableRange",
      },
    },
    required: [],
  },
  DocsCommentThread: {
    description: "Represents a single comment thread.",
    type: "object",
    properties: {
      commentId: {
        description: "The unique ID of the comment thread.",
        type: "string",
      },
      plainTextQuote: {
        description: "The quoted text from the document when the comment was created, formatted as plain-text.",
        type: "string",
      },
      replies: {
        description: "Replies to the head post.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_Post",
        },
      },
      anchorId: {
        description:
          "The ID of the CommentAnchor in the document that this thread is tied to. Multiple comment threads may be anchored to the same CommentAnchor.",
        type: "string",
      },
      headPost: {
        description: "The first post in the thread.",
        type: "ref",
        ref: "docs_Post",
      },
      status: {
        description: "Whether the thread is open or resolved.",
        type: "string",
        enum: ["STATUS_UNSPECIFIED", "OPEN", "RESOLVED"],
      },
    },
    required: [],
  },
  DocsImageProperties: {
    description: "The properties of an image.",
    type: "object",
    properties: {
      brightness: {
        description:
          "The brightness effect of the image. The value should be in the interval [-1.0, 1.0], where 0 means no effect.",
        type: "number",
      },
      angle: {
        description: "The clockwise rotation angle of the image, in radians.",
        type: "number",
      },
      sourceUri: {
        description: "The source URI is the URI used to insert the image. The source URI can be empty.",
        type: "string",
      },
      contentUri: {
        description:
          "A URI to the image with a default lifetime of 30 minutes. This URI is tagged with the account of the requester. Anyone with the URI effectively accesses the image as the original requester. Access to the image may be lost if the document's sharing settings change.",
        type: "string",
      },
      contrast: {
        description:
          "The contrast effect of the image. The value should be in the interval [-1.0, 1.0], where 0 means no effect.",
        type: "number",
      },
      transparency: {
        description:
          "The transparency effect of the image. The value should be in the interval [0.0, 1.0], where 0 means no effect and 1 means transparent.",
        type: "number",
      },
      cropProperties: {
        description: "The crop properties of the image.",
        type: "ref",
        ref: "docs_CropProperties",
      },
    },
    required: [],
  },
  DocsCommentAnchor: {
    description:
      "One or more locations in the document that are tied to CommentThreads with the same anchorId. Note: Multiple anchors may refer to the same location.",
    type: "object",
    properties: {
      anchorId: {
        description: "The ID of the comment anchor.",
        type: "string",
      },
      ranges: {
        description: "A collection of Ranges in the document which are tied to this anchor.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_Range",
        },
      },
    },
    required: [],
  },
  DocsDeleteNamedRangeRequest: {
    description: "Deletes a NamedRange.",
    type: "object",
    properties: {
      tabsCriteria: {
        description:
          "Optional. The criteria used to specify which tab(s) the range deletion should occur in. When omitted, the range deletion is applied to all tabs. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the range deletion applies to the singular tab. In a document containing multiple tabs: - If provided, the range deletion applies to the specified tabs. - If not provided, the range deletion applies to all tabs.",
        type: "ref",
        ref: "docs_TabsCriteria",
      },
      name: {
        description: "The name of the range(s) to delete. All named ranges with the given name will be deleted.",
        type: "string",
      },
      namedRangeId: {
        description: "The ID of the named range to delete.",
        type: "string",
      },
    },
    required: [],
  },
  DocsEmbeddedDrawingPropertiesSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base EmbeddedDrawingProperties have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {},
    required: [],
  },
  DocsTableColumnProperties: {
    description: "The properties of a column in a table.",
    type: "object",
    properties: {
      widthType: {
        description: "The width type of the column.",
        type: "string",
        enum: ["WIDTH_TYPE_UNSPECIFIED", "EVENLY_DISTRIBUTED", "FIXED_WIDTH"],
      },
      width: {
        description: "The width of the column. Set when the column's `width_type` is FIXED_WIDTH.",
        type: "ref",
        ref: "docs_Dimension",
      },
    },
    required: [],
  },
  DocsDocument: {
    description: "A Google Docs document.",
    type: "object",
    properties: {
      inlineObjects: {
        description:
          "Output only. The inline objects in the document, keyed by object ID. Legacy field: Instead, use Document.tabs.documentTab.inlineObjects, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_InlineObject",
        },
      },
      tabs: {
        description:
          "Output only. Tabs that are part of a document. Tabs can contain child tabs, a tab nested within another tab. Child tabs are represented by the Tab.childTabs field.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_Tab",
        },
      },
      footers: {
        description:
          "Output only. The footers in the document, keyed by footer ID. Legacy field: Instead, use Document.tabs.documentTab.footers, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_Footer",
        },
      },
      suggestions: {
        description:
          "Output only. The suggestions associated with the document. Only populated if the commentsViewMode parameter is set to require comments (such as `COMMENTS_VIEW_MODE_INCLUDED`).",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_SuggestionThread",
        },
      },
      documentId: {
        description: "Output only. The ID of the document.",
        type: "string",
      },
      namedStyles: {
        description:
          "Output only. The named styles of the document. Legacy field: Instead, use Document.tabs.documentTab.namedStyles, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "ref",
        ref: "docs_NamedStyles",
      },
      documentStyle: {
        description:
          "Output only. The style of the document. Legacy field: Instead, use Document.tabs.documentTab.documentStyle, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "ref",
        ref: "docs_DocumentStyle",
      },
      suggestedDocumentStyleChanges: {
        description:
          "Output only. The suggested changes to the style of the document, keyed by suggestion ID. Legacy field: Instead, use Document.tabs.documentTab.suggestedDocumentStyleChanges, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedDocumentStyle",
        },
      },
      title: {
        description: "The title of the document.",
        type: "string",
      },
      headers: {
        description:
          "Output only. The headers in the document, keyed by header ID. Legacy field: Instead, use Document.tabs.documentTab.headers, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_Header",
        },
      },
      commentsViewMode: {
        description: "Output only. The comments view mode applied to the document.",
        type: "string",
        enum: [
          "COMMENTS_VIEW_MODE_UNSPECIFIED",
          "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS",
          "COMMENTS_VIEW_MODE_OMITTED",
          "COMMENTS_VIEW_MODE_INCLUDED",
        ],
      },
      positionedObjects: {
        description:
          "Output only. The positioned objects in the document, keyed by object ID. Legacy field: Instead, use Document.tabs.documentTab.positionedObjects, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_PositionedObject",
        },
      },
      suggestionsViewMode: {
        description:
          "Output only. The suggestions view mode applied to the document. Note: When editing a document, changes must be based on a document with SUGGESTIONS_INLINE.",
        type: "string",
        enum: [
          "DEFAULT_FOR_CURRENT_ACCESS",
          "SUGGESTIONS_INLINE",
          "PREVIEW_SUGGESTIONS_ACCEPTED",
          "PREVIEW_WITHOUT_SUGGESTIONS",
        ],
      },
      revisionId: {
        description:
          "Output only. The revision ID of the document. Can be used in update requests to specify which revision of a document to apply updates to and how the request should behave if the document has been edited since that revision. Only populated if the user has edit access to the document. The revision ID is not a sequential number but an opaque string. The format of the revision ID might change over time. A returned revision ID is only guaranteed to be valid for 24 hours after it has been returned and cannot be shared across users. If the revision ID is unchanged between calls, then the document has not changed. Conversely, a changed ID (for the same document and user) usually means the document has been updated. However, a changed ID can also be due to internal factors such as ID format changes.",
        type: "string",
      },
      footnotes: {
        description:
          "Output only. The footnotes in the document, keyed by footnote ID. Legacy field: Instead, use Document.tabs.documentTab.footnotes, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_Footnote",
        },
      },
      suggestedNamedStylesChanges: {
        description:
          "Output only. The suggested changes to the named styles of the document, keyed by suggestion ID. Legacy field: Instead, use Document.tabs.documentTab.suggestedNamedStylesChanges, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedNamedStyles",
        },
      },
      lists: {
        description:
          "Output only. The lists in the document, keyed by list ID. Legacy field: Instead, use Document.tabs.documentTab.lists, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_List",
        },
      },
      namedRanges: {
        description:
          "Output only. The named ranges in the document, keyed by name. Legacy field: Instead, use Document.tabs.documentTab.namedRanges, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_NamedRanges",
        },
      },
      body: {
        description:
          "Output only. The main body of the document. Legacy field: Instead, use Document.tabs.documentTab.body, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document.",
        type: "ref",
        ref: "docs_Body",
      },
      comments: {
        description:
          "Output only. The comments associated with the document. Only populated if the commentsViewMode parameter is set to require comments (such as `COMMENTS_VIEW_MODE_INCLUDED`).",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_CommentThread",
        },
      },
    },
    required: [],
  },
  DocsInlineObjectProperties: {
    description: "Properties of an InlineObject.",
    type: "object",
    properties: {
      embeddedObject: {
        description: "The embedded object of this inline object.",
        type: "ref",
        ref: "docs_EmbeddedObject",
      },
    },
    required: [],
  },
  DocsTabsCriteria: {
    description: "A criteria that specifies in which tabs a request executes.",
    type: "object",
    properties: {
      tabIds: {
        description: "The list of tab IDs in which the request executes.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsCropPropertiesSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base CropProperties have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      offsetRightSuggested: {
        description: "Indicates if there was a suggested change to offset_right.",
        type: "boolean",
      },
      offsetBottomSuggested: {
        description: "Indicates if there was a suggested change to offset_bottom.",
        type: "boolean",
      },
      angleSuggested: {
        description: "Indicates if there was a suggested change to angle.",
        type: "boolean",
      },
      offsetLeftSuggested: {
        description: "Indicates if there was a suggested change to offset_left.",
        type: "boolean",
      },
      offsetTopSuggested: {
        description: "Indicates if there was a suggested change to offset_top.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsDropdownDefinitionPropertiesSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base DropdownDefinitionProperties have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      optionsSuggested: {
        description: "Indicates if there was a suggested change to options.",
        type: "boolean",
      },
      titleSuggested: {
        description: "Indicates if there was a suggested change to title.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsBatchUpdateDocumentResponse: {
    description: "Response message from a BatchUpdateDocument request.",
    type: "object",
    properties: {
      replies: {
        description:
          "The reply of the updates. This maps 1:1 with the updates, although replies to some requests may be empty.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_Response",
        },
      },
      commentUpdateState: {
        description: "Whether comment updates were applied in the batch request.",
        type: "string",
        enum: ["COMMENT_UPDATE_STATE_UNSPECIFIED", "NO_UPDATES_REQUESTED", "ALL_SAVED", "ALL_FAILED_UNKNOWN_REASON"],
      },
      documentId: {
        description: "The ID of the document to which the updates were applied to.",
        type: "string",
      },
      suggestionResponses: {
        description: "The suggestions which were affected by each update. This maps 1:1 with the updates.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_SuggestionResponse",
        },
      },
      writeControl: {
        description: "The updated write control after applying the request.",
        type: "ref",
        ref: "docs_WriteControl",
      },
    },
    required: [],
  },
  DocsDeleteTableColumnRequest: {
    description: "Deletes a column from a table.",
    type: "object",
    properties: {
      tableCellLocation: {
        description:
          "The reference table cell location from which the column will be deleted. The column this cell spans will be deleted. If this is a merged cell that spans multiple columns, all columns that the cell spans will be deleted. If no columns remain in the table after this deletion, the whole table is deleted.",
        type: "ref",
        ref: "docs_TableCellLocation",
      },
    },
    required: [],
  },
  DocsFootnote: {
    description: "A document footnote.",
    type: "object",
    properties: {
      content: {
        description: "The contents of the footnote. The indexes for a footnote's content begin at zero.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_StructuralElement",
        },
      },
      footnoteId: {
        description: "The ID of the footnote.",
        type: "string",
      },
    },
    required: [],
  },
  DocsLinkedContentReferenceSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base LinkedContentReference have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      sheetsChartReferenceSuggestionState: {
        description:
          "A mask that indicates which of the fields in sheets_chart_reference have been changed in this suggestion.",
        type: "ref",
        ref: "docs_SheetsChartReferenceSuggestionState",
      },
    },
    required: [],
  },
  DocsUpdateCommentPostRequest: {
    description:
      "Updates a Post in a CommentThread or SuggestionThread. Returns a 400 bad request error if: - The post is the headPost of a SuggestionThread. - The requesting user is not the author of the post.",
    type: "object",
    properties: {
      postId: {
        description: "The ID of the post being updated.",
        type: "string",
      },
      content: {
        description:
          "The new text of the comment, as plain text. This text content will be handled similarly to comments created in the Docs editor. It will have similar behaviors for formatting, notifications, etc. This field cannot be empty, and must not exceed 2048 UTF-8 code units.",
        type: "string",
      },
      commentId: {
        description: "The ID of the CommentThread which the post belongs to.",
        type: "string",
      },
      suggestionId: {
        description: "The ID of the SuggestionThread which the post belongs to.",
        type: "string",
      },
    },
    required: [],
  },
  DocsSuggestedTableCellStyle: {
    description: "A suggested change to a TableCellStyle.",
    type: "object",
    properties: {
      tableCellStyleSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base TableCellStyle have been changed in this suggestion.",
        type: "ref",
        ref: "docs_TableCellStyleSuggestionState",
      },
      tableCellStyle: {
        description:
          "A TableCellStyle that only includes the changes made in this suggestion. This can be used along with the table_cell_style_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_TableCellStyle",
      },
    },
    required: [],
  },
  DocsColumnBreak: {
    description:
      "A ParagraphElement representing a column break. A column break makes the subsequent text start at the top of the next column.",
    type: "object",
    properties: {
      textStyle: {
        description:
          "The text style of this ColumnBreak. Similar to text content, like text runs and footnote references, the text style of a column break can affect content layout as well as the styling of text inserted next to it.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A ColumnBreak may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this ColumnBreak, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
    },
    required: [],
  },
  DocsWeightedFontFamily: {
    description: "Represents a font family and weight of text.",
    type: "object",
    properties: {
      weight: {
        description:
          "The weight of the font. This field can have any value that's a multiple of `100` between `100` and `900`, inclusive. This range corresponds to the numerical values described in the CSS 2.1 Specification, [section 15.6](https://www.w3.org/TR/CSS21/fonts.html#font-boldness), with non-numerical values disallowed. The default value is `400` (\"normal\"). The font weight makes up just one component of the rendered font weight. A combination of the `weight` and the text style's resolved `bold` value determine the rendered weight, after accounting for inheritance: * If the text is bold and the weight is less than `400`, the rendered weight is 400. * If the text is bold and the weight is greater than or equal to `400` but is less than `700`, the rendered weight is `700`. * If the weight is greater than or equal to `700`, the rendered weight is equal to the weight. * If the text is not bold, the rendered weight is equal to the weight.",
        type: "integer",
        format: "int32",
      },
      fontFamily: {
        description:
          "The font family of the text. The font family can be any font from the Font menu in Docs or from [Google Fonts] (https://fonts.google.com/). If the font name is unrecognized, the text is rendered in `Arial`.",
        type: "string",
      },
    },
    required: [],
  },
  DocsPostAuthor: {
    description: "Represents a user who authored a comment or suggestion post.",
    type: "object",
    properties: {
      displayName: {
        description: "The display name of the user. May be absent if the author is anonymous.",
        type: "string",
      },
      anonymous: {
        description: "Whether the user is anonymous.",
        type: "boolean",
      },
      user: {
        description:
          "The resource name of the post author user, which can also be used to identify the user in the [Google People API](https://developers.google.com/people/api/rest/v1/people). Format: `users/{user}`. Will not be populated if the anonymous field is `true` or if the post is from an imported document.",
        type: "string",
      },
      me: {
        description: "Whether the user is the authenticated user making the request.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsDocumentTab: {
    description: "A tab with document contents.",
    type: "object",
    properties: {
      body: {
        description: "The main body of the document tab.",
        type: "ref",
        ref: "docs_Body",
      },
      suggestedNamedStylesChanges: {
        description: "The suggested changes to the named styles of the document tab, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedNamedStyles",
        },
      },
      namedRanges: {
        description: "The named ranges in the document tab, keyed by name.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_NamedRanges",
        },
      },
      positionedObjects: {
        description: "The positioned objects in the document tab, keyed by object ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_PositionedObject",
        },
      },
      suggestedDocumentStyleChanges: {
        description: "The suggested changes to the style of the document tab, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedDocumentStyle",
        },
      },
      documentStyle: {
        description: "The style of the document tab.",
        type: "ref",
        ref: "docs_DocumentStyle",
      },
      headers: {
        description: "The headers in the document tab, keyed by header ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_Header",
        },
      },
      inlineObjects: {
        description: "The inline objects in the document tab, keyed by object ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_InlineObject",
        },
      },
      namedStyles: {
        description: "The named styles of the document tab.",
        type: "ref",
        ref: "docs_NamedStyles",
      },
      lists: {
        description: "The lists in the document tab, keyed by list ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_List",
        },
      },
      footnotes: {
        description: "The footnotes in the document tab, keyed by footnote ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_Footnote",
        },
      },
      footers: {
        description: "The footers in the document tab, keyed by footer ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_Footer",
        },
      },
      commentAnchors: {
        description:
          "The comment anchors in a document tab, keyed by anchor ID. Only populated if the commentsViewMode parameter is set to require comments (such as `COMMENTS_VIEW_MODE_INCLUDED`).",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_CommentAnchor",
        },
      },
      dropdownDefinitions: {
        description: "The dropdown definitions in a document tab, keyed by dropdown definition ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_DropdownDefinition",
        },
      },
    },
    required: [],
  },
  DocsInsertCommentRequest: {
    description: "Inserts a CommentThread into the document.",
    type: "object",
    properties: {
      range: {
        description: "The Range in the document that is tied to this comment.",
        type: "ref",
        ref: "docs_Range",
      },
      assigneeEmailAddress: {
        description:
          "Optional. The email address of the assignee of the comment. Leave empty for a non-assigned comment. May not exceed 2048 UTF-8 code units.",
        type: "string",
      },
      content: {
        description:
          "The text of the comment, as plain text. This text content will be handled similarly to comments created in the Docs editor. It will have similar behaviors for formatting, notifications, etc. This field cannot be empty, and must not exceed 2048 UTF-8 code units.",
        type: "string",
      },
    },
    required: [],
  },
  DocsSuggestedParagraphStyle: {
    description: "A suggested change to a ParagraphStyle.",
    type: "object",
    properties: {
      paragraphStyle: {
        description:
          "A ParagraphStyle that only includes the changes made in this suggestion. This can be used along with the paragraph_style_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_ParagraphStyle",
      },
      paragraphStyleSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base ParagraphStyle have been changed in this suggestion.",
        type: "ref",
        ref: "docs_ParagraphStyleSuggestionState",
      },
    },
    required: [],
  },
  DocsDeleteCommentRequest: {
    description:
      "Deletes a CommentThread. Returns a 400 bad request error if the requesting user is not the author of the headPost.",
    type: "object",
    properties: {
      commentId: {
        description: "The ID of the CommentThread that is being deleted.",
        type: "string",
      },
    },
    required: [],
  },
  DocsTableStyle: {
    description: "Styles that apply to a table.",
    type: "object",
    properties: {
      tableColumnProperties: {
        description:
          "The properties of each column. Note that in Docs, tables contain rows and rows contain cells, similar to HTML. So the properties for a row can be found on the row's table_row_style.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_TableColumnProperties",
        },
      },
    },
    required: [],
  },
  DocsUpdateDropdownDefinitionPropertiesRequest: {
    description: "Updates the properties of a DropdownDefinition.",
    type: "object",
    properties: {
      dropdownDefinitionId: {
        description: "The ID of the DropdownDefinition to update.",
        type: "string",
      },
      tabId: {
        description:
          "The ID of the tab that contains the dropdown definition to update. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
      selectedOptionIdReplacements: {
        description:
          'A map of option IDs to their replacements, used to automatically reassign orphaned Dropdown chips when an option is deleted. The keys are the IDs of the options being deleted, and the values are the IDs of their replacement options. If an option being deleted is selected in one or more Dropdown chips in the document, a replacement entry for that option must be provided in this map, and the replacement option ID must exist in the updated DropdownDefinition. If a replacement is required but not provided, a 400 bad request error is returned. Options being deleted that are not selected in any Dropdown chips do not require a replacement. For example, if option A is being replaced by option B, the map should be `{"A": "B"}`.',
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "string",
        },
      },
      dropdownDefinitionProperties: {
        description: "The properties to update.",
        type: "ref",
        ref: "docs_DropdownDefinitionProperties",
      },
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `dropdown_definition_properties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. When `dropdown_definition_properties.options` is included in the field mask, the full, complete list of desired options must be provided in `dropdown_definition_properties.options`.',
        type: "string",
      },
    },
    required: [],
  },
  DocsCreateDropdownDefinitionResponse: {
    description: "Response message for creating a dropdown definition.",
    type: "object",
    properties: {
      dropdownDefinition: {
        description: "The newly-created DropdownDefinition.",
        type: "ref",
        ref: "docs_DropdownDefinition",
      },
    },
    required: [],
  },
  DocsDeleteTabRequest: {
    description: "Deletes a tab. If the tab has child tabs, they are deleted as well.",
    type: "object",
    properties: {
      tabId: {
        description: "The ID of the tab to delete.",
        type: "string",
      },
    },
    required: [],
  },
  DocsPositionedObjectPropertiesSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base PositionedObjectProperties have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      positioningSuggestionState: {
        description: "A mask that indicates which of the fields in positioning have been changed in this suggestion.",
        type: "ref",
        ref: "docs_PositionedObjectPositioningSuggestionState",
      },
      embeddedObjectSuggestionState: {
        description:
          "A mask that indicates which of the fields in embedded_object have been changed in this suggestion.",
        type: "ref",
        ref: "docs_EmbeddedObjectSuggestionState",
      },
    },
    required: [],
  },
  DocsTableCellStyleSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base TableCellStyle have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      contentAlignmentSuggested: {
        description: "Indicates if there was a suggested change to content_alignment.",
        type: "boolean",
      },
      columnSpanSuggested: {
        description: "Indicates if there was a suggested change to column_span.",
        type: "boolean",
      },
      borderLeftSuggested: {
        description: "Indicates if there was a suggested change to border_left.",
        type: "boolean",
      },
      paddingTopSuggested: {
        description: "Indicates if there was a suggested change to padding_top.",
        type: "boolean",
      },
      paddingBottomSuggested: {
        description: "Indicates if there was a suggested change to padding_bottom.",
        type: "boolean",
      },
      borderBottomSuggested: {
        description: "Indicates if there was a suggested change to border_bottom.",
        type: "boolean",
      },
      paddingRightSuggested: {
        description: "Indicates if there was a suggested change to padding_right.",
        type: "boolean",
      },
      paddingLeftSuggested: {
        description: "Indicates if there was a suggested change to padding_left.",
        type: "boolean",
      },
      rowSpanSuggested: {
        description: "Indicates if there was a suggested change to row_span.",
        type: "boolean",
      },
      borderTopSuggested: {
        description: "Indicates if there was a suggested change to border_top.",
        type: "boolean",
      },
      backgroundColorSuggested: {
        description: "Indicates if there was a suggested change to background_color.",
        type: "boolean",
      },
      borderRightSuggested: {
        description: "Indicates if there was a suggested change to border_right.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsPositionedObjectPositioning: {
    description:
      "The positioning of a PositionedObject. The positioned object is positioned relative to the beginning of the Paragraph it's tethered to.",
    type: "object",
    properties: {
      leftOffset: {
        description:
          "The offset of the left edge of the positioned object relative to the beginning of the Paragraph it's tethered to. The exact positioning of the object can depend on other content in the document and the document's styling.",
        type: "ref",
        ref: "docs_Dimension",
      },
      layout: {
        description: "The layout of this positioned object.",
        type: "string",
        enum: [
          "POSITIONED_OBJECT_LAYOUT_UNSPECIFIED",
          "WRAP_TEXT",
          "BREAK_LEFT",
          "BREAK_RIGHT",
          "BREAK_LEFT_RIGHT",
          "IN_FRONT_OF_TEXT",
          "BEHIND_TEXT",
        ],
      },
      topOffset: {
        description:
          "The offset of the top edge of the positioned object relative to the beginning of the Paragraph it's tethered to. The exact positioning of the object can depend on other content in the document and the document's styling.",
        type: "ref",
        ref: "docs_Dimension",
      },
    },
    required: [],
  },
  DocsAddDocumentTabRequest: {
    description:
      "Adds a document tab. When a tab is added at a given index, all subsequent tabs' indexes are incremented.",
    type: "object",
    properties: {
      tabProperties: {
        description: "The properties of the tab to add. All properties are optional.",
        type: "ref",
        ref: "docs_TabProperties",
      },
    },
    required: [],
  },
  DocsEquation: {
    description: "A ParagraphElement representing an equation.",
    type: "object",
    properties: {
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. An Equation may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsTableRowStyle: {
    description: "Styles that apply to a table row.",
    type: "object",
    properties: {
      tableHeader: {
        description: "Whether the row is a table header.",
        type: "boolean",
      },
      minRowHeight: {
        description:
          "The minimum height of the row. The row will be rendered in the Docs editor at a height equal to or greater than this value in order to show all the content in the row's cells.",
        type: "ref",
        ref: "docs_Dimension",
      },
      preventOverflow: {
        description: "Whether the row cannot overflow across page or column boundaries.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsDocumentFormat: {
    description: "Represents document-level format settings.",
    type: "object",
    properties: {
      documentMode: {
        description: "Whether the document has pages or is pageless.",
        type: "string",
        enum: ["DOCUMENT_MODE_UNSPECIFIED", "PAGES", "PAGELESS"],
      },
    },
    required: [],
  },
  DocsRange: {
    description: "Specifies a contiguous range of text.",
    type: "object",
    properties: {
      segmentId: {
        description:
          "The ID of the header, footer, or footnote that this range is contained in. An empty segment ID signifies the document's body.",
        type: "string",
      },
      endIndex: {
        description:
          "The zero-based end index of this range, exclusive, in UTF-16 code units. In all current uses, an end index must be provided. This field is an Int32Value in order to accommodate future use cases with open-ended ranges.",
        type: "integer",
        format: "int32",
      },
      tabId: {
        description:
          "The tab that contains this range. When omitted, the request applies to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
      startIndex: {
        description:
          "The zero-based start index of this range, in UTF-16 code units. In all current uses, a start index must be provided. This field is an Int32Value in order to accommodate future use cases with open-ended ranges.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DocsDateElement: {
    description: "A date instance mentioned in a document.",
    type: "object",
    properties: {
      textStyle: {
        description: "The text style of this DateElement.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      suggestedDeletionIds: {
        description:
          "IDs for suggestions that remove this date from the document. A DateElement might have multiple deletion IDs if, for example, multiple users suggest deleting it. If empty, then this date isn't suggested for deletion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedDateElementPropertiesChanges: {
        description: "The suggested changes to the date element properties, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedDateElementProperties",
        },
      },
      suggestedInsertionIds: {
        description:
          "IDs for suggestions that insert this date into the document. A DateElement might have multiple insertion IDs if it's a nested suggested change (a suggestion within a suggestion made by a different user, for example). If empty, then this date isn't a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      dateElementProperties: {
        description: "The properties of this DateElement.",
        type: "ref",
        ref: "docs_DateElementProperties",
      },
      dateId: {
        description: "Output only. The unique ID of this date.",
        type: "string",
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this DateElement, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
    },
    required: [],
  },
  DocsSuggestedListProperties: {
    description: "A suggested change to ListProperties.",
    type: "object",
    properties: {
      listProperties: {
        description:
          "A ListProperties that only includes the changes made in this suggestion. This can be used along with the list_properties_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_ListProperties",
      },
      listPropertiesSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base ListProperties have been changed in this suggestion.",
        type: "ref",
        ref: "docs_ListPropertiesSuggestionState",
      },
    },
    required: [],
  },
  DocsList: {
    description:
      "A List represents the list attributes for a group of paragraphs that all belong to the same list. A paragraph that's part of a list has a reference to the list's ID in its bullet.",
    type: "object",
    properties: {
      suggestedListPropertiesChanges: {
        description: "The suggested changes to the list properties, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedListProperties",
        },
      },
      suggestedInsertionId: {
        description: "The suggested insertion ID. If empty, then this is not a suggested insertion.",
        type: "string",
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this list.",
        type: "array",
        items: {
          type: "string",
        },
      },
      listProperties: {
        description: "The properties of the list.",
        type: "ref",
        ref: "docs_ListProperties",
      },
    },
    required: [],
  },
  DocsDropdownOption: {
    description: "An option in a Dropdown.",
    type: "object",
    properties: {
      textStyle: {
        description:
          "The text style of this dropdown option. Currently, only the `foreground_color` and `background_color` properties are supported. If other properties are set, a 400 bad request error is returned.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      optionId: {
        description:
          "The ID of this dropdown option. If you specify an ID, it must be unique among all options in this dropdown definition. The ID must start with `dropdownItem.` and match regex `^dropdownItem\\.[a-zA-Z0-9_-]{2,14}$` (length 15-27 chars). If you don't specify an ID, a unique one is generated.",
        type: "string",
      },
      displayValue: {
        description: "The display value of this dropdown option.",
        type: "string",
      },
    },
    required: [],
  },
  DocsCropProperties: {
    description:
      "The crop properties of an image. The crop rectangle is represented using fractional offsets from the original content's 4 edges. - If the offset is in the interval (0, 1), the corresponding edge of crop rectangle is positioned inside of the image's original bounding rectangle. - If the offset is negative or greater than 1, the corresponding edge of crop rectangle is positioned outside of the image's original bounding rectangle. - If all offsets and rotation angles are 0, the image is not cropped.",
    type: "object",
    properties: {
      offsetRight: {
        description:
          "The offset specifies how far inwards the right edge of the crop rectangle is from the right edge of the original content as a fraction of the original content's width.",
        type: "number",
      },
      offsetTop: {
        description:
          "The offset specifies how far inwards the top edge of the crop rectangle is from the top edge of the original content as a fraction of the original content's height.",
        type: "number",
      },
      offsetLeft: {
        description:
          "The offset specifies how far inwards the left edge of the crop rectangle is from the left edge of the original content as a fraction of the original content's width.",
        type: "number",
      },
      angle: {
        description:
          "The clockwise rotation angle of the crop rectangle around its center, in radians. Rotation is applied after the offsets.",
        type: "number",
      },
      offsetBottom: {
        description:
          "The offset specifies how far inwards the bottom edge of the crop rectangle is from the bottom edge of the original content as a fraction of the original content's height.",
        type: "number",
      },
    },
    required: [],
  },
  DocsParagraphBorder: {
    description: "A border around a paragraph.",
    type: "object",
    properties: {
      color: {
        description: "The color of the border.",
        type: "ref",
        ref: "docs_OptionalColor",
      },
      width: {
        description: "The width of the border.",
        type: "ref",
        ref: "docs_Dimension",
      },
      padding: {
        description: "The padding of the border.",
        type: "ref",
        ref: "docs_Dimension",
      },
      dashStyle: {
        description: "The dash style of the border.",
        type: "string",
        enum: ["DASH_STYLE_UNSPECIFIED", "SOLID", "DOT", "DASH"],
      },
    },
    required: [],
  },
  DocsSuggestedNamedStyles: {
    description: "A suggested change to the NamedStyles.",
    type: "object",
    properties: {
      namedStyles: {
        description:
          "A NamedStyles that only includes the changes made in this suggestion. This can be used along with the named_styles_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_NamedStyles",
      },
      namedStylesSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base NamedStyles have been changed in this suggestion.",
        type: "ref",
        ref: "docs_NamedStylesSuggestionState",
      },
    },
    required: [],
  },
  DocsSizeSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base Size have been changed in this suggestion. For any field set to true, the Size has a new suggested value.",
    type: "object",
    properties: {
      heightSuggested: {
        description: "Indicates if there was a suggested change to height.",
        type: "boolean",
      },
      widthSuggested: {
        description: "Indicates if there was a suggested change to width.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsEmbeddedObjectBorderSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base EmbeddedObjectBorder have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      widthSuggested: {
        description: "Indicates if there was a suggested change to width.",
        type: "boolean",
      },
      dashStyleSuggested: {
        description: "Indicates if there was a suggested change to dash_style.",
        type: "boolean",
      },
      colorSuggested: {
        description: "Indicates if there was a suggested change to color.",
        type: "boolean",
      },
      propertyStateSuggested: {
        description: "Indicates if there was a suggested change to property_state.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsParagraphStyle: {
    description:
      "Styles that apply to a whole paragraph. Inherited paragraph styles are represented as unset fields in this message. A paragraph style's parent depends on where the paragraph style is defined: * The ParagraphStyle on a Paragraph inherits from the paragraph's corresponding named style type. * The ParagraphStyle on a named style inherits from the normal text named style. * The ParagraphStyle of the normal text named style inherits from the default paragraph style in the Docs editor. * The ParagraphStyle on a Paragraph element that's contained in a table may inherit its paragraph style from the table style. If the paragraph style does not inherit from a parent, unsetting fields will revert the style to a value matching the defaults in the Docs editor.",
    type: "object",
    properties: {
      indentEnd: {
        description:
          "The amount of indentation for the paragraph on the side that corresponds to the end of the text, based on the current paragraph direction. If unset, the value is inherited from the parent.",
        type: "ref",
        ref: "docs_Dimension",
      },
      borderBottom: {
        description:
          "The border at the bottom of this paragraph. If unset, the value is inherited from the parent. The bottom border is rendered when the paragraph below has different border and indent properties. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety.",
        type: "ref",
        ref: "docs_ParagraphBorder",
      },
      avoidWidowAndOrphan: {
        description:
          "Whether to avoid widows and orphans for the paragraph. If unset, the value is inherited from the parent.",
        type: "boolean",
      },
      headingId: {
        description:
          "The heading ID of the paragraph. If empty, then this paragraph is not a heading. This property is read-only.",
        type: "string",
      },
      borderTop: {
        description:
          "The border at the top of this paragraph. If unset, the value is inherited from the parent. The top border is rendered when the paragraph above has different border and indent properties. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety.",
        type: "ref",
        ref: "docs_ParagraphBorder",
      },
      borderBetween: {
        description:
          "The border between this paragraph and the next and previous paragraphs. If unset, the value is inherited from the parent. The between border is rendered when the adjacent paragraph has the same border and indent properties. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety.",
        type: "ref",
        ref: "docs_ParagraphBorder",
      },
      spacingMode: {
        description: "The spacing mode for the paragraph.",
        type: "string",
        enum: ["SPACING_MODE_UNSPECIFIED", "NEVER_COLLAPSE", "COLLAPSE_LISTS"],
      },
      indentFirstLine: {
        description:
          "The amount of indentation for the first line of the paragraph. If unset, the value is inherited from the parent.",
        type: "ref",
        ref: "docs_Dimension",
      },
      direction: {
        description:
          "The text direction of this paragraph. If unset, the value defaults to LEFT_TO_RIGHT since paragraph direction is not inherited.",
        type: "string",
        enum: ["CONTENT_DIRECTION_UNSPECIFIED", "LEFT_TO_RIGHT", "RIGHT_TO_LEFT"],
      },
      keepLinesTogether: {
        description:
          "Whether all lines of the paragraph should be laid out on the same page or column if possible. If unset, the value is inherited from the parent.",
        type: "boolean",
      },
      keepWithNext: {
        description:
          "Whether at least a part of this paragraph should be laid out on the same page or column as the next paragraph if possible. If unset, the value is inherited from the parent.",
        type: "boolean",
      },
      pageBreakBefore: {
        description:
          "Whether the current paragraph should always start at the beginning of a page. If unset, the value is inherited from the parent. Attempting to update page_break_before for paragraphs in unsupported regions, including Table, Header, Footer and Footnote, can result in an invalid document state that returns a 400 bad request error.",
        type: "boolean",
      },
      lineSpacing: {
        description:
          "The amount of space between lines, as a percentage of normal, where normal is represented as 100.0. If unset, the value is inherited from the parent.",
        type: "number",
      },
      indentStart: {
        description:
          "The amount of indentation for the paragraph on the side that corresponds to the start of the text, based on the current paragraph direction. If unset, the value is inherited from the parent.",
        type: "ref",
        ref: "docs_Dimension",
      },
      spaceBelow: {
        description: "The amount of extra space below the paragraph. If unset, the value is inherited from the parent.",
        type: "ref",
        ref: "docs_Dimension",
      },
      tabStops: {
        description:
          "A list of the tab stops for this paragraph. The list of tab stops is not inherited. This property is read-only.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_TabStop",
        },
      },
      spaceAbove: {
        description: "The amount of extra space above the paragraph. If unset, the value is inherited from the parent.",
        type: "ref",
        ref: "docs_Dimension",
      },
      borderLeft: {
        description:
          "The border to the left of this paragraph. If unset, the value is inherited from the parent. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety.",
        type: "ref",
        ref: "docs_ParagraphBorder",
      },
      borderRight: {
        description:
          "The border to the right of this paragraph. If unset, the value is inherited from the parent. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety.",
        type: "ref",
        ref: "docs_ParagraphBorder",
      },
      namedStyleType: {
        description:
          "The named style type of the paragraph. Since updating the named style type affects other properties within ParagraphStyle, the named style type is applied before the other properties are updated.",
        type: "string",
        enum: [
          "NAMED_STYLE_TYPE_UNSPECIFIED",
          "NORMAL_TEXT",
          "TITLE",
          "SUBTITLE",
          "HEADING_1",
          "HEADING_2",
          "HEADING_3",
          "HEADING_4",
          "HEADING_5",
          "HEADING_6",
        ],
      },
      shading: {
        description: "The shading of the paragraph. If unset, the value is inherited from the parent.",
        type: "ref",
        ref: "docs_Shading",
      },
      alignment: {
        description: "The text alignment for this paragraph.",
        type: "string",
        enum: ["ALIGNMENT_UNSPECIFIED", "START", "CENTER", "END", "JUSTIFIED"],
      },
    },
    required: [],
  },
  DocsUpdateTableCellStyleRequest: {
    description: "Updates the style of a range of table cells.",
    type: "object",
    properties: {
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `tableCellStyle` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the table cell background color, set `fields` to `"backgroundColor"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset.',
        type: "string",
      },
      tableCellStyle: {
        description:
          "The style to set on the table cells. When updating borders, if a cell shares a border with an adjacent cell, the corresponding border property of the adjacent cell is updated as well. Borders that are merged and invisible are not updated. Since updating a border shared by adjacent cells in the same request can cause conflicting border updates, border updates are applied in the following order: - `border_right` - `border_left` - `border_bottom` - `border_top`",
        type: "ref",
        ref: "docs_TableCellStyle",
      },
      tableRange: {
        description: "The table range representing the subset of the table to which the updates are applied.",
        type: "ref",
        ref: "docs_TableRange",
      },
      tableStartLocation: {
        description:
          "The location where the table starts in the document. When specified, the updates are applied to all the cells in the table.",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsNamedStyleSuggestionState: {
    description: "A suggestion state of a NamedStyle message.",
    type: "object",
    properties: {
      namedStyleType: {
        description:
          "The named style type that this suggestion state corresponds to. This field is provided as a convenience for matching the NamedStyleSuggestionState with its corresponding NamedStyle.",
        type: "string",
        enum: [
          "NAMED_STYLE_TYPE_UNSPECIFIED",
          "NORMAL_TEXT",
          "TITLE",
          "SUBTITLE",
          "HEADING_1",
          "HEADING_2",
          "HEADING_3",
          "HEADING_4",
          "HEADING_5",
          "HEADING_6",
        ],
      },
      paragraphStyleSuggestionState: {
        description:
          "A mask that indicates which of the fields in paragraph style have been changed in this suggestion.",
        type: "ref",
        ref: "docs_ParagraphStyleSuggestionState",
      },
      textStyleSuggestionState: {
        description: "A mask that indicates which of the fields in text style have been changed in this suggestion.",
        type: "ref",
        ref: "docs_TextStyleSuggestionState",
      },
    },
    required: [],
  },
  DocsDateElementPropertiesSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base DateElementProperties have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      localeSuggested: {
        description: "Indicates if there was a suggested change to locale.",
        type: "boolean",
      },
      timeFormatSuggested: {
        description: "Indicates if there was a suggested change to time_format.",
        type: "boolean",
      },
      timeZoneIdSuggested: {
        description: "Indicates if there was a suggested change to time_zone_id.",
        type: "boolean",
      },
      timestampSuggested: {
        description: "Indicates if there was a suggested change to timestamp.",
        type: "boolean",
      },
      dateFormatSuggested: {
        description: "Indicates if there was a suggested change to date_format.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsSuggestedDateElementProperties: {
    description: "A suggested change to a DateElementProperties.",
    type: "object",
    properties: {
      dateElementPropertiesSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base DateElementProperties have been changed in this suggestion.",
        type: "ref",
        ref: "docs_DateElementPropertiesSuggestionState",
      },
      dateElementProperties: {
        description:
          "DateElementProperties that only includes the changes made in this suggestion. This can be used along with the date_element_properties_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_DateElementProperties",
      },
    },
    required: [],
  },
  DocsLink: {
    description: "A reference to another portion of a document or an external URL resource.",
    type: "object",
    properties: {
      tabId: {
        description: "The ID of a tab in this document.",
        type: "string",
      },
      url: {
        description: "An external URL.",
        type: "string",
      },
      heading: {
        description:
          "A heading in this document. In documents containing a single tab, links to headings within the singular tab continue to return Link.headingId when the includeTabsContent parameter is set to `false` or unset. Otherwise, this field is returned.",
        type: "ref",
        ref: "docs_HeadingLink",
      },
      headingId: {
        description:
          "The ID of a heading in this document. Legacy field: Instead, set includeTabsContent to `true` and use Link.heading for read and write operations. This field is only returned when includeTabsContent is set to `false` in documents containing a single tab and links to a heading within the singular tab. Otherwise, Link.heading is returned. If this field is used in a write request, the heading is considered to be from the tab ID specified in the request. If a tab ID is not specified in the request, it is considered to be from the first tab in the document.",
        type: "string",
      },
      bookmarkId: {
        description:
          "The ID of a bookmark in this document. Legacy field: Instead, set includeTabsContent to `true` and use Link.bookmark for read and write operations. This field is only returned when includeTabsContent is set to `false` in documents containing a single tab and links to a bookmark within the singular tab. Otherwise, Link.bookmark is returned. If this field is used in a write request, the bookmark is considered to be from the tab ID specified in the request. If a tab ID is not specified in the request, it is considered to be from the first tab in the document.",
        type: "string",
      },
      bookmark: {
        description:
          "A bookmark in this document. In documents containing a single tab, links to bookmarks within the singular tab continue to return Link.bookmarkId when the includeTabsContent parameter is set to `false` or unset. Otherwise, this field is returned.",
        type: "ref",
        ref: "docs_BookmarkLink",
      },
    },
    required: [],
  },
  DocsDeletePositionedObjectRequest: {
    description: "Deletes a PositionedObject from the document.",
    type: "object",
    properties: {
      objectId: {
        description: "The ID of the positioned object to delete.",
        type: "string",
      },
      tabId: {
        description:
          "The tab that the positioned object to delete is in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
    },
    required: [],
  },
  DocsDeleteDropdownDefinitionRequest: {
    description:
      "Deletes a DropdownDefinition. If the dropdown definition is referenced by any dropdown instances (chips) in the document, a 400 bad request error is returned.",
    type: "object",
    properties: {
      tabId: {
        description:
          "The ID of the tab that contains the dropdown definition to delete. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
      dropdownDefinitionId: {
        description: "The ID of the DropdownDefinition to delete.",
        type: "string",
      },
    },
    required: [],
  },
  DocsMergeTableCellsRequest: {
    description: "Merges cells in a Table.",
    type: "object",
    properties: {
      tableRange: {
        description:
          'The table range specifying which cells of the table to merge. Any text in the cells being merged will be concatenated and stored in the "head" cell of the range. This is the upper-left cell of the range when the content direction is left to right, and the upper-right cell of the range otherwise. If the range is non-rectangular (which can occur in some cases where the range covers cells that are already merged or where the table is non-rectangular), a 400 bad request error is returned.',
        type: "ref",
        ref: "docs_TableRange",
      },
    },
    required: [],
  },
  DocsRichLink: {
    description: "A link to a Google resource (such as a file in Drive, a YouTube video, or a Calendar event).",
    type: "object",
    properties: {
      richLinkProperties: {
        description: "Output only. The properties of this RichLink. This field is always present.",
        type: "ref",
        ref: "docs_RichLinkProperties",
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this RichLink, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
      textStyle: {
        description: "The text style of this RichLink.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      suggestedInsertionIds: {
        description:
          "IDs for suggestions that insert this link into the document. A RichLink might have multiple insertion IDs if it's a nested suggested change (a suggestion within a suggestion made by a different user, for example). If empty, then this person link isn't a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      richLinkId: {
        description: "Output only. The ID of this link.",
        type: "string",
      },
      suggestedDeletionIds: {
        description:
          "IDs for suggestions that remove this link from the document. A RichLink might have multiple deletion IDs if, for example, multiple users suggest deleting it. If empty, then this person link isn't suggested for deletion.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsDropdownDefinitionProperties: {
    description: "Properties of a dropdown definition.",
    type: "object",
    properties: {
      title: {
        description: "The title of the dropdown definition.",
        type: "string",
      },
      options: {
        description:
          "The list of options defined by this dropdown definition. A dropdown definition must have at least 2 options and at most 50 options.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_DropdownOption",
        },
      },
    },
    required: [],
  },
  DocsCreateHeaderResponse: {
    description: "The result of creating a header.",
    type: "object",
    properties: {
      headerId: {
        description: "The ID of the created header.",
        type: "string",
      },
    },
    required: [],
  },
  DocsParagraph: {
    description:
      "A StructuralElement representing a paragraph. A paragraph is a range of content that's terminated with a newline character.",
    type: "object",
    properties: {
      suggestedParagraphStyleChanges: {
        description: "The suggested paragraph style changes to this paragraph, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedParagraphStyle",
        },
      },
      suggestedPositionedObjectIds: {
        description:
          "The IDs of the positioned objects suggested to be attached to this paragraph, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_ObjectReferences",
        },
      },
      paragraphStyle: {
        description: "The style of this paragraph.",
        type: "ref",
        ref: "docs_ParagraphStyle",
      },
      positionedObjectIds: {
        description: "The IDs of the positioned objects tethered to this paragraph.",
        type: "array",
        items: {
          type: "string",
        },
      },
      bullet: {
        description: "The bullet for this paragraph. If not present, the paragraph does not belong to a list.",
        type: "ref",
        ref: "docs_Bullet",
      },
      suggestedBulletChanges: {
        description: "The suggested changes to this paragraph's bullet.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedBullet",
        },
      },
      elements: {
        description: "The content of the paragraph, broken down into its component parts.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_ParagraphElement",
        },
      },
    },
    required: [],
  },
  DocsCreateNamedRangeResponse: {
    description: "The result of creating a named range.",
    type: "object",
    properties: {
      namedRangeId: {
        description: "The ID of the created named range.",
        type: "string",
      },
    },
    required: [],
  },
  DocsTextStyle: {
    description:
      "Represents the styling that can be applied to text. Inherited text styles are represented as unset fields in this message. A text style's parent depends on where the text style is defined: * The TextStyle of text in a Paragraph inherits from the paragraph's corresponding named style type. * The TextStyle on a named style inherits from the normal text named style. * The TextStyle of the normal text named style inherits from the default text style in the Docs editor. * The TextStyle on a Paragraph element that's contained in a table may inherit its text style from the table style. If the text style does not inherit from a parent, unsetting fields will revert the style to a value matching the defaults in the Docs editor.",
    type: "object",
    properties: {
      smallCaps: {
        description: "Whether or not the text is in small capital letters.",
        type: "boolean",
      },
      underline: {
        description: "Whether or not the text is underlined.",
        type: "boolean",
      },
      fontSize: {
        description: "The size of the text's font.",
        type: "ref",
        ref: "docs_Dimension",
      },
      bold: {
        description: "Whether or not the text is rendered as bold.",
        type: "boolean",
      },
      baselineOffset: {
        description:
          "The text's vertical offset from its normal position. Text with `SUPERSCRIPT` or `SUBSCRIPT` baseline offsets is automatically rendered in a smaller font size, computed based on the `font_size` field. Changes in this field don't affect the `font_size`.",
        type: "string",
        enum: ["BASELINE_OFFSET_UNSPECIFIED", "NONE", "SUPERSCRIPT", "SUBSCRIPT"],
      },
      link: {
        description:
          'The hyperlink destination of the text. If unset, there\'s no link. Links are not inherited from parent text. Changing the link in an update request causes some other changes to the text style of the range: * When setting a link, the text foreground color will be updated to the default link color and the text will be underlined. If these fields are modified in the same request, those values will be used instead of the link defaults. * Setting a link on a text range that overlaps with an existing link will also update the existing link to point to the new URL. * Links are not settable on newline characters. As a result, setting a link on a text range that crosses a paragraph boundary, such as `"ABC\\n123"`, will separate the newline character(s) into their own text runs. The link will be applied separately to the runs before and after the newline. * Removing a link will update the text style of the range to match the style of the preceding text (or the default text styles if the preceding text is another link) unless different styles are being set in the same request.',
        type: "ref",
        ref: "docs_Link",
      },
      backgroundColor: {
        description:
          "The background color of the text. If set, the color is either an RGB color or transparent, depending on the `color` field.",
        type: "ref",
        ref: "docs_OptionalColor",
      },
      weightedFontFamily: {
        description:
          "The font family and rendered weight of the text. If an update request specifies values for both `weighted_font_family` and `bold`, the `weighted_font_family` is applied first, then `bold`. If `weighted_font_family#weight` is not set, it defaults to `400`. If `weighted_font_family` is set, then `weighted_font_family#font_family` must also be set with a non-empty value. Otherwise, a 400 bad request error is returned.",
        type: "ref",
        ref: "docs_WeightedFontFamily",
      },
      italic: {
        description: "Whether or not the text is italicized.",
        type: "boolean",
      },
      foregroundColor: {
        description:
          "The foreground color of the text. If set, the color is either an RGB color or transparent, depending on the `color` field.",
        type: "ref",
        ref: "docs_OptionalColor",
      },
      strikethrough: {
        description: "Whether or not the text is struck through.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsCreateParagraphBulletsRequest: {
    description:
      "Creates bullets for all of the paragraphs that overlap with the given range. The nesting level of each paragraph will be determined by counting leading tabs in front of each paragraph. To avoid excess space between the bullet and the corresponding paragraph, these leading tabs are removed by this request. This may change the indices of parts of the text. If the paragraph immediately before paragraphs being updated is in a list with a matching preset, the paragraphs being updated are added to that preceding list.",
    type: "object",
    properties: {
      range: {
        description: "The range to apply the bullet preset to.",
        type: "ref",
        ref: "docs_Range",
      },
      bulletPreset: {
        description: "The kinds of bullet glyphs to be used.",
        type: "string",
        enum: [
          "BULLET_GLYPH_PRESET_UNSPECIFIED",
          "BULLET_DISC_CIRCLE_SQUARE",
          "BULLET_DIAMONDX_ARROW3D_SQUARE",
          "BULLET_CHECKBOX",
          "BULLET_ARROW_DIAMOND_DISC",
          "BULLET_STAR_CIRCLE_SQUARE",
          "BULLET_ARROW3D_CIRCLE_SQUARE",
          "BULLET_LEFTTRIANGLE_DIAMOND_DISC",
          "BULLET_DIAMONDX_HOLLOWDIAMOND_SQUARE",
          "BULLET_DIAMOND_CIRCLE_SQUARE",
          "NUMBERED_DECIMAL_ALPHA_ROMAN",
          "NUMBERED_DECIMAL_ALPHA_ROMAN_PARENS",
          "NUMBERED_DECIMAL_NESTED",
          "NUMBERED_UPPERALPHA_ALPHA_ROMAN",
          "NUMBERED_UPPERROMAN_UPPERALPHA_DECIMAL",
          "NUMBERED_ZERODECIMAL_ALPHA_ROMAN",
        ],
      },
    },
    required: [],
  },
  DocsRejectSuggestionRequest: {
    description:
      "Rejects a suggestion. Returns a 403 forbidden error if the requesting user does not have edit access to the document and is not the author of the suggestion.",
    type: "object",
    properties: {
      suggestionId: {
        description: "The ID of the suggestion.",
        type: "string",
      },
    },
    required: [],
  },
  DocsCreateFootnoteResponse: {
    description: "The result of creating a footnote.",
    type: "object",
    properties: {
      footnoteId: {
        description: "The ID of the created footnote.",
        type: "string",
      },
    },
    required: [],
  },
  DocsSectionBreak: {
    description:
      "A StructuralElement representing a section break. A section is a range of content that has the same SectionStyle. A section break represents the start of a new section, and the section style applies to the section after the section break. The document body always begins with a section break.",
    type: "object",
    properties: {
      sectionStyle: {
        description: "The style of the section after this section break.",
        type: "ref",
        ref: "docs_SectionStyle",
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. A SectionBreak may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsSuggestedDropdownProperties: {
    description: "A suggested change to dropdown properties.",
    type: "object",
    properties: {
      dropdownPropertiesSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base DropdownProperties have been changed in this suggestion.",
        type: "ref",
        ref: "docs_DropdownPropertiesSuggestionState",
      },
      dropdownProperties: {
        description:
          "A DropdownProperties that only includes the changes made in this suggestion. This can be used along with the dropdown_properties_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_DropdownProperties",
      },
    },
    required: [],
  },
  DocsBackgroundSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base Background have been changed in this suggestion. For any field set to true, the Backgound has a new suggested value.",
    type: "object",
    properties: {
      backgroundColorSuggested: {
        description: "Indicates whether the current background color has been modified in this suggestion.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsUpdateParagraphStyleRequest: {
    description: "Update the styling of all paragraphs that overlap with the given range.",
    type: "object",
    properties: {
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `paragraph_style` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example, to update the paragraph style\'s alignment property, set `fields` to `"alignment"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset.',
        type: "string",
      },
      paragraphStyle: {
        description:
          "The styles to set on the paragraphs. Certain paragraph style changes may cause other changes in order to mirror the behavior of the Docs editor. See the documentation of ParagraphStyle for more information.",
        type: "ref",
        ref: "docs_ParagraphStyle",
      },
      range: {
        description: "The range overlapping the paragraphs to style.",
        type: "ref",
        ref: "docs_Range",
      },
    },
    required: [],
  },
  DocsInlineObjectElement: {
    description: "A ParagraphElement that contains an InlineObject.",
    type: "object",
    properties: {
      textStyle: {
        description:
          "The text style of this InlineObjectElement. Similar to text content, like text runs and footnote references, the text style of an inline object element can affect content layout as well as the styling of text inserted next to it.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      inlineObjectId: {
        description: "The ID of the InlineObject this element contains.",
        type: "string",
      },
      suggestedDeletionIds: {
        description: "The suggested deletion IDs. If empty, then there are no suggested deletions of this content.",
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this InlineObject, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
      suggestedInsertionIds: {
        description:
          "The suggested insertion IDs. An InlineObjectElement may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [],
  },
  DocsDeleteFooterRequest: {
    description: "Deletes a Footer from the document.",
    type: "object",
    properties: {
      tabId: {
        description:
          "The tab that contains the footer to delete. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
      footerId: {
        description:
          "The id of the footer to delete. If this footer is defined on DocumentStyle, the reference to this footer is removed, resulting in no footer of that type for the first section of the document. If this footer is defined on a SectionStyle, the reference to this footer is removed and the footer of that type is now continued from the previous section.",
        type: "string",
      },
    },
    required: [],
  },
  DocsPinTableHeaderRowsRequest: {
    description: "Updates the number of pinned table header rows in a table.",
    type: "object",
    properties: {
      tableStartLocation: {
        description: "The location where the table starts in the document.",
        type: "ref",
        ref: "docs_Location",
      },
      pinnedHeaderRowsCount: {
        description: "The number of table rows to pin, where 0 implies that all rows are unpinned.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DocsPositionedObjectPositioningSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base PositionedObjectPositioning have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      topOffsetSuggested: {
        description: "Indicates if there was a suggested change to top_offset.",
        type: "boolean",
      },
      leftOffsetSuggested: {
        description: "Indicates if there was a suggested change to left_offset.",
        type: "boolean",
      },
      layoutSuggested: {
        description: "Indicates if there was a suggested change to layout.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsInsertInlineSheetsChartResponse: {
    description: "The result of inserting an embedded Google Sheets chart.",
    type: "object",
    properties: {
      objectId: {
        description: "The object ID of the inserted chart.",
        type: "string",
      },
    },
    required: [],
  },
  DocsInsertPersonRequest: {
    description: "Inserts a person mention.",
    type: "object",
    properties: {
      endOfSegmentLocation: {
        description: "Inserts the person mention at the end of a header, footer, footnote or the document body.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
      location: {
        description:
          "Inserts the person mention at a specific index in the document. The person mention must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Person mentions cannot be inserted inside an equation.",
        type: "ref",
        ref: "docs_Location",
      },
      personProperties: {
        description: "The properties of the person mention to insert.",
        type: "ref",
        ref: "docs_PersonProperties",
      },
    },
    required: [],
  },
  DocsInsertRichLinkRequest: {
    description: "Inserts a RichLink at the specified location.",
    type: "object",
    properties: {
      richLinkProperties: {
        description: "The properties of the rich link to insert.",
        type: "ref",
        ref: "docs_RichLinkProperties",
      },
      location: {
        description:
          "Inserts the rich link at a specific index in the document. The rich link must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). The rich link cannot be inserted inside an equation.",
        type: "ref",
        ref: "docs_Location",
      },
      endOfSegmentLocation: {
        description: "Inserts the rich link at the end of a header, footer, footnote or the document body.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
    },
    required: [],
  },
  DocsBulletSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base Bullet have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      nestingLevelSuggested: {
        description: "Indicates if there was a suggested change to the nesting_level.",
        type: "boolean",
      },
      listIdSuggested: {
        description: "Indicates if there was a suggested change to the list_id.",
        type: "boolean",
      },
      textStyleSuggestionState: {
        description: "A mask that indicates which of the fields in text style have been changed in this suggestion.",
        type: "ref",
        ref: "docs_TextStyleSuggestionState",
      },
    },
    required: [],
  },
  DocsUpdateSectionStyleRequest: {
    description: "Updates the SectionStyle.",
    type: "object",
    properties: {
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `section_style` is implied and must not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the left margin, set `fields` to `"margin_left"`.',
        type: "string",
      },
      range: {
        description:
          "The range overlapping the sections to style. Because section breaks can only be inserted inside the body, the segment ID field must be empty.",
        type: "ref",
        ref: "docs_Range",
      },
      sectionStyle: {
        description:
          "The styles to be set on the section. Certain section style changes may cause other changes in order to mirror the behavior of the Docs editor. See the documentation of SectionStyle for more information.",
        type: "ref",
        ref: "docs_SectionStyle",
      },
    },
    required: [],
  },
  DocsInsertDropdownRequest: {
    description: "Inserts a Dropdown at the specified location.",
    type: "object",
    properties: {
      endOfSegmentLocation: {
        description: "The EndOfSegmentLocation in the document to insert the dropdown at.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
      dropdownDefinitionId: {
        description: "Required. The DropdownDefinition ID.",
        type: "string",
      },
      selectedOptionId: {
        description:
          "Optional initial value for the dropdown. If this field is not specified, the new dropdown will default to selecting the first option defined in the dropdown definition. If this field is specified but does not reference a valid option in the dropdown definition, a 400 bad request error is returned.",
        type: "string",
      },
      location: {
        description: "The Location in the document to insert the dropdown at.",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsPerson: {
    description:
      "A person or email address mentioned in a document. These mentions behave as a single, immutable element containing the person's name or email address.",
    type: "object",
    properties: {
      suggestedDeletionIds: {
        description:
          "IDs for suggestions that remove this person link from the document. A Person might have multiple deletion IDs if, for example, multiple users suggest deleting it. If empty, then this person link isn't suggested for deletion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      personId: {
        description: "Output only. The unique ID of this link.",
        type: "string",
      },
      suggestedTextStyleChanges: {
        description: "The suggested text style changes to this Person, keyed by suggestion ID.",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: {
          type: "ref",
          ref: "docs_SuggestedTextStyle",
        },
      },
      suggestedInsertionIds: {
        description:
          "IDs for suggestions that insert this person link into the document. A Person might have multiple insertion IDs if it's a nested suggested change (a suggestion within a suggestion made by a different user, for example). If empty, then this person link isn't a suggested insertion.",
        type: "array",
        items: {
          type: "string",
        },
      },
      textStyle: {
        description: "The text style of this Person.",
        type: "ref",
        ref: "docs_TextStyle",
      },
      personProperties: {
        description: "Output only. The properties of this Person. This field is always present.",
        type: "ref",
        ref: "docs_PersonProperties",
      },
    },
    required: [],
  },
  DocsInsertInlineImageResponse: {
    description: "The result of inserting an inline image.",
    type: "object",
    properties: {
      objectId: {
        description: "The ID of the created InlineObject.",
        type: "string",
      },
    },
    required: [],
  },
  DocsRequest: {
    description: "A single update to apply to a document.",
    type: "object",
    properties: {
      insertSectionBreak: {
        description: "Inserts a section break at the specified location.",
        type: "ref",
        ref: "docs_InsertSectionBreakRequest",
      },
      insertTableColumn: {
        description: "Inserts an empty column into a table.",
        type: "ref",
        ref: "docs_InsertTableColumnRequest",
      },
      updateDropdownDefinitionProperties: {
        description: "Updates the properties of a DropdownDefinition.",
        type: "ref",
        ref: "docs_UpdateDropdownDefinitionPropertiesRequest",
      },
      addDocumentTab: {
        description: "Adds a document tab.",
        type: "ref",
        ref: "docs_AddDocumentTabRequest",
      },
      deleteTab: {
        description: "Deletes a document tab.",
        type: "ref",
        ref: "docs_DeleteTabRequest",
      },
      createHeader: {
        description: "Creates a header.",
        type: "ref",
        ref: "docs_CreateHeaderRequest",
      },
      insertPageBreak: {
        description: "Inserts a page break at the specified location.",
        type: "ref",
        ref: "docs_InsertPageBreakRequest",
      },
      deleteDropdownDefinition: {
        description: "Deletes a DropdownDefinition.",
        type: "ref",
        ref: "docs_DeleteDropdownDefinitionRequest",
      },
      deletePositionedObject: {
        description: "Deletes a positioned object from the document.",
        type: "ref",
        ref: "docs_DeletePositionedObjectRequest",
      },
      createNamedRange: {
        description: "Creates a named range.",
        type: "ref",
        ref: "docs_CreateNamedRangeRequest",
      },
      unmergeTableCells: {
        description: "Unmerges cells in a table.",
        type: "ref",
        ref: "docs_UnmergeTableCellsRequest",
      },
      deleteCommentReply: {
        description: "Deletes a reply Post from a CommentThread or SuggestionThread.",
        type: "ref",
        ref: "docs_DeleteCommentReplyRequest",
      },
      insertDropdown: {
        description: "Inserts a Dropdown at the specified location.",
        type: "ref",
        ref: "docs_InsertDropdownRequest",
      },
      replaceImage: {
        description: "Replaces an image in the document.",
        type: "ref",
        ref: "docs_ReplaceImageRequest",
      },
      insertText: {
        description: "Inserts text at the specified location.",
        type: "ref",
        ref: "docs_InsertTextRequest",
      },
      rejectSuggestion: {
        description: "Rejects a suggestion.",
        type: "ref",
        ref: "docs_RejectSuggestionRequest",
      },
      replaceAllText: {
        description: "Replaces all instances of the specified text.",
        type: "ref",
        ref: "docs_ReplaceAllTextRequest",
      },
      updateDropdownProperties: {
        description: "Updates the properties of a Dropdown.",
        type: "ref",
        ref: "docs_UpdateDropdownPropertiesRequest",
      },
      deleteFooter: {
        description: "Deletes a footer from the document.",
        type: "ref",
        ref: "docs_DeleteFooterRequest",
      },
      insertComment: {
        description: "Inserts a CommentThread into the document.",
        type: "ref",
        ref: "docs_InsertCommentRequest",
      },
      updateSectionStyle: {
        description: "Updates the section style of the specified range.",
        type: "ref",
        ref: "docs_UpdateSectionStyleRequest",
      },
      deleteContentRange: {
        description: "Deletes content from the document.",
        type: "ref",
        ref: "docs_DeleteContentRangeRequest",
      },
      updateTableCellStyle: {
        description: "Updates the style of table cells.",
        type: "ref",
        ref: "docs_UpdateTableCellStyleRequest",
      },
      deleteComment: {
        description: "Deletes a CommentThread.",
        type: "ref",
        ref: "docs_DeleteCommentRequest",
      },
      updateDocumentStyle: {
        description: "Updates the style of the document.",
        type: "ref",
        ref: "docs_UpdateDocumentStyleRequest",
      },
      createDropdownDefinition: {
        description: "Creates a DropdownDefinition.",
        type: "ref",
        ref: "docs_CreateDropdownDefinitionRequest",
      },
      mergeTableCells: {
        description: "Merges cells in a table.",
        type: "ref",
        ref: "docs_MergeTableCellsRequest",
      },
      deleteHeader: {
        description: "Deletes a header from the document.",
        type: "ref",
        ref: "docs_DeleteHeaderRequest",
      },
      updateNamedStyle: {
        description: "Updates a named style.",
        type: "ref",
        ref: "docs_UpdateNamedStyleRequest",
      },
      updateTableRowStyle: {
        description: "Updates the row style in a table.",
        type: "ref",
        ref: "docs_UpdateTableRowStyleRequest",
      },
      insertInlineImage: {
        description: "Inserts an inline image at the specified location.",
        type: "ref",
        ref: "docs_InsertInlineImageRequest",
      },
      updateTextStyle: {
        description: "Updates the text style at the specified range.",
        type: "ref",
        ref: "docs_UpdateTextStyleRequest",
      },
      pinTableHeaderRows: {
        description: "Updates the number of pinned header rows in a table.",
        type: "ref",
        ref: "docs_PinTableHeaderRowsRequest",
      },
      acceptSuggestion: {
        description: "Accepts a suggestion.",
        type: "ref",
        ref: "docs_AcceptSuggestionRequest",
      },
      updateCommentPost: {
        description: "Updates an existing post (head post or reply) of a CommentThread or SuggestionThread.",
        type: "ref",
        ref: "docs_UpdateCommentPostRequest",
      },
      replaceNamedRangeContent: {
        description: "Replaces the content in a named range.",
        type: "ref",
        ref: "docs_ReplaceNamedRangeContentRequest",
      },
      insertTable: {
        description: "Inserts a table at the specified location.",
        type: "ref",
        ref: "docs_InsertTableRequest",
      },
      addCommentReply: {
        description: "Adds a reply to a CommentThread or SuggestionThread.",
        type: "ref",
        ref: "docs_AddCommentReplyRequest",
      },
      updateParagraphStyle: {
        description: "Updates the paragraph style at the specified range.",
        type: "ref",
        ref: "docs_UpdateParagraphStyleRequest",
      },
      deleteTableRow: {
        description: "Deletes a row from a table.",
        type: "ref",
        ref: "docs_DeleteTableRowRequest",
      },
      deleteSuggestion: {
        description: "Deletes a suggestion.",
        type: "ref",
        ref: "docs_DeleteSuggestionRequest",
      },
      insertPerson: {
        description: "Inserts a person mention.",
        type: "ref",
        ref: "docs_InsertPersonRequest",
      },
      insertRichLink: {
        description: "Insert a rich link.",
        type: "ref",
        ref: "docs_InsertRichLinkRequest",
      },
      deleteParagraphBullets: {
        description: "Deletes bullets from paragraphs.",
        type: "ref",
        ref: "docs_DeleteParagraphBulletsRequest",
      },
      createFooter: {
        description: "Creates a footer.",
        type: "ref",
        ref: "docs_CreateFooterRequest",
      },
      insertDate: {
        description: "Inserts a date.",
        type: "ref",
        ref: "docs_InsertDateRequest",
      },
      deleteNamedRange: {
        description: "Deletes a named range.",
        type: "ref",
        ref: "docs_DeleteNamedRangeRequest",
      },
      createParagraphBullets: {
        description: "Creates bullets for paragraphs.",
        type: "ref",
        ref: "docs_CreateParagraphBulletsRequest",
      },
      insertTableRow: {
        description: "Inserts an empty row into a table.",
        type: "ref",
        ref: "docs_InsertTableRowRequest",
      },
      deleteTableColumn: {
        description: "Deletes a column from a table.",
        type: "ref",
        ref: "docs_DeleteTableColumnRequest",
      },
      updateTableColumnProperties: {
        description: "Updates the properties of columns in a table.",
        type: "ref",
        ref: "docs_UpdateTableColumnPropertiesRequest",
      },
      createFootnote: {
        description: "Creates a footnote.",
        type: "ref",
        ref: "docs_CreateFootnoteRequest",
      },
      updateDocumentTabProperties: {
        description: "Updates the properties of a document tab.",
        type: "ref",
        ref: "docs_UpdateDocumentTabPropertiesRequest",
      },
    },
    required: [],
  },
  DocsInsertPageBreakRequest: {
    description: "Inserts a page break followed by a newline at the specified location.",
    type: "object",
    properties: {
      endOfSegmentLocation: {
        description:
          "Inserts the page break at the end of the document body. Page breaks cannot be inserted inside a footnote, header or footer. Since page breaks can only be inserted inside the body, the segment ID field must be empty.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
      location: {
        description:
          "Inserts the page break at a specific index in the document. The page break must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Page breaks cannot be inserted inside a table, equation, footnote, header or footer. Since page breaks can only be inserted inside the body, the segment ID field must be empty.",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsDocumentStyleSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base DocumentStyle have been changed in this suggestion. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      defaultFooterIdSuggested: {
        description: "Indicates if there was a suggested change to default_footer_id.",
        type: "boolean",
      },
      marginHeaderSuggested: {
        description: "Indicates if there was a suggested change to margin_header.",
        type: "boolean",
      },
      useEvenPageHeaderFooterSuggested: {
        description: "Indicates if there was a suggested change to use_even_page_header_footer.",
        type: "boolean",
      },
      evenPageHeaderIdSuggested: {
        description: "Indicates if there was a suggested change to even_page_header_id.",
        type: "boolean",
      },
      defaultHeaderIdSuggested: {
        description: "Indicates if there was a suggested change to default_header_id.",
        type: "boolean",
      },
      useFirstPageHeaderFooterSuggested: {
        description: "Indicates if there was a suggested change to use_first_page_header_footer.",
        type: "boolean",
      },
      evenPageFooterIdSuggested: {
        description: "Indicates if there was a suggested change to even_page_footer_id.",
        type: "boolean",
      },
      pageSizeSuggestionState: {
        description: "A mask that indicates which of the fields in size have been changed in this suggestion.",
        type: "ref",
        ref: "docs_SizeSuggestionState",
      },
      pageNumberStartSuggested: {
        description: "Indicates if there was a suggested change to page_number_start.",
        type: "boolean",
      },
      marginTopSuggested: {
        description: "Indicates if there was a suggested change to margin_top.",
        type: "boolean",
      },
      firstPageFooterIdSuggested: {
        description: "Indicates if there was a suggested change to first_page_footer_id.",
        type: "boolean",
      },
      useCustomHeaderFooterMarginsSuggested: {
        description: "Indicates if there was a suggested change to use_custom_header_footer_margins.",
        type: "boolean",
      },
      backgroundSuggestionState: {
        description: "A mask that indicates which of the fields in background have been changed in this suggestion.",
        type: "ref",
        ref: "docs_BackgroundSuggestionState",
      },
      flipPageOrientationSuggested: {
        description: "Optional. Indicates if there was a suggested change to flip_page_orientation.",
        type: "boolean",
      },
      marginLeftSuggested: {
        description: "Indicates if there was a suggested change to margin_left.",
        type: "boolean",
      },
      marginRightSuggested: {
        description: "Indicates if there was a suggested change to margin_right.",
        type: "boolean",
      },
      firstPageHeaderIdSuggested: {
        description: "Indicates if there was a suggested change to first_page_header_id.",
        type: "boolean",
      },
      marginBottomSuggested: {
        description: "Indicates if there was a suggested change to margin_bottom.",
        type: "boolean",
      },
      marginFooterSuggested: {
        description: "Indicates if there was a suggested change to margin_footer.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsShadingSuggestionState: {
    description:
      "A mask that indicates which of the fields on the base Shading have been changed in this suggested change. For any field set to true, there's a new suggested value.",
    type: "object",
    properties: {
      backgroundColorSuggested: {
        description: "Indicates if there was a suggested change to the Shading.",
        type: "boolean",
      },
    },
    required: [],
  },
  DocsTableRange: {
    description:
      "A table range represents a reference to a subset of a table. It's important to note that the cells specified by a table range do not necessarily form a rectangle. For example, let's say we have a 3 x 3 table where all the cells of the last row are merged together. The table looks like this: [ ] A table range with table cell location = (table_start_location, row = 0, column = 0), row span = 3 and column span = 2 specifies the following cells: x x [ x x x ]",
    type: "object",
    properties: {
      columnSpan: {
        description: "The column span of the table range.",
        type: "integer",
        format: "int32",
      },
      tableCellLocation: {
        description: "The cell location where the table range starts.",
        type: "ref",
        ref: "docs_TableCellLocation",
      },
      rowSpan: {
        description: "The row span of the table range.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DocsCreateDropdownDefinitionRequest: {
    description: "Creates a new DropdownDefinition in the document.",
    type: "object",
    properties: {
      dropdownDefinition: {
        description: "Required. The DropdownDefinition to create.",
        type: "ref",
        ref: "docs_DropdownDefinition",
      },
      tabId: {
        description:
          "The ID of the tab to create the dropdown definition in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
    },
    required: [],
  },
  DocsParagraphElement: {
    description: "A ParagraphElement describes content within a Paragraph.",
    type: "object",
    properties: {
      endIndex: {
        description: "The zero-base end index of this paragraph element, exclusive, in UTF-16 code units.",
        type: "integer",
        format: "int32",
      },
      richLink: {
        description:
          "A paragraph element that links to a Google resource (such as a file in Google Drive, a YouTube video, or a Calendar event.)",
        type: "ref",
        ref: "docs_RichLink",
      },
      inlineObjectElement: {
        description: "An inline object paragraph element.",
        type: "ref",
        ref: "docs_InlineObjectElement",
      },
      pageBreak: {
        description: "A page break paragraph element.",
        type: "ref",
        ref: "docs_PageBreak",
      },
      equation: {
        description: "An equation paragraph element.",
        type: "ref",
        ref: "docs_Equation",
      },
      horizontalRule: {
        description: "A horizontal rule paragraph element.",
        type: "ref",
        ref: "docs_HorizontalRule",
      },
      dateElement: {
        description: "A paragraph element that represents a date.",
        type: "ref",
        ref: "docs_DateElement",
      },
      autoText: {
        description: "An auto text paragraph element.",
        type: "ref",
        ref: "docs_AutoText",
      },
      footnoteReference: {
        description: "A footnote reference paragraph element.",
        type: "ref",
        ref: "docs_FootnoteReference",
      },
      dropdown: {
        description: "A paragraph element that represents a dropdown menu.",
        type: "ref",
        ref: "docs_Dropdown",
      },
      person: {
        description: "A paragraph element that links to a person or email address.",
        type: "ref",
        ref: "docs_Person",
      },
      textRun: {
        description: "A text run paragraph element.",
        type: "ref",
        ref: "docs_TextRun",
      },
      columnBreak: {
        description: "A column break paragraph element.",
        type: "ref",
        ref: "docs_ColumnBreak",
      },
      startIndex: {
        description: "The zero-based start index of this paragraph element, in UTF-16 code units.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DocsSuggestedBullet: {
    description: "A suggested change to a Bullet.",
    type: "object",
    properties: {
      bullet: {
        description:
          "A Bullet that only includes the changes made in this suggestion. This can be used along with the bullet_suggestion_state to see which fields have changed and their new values.",
        type: "ref",
        ref: "docs_Bullet",
      },
      bulletSuggestionState: {
        description:
          "A mask that indicates which of the fields on the base Bullet have been changed in this suggestion.",
        type: "ref",
        ref: "docs_BulletSuggestionState",
      },
    },
    required: [],
  },
  DocsPost: {
    description: "Represents a single post in a comment or suggestion thread.",
    type: "object",
    properties: {
      fromCopiedDocument: {
        description:
          "Output only. Whether the post is from a copied document. This field cannot be set directly by callers.",
        type: "boolean",
      },
      commentAction: {
        description: "Optional. The action type for comment posts.",
        type: "string",
        enum: ["COMMENT_ACTION_TYPE_UNSPECIFIED", "NO_COMMENT_ACTION_CHANGE", "RESOLVE", "REOPEN"],
      },
      content: {
        description:
          "The content of the post. Required to be non-empty if commentAction is not `RESOLVE` or `REOPEN`. This text content will be handled similarly to comments created in the Docs editor. It will have similar behaviors for formatting, notifications, etc. May not exceed 2048 UTF-8 code units.",
        type: "string",
      },
      deleted: {
        description: "Output only. Whether the post is deleted. If `true`, content and author fields will be empty.",
        type: "boolean",
      },
      fromDocumentComparison: {
        description:
          "Output only. Whether the post is from a document comparison. This field cannot be set directly by callers.",
        type: "boolean",
      },
      postId: {
        description: "Output only. The unique ID of the post.",
        type: "string",
      },
      contentHtml: {
        description: "Output only. The content of the post as HTML.",
        type: "string",
      },
      suggestionAction: {
        description: "Output only. The action type for suggestion posts.",
        type: "string",
        enum: ["SUGGESTION_ACTION_TYPE_UNSPECIFIED", "NO_SUGGESTION_ACTION_CHANGE", "ACCEPT", "REJECT"],
      },
      assigneeEmail: {
        description:
          "Optional. The email of the user who is being newly assigned to the thread as part of this post. Returns a 400 bad request error if: - The parent thread is a CommentThread whose headPost does not have an assignee. - The parent thread is a SuggestionThread. - commentAction is specified as `RESOLVE` or `REOPEN`. - `assigneeEmail` exceeds 2048 UTF-8 code units.",
        type: "string",
      },
      fromImportedDocument: {
        description:
          "Output only. Whether the post is from an imported document. This field cannot be set directly by callers.",
        type: "boolean",
      },
      author: {
        description: "Output only. The user who created the post.",
        type: "ref",
        ref: "docs_PostAuthor",
      },
      updateTime: {
        description: "Output only. The time the post was last updated.",
        type: "string",
      },
      createTime: {
        description: "Output only. The time the post was created.",
        type: "string",
      },
    },
    required: [],
  },
  DocsUpdateTableRowStyleRequest: {
    description: "Updates the TableRowStyle of rows in a table.",
    type: "object",
    properties: {
      tableRowStyle: {
        description: "The styles to be set on the rows.",
        type: "ref",
        ref: "docs_TableRowStyle",
      },
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `tableRowStyle` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the minimum row height, set `fields` to `"min_row_height"`.',
        type: "string",
      },
      rowIndices: {
        description:
          "The list of zero-based row indices whose style should be updated. If no indices are specified, all rows will be updated.",
        type: "array",
        items: {
          type: "integer",
          format: "int32",
        },
      },
      tableStartLocation: {
        description: "The location where the table starts in the document.",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsInsertSectionBreakRequest: {
    description:
      "Inserts a section break at the given location. A newline character will be inserted before the section break.",
    type: "object",
    properties: {
      sectionType: {
        description: "The type of section to insert.",
        type: "string",
        enum: ["SECTION_TYPE_UNSPECIFIED", "CONTINUOUS", "NEXT_PAGE"],
      },
      endOfSegmentLocation: {
        description:
          "Inserts a newline and a section break at the end of the document body. Section breaks cannot be inserted inside a footnote, header or footer. Because section breaks can only be inserted inside the body, the segment ID field must be empty.",
        type: "ref",
        ref: "docs_EndOfSegmentLocation",
      },
      location: {
        description:
          "Inserts a newline and a section break at a specific index in the document. The section break must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Section breaks cannot be inserted inside a table, equation, footnote, header, or footer. Since section breaks can only be inserted inside the body, the segment ID field must be empty.",
        type: "ref",
        ref: "docs_Location",
      },
    },
    required: [],
  },
  DocsReplaceNamedRangeContentRequest: {
    description:
      "Replaces the contents of the specified NamedRange or NamedRanges with the given replacement content. Note that an individual NamedRange may consist of multiple discontinuous ranges. In this case, only the content in the first range will be replaced. The other ranges and their content will be deleted. In cases where replacing or deleting any ranges would result in an invalid document structure, a 400 bad request error is returned.",
    type: "object",
    properties: {
      text: {
        description: "Replaces the content of the specified named range(s) with the given text.",
        type: "string",
      },
      namedRangeName: {
        description:
          "The name of the NamedRanges whose content will be replaced. If there are multiple named ranges with the given name, then the content of each one will be replaced. If there are no named ranges with the given name, then the request will be a no-op.",
        type: "string",
      },
      namedRangeId: {
        description:
          "The ID of the named range whose content will be replaced. If there is no named range with the given ID a 400 bad request error is returned.",
        type: "string",
      },
      tabsCriteria: {
        description:
          "Optional. The criteria used to specify in which tabs the replacement occurs. When omitted, the replacement applies to all tabs. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the replacement applies to the singular tab. In a document containing multiple tabs: - If provided, the replacement applies to the specified tabs. - If omitted, the replacement applies to all tabs.",
        type: "ref",
        ref: "docs_TabsCriteria",
      },
    },
    required: [],
  },
  DocsLocation: {
    description: "A particular location in the document.",
    type: "object",
    properties: {
      segmentId: {
        description:
          "The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body.",
        type: "string",
      },
      tabId: {
        description:
          "The tab that the location is in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document.",
        type: "string",
      },
      index: {
        description:
          "The zero-based index, in UTF-16 code units. The index is relative to the beginning of the segment specified by segment_id.",
        type: "integer",
        format: "int32",
      },
    },
    required: [],
  },
  DocsSize: {
    description: "A width and height.",
    type: "object",
    properties: {
      height: {
        description: "The height of the object.",
        type: "ref",
        ref: "docs_Dimension",
      },
      width: {
        description: "The width of the object.",
        type: "ref",
        ref: "docs_Dimension",
      },
    },
    required: [],
  },
  DocsUpdateTableColumnPropertiesRequest: {
    description: "Updates the TableColumnProperties of columns in a table.",
    type: "object",
    properties: {
      fields: {
        description:
          'The fields that should be updated. At least one field must be specified. The root `tableColumnProperties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the column width, set `fields` to `"width"`.',
        type: "string",
      },
      tableColumnProperties: {
        description:
          "The table column properties to update. If the value of `table_column_properties#width` is less than 5 points (5/72 inch), a 400 bad request error is returned.",
        type: "ref",
        ref: "docs_TableColumnProperties",
      },
      tableStartLocation: {
        description: "The location where the table starts in the document.",
        type: "ref",
        ref: "docs_Location",
      },
      columnIndices: {
        description:
          "The list of zero-based column indices whose property should be updated. If no indices are specified, all columns will be updated.",
        type: "array",
        items: {
          type: "integer",
          format: "int32",
        },
      },
    },
    required: [],
  },
  DocsAddDocumentTabResponse: {
    description: "The result of adding a document tab.",
    type: "object",
    properties: {
      tabProperties: {
        description: "The properties of the newly added tab.",
        type: "ref",
        ref: "docs_TabProperties",
      },
    },
    required: [],
  },
  DocsDimension: {
    description: "A magnitude in a single direction in the specified units.",
    type: "object",
    properties: {
      unit: {
        description: "The units for magnitude.",
        type: "string",
        enum: ["UNIT_UNSPECIFIED", "PT"],
      },
      magnitude: {
        description: "The magnitude.",
        type: "number",
      },
    },
    required: [],
  },
  DocsSuggestionThread: {
    description:
      "Represents a single suggestion thread. Suggestion threads are created as a byproduct of saving changes to the document while in suggestion mode, and cannot be created directly.",
    type: "object",
    properties: {
      status: {
        description: "Whether the thread is open, accepted, or rejected.",
        type: "string",
        enum: ["STATUS_UNSPECIFIED", "OPEN", "ACCEPTED", "REJECTED"],
      },
      suggestionId: {
        description: "The unique ID of the suggestion.",
        type: "string",
      },
      headPost: {
        description: "The first post in the thread.",
        type: "ref",
        ref: "docs_Post",
      },
      summaryHtml: {
        description: "Summary of the suggested differences in the document, in HTML. May be empty.",
        type: "string",
      },
      replies: {
        description: "Replies to the head post.",
        type: "array",
        items: {
          type: "ref",
          ref: "docs_Post",
        },
      },
      summaryText: {
        description: "Summary of the suggested differences in the document, in plain text. May be empty.",
        type: "string",
      },
    },
    required: [],
  },
  DocsBookmarkLink: {
    description: "A reference to a bookmark in this document.",
    type: "object",
    properties: {
      tabId: {
        description: "The ID of the tab containing this bookmark.",
        type: "string",
      },
      id: {
        description: "The ID of a bookmark in this document.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityAppliedLabelChange: {
    description: "Label changes that were made on the Target.",
    type: "object",
    properties: {
      changes: {
        description: "Changes that were made to the Label on the Target.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_AppliedLabelChangeDetail",
        },
      },
    },
    required: [],
  },
  DriveactivityLegacy: {
    description:
      "A strategy that consolidates activities using the grouping rules from the legacy V1 Activity API. Similar actions occurring within a window of time can be grouped across multiple targets (such as moving a set of files at once) or multiple actors (such as several users editing the same item). Grouping rules for this strategy are specific to each type of action.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityDataLeakPreventionChange: {
    description: "A change in the object's data leak prevention status.",
    type: "object",
    properties: {
      type: {
        description: "The type of Data Leak Prevention (DLP) change.",
        type: "string",
        enum: ["TYPE_UNSPECIFIED", "FLAGGED", "CLEARED"],
      },
    },
    required: [],
  },
  DriveactivitySingleUser: {
    description: "Wrapper for User Field value.",
    type: "object",
    properties: {
      value: {
        description: "User value as email.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityTargetReference: {
    description: "A lightweight reference to the target of activity.",
    type: "object",
    properties: {
      driveItem: {
        description: "The target is a Drive item.",
        type: "ref",
        ref: "driveactivity_DriveItemReference",
      },
      teamDrive: {
        description: "This field is deprecated; please use the `drive` field instead.",
        deprecated: true,
        type: "ref",
        ref: "driveactivity_TeamDriveReference",
      },
      drive: {
        description: "The target is a shared drive.",
        type: "ref",
        ref: "driveactivity_DriveReference",
      },
    },
    required: [],
  },
  DriveactivityPost: {
    description: "A regular posted comment.",
    type: "object",
    properties: {
      subtype: {
        description: "The sub-type of this event.",
        type: "string",
        enum: ["SUBTYPE_UNSPECIFIED", "ADDED", "DELETED", "REPLY_ADDED", "REPLY_DELETED", "RESOLVED", "REOPENED"],
      },
    },
    required: [],
  },
  DriveactivityImpersonation: {
    description:
      "Information about an impersonation, where an admin acts on behalf of an end user. Information about the acting admin is not currently available.",
    type: "object",
    properties: {
      impersonatedUser: {
        description: "The impersonated user.",
        type: "ref",
        ref: "driveactivity_User",
      },
    },
    required: [],
  },
  DriveactivityFieldValueChange: {
    description: "Change to a Field value.",
    type: "object",
    properties: {
      fieldId: {
        description: "The ID of this field. Field IDs are unique within a Label.",
        type: "string",
      },
      oldValue: {
        description:
          "The value that was previously set on the field. If not present, the field was newly set. At least one of {old_value|new_value} is always set.",
        type: "ref",
        ref: "driveactivity_FieldValue",
      },
      newValue: {
        description:
          "The value that is now set on the field. If not present, the field was cleared. At least one of {old_value|new_value} is always set.",
        type: "ref",
        ref: "driveactivity_FieldValue",
      },
      displayName: {
        description: "The human-readable display name for this field.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityAdministrator: {
    description: "Empty message representing an administrator.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityDriveReference: {
    description: "A lightweight reference to a shared drive.",
    type: "object",
    properties: {
      name: {
        description:
          "The resource name of the shared drive. The format is `COLLECTION_ID/DRIVE_ID`. Clients should not assume a specific collection ID for this resource name.",
        type: "string",
      },
      title: {
        description: "The title of the shared drive.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityTimeRange: {
    description: "Information about time ranges.",
    type: "object",
    properties: {
      startTime: {
        description: "The start of the time range.",
        type: "string",
      },
      endTime: {
        description: "The end of the time range.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityDriveActivity: {
    description:
      "A single Drive activity comprising one or more Actions by one or more Actors on one or more Targets. Some Action groupings occur spontaneously, such as moving an item into a shared folder triggering a permission change. Other groupings of related Actions, such as multiple Actors editing one item or moving multiple files into a new folder, are controlled by the selection of a ConsolidationStrategy in the QueryDriveActivityRequest.",
    type: "object",
    properties: {
      actors: {
        description: "All actor(s) responsible for the activity.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_Actor",
        },
      },
      timeRange: {
        description: "The activity occurred over this time range.",
        type: "ref",
        ref: "driveactivity_TimeRange",
      },
      targets: {
        description:
          "All Google Drive objects this activity is about (e.g. file, folder, drive). This represents the state of the target immediately after the actions occurred.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_Target",
        },
      },
      primaryActionDetail: {
        description:
          "Key information about the primary action for this activity. This is either representative, or the most important, of all actions in the activity, according to the ConsolidationStrategy in the request.",
        type: "ref",
        ref: "driveactivity_ActionDetail",
      },
      actions: {
        description: "Details on all actions in this activity.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_Action",
        },
      },
      timestamp: {
        description: "The activity occurred at this specific time.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivitySelectionList: {
    description: "Wrapper for SelectionList Field value.",
    type: "object",
    properties: {
      values: {
        description: "Selection values.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_Selection",
        },
      },
    },
    required: [],
  },
  DriveactivityFile: {
    description: "This item is deprecated; please see `DriveFile` instead.",
    deprecated: true,
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityDelete: {
    description: "An object was deleted.",
    type: "object",
    properties: {
      type: {
        description: "The type of delete action taken.",
        type: "string",
        enum: ["TYPE_UNSPECIFIED", "TRASH", "PERMANENT_DELETE"],
      },
    },
    required: [],
  },
  DriveactivityRestrictionChange: {
    description: "Information about restriction policy changes to a feature.",
    type: "object",
    properties: {
      feature: {
        description: "The feature which had a change in restriction policy.",
        type: "string",
        enum: [
          "FEATURE_UNSPECIFIED",
          "SHARING_OUTSIDE_DOMAIN",
          "DIRECT_SHARING",
          "ITEM_DUPLICATION",
          "DRIVE_FILE_STREAM",
          "FILE_ORGANIZER_CAN_SHARE_FOLDERS",
          "READERS_CAN_DOWNLOAD",
          "WRITERS_CAN_DOWNLOAD",
        ],
      },
      newRestriction: {
        description: "The restriction in place after the change.",
        type: "string",
        enum: ["RESTRICTION_UNSPECIFIED", "UNRESTRICTED", "FULLY_RESTRICTED"],
      },
    },
    required: [],
  },
  DriveactivityNew: {
    description: "An object was created from scratch.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityInteger: {
    description: "Wrapper for Integer Field value.",
    type: "object",
    properties: {
      value: {
        description: "Integer value.",
        type: "string",
        pattern: "^-?\\d+$",
      },
    },
    required: [],
  },
  DriveactivitySuggestion: {
    description: "A suggestion.",
    type: "object",
    properties: {
      subtype: {
        description: "The sub-type of this event.",
        type: "string",
        enum: [
          "SUBTYPE_UNSPECIFIED",
          "ADDED",
          "DELETED",
          "REPLY_ADDED",
          "REPLY_DELETED",
          "ACCEPTED",
          "REJECTED",
          "ACCEPT_DELETED",
          "REJECT_DELETED",
        ],
      },
    },
    required: [],
  },
  DriveactivityGroup: {
    description: "Information about a group.",
    type: "object",
    properties: {
      email: {
        description: "The email address of the group.",
        type: "string",
      },
      title: {
        description: "The title of the group.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityQueryDriveActivityResponse: {
    description: "Response message for querying Drive activity.",
    type: "object",
    properties: {
      activities: {
        description: "List of activity requested.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_DriveActivity",
        },
      },
      nextPageToken: {
        description: "Token to retrieve the next page of results, or empty if there are no more results in the list.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityActionDetail: {
    description: "Data describing the type and additional information of an action.",
    type: "object",
    properties: {
      restore: {
        description: "A deleted object was restored.",
        type: "ref",
        ref: "driveactivity_Restore",
      },
      permissionChange: {
        description: "The permission on an object was changed.",
        type: "ref",
        ref: "driveactivity_PermissionChange",
      },
      dlpChange: {
        description: "A change happened in data leak prevention status.",
        type: "ref",
        ref: "driveactivity_DataLeakPreventionChange",
      },
      edit: {
        description: "An object was edited.",
        type: "ref",
        ref: "driveactivity_Edit",
      },
      settingsChange: {
        description: "Settings were changed.",
        type: "ref",
        ref: "driveactivity_SettingsChange",
      },
      reference: {
        description: "An object was referenced in an application outside of Drive/Docs.",
        type: "ref",
        ref: "driveactivity_ApplicationReference",
      },
      create: {
        description: "An object was created.",
        type: "ref",
        ref: "driveactivity_Create",
      },
      rename: {
        description: "An object was renamed.",
        type: "ref",
        ref: "driveactivity_Rename",
      },
      move: {
        description: "An object was moved.",
        type: "ref",
        ref: "driveactivity_Move",
      },
      appliedLabelChange: {
        description: "Label was changed.",
        type: "ref",
        ref: "driveactivity_AppliedLabelChange",
      },
      comment: {
        description: "A change about comments was made.",
        type: "ref",
        ref: "driveactivity_Comment",
      },
      delete: {
        description: "An object was deleted.",
        type: "ref",
        ref: "driveactivity_Delete",
      },
    },
    required: [],
  },
  DriveactivityAction: {
    description: "Information about the action.",
    type: "object",
    properties: {
      detail: {
        description: "The type and detailed information about the action.",
        type: "ref",
        ref: "driveactivity_ActionDetail",
      },
      timestamp: {
        description: "The action occurred at this specific time.",
        type: "string",
      },
      target: {
        description:
          "The target this action affects (or empty if affecting all targets). This represents the state of the target immediately after this action occurred.",
        type: "ref",
        ref: "driveactivity_Target",
      },
      timeRange: {
        description: "The action occurred over this time range.",
        type: "ref",
        ref: "driveactivity_TimeRange",
      },
      actor: {
        description: "The actor responsible for this action (or empty if all actors are responsible).",
        type: "ref",
        ref: "driveactivity_Actor",
      },
    },
    required: [],
  },
  DriveactivityComment: {
    description: "A change about comments on an object.",
    type: "object",
    properties: {
      suggestion: {
        description: "A change on a suggestion.",
        type: "ref",
        ref: "driveactivity_Suggestion",
      },
      assignment: {
        description: "A change on an assignment.",
        type: "ref",
        ref: "driveactivity_Assignment",
      },
      post: {
        description: "A change on a regular posted comment.",
        type: "ref",
        ref: "driveactivity_Post",
      },
      mentionedUsers: {
        description: "Users who are mentioned in this comment.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_User",
        },
      },
    },
    required: [],
  },
  DriveactivityFileComment: {
    description: "A comment on a file.",
    type: "object",
    properties: {
      legacyCommentId: {
        description:
          "The comment in the discussion thread. This identifier is an opaque string compatible with the Drive API; see https://developers.google.com/workspace/drive/v3/reference/comments/get",
        type: "string",
      },
      linkToDiscussion: {
        description:
          "The link to the discussion thread containing this comment, for example, `https://docs.google.com/DOCUMENT_ID/edit?disco=THREAD_ID`.",
        type: "string",
      },
      legacyDiscussionId: {
        description:
          "The discussion thread to which the comment was added. This identifier is an opaque string compatible with the Drive API and references the first comment in a discussion; see https://developers.google.com/workspace/drive/v3/reference/comments/get",
        type: "string",
      },
      parent: {
        description: "The Drive item containing this comment.",
        type: "ref",
        ref: "driveactivity_DriveItem",
      },
    },
    required: [],
  },
  DriveactivityAssignment: {
    description: "A comment with an assignment.",
    type: "object",
    properties: {
      subtype: {
        description: "The sub-type of this event.",
        type: "string",
        enum: [
          "SUBTYPE_UNSPECIFIED",
          "ADDED",
          "DELETED",
          "REPLY_ADDED",
          "REPLY_DELETED",
          "RESOLVED",
          "REOPENED",
          "REASSIGNED",
        ],
      },
      assignedUser: {
        description: "The user to whom the comment was assigned.",
        type: "ref",
        ref: "driveactivity_User",
      },
    },
    required: [],
  },
  DriveactivityNoConsolidation: {
    description: "A strategy that does no consolidation of individual activities.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityDriveFile: {
    description: "A Drive item which is a file.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityText: {
    description: "Wrapper for Text Field value.",
    type: "object",
    properties: {
      value: {
        description: "Value of Text Field.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityMove: {
    description: "An object was moved.",
    type: "object",
    properties: {
      addedParents: {
        description: "The added parent object(s).",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_TargetReference",
        },
      },
      removedParents: {
        description: "The removed parent object(s).",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_TargetReference",
        },
      },
    },
    required: [],
  },
  DriveactivityUnknownUser: {
    description: "A user about whom nothing is currently known.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivitySettingsChange: {
    description: "Information about settings changes.",
    type: "object",
    properties: {
      restrictionChanges: {
        description: "The set of changes made to restrictions.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_RestrictionChange",
        },
      },
    },
    required: [],
  },
  DriveactivityApplicationReference: {
    description: "Activity in applications other than Drive.",
    type: "object",
    properties: {
      type: {
        description: "The reference type corresponding to this event.",
        type: "string",
        enum: ["UNSPECIFIED_REFERENCE_TYPE", "LINK", "DISCUSS"],
      },
    },
    required: [],
  },
  DriveactivityEdit: {
    description: "An empty message indicating an object was edited.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityAnyone: {
    description: "Represents any user (including a logged out user).",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityTeamDrive: {
    description: "This item is deprecated; please see `Drive` instead.",
    deprecated: true,
    type: "object",
    properties: {
      title: {
        description: "This field is deprecated; please see `Drive.title` instead.",
        type: "string",
      },
      name: {
        description: "This field is deprecated; please see `Drive.name` instead.",
        type: "string",
      },
      root: {
        description: "This field is deprecated; please see `Drive.root` instead.",
        type: "ref",
        ref: "driveactivity_DriveItem",
      },
    },
    required: [],
  },
  DriveactivitySystemEvent: {
    description: "Event triggered by system operations instead of end users.",
    type: "object",
    properties: {
      type: {
        description: "The type of the system event that may triggered activity.",
        type: "string",
        enum: ["TYPE_UNSPECIFIED", "USER_DELETION", "TRASH_AUTO_PURGE"],
      },
    },
    required: [],
  },
  DriveactivityDomain: {
    description: "Information about a domain.",
    type: "object",
    properties: {
      legacyId: {
        description: "An opaque string used to identify this domain.",
        type: "string",
      },
      name: {
        description: "The name of the domain, e.g. `google.com`.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityActor: {
    description: "The actor of a Drive activity.",
    type: "object",
    properties: {
      anonymous: {
        description: "An anonymous user.",
        type: "ref",
        ref: "driveactivity_AnonymousUser",
      },
      user: {
        description: "An end user.",
        type: "ref",
        ref: "driveactivity_User",
      },
      system: {
        description: "A non-user actor (i.e. system triggered).",
        type: "ref",
        ref: "driveactivity_SystemEvent",
      },
      administrator: {
        description: "An administrator.",
        type: "ref",
        ref: "driveactivity_Administrator",
      },
      impersonation: {
        description: "An account acting on behalf of another.",
        type: "ref",
        ref: "driveactivity_Impersonation",
      },
    },
    required: [],
  },
  DriveactivitySelection: {
    description: "Wrapper for Selection Field value as combined value/display_name pair for selected choice.",
    type: "object",
    properties: {
      value: {
        description: "Selection value as Field Choice ID.",
        type: "string",
      },
      displayName: {
        description: "Selection value as human-readable display string.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityPermission: {
    description: "The permission setting of an object.",
    type: "object",
    properties: {
      allowDiscovery: {
        description:
          'If true, the item can be discovered (e.g. in the user\'s "Shared with me" collection) without needing a link to the item.',
        type: "boolean",
      },
      role: {
        description:
          "Indicates the [Google Drive permissions role](https://developers.google.com/workspace/drive/web/manage-sharing#roles). The role determines a user's ability to read, write, and comment on items.",
        type: "string",
        enum: [
          "ROLE_UNSPECIFIED",
          "OWNER",
          "ORGANIZER",
          "FILE_ORGANIZER",
          "EDITOR",
          "COMMENTER",
          "VIEWER",
          "PUBLISHED_VIEWER",
        ],
      },
      domain: {
        description: "The domain to whom this permission applies.",
        type: "ref",
        ref: "driveactivity_Domain",
      },
      user: {
        description: "The user to whom this permission applies.",
        type: "ref",
        ref: "driveactivity_User",
      },
      group: {
        description: "The group to whom this permission applies.",
        type: "ref",
        ref: "driveactivity_Group",
      },
      anyone: {
        description: "If set, this permission applies to anyone, even logged out users.",
        type: "ref",
        ref: "driveactivity_Anyone",
      },
    },
    required: [],
  },
  DriveactivityRename: {
    description: "An object was renamed.",
    type: "object",
    properties: {
      oldTitle: {
        description: "The previous title of the drive object.",
        type: "string",
      },
      newTitle: {
        description: "The new title of the drive object.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityRestore: {
    description: "A deleted object was restored.",
    type: "object",
    properties: {
      type: {
        description: "The type of restore action taken.",
        type: "string",
        enum: ["TYPE_UNSPECIFIED", "UNTRASH"],
      },
    },
    required: [],
  },
  DriveactivityKnownUser: {
    description: "A known user.",
    type: "object",
    properties: {
      isCurrentUser: {
        description: "True if this is the user making the request.",
        type: "boolean",
      },
      personName: {
        description:
          "The identifier for this user that can be used with the People API to get more information. The format is `people/ACCOUNT_ID`. See https://developers.google.com/people/.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityUserList: {
    description: "Wrapper for UserList Field value.",
    type: "object",
    properties: {
      values: {
        description: "User values.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_SingleUser",
        },
      },
    },
    required: [],
  },
  DriveactivityQueryDriveActivityRequest: {
    description: "The request message for querying Drive activity.",
    type: "object",
    properties: {
      pageSize: {
        description:
          "The minimum number of activities desired in the response; the server attempts to return at least this quantity. The server may also return fewer activities if it has a partial response ready before the request times out. If not set, a default value is used.",
        type: "integer",
        format: "int32",
      },
      ancestorName: {
        description:
          "Return activities for this Drive folder, plus all children and descendants. The format is `items/ITEM_ID`.",
        type: "string",
      },
      filter: {
        description:
          'The filtering for items returned from this query request. The format of the filter string is a sequence of expressions, joined by an optional "AND", where each expression is of the form "field operator value". Supported fields: - `time`: Uses numerical operators on date values either in terms of milliseconds since Jan 1, 1970 or in RFC 3339 format. Examples: - `time > 1452409200000 AND time <= 1492812924310` - `time >= "2016-01-10T01:02:03-05:00"` - `detail.action_detail_case`: Uses the "has" operator (:) and either a singular value or a list of allowed action types enclosed in parentheses, separated by a space. To exclude a result from the response, prepend a hyphen (`-`) to the beginning of the filter string. Examples: - `detail.action_detail_case:RENAME` - `detail.action_detail_case:(CREATE RESTORE)` - `-detail.action_detail_case:MOVE` ',
        type: "string",
      },
      consolidationStrategy: {
        description:
          "Details on how to consolidate related actions that make up the activity. If not set, then related actions aren't consolidated.",
        type: "ref",
        ref: "driveactivity_ConsolidationStrategy",
      },
      itemName: {
        description: "Return activities for this Drive item. The format is `items/ITEM_ID`.",
        type: "string",
      },
      pageToken: {
        description:
          "The token identifies which page of results to return. Set this to the next_page_token value returned from a previous query to obtain the following page of results. If not set, the first page of results is returned.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityUpload: {
    description: "An object was uploaded into Drive.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityCreate: {
    description: "An object was created.",
    type: "object",
    properties: {
      upload: {
        description: "If present, indicates the object originated externally and was uploaded to Drive.",
        type: "ref",
        ref: "driveactivity_Upload",
      },
      copy: {
        description: "If present, indicates the object was created by copying an existing Drive object.",
        type: "ref",
        ref: "driveactivity_Copy",
      },
      "new": {
        description:
          "If present, indicates the object was newly created (e.g. as a blank document), not derived from a Drive object or external object.",
        type: "ref",
        ref: "driveactivity_New",
      },
    },
    required: [],
  },
  DriveactivityUser: {
    description: "Information about an end user.",
    type: "object",
    properties: {
      knownUser: {
        description: "A known user.",
        type: "ref",
        ref: "driveactivity_KnownUser",
      },
      deletedUser: {
        description: "A user whose account has since been deleted.",
        type: "ref",
        ref: "driveactivity_DeletedUser",
      },
      unknownUser: {
        description: "A user about whom nothing is currently known.",
        type: "ref",
        ref: "driveactivity_UnknownUser",
      },
    },
    required: [],
  },
  DriveactivityDrive: {
    description: "Information about a shared drive.",
    type: "object",
    properties: {
      name: {
        description:
          "The resource name of the shared drive. The format is `COLLECTION_ID/DRIVE_ID`. Clients should not assume a specific collection ID for this resource name.",
        type: "string",
      },
      root: {
        description: "The root of this shared drive.",
        type: "ref",
        ref: "driveactivity_DriveItem",
      },
      title: {
        description: "The title of the shared drive.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityDriveItemReference: {
    description: "A lightweight reference to a Drive item, such as a file or folder.",
    type: "object",
    properties: {
      name: {
        description: "The target Drive item. The format is `items/ITEM_ID`.",
        type: "string",
      },
      title: {
        description: "The title of the Drive item.",
        type: "string",
      },
      driveFolder: {
        description: "The Drive item is a folder. Includes information about the type of folder.",
        type: "ref",
        ref: "driveactivity_DriveFolder",
      },
      folder: {
        description: "This field is deprecated; please use the `driveFolder` field instead.",
        deprecated: true,
        type: "ref",
        ref: "driveactivity_Folder",
      },
      driveFile: {
        description: "The Drive item is a file.",
        type: "ref",
        ref: "driveactivity_DriveFile",
      },
      file: {
        description: "This field is deprecated; please use the `driveFile` field instead.",
        deprecated: true,
        type: "ref",
        ref: "driveactivity_File",
      },
    },
    required: [],
  },
  DriveactivityAppliedLabelChangeDetail: {
    description: "A change made to a Label on the Target.",
    type: "object",
    properties: {
      fieldChanges: {
        description: "Field Changes. Only present if `types` contains `LABEL_FIELD_VALUE_CHANGED`.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_FieldValueChange",
        },
      },
      label: {
        description:
          "The Label name representing the Label that changed. This name always contains the revision of the Label that was used when this Action occurred. The format is `labels/id@revision`.",
        type: "string",
      },
      types: {
        description: "The types of changes made to the Label on the Target.",
        type: "array",
        items: {
          type: "string",
          enum: [
            "TYPE_UNSPECIFIED",
            "LABEL_ADDED",
            "LABEL_REMOVED",
            "LABEL_FIELD_VALUE_CHANGED",
            "LABEL_APPLIED_BY_ITEM_CREATE",
          ],
        },
      },
      title: {
        description: "The human-readable title of the label that changed.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityAnonymousUser: {
    description:
      "Empty message representing an anonymous user or indicating the authenticated user should be anonymized.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityFieldValue: {
    description: "Contains a value of a Field.",
    type: "object",
    properties: {
      userList: {
        description: "User List Field value.",
        type: "ref",
        ref: "driveactivity_UserList",
      },
      date: {
        description: "Date Field value.",
        type: "ref",
        ref: "driveactivity_Date",
      },
      integer: {
        description: "Integer Field value.",
        type: "ref",
        ref: "driveactivity_Integer",
      },
      selectionList: {
        description: "Selection List Field value.",
        type: "ref",
        ref: "driveactivity_SelectionList",
      },
      textList: {
        description: "Text List Field value.",
        type: "ref",
        ref: "driveactivity_TextList",
      },
      text: {
        description: "Text Field value.",
        type: "ref",
        ref: "driveactivity_Text",
      },
      user: {
        description: "User Field value.",
        type: "ref",
        ref: "driveactivity_SingleUser",
      },
      selection: {
        description: "Selection Field value.",
        type: "ref",
        ref: "driveactivity_Selection",
      },
    },
    required: [],
  },
  DriveactivityDeletedUser: {
    description: "A user whose account has since been deleted.",
    type: "object",
    properties: {},
    required: [],
  },
  DriveactivityDriveItem: {
    description: "A Drive item, such as a file or folder.",
    type: "object",
    properties: {
      mimeType: {
        description:
          "The MIME type of the Drive item. See https://developers.google.com/workspace/drive/v3/web/mime-types.",
        type: "string",
      },
      name: {
        description: "The target Drive item. The format is `items/ITEM_ID`.",
        type: "string",
      },
      driveFolder: {
        description: "The Drive item is a folder. Includes information about the type of folder.",
        type: "ref",
        ref: "driveactivity_DriveFolder",
      },
      folder: {
        description: "This field is deprecated; please use the `driveFolder` field instead.",
        deprecated: true,
        type: "ref",
        ref: "driveactivity_Folder",
      },
      owner: {
        description: "Information about the owner of this Drive item.",
        type: "ref",
        ref: "driveactivity_Owner",
      },
      driveFile: {
        description: "The Drive item is a file.",
        type: "ref",
        ref: "driveactivity_DriveFile",
      },
      file: {
        description: "This field is deprecated; please use the `driveFile` field instead.",
        deprecated: true,
        type: "ref",
        ref: "driveactivity_File",
      },
      title: {
        description: "The title of the Drive item.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityFolder: {
    description: "This item is deprecated; please see `DriveFolder` instead.",
    deprecated: true,
    type: "object",
    properties: {
      type: {
        description: "This field is deprecated; please see `DriveFolder.type` instead.",
        type: "string",
        enum: ["TYPE_UNSPECIFIED", "MY_DRIVE_ROOT", "TEAM_DRIVE_ROOT", "STANDARD_FOLDER"],
      },
    },
    required: [],
  },
  DriveactivityTextList: {
    description: "Wrapper for Text List Field value.",
    type: "object",
    properties: {
      values: {
        description: "Text values.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_Text",
        },
      },
    },
    required: [],
  },
  DriveactivityTarget: {
    description:
      "Information about the target of activity. For more information on how activity history is shared with users, see [Activity history visibility](https://developers.google.com/workspace/drive/activity/v2#activityhistory).",
    type: "object",
    properties: {
      drive: {
        description: "The target is a shared drive.",
        type: "ref",
        ref: "driveactivity_Drive",
      },
      driveItem: {
        description: "The target is a Drive item.",
        type: "ref",
        ref: "driveactivity_DriveItem",
      },
      teamDrive: {
        description: "This field is deprecated; please use the `drive` field instead.",
        deprecated: true,
        type: "ref",
        ref: "driveactivity_TeamDrive",
      },
      fileComment: {
        description: "The target is a comment on a Drive file.",
        type: "ref",
        ref: "driveactivity_FileComment",
      },
    },
    required: [],
  },
  DriveactivityDriveFolder: {
    description: "A Drive item which is a folder.",
    type: "object",
    properties: {
      type: {
        description: "The type of Drive folder.",
        type: "string",
        enum: ["TYPE_UNSPECIFIED", "MY_DRIVE_ROOT", "SHARED_DRIVE_ROOT", "STANDARD_FOLDER"],
      },
    },
    required: [],
  },
  DriveactivityConsolidationStrategy: {
    description:
      "How the individual activities are consolidated. If a set of activities is related they can be consolidated into one combined activity, such as one actor performing the same action on multiple targets, or multiple actors performing the same action on a single target. The strategy defines the rules for which activities are related.",
    type: "object",
    properties: {
      legacy: {
        description: "The individual activities are consolidated using the legacy strategy.",
        type: "ref",
        ref: "driveactivity_Legacy",
      },
      none: {
        description: "The individual activities are not consolidated.",
        type: "ref",
        ref: "driveactivity_NoConsolidation",
      },
    },
    required: [],
  },
  DriveactivityPermissionChange: {
    description: "A change of the permission setting on an item.",
    type: "object",
    properties: {
      addedPermissions: {
        description: "The set of permissions added by this change.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_Permission",
        },
      },
      removedPermissions: {
        description: "The set of permissions removed by this change.",
        type: "array",
        items: {
          type: "ref",
          ref: "driveactivity_Permission",
        },
      },
    },
    required: [],
  },
  DriveactivityTeamDriveReference: {
    description: "This item is deprecated; please see `DriveReference` instead.",
    deprecated: true,
    type: "object",
    properties: {
      name: {
        description: "This field is deprecated; please see `DriveReference.name` instead.",
        type: "string",
      },
      title: {
        description: "This field is deprecated; please see `DriveReference.title` instead.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityCopy: {
    description: "An object was created by copying an existing object.",
    type: "object",
    properties: {
      originalObject: {
        description: "The original object.",
        type: "ref",
        ref: "driveactivity_TargetReference",
      },
    },
    required: [],
  },
  DriveactivityDate: {
    description: "Wrapper for Date Field value.",
    type: "object",
    properties: {
      value: {
        description: "Date value.",
        type: "string",
      },
    },
    required: [],
  },
  DriveactivityOwner: {
    description: "Information about the owner of a Drive item.",
    type: "object",
    properties: {
      domain: {
        description: "The domain of the Drive item owner.",
        type: "ref",
        ref: "driveactivity_Domain",
      },
      teamDrive: {
        description: "This field is deprecated; please use the `drive` field instead.",
        deprecated: true,
        type: "ref",
        ref: "driveactivity_TeamDriveReference",
      },
      user: {
        description: "The user that owns the Drive item.",
        type: "ref",
        ref: "driveactivity_User",
      },
      drive: {
        description: "The drive that owns the item.",
        type: "ref",
        ref: "driveactivity_DriveReference",
      },
    },
    required: [],
  },
}
