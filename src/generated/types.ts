// GENERATED. DO NOT EDIT.
// Source: spec/google/*.json, verified by provenance.json
// Run: pnpm generate

/** This resource represents a long-running operation that is the result of a network API call. */
export type DriveOperation = {
  /** The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`. */
  response?: Record<string, unknown>
  /** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any. */
  metadata?: Record<string, unknown>
  /** The error result of the operation in case of failure or cancellation. */
  error?: DriveStatus
  /** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
  name?: string
  /** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
  done?: boolean
}

/** A permission for a file. A permission grants a user, group, domain, or the world access to a file or a folder hierarchy. For more information, see [Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing). By default, permission requests only return a subset of fields. Permission `kind`, `ID`, `type`, and `role` are always returned. To retrieve specific fields, see [Return specific fields](https://developers.google.com/workspace/drive/api/guides/fields-parameter). Some resource methods (such as `permissions.update`) require a `permissionId`. Use the `permissions.list` method to retrieve the ID for a file, folder, or shared drive. */
export type DrivePermission = {
  /** The type of the grantee. Supported values include: * `user` * `group` * `domain` * `anyone` When creating a permission, if `type` is `user` or `group`, you must provide an `emailAddress` for the user or group. If `type` is `domain`, you must provide a `domain`. If `type` is `anyone`, no extra information is required. */
  type?: string
  /** Output only. Details of whether the permissions on this item are inherited or are directly on this item. */
  permissionDetails?: Array<{
    /** Output only. The primary role for this user. Supported values include: * `owner` * `organizer` * `fileOrganizer` * `writer` * `commenter` * `reader` For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles). */
    role?: string
    /** Output only. The ID of the item from which this permission is inherited. This is only populated for items in shared drives. */
    inheritedFrom?: string
    /** Output only. Whether this permission is inherited. This field is always populated. This is an output-only field. */
    inherited?: boolean
    /** Output only. The permission type for this user. Supported values include: * `file` * `member` */
    permissionType?: string
  }>
  /** Output only. Deprecated: Output only. Use `permissionDetails` instead. */
  teamDrivePermissionDetails?: Array<{
    /** Deprecated: Output only. Use `permissionDetails/inherited` instead. */
    inherited?: boolean
    /** Deprecated: Output only. Use `permissionDetails/inheritedFrom` instead. */
    inheritedFrom?: string
    /** Deprecated: Output only. Use `permissionDetails/permissionType` instead. */
    teamDrivePermissionType?: string
    /** Deprecated: Output only. Use `permissionDetails/role` instead. */
    role?: string
  }>
  /** Output only. Whether the account associated with this permission has been deleted. This field only pertains to permissions of type `user` or `group`. */
  deleted?: boolean
  /** Whether the permission allows the file to be discovered through search. This is only applicable for permissions of type `domain` or `anyone`. */
  allowFileDiscovery?: boolean
  /** Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#permission"`. */
  kind?: string
  /** The role granted by this permission. Supported values include: * `owner` * `organizer` * `fileOrganizer` * `writer` * `commenter` * `reader` For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles). */
  role?: string
  /** Output only. The ID of this permission. This is a unique identifier for the grantee, and is published in the [User resource](https://developers.google.com/workspace/drive/api/reference/rest/v3/User) as `permissionId`. IDs should be treated as opaque values. */
  id?: string
  /** Output only. A link to the user's profile photo, if available. */
  photoLink?: string
  /** When `true`, only organizers, owners, and users with permissions added directly on the item can access it. */
  inheritedPermissionsDisabled?: boolean
  /** Whether the account associated with this permission is a pending owner. Only populated for permissions of type `user` for files that aren't in a shared drive. */
  pendingOwner?: boolean
  /** The time at which this permission will expire (RFC 3339 date-time). Expiration times have the following restrictions: - They can only be set on user and group permissions - The time must be in the future - The time cannot be more than a year in the future */
  expirationTime?: string
  /** Output only. The email address of the user or group to which this permission refers. */
  emailAddress?: string
  /** Output only. The "pretty" name of the value of the permission. The following is a list of examples for each type of permission: * `user` - User's full name, as defined for their Google Account, such as "Dana A." * `group` - Name of the Google Group, such as "The Company Administrators." * `domain` - String domain name, such as "cymbalgroup.com." * `anyone` - No `displayName` is present. */
  displayName?: string
  /** Output only. The domain to which this permission refers. */
  domain?: string
  /** Indicates the view for this permission. Only populated for permissions that belong to a view. The only supported values are `published` and `metadata`: * `published`: The permission's role is `publishedReader`. * `metadata`: The item is only visible to the `metadata` view because the item has limited access and the scope has at least read access to the parent. The `metadata` view is only supported on folders. For more information, see [Views](https://developers.google.com/workspace/drive/api/guides/ref-roles#views). */
  view?: string
}

/** Representation of a reviewer addition. */
export type DriveAddReviewer = {
  /** Required. The email of the reviewer to add. */
  addedReviewerEmail?: string
}

/** Deprecated: use the drive collection instead. Next ID: 33 */
export type DriveTeamDrive = {
  /** Capabilities the current user has on this Team Drive. */
  capabilities?: {
    /** Whether the current user can edit files in this Team Drive */
    canEdit?: boolean
    /** Whether the current user can list the children of folders in this Team Drive. */
    canListChildren?: boolean
    /** Whether the current user can rename this Team Drive. */
    canRenameTeamDrive?: boolean
    /** Whether the current user can change the `teamMembersOnly` restriction of this Team Drive. */
    canChangeTeamMembersOnlyRestriction?: boolean
    /** Whether the current user can change the `sharingFoldersRequiresOrganizerPermission` restriction of this Team Drive. */
    canChangeSharingFoldersRequiresOrganizerPermissionRestriction?: boolean
    /** Whether the current user can read the revisions resource of files in this Team Drive. */
    canReadRevisions?: boolean
    /** Whether the current user can change the `domainUsersOnly` restriction of this Team Drive. */
    canChangeDomainUsersOnlyRestriction?: boolean
    /** Whether the current user can delete children from folders in this Team Drive. */
    canDeleteChildren?: boolean
    /** Output only. Whether the current user can change organizer-applied download restrictions of this shared drive. */
    canChangeDownloadRestriction?: boolean
    /** Whether the current user can reset the Team Drive restrictions to defaults. */
    canResetTeamDriveRestrictions?: boolean
    /** Whether the current user can share files or folders in this Team Drive. */
    canShare?: boolean
    /** Whether the current user can rename files or folders in this Team Drive. */
    canRename?: boolean
    /** Whether the current user can add members to this Team Drive or remove them or change their role. */
    canManageMembers?: boolean
    /** Whether the current user can change the background of this Team Drive. */
    canChangeTeamDriveBackground?: boolean
    /** Whether the current user can change the `copyRequiresWriterPermission` restriction of this Team Drive. */
    canChangeCopyRequiresWriterPermissionRestriction?: boolean
    /** Whether the current user can add children to folders in this Team Drive. */
    canAddChildren?: boolean
    /** Whether the current user can download files in this Team Drive. */
    canDownload?: boolean
    /** Whether the current user can delete this Team Drive. Attempting to delete the Team Drive may still fail if there are untrashed items inside the Team Drive. */
    canDeleteTeamDrive?: boolean
    /** Whether the current user can copy files in this Team Drive. */
    canCopy?: boolean
    /** Whether the current user can comment on files in this Team Drive. */
    canComment?: boolean
    /** Whether the current user can trash children from folders in this Team Drive. */
    canTrashChildren?: boolean
    /** Deprecated: Use `canDeleteChildren` or `canTrashChildren` instead. */
    canRemoveChildren?: boolean
  }
  /** The ID of this Team Drive which is also the ID of the top level folder of this Team Drive. */
  id?: string
  /** A set of restrictions that apply to this Team Drive or items inside this Team Drive. */
  restrictions?: {
    /** If true, only users with the organizer role can share folders. If false, users with either the organizer role or the file organizer role can share folders. */
    sharingFoldersRequiresOrganizerPermission?: boolean
    /** Whether access to items inside this Team Drive is restricted to members of this Team Drive. */
    teamMembersOnly?: boolean
    /** Whether the options to copy, print, or download files inside this Team Drive, should be disabled for readers and commenters. When this restriction is set to `true`, it will override the similarly named field to `true` for any file inside this Team Drive. */
    copyRequiresWriterPermission?: boolean
    /** Whether administrative privileges on this Team Drive are required to modify restrictions. */
    adminManagedRestrictions?: boolean
    /** Download restrictions applied by shared drive managers. */
    downloadRestriction?: DriveDownloadRestriction
    /** Whether access to this Team Drive and items inside this Team Drive is restricted to users of the domain to which this Team Drive belongs. This restriction may be overridden by other sharing policies controlled outside of this Team Drive. */
    domainUsersOnly?: boolean
  }
  /** The organizational unit of this shared drive. This field is only populated on `drives.list` responses when the `useDomainAdminAccess` parameter is set to `true`. */
  orgUnitId?: string
  /** The ID of the theme from which the background image and color will be set. The set of possible `teamDriveThemes` can be retrieved from a `drive.about.get` response. When not specified on a `drive.teamdrives.create` request, a random theme is chosen from which the background image and color are set. This is a write-only field; it can only be set on requests that don't set `colorRgb` or `backgroundImageFile`. */
  themeId?: string
  /** The name of this Team Drive. */
  name?: string
  /** The background image file for a Team Drive. */
  backgroundImageFile?: {
    /** The width of the cropped image in the closed range of 0 to 1. This value represents the width of the cropped image divided by the width of the entire image. The height is computed by applying a width to height aspect ratio of 80 to 9. The resulting image must be at least 1280 pixels wide and 144 pixels high. */
    width?: number
    /** The ID of an image file in Drive to use for the background image. */
    id?: string
    /** The X coordinate of the upper left corner of the cropping area in the background image. This is a value in the closed range of 0 to 1. This value represents the horizontal distance from the left side of the entire image to the left side of the cropping area divided by the width of the entire image. */
    xCoordinate?: number
    /** The Y coordinate of the upper left corner of the cropping area in the background image. This is a value in the closed range of 0 to 1. This value represents the vertical distance from the top side of the entire image to the top side of the cropping area divided by the height of the entire image. */
    yCoordinate?: number
  }
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#teamDrive"`. */
  kind?: string
  /** A short-lived link to this Team Drive's background image. */
  backgroundImageLink?: string
  /** The time at which the Team Drive was created (RFC 3339 date-time). */
  createdTime?: string
  /** The color of this Team Drive as an RGB hex string. It can only be set on a `drive.teamdrives.update` request that does not set `themeId`. */
  colorRgb?: string
}

/** The response to an access proposal list request. */
export type DriveListAccessProposalsResponse = {
  /** The continuation token for the next page of results. This will be absent if the end of the results list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. */
  nextPageToken?: string
  /** The list of access proposals. This field is only populated in Drive API v3. */
  accessProposals?: Array<DriveAccessProposal>
}

/** A reply to a comment on a file. Some resource methods (such as `replies.update`) require a `replyId`. Use the `replies.list` method to retrieve the ID for a reply. */
export type DriveReply = {
  /** The time at which the reply was created (RFC 3339 date-time). */
  createdTime?: string
  /** Output only. A list of email addresses for users mentioned in this comment. If no users are mentioned, the list is empty. */
  mentionedEmailAddresses?: Array<string>
  /** Output only. The email address of the user assigned to this comment. If no user is assigned, the field is unset. */
  assigneeEmailAddress?: string
  /** The plain text content of the reply. This field is used for setting the content, while `htmlContent` should be displayed. This field is required by the `create` method if no `action` value is specified. */
  content?: string
  /** Output only. The ID of the reply. */
  id?: string
  /** Output only. The author of the reply. The author's email address and permission ID won't be populated. */
  author?: DriveUser
  /** The action the reply performed to the parent comment. The supported values are: * `resolve` * `reopen` */
  action?: string
  /** Output only. Whether the reply has been deleted. A deleted reply has no content. */
  deleted?: boolean
  /** Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#reply"`. */
  kind?: string
  /** The last time the reply was modified (RFC 3339 date-time). */
  modifiedTime?: string
  /** Output only. The content of the reply with HTML formatting. */
  htmlContent?: string
}

/** A comment on a file. Some resource methods (such as `comments.update`) require a `commentId`. Use the `comments.list` method to retrieve the ID for a comment in a file. */
export type DriveComment = {
  /** Output only. Whether the comment has been resolved by one of its replies. */
  resolved?: boolean
  /** Output only. The full list of replies to the comment in chronological order. */
  replies?: Array<DriveReply>
  /** The file content to which the comment refers, typically within the anchor region. For a text file, for example, this would be the text at the location of the comment. */
  quotedFileContent?: {
    /** The quoted content itself. This is interpreted as plain text if set through the API. */
    value?: string
    /** The MIME type of the quoted content. */
    mimeType?: string
  }
  /** Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#comment"`. */
  kind?: string
  /** A region of the document represented as a JSON string. For details on defining anchor properties, refer to [Manage comments and replies](https://developers.google.com/workspace/drive/api/v3/manage-comments). */
  anchor?: string
  /** The last time the comment or any of its replies was modified (RFC 3339 date-time). */
  modifiedTime?: string
  /** Output only. The content of the comment with HTML formatting. */
  htmlContent?: string
  /** Output only. The author of the comment. The author's email address and permission ID will not be populated. */
  author?: DriveUser
  /** The plain text content of the comment. This field is used for setting the content, while `htmlContent` should be displayed. */
  content?: string
  /** Output only. The email address of the user assigned to this comment. If no user is assigned, the field is unset. */
  assigneeEmailAddress?: string
  /** Output only. A list of email addresses for users mentioned in this comment. If no users are mentioned, the list is empty. */
  mentionedEmailAddresses?: Array<string>
  /** Output only. Whether the comment has been deleted. A deleted comment has no content. */
  deleted?: boolean
  /** Output only. The ID of the comment. */
  id?: string
  /** The time at which the comment was created (RFC 3339 date-time). */
  createdTime?: string
}

/** A change to a file or shared drive. */
export type DriveChange = {
  /** The updated state of the shared drive. Present if the changeType is drive, the user is still a member of the shared drive, and the shared drive has not been deleted. */
  drive?: DriveDrive
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#change"`. */
  kind?: string
  /** Whether the file or shared drive has been removed from this list of changes, for example by deletion or loss of access. */
  removed?: boolean
  /** The time of this change (RFC 3339 date-time). */
  time?: string
  /** Deprecated: Use `drive` instead. */
  teamDrive?: DriveTeamDrive
  /** The ID of the shared drive associated with this change. */
  driveId?: string
  /** Deprecated: Use `changeType` instead. */
  type?: string
  /** Deprecated: Use `driveId` instead. */
  teamDriveId?: string
  /** The ID of the file which has changed. */
  fileId?: string
  /** The type of the change. Possible values are `file` and `drive`. */
  changeType?: string
  /** The updated state of the file. Present if the type is file and the file has not been removed from this list of changes. */
  file?: DriveFile
}

/** Representation of the CSE DecryptionMetadata. */
export type DriveDecryptionMetadata = {
  /** The ID of the KACLS (Key ACL Service) used to encrypt the file. */
  kaclsId?: string
  /** The signed JSON Web Token (JWT) which can be used to authorize the requesting user with the Key ACL Service (KACLS). The JWT asserts that the requesting user has at least read permissions on the file. */
  jwt?: string
  /** The name of the KACLS (Key ACL Service) used to encrypt the file. */
  kaclsName?: string
  /** Key format for the unwrapped key. Must be `tinkAesGcmKey`. */
  keyFormat?: string
  /** The URL-safe Base64 encoded wrapped key used to encrypt the contents of the file. */
  wrappedKey?: string
  /** The URL-safe Base64 encoded HMAC-SHA256 digest of the resource metadata with its DEK (Data Encryption Key); see https://developers.google.com/workspace/cse/reference */
  encryptionResourceKeyHash?: string
  /** Chunk size used if content was encrypted with the AES 256 GCM Cipher. Possible values are: - default - small */
  aes256GcmChunkSize?: string
}

/** A modification to a label's field. */
export type DriveLabelFieldModification = {
  /** Replaces the value of a dateString Field with these new values. The string must be in the RFC 3339 full-date format: YYYY-MM-DD. */
  setDateValues?: Array<string>
  /** Sets the value of a `text` field. */
  setTextValues?: Array<string>
  /** Replaces the value of an `integer` field with these new values. */
  setIntegerValues?: Array<string>
  /** Unsets the values for this field. */
  unsetValues?: boolean
  /** This is always `"drive#labelFieldModification"`. */
  kind?: string
  /** The ID of the field to be modified. */
  fieldId?: string
  /** Replaces a `selection` field with these new values. */
  setSelectionValues?: Array<string>
  /** Replaces a `user` field with these new values. The values must be a valid email addresses. */
  setUserValues?: Array<string>
}

/** The response of an approvals list request. */
export type DriveApprovalList = {
  /** The page token for the next page of approvals. This is absent if the end of the approvals list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. */
  nextPageToken?: string
  /** The list of approvals. If `nextPageToken` is populated, then this list may be incomplete and an additional page of results should be fetched. */
  items?: Array<DriveApproval>
  /** This is always drive#approvalList */
  kind?: string
}

/** A list of shared drives. */
export type DriveDriveList = {
  /** The list of shared drives. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched. */
  drives?: Array<DriveDrive>
  /** The page token for the next page of shared drives. This will be absent if the end of the list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ. */
  nextPageToken?: string
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#driveList"`. */
  kind?: string
}

export type DriveStartPageToken = {
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#startPageToken"`. */
  kind?: string
  /** The starting page token for listing future changes. The page token doesn't expire. */
  startPageToken?: string
}

/** Request for commenting on an approval. */
export type DriveCommentApprovalRequest = {
  /** Required. A message to comment on the approval. This message is included in notifications for the action and in the approval activity log. */
  message?: string
}

/** A restriction for copy and download of the file. */
export type DriveDownloadRestriction = {
  /** Whether download and copy is restricted for writers. If true, download is also restricted for readers. */
  restrictedForWriters?: boolean
  /** Whether download and copy is restricted for readers. */
  restrictedForReaders?: boolean
}

/** A list of Team Drives. */
export type DriveTeamDriveList = {
  /** The page token for the next page of Team Drives. This will be absent if the end of the Team Drives list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ. */
  nextPageToken?: string
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#teamDriveList"`. */
  kind?: string
  /** The list of Team Drives. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched. */
  teamDrives?: Array<DriveTeamDrive>
}

/** Request for reassigning an approval. Reviewers can be added or replaced, but not removed. */
export type DriveReassignApprovalRequest = {
  /** Optional. The list of reviewer replacements. */
  replaceReviewers?: Array<DriveReplaceReviewer>
  /** Optional. The list of reviewers to add. */
  addReviewers?: Array<DriveAddReviewer>
  /** Optional. A message to send to the new reviewers. This message is included in notifications for the action and in the approval activity log. */
  message?: string
}

/** Representation of a reviewer replacement. */
export type DriveReplaceReviewer = {
  /** Required. The email of the reviewer to add. */
  addedReviewerEmail?: string
  /** Required. The email of the reviewer to remove. */
  removedReviewerEmail?: string
}

/** Representation of field, which is a typed key-value pair. */
export type DriveLabelField = {
  /** Only present if valueType is dateString. RFC 3339 formatted date: YYYY-MM-DD. */
  dateString?: Array<string>
  /** This is always drive#labelField. */
  kind?: string
  /** The field type. While new values may be supported in the future, the following are currently allowed: * `dateString` * `integer` * `selection` * `text` * `user` */
  valueType?: string
  /** The identifier of this label field. */
  id?: string
  /** Only present if `valueType` is `user`. */
  user?: Array<DriveUser>
  /** Only present if `valueType` is `text`. */
  text?: Array<string>
  /** Only present if `valueType` is `integer`. */
  integer?: Array<string>
  /** Only present if `valueType` is `selection` */
  selection?: Array<string>
}

/** Metadata for an approval. An approval is a review or approve process for a Drive item. */
export type DriveApproval = {
  /** The responses made on the approval by reviewers. */
  reviewerResponses?: Array<DriveReviewerResponse>
  /** Target file id of the approval. */
  targetFileId?: string
  /** Output only. The time the approval was created. */
  createTime?: string
  /** The time that the approval is due. */
  dueTime?: string
  /** The approval ID. */
  approvalId?: string
  /** This is always drive#approval. */
  kind?: string
  /** Output only. The status of the approval at the time this resource was requested. */
  status?: "STATUS_UNSPECIFIED" | "IN_PROGRESS" | "APPROVED" | "CANCELLED" | "DECLINED"
  /** Output only. The most recent time the approval was modified. */
  modifyTime?: string
  /** Output only. The behavior of the approval when the file content changes. */
  fileContentChangeBehavior?: "FILE_CONTENT_CHANGE_BEHAVIOR_UNSPECIFIED" | "RESET_APPROVAL" | "NO_APPROVAL_ACTION"
  /** The user that requested the approval. */
  initiator?: DriveUser
  /** Output only. The time the approval was completed. */
  completeTime?: string
}

/** A list of changes for a user. */
export type DriveChangeList = {
  /** The page token for the next page of changes. This will be absent if the end of the changes list has been reached. The page token doesn't expire. */
  nextPageToken?: string
  /** The starting page token for future changes. This will be present only if the end of the current changes list has been reached. The page token doesn't expire. */
  newStartPageToken?: string
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#changeList"`. */
  kind?: string
  /** The list of changes. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched. */
  changes?: Array<DriveChange>
}

/** Request for declining an approval as a reviewer. */
export type DriveDeclineApprovalRequest = {
  /** Optional. A message to accompany the reviewer response on the approval. This message is included in notifications for the action and in the approval activity log. */
  message?: string
}

/** A list of generated file IDs which can be provided in create requests. */
export type DriveGeneratedIds = {
  /** The IDs generated for the requesting user in the specified space. */
  ids?: Array<string>
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#generatedIds"`. */
  kind?: string
  /** The type of file that can be created with these IDs. */
  space?: string
}

/** Details about the client-side encryption applied to the file. */
export type DriveClientEncryptionDetails = {
  /** The encryption state of the file. The values expected here are: - encrypted - unencrypted */
  encryptionState?: string
  /** The metadata used for client-side operations. */
  decryptionMetadata?: DriveDecryptionMetadata
}

/** A list of revisions of a file. */
export type DriveRevisionList = {
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#revisionList"`. */
  kind?: string
  /** The page token for the next page of revisions. This will be absent if the end of the revisions list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ. */
  nextPageToken?: string
  /** The list of revisions. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched. */
  revisions?: Array<DriveRevision>
}

/** A modification to a label on a file. A `LabelModification` can be used to apply a label to a file, update an existing label on a file, or remove a label from a file. */
export type DriveLabelModification = {
  /** The ID of the label to modify. */
  labelId?: string
  /** This is always `"drive#labelModification"`. */
  kind?: string
  /** If true, the label will be removed from the file. */
  removeLabel?: boolean
  /** The list of modifications to this label's fields. */
  fieldModifications?: Array<DriveLabelFieldModification>
}

/** A notification channel used to watch for resource changes. */
export type DriveChannel = {
  /** The address where notifications are delivered for this channel. */
  address?: string
  /** The type of delivery mechanism used for this channel. Valid values are "web_hook" or "webhook". */
  type?: string
  /** A UUID or similar unique string that identifies this channel. */
  id?: string
  /** A version-specific identifier for the watched resource. */
  resourceUri?: string
  /** A Boolean value to indicate whether payload is wanted. Optional. */
  payload?: boolean
  /** Additional parameters controlling delivery channel behavior. Optional. */
  params?: Record<string, string>
  /** Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional. */
  expiration?: string
  /** An arbitrary string delivered to the target address with each notification delivered over this channel. Optional. */
  token?: string
  /** An opaque ID that identifies the resource being watched on this channel. Stable across different API versions. */
  resourceId?: string
  /** Identifies this as a notification channel used to watch for changes to a resource, which is `api#channel`. */
  kind?: string
}

/** Response to a `ModifyLabels` request. This contains only those labels which were added or updated by the request. */
export type DriveModifyLabelsResponse = {
  /** This is always `"drive#modifyLabelsResponse"`. */
  kind?: string
  /** The list of labels which were added or updated by the request. */
  modifiedLabels?: Array<DriveLabel>
}

/** A list of replies to a comment on a file. */
export type DriveReplyList = {
  /** The page token for the next page of replies. This will be absent if the end of the replies list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ. */
  nextPageToken?: string
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#replyList"`. */
  kind?: string
  /** The list of replies. If `nextPageToken` is populated, then this list may be incomplete and an additional page of results should be fetched. */
  replies?: Array<DriveReply>
}

/** A list of files. */
export type DriveFileList = {
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#fileList"`. */
  kind?: string
  /** Whether the search process was incomplete. If true, then some search results might be missing, since all documents were not searched. This can occur when searching multiple drives with the `allDrives` corpora, but all corpora couldn't be searched. When this happens, it's suggested that clients narrow their query by choosing a different corpus such as `user` or `drive`. */
  incompleteSearch?: boolean
  /** The page token for the next page of files. This will be absent if the end of the files list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ. */
  nextPageToken?: string
  /** The list of files. If `nextPageToken` is populated, then this list may be incomplete and an additional page of results should be fetched. */
  files?: Array<DriveFile>
}

/** The metadata for a revision to a file. Some resource methods (such as `revisions.update`) require a `revisionId`. Use the `revisions.list` method to retrieve the ID for a revision. */
export type DriveRevision = {
  /** Output only. A link to the published revision. This is only populated for Docs Editors files. */
  publishedLink?: string
  /** Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#revision"`. */
  kind?: string
  /** Output only. The size of the revision's content in bytes. This is only applicable to files with binary content in Drive. */
  size?: string
  /** Whether this revision is published outside the domain. This is only applicable to Docs Editors files. */
  publishedOutsideDomain?: boolean
  /** Output only. The ID of the revision. */
  id?: string
  /** Output only. The MD5 checksum of the revision's content. This is only applicable to files with binary content in Drive. */
  md5Checksum?: string
  /** Output only. Links for exporting Docs Editors files to specific formats. */
  exportLinks?: Record<string, string>
  /** Output only. The MIME type of the revision. */
  mimeType?: string
  /** Whether this revision is published. This is only applicable to Docs Editors files. */
  published?: boolean
  /** The last time the revision was modified (RFC 3339 date-time). */
  modifiedTime?: string
  /** Whether subsequent revisions will be automatically republished. This is only applicable to Docs Editors files. */
  publishAuto?: boolean
  /** Output only. The last user to modify this revision. This field is only populated when the last modification was performed by a signed-in user. */
  lastModifyingUser?: DriveUser
  /** Output only. The original filename used to create this revision. This is only applicable to files with binary content in Drive. */
  originalFilename?: string
  /** Whether to keep this revision forever, even if it is no longer the head revision. If not set, the revision will be automatically purged 30 days after newer content is uploaded. This can be set on a maximum of 200 revisions for a file. This field is only applicable to files with binary content in Drive. */
  keepForever?: boolean
}

export type DriveAppIcons = {
  /** URL for the icon. */
  iconUrl?: string
  /** Category of the icon. Allowed values are: * `application` - The icon for the application. * `document` - The icon for a file associated with the app. * `documentShared` - The icon for a shared file associated with the app. */
  category?: string
  /** Size of the icon. Represented as the maximum of the width and height. */
  size?: number
}

/** Manage outstanding access proposals on a file. */
export type DriveAccessProposal = {
  /** The email address of the requesting user. */
  requesterEmailAddress?: string
  /** The email address of the user that will receive permissions, if accepted. */
  recipientEmailAddress?: string
  /** The message that the requester added to the proposal. */
  requestMessage?: string
  /** The file ID that the proposal for access is on. */
  fileId?: string
  /** The ID of the access proposal. */
  proposalId?: string
  /** The creation time. */
  createTime?: string
  /** A wrapper for the role and view of an access proposal. For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles). */
  rolesAndViews?: Array<DriveAccessProposalRoleAndView>
}

/** Download restrictions applied to the file. */
export type DriveDownloadRestrictionsMetadata = {
  /** The download restriction of the file applied directly by the owner or organizer. This doesn't take into account shared drive settings or DLP rules. */
  itemDownloadRestriction?: DriveDownloadRestriction
  /** Output only. The effective download restriction applied to this file. This considers all restriction settings and DLP rules. */
  effectiveDownloadRestrictionWithContext?: DriveDownloadRestriction
}

/** Information about a Drive user. */
export type DriveUser = {
  /** Output only. A plain text displayable name for this user. */
  displayName?: string
  /** Output only. A link to the user's profile photo, if available. */
  photoLink?: string
  /** Output only. The user's ID as visible in Permission resources. */
  permissionId?: string
  /** Output only. Whether this user is the requesting user. */
  me?: boolean
  /** Output only. The email address of the user. This may not be present in certain contexts if the user has not made their email address visible to the requester. */
  emailAddress?: string
  /** Output only. Identifies what kind of resource this is. Value: the fixed string `drive#user`. */
  kind?: string
}

/** A wrapper for the role and view of an access proposal. For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles). */
export type DriveAccessProposalRoleAndView = {
  /** The role that was proposed by the requester. The supported values are: * `writer` * `commenter` * `reader` */
  role?: string
  /** Indicates the view for this access proposal. Only populated for proposals that belong to a view. Only `published` is supported. */
  view?: string
}

/** A list of labels applied to a file. */
export type DriveLabelList = {
  /** The list of labels. */
  labels?: Array<DriveLabel>
  /** This is always `"drive#labelList"`. */
  kind?: string
  /** The page token for the next page of labels. This field will be absent if the end of the list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ. */
  nextPageToken?: string
}

/** A list of third-party applications which the user has installed or given access to Google Drive. */
export type DriveAppList = {
  /** A link back to this list. */
  selfLink?: string
  /** The list of app IDs that the user has specified to use by default. The list is in reverse-priority order (lowest to highest). */
  defaultAppIds?: Array<string>
  /** Output only. Identifies what kind of resource this is. Value: the fixed string "drive#appList". */
  kind?: string
  /** The list of apps. */
  items?: Array<DriveApp>
}

/** JWT and associated metadata used to generate CSE files. */
export type DriveGenerateCseTokenResponse = {
  /** The fileId for which the JWT was generated. */
  fileId?: string
  /** Name of the KACLs that the returned KACLs ID points to. */
  currentKaclsName?: string
  /** Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#generateCseTokenResponse"`. */
  kind?: string
  /** The current Key ACL Service (KACLS) ID associated with the JWT. */
  currentKaclsId?: string
  /** The signed JSON Web Token (JWT) for the file. */
  jwt?: string
}

/** The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors). */
export type DriveStatus = {
  /** The status code, which should be an enum value of google.rpc.Code. */
  code?: number
  /** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
  details?: Array<Record<string, unknown>>
  /** A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client. */
  message?: string
}

/** A list of permissions for a file. */
export type DrivePermissionList = {
  /** The list of permissions. If `nextPageToken` is populated, then this list may be incomplete and an additional page of results should be fetched. */
  permissions?: Array<DrivePermission>
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#permissionList"`. */
  kind?: string
  /** The page token for the next page of permissions. This field will be absent if the end of the permissions list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ. */
  nextPageToken?: string
}

/** Allows creating an approval on a file. */
export type DriveStartApprovalRequest = {
  /** Optional. The behavior of the approval when the file content changes. */
  fileContentChangeBehavior?: "FILE_CONTENT_CHANGE_BEHAVIOR_UNSPECIFIED" | "RESET_APPROVAL" | "NO_APPROVAL_ACTION"
  /** Required. The emails of the users who are set to review the approval. */
  reviewerEmails?: Array<string>
  /** Optional. Whether to lock the file when starting the approval. */
  lockFile?: boolean
  /** Optional. The time that the approval is due. */
  dueTime?: string
  /** Optional. A message to send to reviewers when notifying them of the approval request. */
  message?: string
}

/** A list of comments on a file. */
export type DriveCommentList = {
  /** The list of comments. If nextPageToken is populated, then this list may be incomplete and an additional page of results should be fetched. */
  comments?: Array<DriveComment>
  /** The page token for the next page of comments. This will be absent if the end of the comments list has been reached. If the token is rejected for any reason, it should be discarded, and pagination should be restarted from the first page of results. The page token is typically valid for several hours. However, if new items are added or removed, your expected results might differ. */
  nextPageToken?: string
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#commentList"`. */
  kind?: string
}

/** Representation of label and label fields. */
export type DriveLabel = {
  /** This is always drive#label */
  kind?: string
  /** The ID of the label. */
  id?: string
  /** A map of the fields on the label, keyed by the field's ID. */
  fields?: Record<string, DriveLabelField>
  /** The revision ID of the label. */
  revisionId?: string
}

/** Request for cancelling an approval as an initiator. */
export type DriveCancelApprovalRequest = {
  /** Optional. A message to accompany the cancellation of the approval. This message is included in notifications for the action and in the approval activity log. */
  message?: string
}

/** A response on an approval made by a specific reviewer. */
export type DriveReviewerResponse = {
  /** This is always drive#reviewerResponse. */
  kind?: string
  /** The user that's responsible for this response. */
  reviewer?: DriveUser
  /** A reviewer’s response for the approval. */
  response?: "RESPONSE_UNSPECIFIED" | "NO_RESPONSE" | "APPROVED" | "DECLINED"
}

/** A restriction for accessing the content of the file. */
export type DriveContentRestriction = {
  /** Output only. Whether the content restriction was applied by the system, for example due to an esignature. Users cannot modify or remove system restricted content restrictions. */
  systemRestricted?: boolean
  /** Output only. The user who set the content restriction. Only populated if `readOnly=true`. */
  restrictingUser?: DriveUser
  /** Whether the content of the file is read-only. If a file is read-only, a new revision of the file may not be added, comments may not be added or modified, and the title of the file may not be modified. */
  readOnly?: boolean
  /** Whether the content restriction can only be modified or removed by a user who owns the file. For files in shared drives, any user with `organizer` capabilities can modify or remove this content restriction. */
  ownerRestricted?: boolean
  /** Reason for why the content of the file is restricted. This is only mutable on requests that also set `readOnly=true`. */
  reason?: string
  /** Output only. The type of the content restriction. Currently the only possible value is `globalContentRestriction`. */
  type?: string
  /** The time at which the content restriction was set (formatted RFC 3339 timestamp). Only populated if readOnly is true. */
  restrictionTime?: string
}

/** Request for approving an approval as a reviewer. */
export type DriveApproveApprovalRequest = {
  /** Optional. A message to accompany the reviewer response on the approval. This message is included in notifications for the action and in the approval activity log. */
  message?: string
}

/** The `apps` resource provides a list of apps that a user has installed, with information about each app's supported MIME types, file extensions, and other details. Some resource methods (such as `apps.get`) require an `appId`. Use the `apps.list` method to retrieve the ID for an installed application. */
export type DriveApp = {
  /** A long description of the app. */
  longDescription?: string
  /** Whether this app supports creating files when offline. */
  supportsOfflineCreate?: boolean
  /** The list of primary file extensions. */
  primaryFileExtensions?: Array<string>
  /** The name of the app. */
  name?: string
  /** The URL to create a file with this app. */
  createUrl?: string
  /** Whether the app is authorized to access data on the user's Drive. */
  authorized?: boolean
  /** Whether the app is selected as the default handler for the types it supports. */
  useByDefault?: boolean
  /** The template URL to create a file with this app in a given folder. The template contains the {folderId} to be replaced by the folder ID house the new file. */
  createInFolderTemplate?: string
  /** The various icons for the app. */
  icons?: Array<DriveAppIcons>
  /** The type of object this app creates such as a Chart. If empty, the app name should be used instead. */
  objectType?: string
  /** The ID of the app. */
  id?: string
  /** The list of secondary MIME types. */
  secondaryMimeTypes?: Array<string>
  /** The ID of the product listing for this app. */
  productId?: string
  /** The template URL for opening files with this app. The template contains {ids} or {exportIds} to be replaced by the actual file IDs. For more information, see Open Files for the full documentation. */
  openUrlTemplate?: string
  /** Whether this app supports opening more than one file. */
  supportsMultiOpen?: boolean
  /** Whether this app supports importing from Google Docs. */
  supportsImport?: boolean
  /** Output only. Identifies what kind of resource this is. Value: the fixed string "drive#app". */
  kind?: string
  /** Whether the app has Drive-wide scope. An app with Drive-wide scope can access all files in the user's Drive. */
  hasDriveWideScope?: boolean
  /** A link to the product listing for this app. */
  productUrl?: string
  /** The list of secondary file extensions. */
  secondaryFileExtensions?: Array<string>
  /** Whether the app is installed. */
  installed?: boolean
  /** A short description of the app. */
  shortDescription?: string
  /** The list of primary MIME types. */
  primaryMimeTypes?: Array<string>
  /** Whether this app supports creating objects. */
  supportsCreate?: boolean
}

/** The metadata for a file. Some resource methods (such as `files.update`) require a `fileId`. Use the `files.list` method to retrieve the ID for a file. */
export type DriveFile = {
  /** Output only. Whether there are permissions directly on this file. This field is only populated for items in shared drives. */
  hasAugmentedPermissions?: boolean
  /** Whether the user has starred the file. */
  starred?: boolean
  /** Whether the file has been trashed, either explicitly or from a trashed parent folder. Only the owner may trash a file, but other users can still access the file in the owner's trash until it's permanently deleted. */
  trashed?: boolean
  /** Output only. The SHA1 checksum associated with this file, if available. This field is only populated for files with content stored in Google Drive; it's not populated for Docs Editors or shortcut files. */
  sha1Checksum?: string
  /** The original filename of the uploaded content if available, or else the original value of the `name` field. This is only available for files with binary content in Google Drive. */
  originalFilename?: string
  /** Output only. List of permission IDs for users with access to this file. */
  permissionIds?: Array<string>
  /** The last time the file was modified by the user (RFC 3339 date-time). */
  modifiedByMeTime?: string
  /** Output only. Additional metadata about video media. This may not be available immediately upon upload. */
  videoMediaMetadata?: {
    /** Output only. The duration of the video in milliseconds. */
    durationMillis?: string
    /** Output only. The width of the video in pixels. */
    width?: number
    /** Output only. The height of the video in pixels. */
    height?: number
  }
  /** Output only. Whether the file was created or opened by the requesting app. */
  isAppAuthorized?: boolean
  /** Output only. Whether the file has been shared. Not populated for items in shared drives. */
  shared?: boolean
  /** Output only. Whether the file has been explicitly trashed, as opposed to recursively trashed from a parent folder. */
  explicitlyTrashed?: boolean
  /** Output only. The full list of permissions for the file. This is only available if the requesting user can share the file. Not populated for items in shared drives. */
  permissions?: Array<DrivePermission>
  /** Client Side Encryption related details. Contains details about the encryption state of the file and details regarding the encryption mechanism that clients need to use when decrypting the contents of this item. This will only be present on files and not on folders or shortcuts. */
  clientEncryptionDetails?: DriveClientEncryptionDetails
  /** Additional information about the content of the file. These fields are never populated in responses. */
  contentHints?: {
    /** A thumbnail for the file. This will only be used if Google Drive cannot generate a standard thumbnail. */
    thumbnail?: {
      /** The thumbnail data encoded with URL-safe Base64 ([RFC 4648 section 5](https://datatracker.ietf.org/doc/html/rfc4648#section-5)). */
      image?: string
      /** The MIME type of the thumbnail. */
      mimeType?: string
    }
    /** Text to be indexed for the file to improve fullText queries. This is limited to 128 KB in length and may contain HTML elements. */
    indexableText?: string
  }
  /** Output only. The user who shared the file with the requesting user, if applicable. */
  sharingUser?: DriveUser
  /** Contains details about the link URLs that clients are using to refer to this item. */
  linkShareMetadata?: {
    /** Output only. Whether the security update is enabled for this file. */
    securityUpdateEnabled?: boolean
    /** Output only. Whether the file is eligible for security update. */
    securityUpdateEligible?: boolean
  }
  /** Deprecated: Use `copyRequiresWriterPermission` instead. */
  viewersCanCopyContent?: boolean
  /** Output only. The SHA256 checksum associated with this file, if available. This field is only populated for files with content stored in Google Drive; it's not populated for Docs Editors or shortcut files. */
  sha256Checksum?: string
  /** Whether the options to copy, print, or download this file should be disabled for readers and commenters. */
  copyRequiresWriterPermission?: boolean
  /** Output only. The MD5 checksum for the content of the file. This is only applicable to files with binary content in Google Drive. */
  md5Checksum?: string
  /** The last time the file was viewed by the user (RFC 3339 date-time). */
  viewedByMeTime?: string
  /** Output only. The last user to modify the file. This field is only populated when the last modification was performed by a signed-in user. */
  lastModifyingUser?: DriveUser
  /** Output only. Links for exporting Docs Editors files to specific formats. */
  exportLinks?: Record<string, string>
  /** The time at which the file was created (RFC 3339 date-time). */
  createdTime?: string
  /** The name of the file. This isn't necessarily unique within a folder. Note that for immutable items such as the top-level folders of shared drives, the My Drive root folder, and the Application Data folder, the name is constant. */
  name?: string
  /** Output only. The list of spaces which contain the file. The currently supported values are `drive`, `appDataFolder`, and `photos`. */
  spaces?: Array<string>
  /** Output only. Whether the file has been viewed by this user. */
  viewedByMe?: boolean
  /** Output only. The final component of `fullFileExtension`. This is only available for files with binary content in Google Drive. */
  fileExtension?: string
  /** Output only. Additional metadata about image media, if available. */
  imageMediaMetadata?: {
    /** Output only. The exposure mode used to create the photo. */
    exposureMode?: string
    /** Output only. The make of the camera used to create the photo. */
    cameraMake?: string
    /** Output only. The aperture used to create the photo (f-number). */
    aperture?: number
    /** Output only. The length of the exposure, in seconds. */
    exposureTime?: number
    /** Output only. The type of sensor used to create the photo. */
    sensor?: string
    /** Output only. The distance to the subject of the photo, in meters. */
    subjectDistance?: number
    /** Output only. The focal length used to create the photo, in millimeters. */
    focalLength?: number
    /** Output only. The width of the image in pixels. */
    width?: number
    /** Output only. The ISO speed used to create the photo. */
    isoSpeed?: number
    /** Output only. The lens used to create the photo. */
    lens?: string
    /** Output only. The number of clockwise 90 degree rotations applied from the image's original orientation. */
    rotation?: number
    /** Output only. The height of the image in pixels. */
    height?: number
    /** Output only. The white balance mode used to create the photo. */
    whiteBalance?: string
    /** Output only. The model of the camera used to create the photo. */
    cameraModel?: string
    /** Output only. The date and time the photo was taken (EXIF DateTime). */
    time?: string
    /** Output only. Whether a flash was used to create the photo. */
    flashUsed?: boolean
    /** Output only. Geographic location information stored in the image. */
    location?: {
      /** Output only. The altitude stored in the image. */
      altitude?: number
      /** Output only. The latitude stored in the image. */
      latitude?: number
      /** Output only. The longitude stored in the image. */
      longitude?: number
    }
    /** Output only. The smallest f-number of the lens at the focal length used to create the photo (APEX value). */
    maxApertureValue?: number
    /** Output only. The color space of the photo. */
    colorSpace?: string
    /** Output only. The metering mode used to create the photo. */
    meteringMode?: string
    /** Output only. The exposure bias of the photo (APEX value). */
    exposureBias?: number
  }
  /** A short description of the file. */
  description?: string
  /** Label information on the file. */
  labelInfo?: {
    /** Output only. The set of labels on the file as requested by the label IDs in the `includeLabels` parameter. By default, no labels are returned. */
    labels?: Array<DriveLabel>
  }
  /** Output only. Whether the user owns the file. Not populated for items in shared drives. */
  ownedByMe?: boolean
  /** The color for a folder or a shortcut to a folder as an RGB hex string. The supported colors are published in the `folderColorPalette` field of the [`about`](https://developers.google.com/workspace/drive/api/reference/rest/v3/about) resource. If an unsupported color is specified, the closest color in the palette is used instead. */
  folderColorRgb?: string
  /** Whether users with only `writer` permission can modify the file's permissions. Not populated for items in shared drives. */
  writersCanShare?: boolean
  /** Output only. A link for downloading the content of the file in a browser. This is only available for files with binary content in Google Drive. */
  webContentLink?: string
  /** Output only. If the file has been explicitly trashed, the user who trashed it. Only populated for items in shared drives. */
  trashingUser?: DriveUser
  /** Output only. ID of the shared drive the file resides in. Only populated for items in shared drives. */
  driveId?: string
  /** Information about a shortcut file. */
  shortcutDetails?: {
    /** The ID of the file that this shortcut points to. Can only be set on `files.create` requests. */
    targetId?: string
    /** Output only. The MIME type of the file that this shortcut points to. The value of this field is a snapshot of the target's MIME type, captured when the shortcut is created. */
    targetMimeType?: string
    /** Output only. The `resourceKey` for the target file. */
    targetResourceKey?: string
  }
  /** Restrictions for accessing the content of the file. Only populated if such a restriction exists. */
  contentRestrictions?: Array<DriveContentRestriction>
  /** Output only. Whether this file has a thumbnail. This doesn't indicate whether the requesting app has access to the thumbnail. To check access, look for the presence of the thumbnailLink field. */
  hasThumbnail?: boolean
  /** Deprecated: Output only. Use `driveId` instead. */
  teamDriveId?: string
  /** he last time the file was modified by anyone (RFC 3339 date-time). Note that setting modifiedTime will also update modifiedByMeTime for the user. */
  modifiedTime?: string
  /** The time at which the file was shared with the user, if applicable (RFC 3339 date-time). */
  sharedWithMeTime?: string
  /** Output only. A key needed to access the item via a shared link. */
  resourceKey?: string
  /** Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#file"`. */
  kind?: string
  /** Output only. The owner of this file. Only certain legacy files may have more than one owner. This field isn't populated for items in shared drives. */
  owners?: Array<DriveUser>
  /** The ID of the parent folder containing the file. A file can only have one parent folder; specifying multiple parents isn't supported. If not specified as part of a create request, the file is placed directly in the user's My Drive folder. If not specified as part of a copy request, the file inherits any discoverable parent of the source file. Update requests must use the `addParents` and `removeParents` parameters to modify the parents list. */
  parents?: Array<string>
  /** Output only. A short-lived link to the file's thumbnail, if available. Typically lasts on the order of hours. Not intended for direct usage on web applications due to [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) policies. Consider using a proxy server. Only populated when the requesting app can access the file's content. If the file isn't shared publicly, the URL returned in `files.thumbnailLink` must be fetched using a credentialed request. */
  thumbnailLink?: string
  /** Output only. The ID of the file's head revision. This is currently only available for files with binary content in Google Drive. */
  headRevisionId?: string
  /** The time that the item was trashed (RFC 3339 date-time). Only populated for items in shared drives. */
  trashedTime?: string
  /** A collection of arbitrary key-value pairs which are private to the requesting app. Entries with null values are cleared in update and copy requests. These properties can only be retrieved using an authenticated request. An authenticated request uses an access token obtained with a OAuth 2 client ID. You cannot use an API key to retrieve private properties. */
  appProperties?: Record<string, string>
  /** Output only. Capabilities the current user has on this file. Each capability corresponds to a fine-grained action that a user may take. For more information, see [Understand file capabilities](https://developers.google.com/workspace/drive/api/guides/manage-sharing#capabilities). */
  capabilities?: {
    /** Output only. Whether the current user can delete children of this folder. This is `false` when the item isn't a folder. Only populated for items in shared drives. */
    canDeleteChildren?: boolean
    /** Output only. Whether the current user can change the `securityUpdateEnabled` field on link share metadata. */
    canChangeSecurityUpdateEnabled?: boolean
    /** Output only. Whether the current user can trash children of this folder. This is `false` when the item isn't a folder. Only populated for items in shared drives. */
    canTrashChildren?: boolean
    /** Deprecated: Output only. */
    canChangeViewersCanCopyContent?: boolean
    /** Output only. Whether the current user is the pending owner of the file. Not populated for shared drive files. */
    canAcceptOwnership?: boolean
    /** Output only. Whether the current user can list the children of this folder. This is always `false` when the item isn't a folder. */
    canListChildren?: boolean
    /** Output only. Whether the current user can move this item within this drive. Note that a request to change the parent of the item may still fail depending on the new parent that's being added and the parent that is being removed. */
    canMoveItemWithinDrive?: boolean
    /** Output only. Whether there's a content restriction on the file that can be removed by the current user. */
    canRemoveContentRestriction?: boolean
    /** Output only. Whether the current user can read the labels on the file. */
    canReadLabels?: boolean
    /** Output only. Whether the current user can restore this file from trash. */
    canUntrash?: boolean
    /** Output only. Whether the current user can move this file to trash. */
    canTrash?: boolean
    /** Deprecated: Output only. Use `canMoveItemWithinDrive` or `canMoveItemOutOfDrive` instead. */
    canMoveTeamDriveItem?: boolean
    /** Output only. Whether the current user can add children to this folder. This is always `false` when the item isn't a folder. */
    canAddChildren?: boolean
    /** Whether the current user can start an approval on the file. */
    canStartApproval?: boolean
    /** Output only. Whether the current user can remove children from this folder. This is always `false` when the item isn't a folder. For a folder in a shared drive, use `canDeleteChildren` or `canTrashChildren` instead. */
    canRemoveChildren?: boolean
    /** Output only. Whether the current user can read the revisions resource of this file. For a shared drive item, whether revisions of non-folder descendants of this item, or this item if it's not a folder, can be read. */
    canReadRevisions?: boolean
    /** Deprecated: Output only. Use `canMoveItemOutOfDrive` instead. */
    canMoveItemIntoTeamDrive?: boolean
    /** Whether the current user can access this file via Gen AI features. For more information, see [Drive MCP file eligibility](https://developers.google.com/workspace/drive/api/guides/drive-mcp-server-file-eligibility). */
    canAccessViaGenAi?: boolean
    /** Output only. Whether the current user can modify the labels on the file. */
    canModifyLabels?: boolean
    /** Output only. Whether the current user can change the owner or organizer-applied download restrictions of the file. */
    canChangeItemDownloadRestriction?: boolean
    /** Output only. Whether the current user can remove a parent from the item without adding another parent in the same request. Not populated for shared drive files. */
    canRemoveMyDriveParent?: boolean
    /** Output only. Whether the current user can rename this file. */
    canRename?: boolean
    /** Output only. Whether the current user can move children of this folder within this drive. This is `false` when the item isn't a folder. Note that a request to move the child may still fail depending on the current user's access to the child and to the destination folder. */
    canMoveChildrenWithinDrive?: boolean
    /** Output only. Whether the current user can delete this file. */
    canDelete?: boolean
    /** Output only. Whether the current user can copy this file. For an item in a shared drive, whether the current user can copy non-folder descendants of this item, or this item if it's not a folder. */
    canCopy?: boolean
    /** Deprecated: Output only. Use `canMoveChildrenWithinDrive` instead. */
    canMoveChildrenWithinTeamDrive?: boolean
    /** Output only. Whether the current user can add or modify content restrictions on the file which are editor restricted. */
    canModifyEditorContentRestriction?: boolean
    /** Whether a user can re-enable inherited permissions. */
    canEnableInheritedPermissions?: boolean
    /** Deprecated: Output only. Use `canMoveChildrenOutOfDrive` instead. */
    canMoveChildrenOutOfTeamDrive?: boolean
    /** Deprecated: Output only. Use `canMoveItemWithinDrive` instead. */
    canMoveItemWithinTeamDrive?: boolean
    /** Output only. Whether the current user can add or modify content restrictions which are owner restricted. */
    canModifyOwnerContentRestriction?: boolean
    /** Deprecated: Output only. Use one of `canModifyEditorContentRestriction`, `canModifyOwnerContentRestriction`, or `canRemoveContentRestriction`. */
    canModifyContentRestriction?: boolean
    /** Deprecated: Output only. Use `canMoveItemOutOfDrive` instead. */
    canMoveItemOutOfTeamDrive?: boolean
    /** Output only. Whether the current user can add a folder from another drive (different shared drive or My Drive) to this folder. This is `false` when the item isn't a folder. Only populated for items in shared drives. */
    canAddFolderFromAnotherDrive?: boolean
    /** Output only. Whether the current user can modify the content of this file. */
    canModifyContent?: boolean
    /** Output only. Whether the current user can move children of this folder outside of the shared drive. This is `false` when the item isn't a folder. Only populated for items in shared drives. */
    canMoveChildrenOutOfDrive?: boolean
    /** Output only. Whether the current user can download this file. */
    canDownload?: boolean
    /** Deprecated: Output only. Use `canReadDrive` instead. */
    canReadTeamDrive?: boolean
    /** Output only. Whether the current user can modify the sharing settings for this file. */
    canShare?: boolean
    /** Output only. Whether the current user can move this item outside of this drive by changing its parent. Note that a request to change the parent of the item may still fail depending on the new parent that's being added. */
    canMoveItemOutOfDrive?: boolean
    /** Output only. Whether the current user can read the shared drive to which this file belongs. Only populated for items in shared drives. */
    canReadDrive?: boolean
    /** Output only. Whether the current user can change the `copyRequiresWriterPermission` restriction of this file. */
    canChangeCopyRequiresWriterPermission?: boolean
    /** Whether a user can disable inherited permissions. */
    canDisableInheritedPermissions?: boolean
    /** Output only. Whether the current user can edit this file. Other factors may limit the type of changes a user can make to a file. For example, see `canChangeCopyRequiresWriterPermission` or `canModifyContent`. */
    canEdit?: boolean
    /** Output only. Whether the current user can add a parent for the item without removing an existing parent in the same request. Not populated for shared drive files. */
    canAddMyDriveParent?: boolean
    /** Output only. Whether the current user can comment on this file. */
    canComment?: boolean
  }
  /** A collection of arbitrary key-value pairs which are visible to all apps. Entries with null values are cleared in update and copy requests. */
  properties?: Record<string, string>
  /** The MIME type of the file. Google Drive attempts to automatically detect an appropriate value from uploaded content, if no value is provided. The value cannot be changed unless a new revision is uploaded. If a file is created with a Google Doc MIME type, the uploaded content is imported, if possible. The supported import formats are published in the [`about`](https://developers.google.com/workspace/drive/api/reference/rest/v3/about) resource. */
  mimeType?: string
  /** Output only. A link for opening the file in a relevant Google editor or viewer in a browser. */
  webViewLink?: string
  /** Output only. The thumbnail version for use in thumbnail cache invalidation. */
  thumbnailVersion?: string
  /** Whether this file has inherited permissions disabled. Inherited permissions are enabled by default. */
  inheritedPermissionsDisabled?: boolean
  /** Output only. The number of storage quota bytes used by the file. This includes the head revision as well as previous revisions with `keepForever` enabled. */
  quotaBytesUsed?: string
  /** Output only. Size in bytes of blobs and Google Workspace editor files. Won't be populated for files that have no size, like shortcuts and folders. */
  size?: string
  /** Output only. Whether the file has been modified by this user. */
  modifiedByMe?: boolean
  /** Output only. The full file extension extracted from the `name` field. May contain multiple concatenated extensions, such as "tar.gz". This is only available for files with binary content in Google Drive. This is automatically updated when the `name` field changes, however it's not cleared if the new name doesn't contain a valid extension. */
  fullFileExtension?: string
  /** Output only. A monotonically increasing version number for the file. This reflects every change made to the file on the server, even those not visible to the user. */
  version?: string
  /** Download restrictions applied on the file. */
  downloadRestrictions?: DriveDownloadRestrictionsMetadata
  /** The ID of the file. */
  id?: string
  /** Output only. A static, unauthenticated link to the file's icon. */
  iconLink?: string
}

/** Information about the user, the user's Drive, and system capabilities. */
export type DriveAbout = {
  /** A map of source MIME type to possible targets for all supported imports. */
  importFormats?: Record<string, Array<string>>
  /** The maximum upload size in bytes. */
  maxUploadSize?: string
  /** Deprecated: Use `canCreateDrives` instead. */
  canCreateTeamDrives?: boolean
  /** A map of maximum import sizes by MIME type, in bytes. */
  maxImportSizes?: Record<string, string>
  /** Deprecated: Use `driveThemes` instead. */
  teamDriveThemes?: Array<{
    /** Deprecated: Use `driveThemes/id` instead. */
    id?: string
    /** Deprecated: Use `driveThemes/colorRgb` instead. */
    colorRgb?: string
    /** Deprecated: Use `driveThemes/backgroundImageLink` instead. */
    backgroundImageLink?: string
  }>
  /** The user's storage quota limits and usage. For users that are part of an organization with pooled storage, information about the limit and usage across all services is for the organization, rather than the individual user. All fields are measured in bytes. */
  storageQuota?: {
    /** The usage by all files in Google Drive. */
    usageInDrive?: string
    /** The total usage across all services. For users that are part of an organization with pooled storage, this is the usage across all services for the organization, rather than the individual user. */
    usage?: string
    /** The usage by trashed files in Google Drive. */
    usageInDriveTrash?: string
    /** The usage limit, if applicable. This will not be present if the user has unlimited storage. For users that are part of an organization with pooled storage, this is the limit for the organization, rather than the individual user. */
    limit?: string
  }
  /** Whether the user can create shared drives. */
  canCreateDrives?: boolean
  /** A map of source MIME type to possible targets for all supported exports. */
  exportFormats?: Record<string, Array<string>>
  /** Identifies what kind of resource this is. Value: the fixed string `"drive#about"`. */
  kind?: string
  /** Whether the user has installed the requesting app. */
  appInstalled?: boolean
  /** The currently supported folder colors as RGB hex strings. */
  folderColorPalette?: Array<string>
  /** A list of themes that are supported for shared drives. */
  driveThemes?: Array<{
    /** The color of this theme as an RGB hex string. */
    colorRgb?: string
    /** The ID of the theme. */
    id?: string
    /** A link to this theme's background image. */
    backgroundImageLink?: string
  }>
  /** The authenticated user. */
  user?: DriveUser
}

/** Representation of a shared drive. Some resource methods (such as `drives.update`) require a `driveId`. Use the `drives.list` method to retrieve the ID for a shared drive. */
export type DriveDrive = {
  /** The name of this shared drive. */
  name?: string
  /** Output only. Capabilities the current user has on this shared drive. */
  capabilities?: {
    /** Output only. Whether the current user can add members to this shared drive or remove them or change their role. */
    canManageMembers?: boolean
    /** Output only. Whether the current user can rename files or folders in this shared drive. */
    canRename?: boolean
    /** Output only. Whether the current user can change the `driveMembersOnly` restriction of this shared drive. */
    canChangeDriveMembersOnlyRestriction?: boolean
    /** Output only. Whether the current user can list the children of folders in this shared drive. */
    canListChildren?: boolean
    /** Output only. Whether the current user can add children to folders in this shared drive. */
    canAddChildren?: boolean
    /** Output only. Whether the current user can change the `sharingFoldersRequiresOrganizerPermission` restriction of this shared drive. */
    canChangeSharingFoldersRequiresOrganizerPermissionRestriction?: boolean
    /** Output only. Whether the current user can change the `copyRequiresWriterPermission` restriction of this shared drive. */
    canChangeCopyRequiresWriterPermissionRestriction?: boolean
    /** Output only. Whether the current user can change the `domainUsersOnly` restriction of this shared drive. */
    canChangeDomainUsersOnlyRestriction?: boolean
    /** Output only. Whether the current user can download files in this shared drive. */
    canDownload?: boolean
    /** Output only. Whether the current user can delete this shared drive. Attempting to delete the shared drive may still fail if there are untrashed items inside the shared drive. */
    canDeleteDrive?: boolean
    /** Output only. Whether the current user can share files or folders in this shared drive. */
    canShare?: boolean
    /** Output only. Whether the current user can rename this shared drive. */
    canRenameDrive?: boolean
    /** Output only. Whether the current user can read the revisions resource of files in this shared drive. */
    canReadRevisions?: boolean
    /** Output only. Whether the current user can copy files in this shared drive. */
    canCopy?: boolean
    /** Output only. Whether the current user can trash children from folders in this shared drive. */
    canTrashChildren?: boolean
    /** Output only. Whether the current user can change organizer-applied download restrictions of this shared drive. */
    canChangeDownloadRestriction?: boolean
    /** Output only. Whether the current user can comment on files in this shared drive. */
    canComment?: boolean
    /** Output only. Whether the current user can edit files in this shared drive */
    canEdit?: boolean
    /** Output only. Whether the current user can delete children from folders in this shared drive. */
    canDeleteChildren?: boolean
    /** Output only. Whether the current user can change the background of this shared drive. */
    canChangeDriveBackground?: boolean
    /** Output only. Whether the current user can reset the shared drive restrictions to defaults. */
    canResetDriveRestrictions?: boolean
  }
  /** A set of restrictions that apply to this shared drive or items inside this shared drive. Note that restrictions can't be set when creating a shared drive. To add a restriction, first create a shared drive and then use `drives.update` to add restrictions. */
  restrictions?: {
    /** Whether administrative privileges on this shared drive are required to modify restrictions. */
    adminManagedRestrictions?: boolean
    /** If true, only users with the organizer role can share folders. If false, users with either the organizer role or the file organizer role can share folders. */
    sharingFoldersRequiresOrganizerPermission?: boolean
    /** Whether access to items inside this shared drive is restricted to its members. */
    driveMembersOnly?: boolean
    /** Download restrictions applied by shared drive managers. */
    downloadRestriction?: DriveDownloadRestriction
    /** Whether the options to copy, print, or download files inside this shared drive, should be disabled for readers and commenters. When this restriction is set to `true`, it will override the similarly named field to `true` for any file inside this shared drive. */
    copyRequiresWriterPermission?: boolean
    /** Whether access to this shared drive and items inside this shared drive is restricted to users of the domain to which this shared drive belongs. This restriction may be overridden by other sharing policies controlled outside of this shared drive. */
    domainUsersOnly?: boolean
  }
  /** Whether the shared drive is hidden from default view. */
  hidden?: boolean
  /** Output only. A short-lived link to this shared drive's background image. */
  backgroundImageLink?: string
  /** The color of this shared drive as an RGB hex string. It can only be set on a `drive.drives.update` request that does not set `themeId`. */
  colorRgb?: string
  /** Output only. Identifies what kind of resource this is. Value: the fixed string `"drive#drive"`. */
  kind?: string
  /** Output only. The ID of this shared drive which is also the ID of the top level folder of this shared drive. */
  id?: string
  /** An image file and cropping parameters from which a background image for this shared drive is set. This is a write only field; it can only be set on `drive.drives.update` requests that don't set `themeId`. When specified, all fields of the `backgroundImageFile` must be set. */
  backgroundImageFile?: {
    /** The ID of an image file in Google Drive to use for the background image. */
    id?: string
    /** The X coordinate of the upper left corner of the cropping area in the background image. This is a value in the closed range of 0 to 1. This value represents the horizontal distance from the left side of the entire image to the left side of the cropping area divided by the width of the entire image. */
    xCoordinate?: number
    /** The Y coordinate of the upper left corner of the cropping area in the background image. This is a value in the closed range of 0 to 1. This value represents the vertical distance from the top side of the entire image to the top side of the cropping area divided by the height of the entire image. */
    yCoordinate?: number
    /** The width of the cropped image in the closed range of 0 to 1. This value represents the width of the cropped image divided by the width of the entire image. The height is computed by applying a width to height aspect ratio of 80 to 9. The resulting image must be at least 1280 pixels wide and 144 pixels high. */
    width?: number
  }
  /** The ID of the theme from which the background image and color will be set. The set of possible `driveThemes` can be retrieved from a `drive.about.get` response. When not specified on a `drive.drives.create` request, a random theme is chosen from which the background image and color are set. This is a write-only field; it can only be set on requests that don't set `colorRgb` or `backgroundImageFile`. */
  themeId?: string
  /** Output only. The organizational unit of this shared drive. This field is only populated on `drives.list` responses when the `useDomainAdminAccess` parameter is set to `true`. */
  orgUnitId?: string
  /** The time at which the shared drive was created (RFC 3339 date-time). */
  createdTime?: string
}

/** A request to modify the set of labels on a file. This request may contain many modifications that will either all succeed or all fail atomically. */
export type DriveModifyLabelsRequest = {
  /** The list of modifications to apply to the labels on the file. */
  labelModifications?: Array<DriveLabelModification>
  /** This is always `"drive#modifyLabelsRequest"`. */
  kind?: string
}

/** Request message for resolving an AccessProposal on a file. */
export type DriveResolveAccessProposalRequest = {
  /** Optional. Whether to send an email to the requester when the access proposal is denied or accepted. */
  sendNotification?: boolean
  /** Optional. The roles that the approver has allowed, if any. For more information, see [Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles). Note: This field is required for the `ACCEPT` action. */
  role?: Array<string>
  /** Optional. Indicates the view for this access proposal. This should only be set when the proposal belongs to a view. Only `published` is supported. */
  view?: string
  /** Required. The action to take on the access proposal. */
  action?: "ACTION_UNSPECIFIED" | "ACCEPT" | "DENY"
}

/** Describes the bullet of a paragraph. */
export type DocsBullet = {
  /** The paragraph-specific text style applied to this bullet. */
  textStyle?: DocsTextStyle
  /** The nesting level of this paragraph in the list. */
  nestingLevel?: number
  /** The ID of the list this paragraph belongs to. */
  listId?: string
}

/** A reference to the external linked source content. */
export type DocsLinkedContentReference = {
  /** A reference to the linked chart. */
  sheetsChartReference?: DocsSheetsChartReference
}

/** Properties of a PositionedObject. */
export type DocsPositionedObjectProperties = {
  /** The positioning of this positioned object relative to the newline of the Paragraph that references this positioned object. */
  positioning?: DocsPositionedObjectPositioning
  /** The embedded object of this positioned object. */
  embeddedObject?: DocsEmbeddedObject
}

/** An object that's tethered to a Paragraph and positioned relative to the beginning of the paragraph. A PositionedObject contains an EmbeddedObject such as an image. */
export type DocsPositionedObject = {
  /** The suggested changes to the positioned object properties, keyed by suggestion ID. */
  suggestedPositionedObjectPropertiesChanges?: Record<string, DocsSuggestedPositionedObjectProperties>
  /** The suggested insertion ID. If empty, then this is not a suggested insertion. */
  suggestedInsertionId?: string
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The ID of this positioned object. */
  objectId?: string
  /** The properties of this positioned object. */
  positionedObjectProperties?: DocsPositionedObjectProperties
}

/** An RGB color. */
export type DocsRgbColor = {
  /** The red component of the color, from 0.0 to 1.0. */
  red?: number
  /** The blue component of the color, from 0.0 to 1.0. */
  blue?: number
  /** The green component of the color, from 0.0 to 1.0. */
  green?: number
}

/** The contents and style of a cell in a Table. */
export type DocsTableCell = {
  /** The style of the cell. */
  tableCellStyle?: DocsTableCellStyle
  /** The suggested insertion IDs. A TableCell may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The suggested changes to the table cell style, keyed by suggestion ID. */
  suggestedTableCellStyleChanges?: Record<string, DocsSuggestedTableCellStyle>
  /** The content of the cell. */
  content?: Array<DocsStructuralElement>
  /** The zero-based start index of this cell, in UTF-16 code units. */
  startIndex?: number
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The zero-based end index of this cell, exclusive, in UTF-16 code units. */
  endIndex?: number
}

/** Replaces an existing image with a new image. Replacing an image removes some image effects from the existing image in order to mirror the behavior of the Docs editor. */
export type DocsReplaceImageRequest = {
  /** The URI of the new image. The image is fetched once at insertion time and a copy is stored for display inside the document. Images must be less than 50MB, cannot exceed 25 megapixels, and must be in PNG, JPEG, or GIF format. The provided URI can't surpass 2 KB in length. The URI is saved with the image, and exposed through the ImageProperties.source_uri field. */
  uri?: string
  /** The replacement method. */
  imageReplaceMethod?: "IMAGE_REPLACE_METHOD_UNSPECIFIED" | "CENTER_CROP"
  /** The tab that the image to be replaced is in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
  /** The ID of the existing image that will be replaced. The ID can be retrieved from the response of a get request. */
  imageObjectId?: string
}

/** A mask that indicates which of the fields on the base TableRowStyle have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsTableRowStyleSuggestionState = {
  /** Indicates if there was a suggested change to min_row_height. */
  minRowHeightSuggested?: boolean
}

/** Represents the background of a document. */
export type DocsBackground = {
  /** The background color. */
  color?: DocsOptionalColor
}

/** A ParagraphElement representing a spot in the text that's dynamically replaced with content that can change over time, like a page number. */
export type DocsAutoText = {
  /** The text style of this AutoText. */
  textStyle?: DocsTextStyle
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The type of this auto text. */
  type?: "TYPE_UNSPECIFIED" | "PAGE_NUMBER" | "PAGE_COUNT"
  /** The suggested insertion IDs. An AutoText may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The suggested text style changes to this AutoText, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
}

/** A dropdown in the document. The chip is displayed as a dropdown menu that allows users to select an option from a configurable list of options. */
export type DocsDropdown = {
  /** The text style of this dropdown. */
  textStyle?: DocsTextStyle
  /** IDs for suggestions that remove this dropdown from the document. If empty, then this dropdown isn't suggested for deletion. */
  suggestedDeletionIds?: Array<string>
  /** IDs for suggestions that insert this dropdown into the document. If empty, then this dropdown isn't a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The ID of this dropdown. */
  dropdownId?: string
  /** The suggested properties changes to this dropdown, keyed by suggestion ID. */
  suggestedDropdownPropertiesChanges?: Record<string, DocsSuggestedDropdownProperties>
  /** The suggested text style changes to this dropdown, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
  /** The properties of this dropdown. */
  dropdownProperties?: DocsDropdownProperties
}

/** The result of replacing text. */
export type DocsReplaceAllTextResponse = {
  /** The number of occurrences changed by replacing all text. */
  occurrencesChanged?: number
}

/** Updates a named style. */
export type DocsUpdateNamedStyleRequest = {
  /** The document tab to update. By default, the update is applied to the first tab. */
  tabId?: string
  /** The document style to update. */
  namedStyle?: DocsNamedStyle
  /** The NamedStyle fields that should be updated. At least `named_style_type` must be specified. The root `named_style` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example, to update the text style to bold, set `fields` to include `"text_style"` and `"text_style.bold"`. To update the paragraph style's alignment property, set `fields` to include `"paragraph_style"` and `"paragraph_style.alignment"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset. Specifying `"text_style"` or `"paragraph_style"` with an empty TextStyle or ParagraphStyle will reset all of its nested fields. */
  fields?: string
}

/** A suggested change to a TextStyle. */
export type DocsSuggestedTextStyle = {
  /** A TextStyle that only includes the changes made in this suggestion. This can be used along with the text_style_suggestion_state to see which fields have changed and their new values. */
  textStyle?: DocsTextStyle
  /** A mask that indicates which of the fields on the base TextStyle have been changed in this suggestion. */
  textStyleSuggestionState?: DocsTextStyleSuggestionState
}

/** Properties specific to a RichLink. */
export type DocsRichLinkProperties = {
  /** The URI to the RichLink. This is always present. */
  uri?: string
  /** The title of the RichLink as displayed in the link. This title matches the title of the linked resource at the time of the insertion or last update of the link. This field is always present. */
  title?: string
  /** The [MIME type](https://developers.google.com/drive/api/v3/mime-types) of the RichLink, if there's one (for example, when it's a file in Drive). */
  mimeType?: string
}

/** A ParagraphElement representing a page break. A page break makes the subsequent text start at the top of the next page. */
export type DocsPageBreak = {
  /** The suggested insertion IDs. A PageBreak may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The suggested text style changes to this PageBreak, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
  /** The text style of this PageBreak. Similar to text content, like text runs and footnote references, the text style of a page break can affect content layout as well as the styling of text inserted next to it. */
  textStyle?: DocsTextStyle
}

/** Properties specific to a dropdown. */
export type DocsDropdownProperties = {
  /** The ID of the selected option in this dropdown. */
  selectedOptionId?: string
  /** The human-readable display text of the currently selected item. This field is populated by the server based on the dropdown definition and the selected option ID. It may differ from `DropdownOption.display_value` if the underlying option definition was modified or deleted, or during pending suggested changes. */
  displayValue?: string
  /** The ID of the DropdownDefinition that defines the options for this dropdown. */
  dropdownDefinitionId?: string
}

/** A mask that indicates which of the fields on the base SheetsChartReference have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsSheetsChartReferenceSuggestionState = {
  /** Indicates if there was a suggested change to spreadsheet_id. */
  spreadsheetIdSuggested?: boolean
  /** Indicates if there was a suggested change to chart_id. */
  chartIdSuggested?: boolean
}

/** The shading of a paragraph. */
export type DocsShading = {
  /** The background color of this paragraph shading. */
  backgroundColor?: DocsOptionalColor
}

/** Replaces all instances of text matching a criteria with replace text. */
export type DocsReplaceAllTextRequest = {
  /** Finds text in the document matching this substring. */
  containsText?: DocsSubstringMatchCriteria
  /** The text that will replace the matched text. */
  replaceText?: string
  /** Optional. The criteria used to specify in which tabs the replacement occurs. When omitted, the replacement applies to all tabs. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the replacement applies to the singular tab. In a document containing multiple tabs: - If provided, the replacement applies to the specified tabs. - If omitted, the replacement applies to all tabs. */
  tabsCriteria?: DocsTabsCriteria
}

/** A reference to a linked chart embedded from Google Sheets. */
export type DocsSheetsChartReference = {
  /** The ID of the specific chart in the Google Sheets spreadsheet that's embedded. */
  chartId?: number
  /** The ID of the Google Sheets spreadsheet that contains the source chart. */
  spreadsheetId?: string
}

/** Contains properties describing the look and feel of a list bullet at a given level of nesting. */
export type DocsNestingLevel = {
  /** The type of glyph used by bullets when paragraphs at this level of nesting is ordered. The glyph type determines the type of glyph used to replace placeholders within the glyph_format when paragraphs at this level of nesting are ordered. For example, if the nesting level is 0, the glyph_format is `%0.` and the glyph type is DECIMAL, then the rendered glyph would replace the placeholder `%0` in the glyph format with a number corresponding to the list item's order within the list. */
  glyphType?:
    | "GLYPH_TYPE_UNSPECIFIED"
    | "NONE"
    | "DECIMAL"
    | "ZERO_DECIMAL"
    | "UPPER_ALPHA"
    | "ALPHA"
    | "UPPER_ROMAN"
    | "ROMAN"
  /** The amount of indentation for paragraphs at this level of nesting. Applied to the side that corresponds to the start of the text, based on the paragraph's content direction. */
  indentStart?: DocsDimension
  /** The text style of bullets at this level of nesting. */
  textStyle?: DocsTextStyle
  /** The number of the first list item at this nesting level. A value of 0 is treated as a value of 1 for lettered lists and Roman numeral lists. For values of both 0 and 1, lettered and Roman numeral lists will begin at `a` and `i` respectively. This value is ignored for nesting levels with unordered glyphs. */
  startNumber?: number
  /** A custom glyph symbol used by bullets when paragraphs at this level of nesting is unordered. The glyph symbol replaces placeholders within the glyph_format. For example, if the glyph_symbol is the solid circle corresponding to Unicode U+25cf code point and the glyph_format is `%0`, the rendered glyph would be the solid circle. */
  glyphSymbol?: string
  /** The format string used by bullets at this level of nesting. The glyph format contains one or more placeholders, and these placeholders are replaced with the appropriate values depending on the glyph_type or glyph_symbol. The placeholders follow the pattern `%[nesting_level]`. Furthermore, placeholders can have prefixes and suffixes. Thus, the glyph format follows the pattern `%[nesting_level]`. Note that the prefix and suffix are optional and can be arbitrary strings. For example, the glyph format `%0.` indicates that the rendered glyph will replace the placeholder with the corresponding glyph for nesting level 0 followed by a period as the suffix. So a list with a glyph type of UPPER_ALPHA and glyph format `%0.` at nesting level 0 will result in a list with rendered glyphs `A.` `B.` `C.` The glyph format can contain placeholders for the current nesting level as well as placeholders for parent nesting levels. For example, a list can have a glyph format of `%0.` at nesting level 0 and a glyph format of `%0.%1.` at nesting level 1. Assuming both nesting levels have DECIMAL glyph types, this would result in a list with rendered glyphs `1.` `2.` ` 2.1.` ` 2.2.` `3.` For nesting levels that are ordered, the string that replaces a placeholder in the glyph format for a particular paragraph depends on the paragraph's order within the list. */
  glyphFormat?: string
  /** The amount of indentation for the first line of paragraphs at this level of nesting. */
  indentFirstLine?: DocsDimension
  /** The alignment of the bullet within the space allotted for rendering the bullet. */
  bulletAlignment?: "BULLET_ALIGNMENT_UNSPECIFIED" | "START" | "CENTER" | "END"
}

/** The suggestions which were affected by a given update. */
export type DocsSuggestionResponse = {
  /** The IDs of suggestions which were deleted during the update. */
  deletedSuggestionIds?: Array<string>
  /** The IDs of suggestions which were created during the update. */
  createdSuggestionIds?: Array<string>
  /** The IDs of suggestions which were accepted during the update. */
  acceptedSuggestionIds?: Array<string>
  /** The IDs of suggestions which were rejected during the update. */
  rejectedSuggestionIds?: Array<string>
  /** The IDs of suggestions whose summaries were updated during the update. */
  updatedSummarySuggestionIds?: Array<string>
}

/** A ParagraphElement representing a footnote reference. A footnote reference is the inline content rendered with a number and is used to identify the footnote. */
export type DocsFootnoteReference = {
  /** The rendered number of this footnote. */
  footnoteNumber?: string
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The text style of this FootnoteReference. */
  textStyle?: DocsTextStyle
  /** The suggested text style changes to this FootnoteReference, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
  /** The ID of the footnote that contains the content of this footnote reference. */
  footnoteId?: string
  /** The suggested insertion IDs. A FootnoteReference may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
}

/** A mask that indicates which of the fields on the base TextStyle have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsTextStyleSuggestionState = {
  /** Indicates if there was a suggested change to italic. */
  italicSuggested?: boolean
  /** Indicates if there was a suggested change to small_caps. */
  smallCapsSuggested?: boolean
  /** Indicates if there was a suggested change to weighted_font_family. */
  weightedFontFamilySuggested?: boolean
  /** Indicates if there was a suggested change to link. */
  linkSuggested?: boolean
  /** Indicates if there was a suggested change to font_size. */
  fontSizeSuggested?: boolean
  /** Indicates if there was a suggested change to background_color. */
  backgroundColorSuggested?: boolean
  /** Indicates if there was a suggested change to foreground_color. */
  foregroundColorSuggested?: boolean
  /** Indicates if there was a suggested change to bold. */
  boldSuggested?: boolean
  /** Indicates if there was a suggested change to underline. */
  underlineSuggested?: boolean
  /** Indicates if there was a suggested change to baseline_offset. */
  baselineOffsetSuggested?: boolean
  /** Indicates if there was a suggested change to strikethrough. */
  strikethroughSuggested?: boolean
}

/** A mask that indicates which of the fields on the base DropdownProperties have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsDropdownPropertiesSuggestionState = {
  /** Indicates if there was a suggested change to selected_option_id. */
  selectedOptionIdSuggested?: boolean
}

/** A mask that indicates which of the fields on the base NestingLevel have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsNestingLevelSuggestionState = {
  /** A mask that indicates which of the fields in text style have been changed in this suggestion. */
  textStyleSuggestionState?: DocsTextStyleSuggestionState
  /** Indicates if there was a suggested change to glyph_format. */
  glyphFormatSuggested?: boolean
  /** Indicates if there was a suggested change to glyph_type. */
  glyphTypeSuggested?: boolean
  /** Indicates if there was a suggested change to bullet_alignment. */
  bulletAlignmentSuggested?: boolean
  /** Indicates if there was a suggested change to start_number. */
  startNumberSuggested?: boolean
  /** Indicates if there was a suggested change to indent_start. */
  indentStartSuggested?: boolean
  /** Indicates if there was a suggested change to glyph_symbol. */
  glyphSymbolSuggested?: boolean
  /** Indicates if there was a suggested change to indent_first_line. */
  indentFirstLineSuggested?: boolean
}

/** A StructuralElement representing a table. */
export type DocsTable = {
  /** Number of rows in the table. */
  rows?: number
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The suggested insertion IDs. A Table may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The contents and style of each row. */
  tableRows?: Array<DocsTableRow>
  /** Number of columns in the table. It's possible for a table to be non-rectangular, so some rows may have a different number of cells. */
  columns?: number
  /** The style of the table. */
  tableStyle?: DocsTableStyle
}

/** Location of a single cell within a table. */
export type DocsTableCellLocation = {
  /** The zero-based row index. For example, the second row in the table has a row index of 1. */
  rowIndex?: number
  /** The zero-based column index. For example, the second column in the table has a column index of 1. */
  columnIndex?: number
  /** The location where the table starts in the document. */
  tableStartLocation?: DocsLocation
}

/** A single response from an update. */
export type DocsResponse = {
  /** The result of adding a reply to a comment or suggestion. */
  addCommentReply?: DocsAddCommentReplyResponse
  /** The result of adding a document tab. */
  addDocumentTab?: DocsAddDocumentTabResponse
  /** The result of inserting a dropdown. */
  insertDropdown?: DocsInsertDropdownResponse
  /** The result of replacing text. */
  replaceAllText?: DocsReplaceAllTextResponse
  /** The result of inserting an inline image. */
  insertInlineImage?: DocsInsertInlineImageResponse
  /** The result of inserting an inline Google Sheets chart. */
  insertInlineSheetsChart?: DocsInsertInlineSheetsChartResponse
  /** The result of creating a dropdown definition. */
  createDropdownDefinition?: DocsCreateDropdownDefinitionResponse
  /** The result of creating a footnote. */
  createFootnote?: DocsCreateFootnoteResponse
  /** The result of creating a footer. */
  createFooter?: DocsCreateFooterResponse
  /** The result of creating a header. */
  createHeader?: DocsCreateHeaderResponse
  /** The result of inserting a comment. */
  insertComment?: DocsInsertCommentResponse
  /** The result of creating a named range. */
  createNamedRange?: DocsCreateNamedRangeResponse
}

/** The style of the document. */
export type DocsDocumentStyle = {
  /** The amount of space between the top of the page and the contents of the header. If DocumentMode is PAGELESS, this property will not be rendered. */
  marginHeader?: DocsDimension
  /** The top page margin. Updating the top page margin on the document style clears the top page margin on all section styles. If DocumentMode is PAGELESS, this property will not be rendered. */
  marginTop?: DocsDimension
  /** The left page margin. Updating the left page margin on the document style clears the left page margin on all section styles. It may also cause columns to resize in all sections. If DocumentMode is PAGELESS, this property will not be rendered. */
  marginLeft?: DocsDimension
  /** The ID of the default header. If not set, there's no default header. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  defaultHeaderId?: string
  /** The amount of space between the bottom of the page and the contents of the footer. If DocumentMode is PAGELESS, this property will not be rendered. */
  marginFooter?: DocsDimension
  /** The background of the document. Documents cannot have a transparent background color. */
  background?: DocsBackground
  /** Indicates whether to use the first page header / footer IDs for the first page. If DocumentMode is PAGELESS, this property will not be rendered. */
  useFirstPageHeaderFooter?: boolean
  /** The ID of the footer used only for even pages. The value of use_even_page_header_footer determines whether to use the default_footer_id or this value for the footer on even pages. If not set, there's no even page footer. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  evenPageFooterId?: string
  /** The bottom page margin. Updating the bottom page margin on the document style clears the bottom page margin on all section styles. If DocumentMode is PAGELESS, this property will not be rendered. */
  marginBottom?: DocsDimension
  /** Optional. Indicates whether to flip the dimensions of the page_size, which allows changing the page orientation between portrait and landscape. If DocumentMode is PAGELESS, this property will not be rendered. */
  flipPageOrientation?: boolean
  /** The page number from which to start counting the number of pages. If DocumentMode is PAGELESS, this property will not be rendered. */
  pageNumberStart?: number
  /** The right page margin. Updating the right page margin on the document style clears the right page margin on all section styles. It may also cause columns to resize in all sections. If DocumentMode is PAGELESS, this property will not be rendered. */
  marginRight?: DocsDimension
  /** The ID of the header used only for even pages. The value of use_even_page_header_footer determines whether to use the default_header_id or this value for the header on even pages. If not set, there's no even page header. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  evenPageHeaderId?: string
  /** The size of a page in the document. If DocumentMode is PAGELESS, this property will not be rendered. */
  pageSize?: DocsSize
  /** The ID of the default footer. If not set, there's no default footer. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  defaultFooterId?: string
  /** The ID of the header used only for the first page. If not set then a unique header for the first page does not exist. The value of use_first_page_header_footer determines whether to use the default_header_id or this value for the header on the first page. If not set, there's no first page header. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  firstPageHeaderId?: string
  /** The ID of the footer used only for the first page. If not set then a unique footer for the first page does not exist. The value of use_first_page_header_footer determines whether to use the default_footer_id or this value for the footer on the first page. If not set, there's no first page footer. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  firstPageFooterId?: string
  /** Indicates whether DocumentStyle margin_header, SectionStyle margin_header and DocumentStyle margin_footer, SectionStyle margin_footer are respected. When false, the default values in the Docs editor for header and footer margin is used. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  useCustomHeaderFooterMargins?: boolean
  /** Indicates whether to use the even page header / footer IDs for the even pages. If DocumentMode is PAGELESS, this property will not be rendered. */
  useEvenPageHeaderFooter?: boolean
  /** Specifies document-level format settings, such as the document mode (pages vs pageless). */
  documentFormat?: DocsDocumentFormat
}

/** Deletes a row from a table. */
export type DocsDeleteTableRowRequest = {
  /** The reference table cell location from which the row will be deleted. The row this cell spans will be deleted. If this is a merged cell that spans multiple rows, all rows that the cell spans will be deleted. If no rows remain in the table after this deletion, the whole table is deleted. */
  tableCellLocation?: DocsTableCellLocation
}

/** Creates a Footnote segment and inserts a new FootnoteReference to it at the given location. The new Footnote segment will contain a space followed by a newline character. */
export type DocsCreateFootnoteRequest = {
  /** Inserts the footnote reference at the end of the document body. Footnote references cannot be inserted inside a header, footer or footnote. Since footnote references can only be inserted in the body, the segment ID field must be empty. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
  /** Inserts the footnote reference at a specific index in the document. The footnote reference must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Footnote references cannot be inserted inside an equation, header, footer or footnote. Since footnote references can only be inserted in the body, the segment ID field must be empty. */
  location?: DocsLocation
}

/** Creates a Header. The new header is applied to the SectionStyle at the location of the SectionBreak if specified, otherwise it is applied to the DocumentStyle. If a header of the specified type already exists, a 400 bad request error is returned. */
export type DocsCreateHeaderRequest = {
  /** The type of header to create. */
  type?: "HEADER_FOOTER_TYPE_UNSPECIFIED" | "DEFAULT"
  /** The location of the SectionBreak which begins the section this header should belong to. If `section_break_location' is unset or if it refers to the first section break in the document body, the header applies to the DocumentStyle */
  sectionBreakLocation?: DocsLocation
}

/** Inserts a reply Post into a CommentThread or SuggestionThread. */
export type DocsAddCommentReplyRequest = {
  /** The ID of the SuggestionThread to add the reply to. */
  suggestionId?: string
  /** The Post representing the reply. */
  post?: DocsPost
  /** The ID of the CommentThread to add the reply to. */
  commentId?: string
}

/** Deletes bullets from all of the paragraphs that overlap with the given range. The nesting level of each paragraph will be visually preserved by adding indent to the start of the corresponding paragraph. */
export type DocsDeleteParagraphBulletsRequest = {
  /** The range to delete bullets from. */
  range?: DocsRange
}

/** The suggestion state of a NamedStyles message. */
export type DocsNamedStylesSuggestionState = {
  /** A mask that indicates which of the fields on the corresponding NamedStyle in styles have been changed in this suggestion. The order of these named style suggestion states matches the order of the corresponding named style within the named styles suggestion. */
  stylesSuggestionStates?: Array<DocsNamedStyleSuggestionState>
}

/** Properties of a tab. */
export type DocsTabProperties = {
  /** The zero-based index of the tab within the parent. */
  index?: number
  /** Output only. The depth of the tab within the document. Root-level tabs start at 0. */
  nestingLevel?: number
  /** The immutable ID of the tab. */
  tabId?: string
  /** Optional. The ID of the parent tab. Empty when the current tab is a root-level tab, which means it doesn't have any parents. */
  parentTabId?: string
  /** Optional. The emoji icon displayed with the tab. A valid emoji icon is represented by a non-empty Unicode string. Any set of characters that don't represent a single emoji is invalid. If an emoji is invalid, a 400 bad request error is returned. If this value is unset or empty, the tab will display the default tab icon. */
  iconEmoji?: string
  /** The user-visible name of the tab. */
  title?: string
}

/** A suggested change to the DocumentStyle. */
export type DocsSuggestedDocumentStyle = {
  /** A mask that indicates which of the fields on the base DocumentStyle have been changed in this suggestion. */
  documentStyleSuggestionState?: DocsDocumentStyleSuggestionState
  /** A DocumentStyle that only includes the changes made in this suggestion. This can be used along with the document_style_suggestion_state to see which fields have changed and their new values. */
  documentStyle?: DocsDocumentStyle
}

/** Creates a NamedRange referencing the given range. */
export type DocsCreateNamedRangeRequest = {
  /** The name of the NamedRange. Names do not need to be unique. Names must be at least 1 character and no more than 256 characters, measured in UTF-16 code units. */
  name?: string
  /** The range to apply the name to. */
  range?: DocsRange
}

/** An embedded object in the document. */
export type DocsEmbeddedObject = {
  /** The properties of an embedded drawing. */
  embeddedDrawingProperties?: DocsEmbeddedDrawingProperties
  /** The right margin of the embedded object. */
  marginRight?: DocsDimension
  /** The visible size of the image after cropping. */
  size?: DocsSize
  /** The border of the embedded object. */
  embeddedObjectBorder?: DocsEmbeddedObjectBorder
  /** The left margin of the embedded object. */
  marginLeft?: DocsDimension
  /** The top margin of the embedded object. */
  marginTop?: DocsDimension
  /** The description of the embedded object. The `title` and `description` are both combined to display alt text. */
  description?: string
  /** A reference to the external linked source content. For example, it contains a reference to the source Google Sheets chart when the embedded object is a linked chart. If unset, then the embedded object is not linked. */
  linkedContentReference?: DocsLinkedContentReference
  /** The title of the embedded object. The `title` and `description` are both combined to display alt text. */
  title?: string
  /** The bottom margin of the embedded object. */
  marginBottom?: DocsDimension
  /** The properties of an image. */
  imageProperties?: DocsImageProperties
}

/** Deletes a Header from the document. */
export type DocsDeleteHeaderRequest = {
  /** The tab containing the header to delete. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
  /** The id of the header to delete. If this header is defined on DocumentStyle, the reference to this header is removed, resulting in no header of that type for the first section of the document. If this header is defined on a SectionStyle, the reference to this header is removed and the header of that type is now continued from the previous section. */
  headerId?: string
}

/** Inserts a table at the specified location. A newline character will be inserted before the inserted table. */
export type DocsInsertTableRequest = {
  /** The number of rows in the table. */
  rows?: number
  /** Inserts the table at the end of the given header, footer or document body. A newline character will be inserted before the inserted table. Tables cannot be inserted inside a footnote. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
  /** Inserts the table at a specific model index. A newline character will be inserted before the inserted table, therefore the table start index will be at the specified location index + 1. The table must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between an existing table and its preceding paragraph). Tables cannot be inserted inside a footnote or equation. */
  location?: DocsLocation
  /** The number of columns in the table. */
  columns?: number
}

/** The result of inserting a Dropdown. */
export type DocsInsertDropdownResponse = {
  /** The newly-inserted Dropdown. */
  dropdown?: DocsDropdown
}

/** Inserts a date at the specified location. */
export type DocsInsertDateRequest = {
  /** Inserts the date at the end of the given header, footer or document body. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
  /** Inserts the date at a specific index in the document. The date must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between an existing table and its preceding paragraph). */
  location?: DocsLocation
  /** The properties of the date to insert. */
  dateElementProperties?: DocsDateElementProperties
}

/** Response message for adding a reply. */
export type DocsAddCommentReplyResponse = {
  /** The newly-inserted reply Post. */
  post?: DocsPost
}

/** The contents and style of a row in a Table. */
export type DocsTableRow = {
  /** The suggested style changes to this row, keyed by suggestion ID. */
  suggestedTableRowStyleChanges?: Record<string, DocsSuggestedTableRowStyle>
  /** The zero-based end index of this row, exclusive, in UTF-16 code units. */
  endIndex?: number
  /** The suggested insertion IDs. A TableRow may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The style of the table row. */
  tableRowStyle?: DocsTableRowStyle
  /** The zero-based start index of this row, in UTF-16 code units. */
  startIndex?: number
  /** The contents and style of each cell in this row. It's possible for a table to be non-rectangular, so some rows may have a different number of cells than other rows in the same table. */
  tableCells?: Array<DocsTableCell>
}

/** The properties of a list that describe the look and feel of bullets belonging to paragraphs associated with a list. */
export type DocsListProperties = {
  /** Describes the properties of the bullets at the associated level. A list has at most 9 levels of nesting with nesting level 0 corresponding to the top-most level and nesting level 8 corresponding to the most nested level. The nesting levels are returned in ascending order with the least nested returned first. */
  nestingLevels?: Array<DocsNestingLevel>
}

/** A mask that indicates which of the fields on the base ImageProperties have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsImagePropertiesSuggestionState = {
  /** Indicates if there was a suggested change to transparency. */
  transparencySuggested?: boolean
  /** Indicates if there was a suggested change to contrast. */
  contrastSuggested?: boolean
  /** Indicates if there was a suggested change to content_uri. */
  contentUriSuggested?: boolean
  /** A mask that indicates which of the fields in crop_properties have been changed in this suggestion. */
  cropPropertiesSuggestionState?: DocsCropPropertiesSuggestionState
  /** Indicates if there was a suggested change to brightness. */
  brightnessSuggested?: boolean
  /** Indicates if there was a suggested change to source_uri. */
  sourceUriSuggested?: boolean
  /** Indicates if there was a suggested change to angle. */
  angleSuggested?: boolean
}

/** A collection of Ranges with the same named range ID. Named ranges allow developers to associate parts of a document with an arbitrary user-defined label so their contents can be programmatically read or edited later. A document can contain multiple named ranges with the same name, but every named range has a unique ID. A named range is created with a single Range, and content inserted inside a named range generally expands that range. However, certain document changes can cause the range to be split into multiple ranges. Named ranges are not private. All applications and collaborators that have access to the document can see its named ranges. */
export type DocsNamedRange = {
  /** The ranges that belong to this named range. */
  ranges?: Array<DocsRange>
  /** The ID of the named range. */
  namedRangeId?: string
  /** The name of the named range. */
  name?: string
}

/** A named style. Paragraphs in the document can inherit their TextStyle and ParagraphStyle from this named style when they have the same named style type. */
export type DocsNamedStyle = {
  /** The type of this named style. */
  namedStyleType?:
    | "NAMED_STYLE_TYPE_UNSPECIFIED"
    | "NORMAL_TEXT"
    | "TITLE"
    | "SUBTITLE"
    | "HEADING_1"
    | "HEADING_2"
    | "HEADING_3"
    | "HEADING_4"
    | "HEADING_5"
    | "HEADING_6"
  /** The text style of this named style. */
  textStyle?: DocsTextStyle
  /** The paragraph style of this named style. */
  paragraphStyle?: DocsParagraphStyle
}

/** The properties of an embedded drawing and used to differentiate the object type. An embedded drawing is one that's created and edited within a document. Note that extensive details are not supported. */
export type DocsEmbeddedDrawingProperties = Record<string, unknown>

/** Deletes a suggestion. Returns a 403 forbidden error if the requesting user is not the author of the suggestion. */
export type DocsDeleteSuggestionRequest = {
  /** The ID of the suggestion. */
  suggestionId?: string
}

/** Update the properties of a document tab. */
export type DocsUpdateDocumentTabPropertiesRequest = {
  /** The tab properties to update. */
  tabProperties?: DocsTabProperties
  /** The fields that should be updated. At least one field must be specified. The root `tab_properties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** Deletes content from the document. */
export type DocsDeleteContentRangeRequest = {
  /** The range of content to delete. Deleting text that crosses a paragraph boundary may result in changes to paragraph styles, lists, positioned objects and bookmarks as the two paragraphs are merged. Attempting to delete certain ranges can result in an invalid document structure in which case a 400 bad request error is returned. Some examples of invalid delete requests include: * Deleting one code unit of a surrogate pair. * Deleting the last newline character of a Body, Header, Footer, Footnote, TableCell or TableOfContents. * Deleting the start or end of a Table, TableOfContents or Equation without deleting the entire element. * Deleting the newline character before a Table, TableOfContents or SectionBreak without deleting the element. * Deleting individual rows or cells of a table. Deleting the content within a table cell is allowed. */
  range?: DocsRange
}

/** Accepts a suggestion. Returns a 403 forbidden error if the requesting user does not have edit access to the document. */
export type DocsAcceptSuggestionRequest = {
  /** The ID of the suggestion. */
  suggestionId?: string
}

/** A ParagraphElement representing a horizontal line. */
export type DocsHorizontalRule = {
  /** The suggested text style changes to this HorizontalRule, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
  /** The text style of this HorizontalRule. Similar to text content, like text runs and footnote references, the text style of a horizontal rule can affect content layout as well as the styling of text inserted next to it. */
  textStyle?: DocsTextStyle
  /** The suggested insertion IDs. A HorizontalRule may have multiple insertion IDs if it is a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
}

/** A reference to a heading in this document. */
export type DocsHeadingLink = {
  /** The ID of the tab containing this heading. */
  tabId?: string
  /** The ID of a heading in this document. */
  id?: string
}

/** Update the styling of text. */
export type DocsUpdateTextStyleRequest = {
  /** The range of text to style. The range may be extended to include adjacent newlines. If the range fully contains a paragraph belonging to a list, the paragraph's bullet is also updated with the matching text style. Ranges cannot be inserted inside a relative UpdateTextStyleRequest. */
  range?: DocsRange
  /** The fields that should be updated. At least one field must be specified. The root `text_style` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example, to update the text style to bold, set `fields` to `"bold"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset. */
  fields?: string
  /** The styles to set on the text. If the value for a particular style matches that of the parent, that style will be set to inherit. Certain text style changes may cause other changes in order to to mirror the behavior of the Docs editor. See the documentation of TextStyle for more information. */
  textStyle?: DocsTextStyle
}

/** Updates the DocumentStyle. */
export type DocsUpdateDocumentStyleRequest = {
  /** The tab that contains the style to update. When omitted, the request applies to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If not provided, the request applies to the first tab in the document. */
  tabId?: string
  /** The fields that should be updated. At least one field must be specified. The root `document_style` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the background, set `fields` to `"background"`. */
  fields?: string
  /** The styles to set on the document. Certain document style changes may cause other changes in order to mirror the behavior of the Docs editor. See the documentation of DocumentStyle for more information. */
  documentStyle?: DocsDocumentStyle
}

/** A color that can either be fully opaque or fully transparent. */
export type DocsOptionalColor = {
  /** If set, this will be used as an opaque color. If unset, this represents a transparent color. */
  color?: DocsColor
}

/** Location at the end of a body, header, footer or footnote. The location is immediately before the last newline in the document segment. */
export type DocsEndOfSegmentLocation = {
  /** The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body. */
  segmentId?: string
  /** The tab that the location is in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
}

/** A suggested change to InlineObjectProperties. */
export type DocsSuggestedInlineObjectProperties = {
  /** An InlineObjectProperties that only includes the changes made in this suggestion. This can be used along with the inline_object_properties_suggestion_state to see which fields have changed and their new values. */
  inlineObjectProperties?: DocsInlineObjectProperties
  /** A mask that indicates which of the fields on the base InlineObjectProperties have been changed in this suggestion. */
  inlineObjectPropertiesSuggestionState?: DocsInlineObjectPropertiesSuggestionState
}

/** Inserts text at the specified location. */
export type DocsInsertTextRequest = {
  /** Inserts the text at the end of a header, footer, footnote or the document body. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
  /** Inserts the text at a specific index in the document. Text must be inserted inside the bounds of an existing Paragraph. For instance, text cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). The text must be inserted in the preceding paragraph. */
  location?: DocsLocation
  /** The text to be inserted. Inserting a newline character will implicitly create a new Paragraph at that index. The paragraph style of the new paragraph will be copied from the paragraph at the current insertion index, including lists and bullets. Text styles for inserted text will be determined automatically, generally preserving the styling of neighboring text. In most cases, the text style for the inserted text will match the text immediately before the insertion index. Some control characters (U+0000-U+0008, U+000C-U+001F) and characters from the Unicode Basic Multilingual Plane Private Use Area (U+E000-U+F8FF) will be stripped out of the inserted text. */
  text?: string
}

/** Creates a Footer. The new footer is applied to the SectionStyle at the location of the SectionBreak if specified, otherwise it is applied to the DocumentStyle. If a footer of the specified type already exists, a 400 bad request error is returned. */
export type DocsCreateFooterRequest = {
  /** The type of footer to create. */
  type?: "HEADER_FOOTER_TYPE_UNSPECIFIED" | "DEFAULT"
  /** The location of the SectionBreak immediately preceding the section whose SectionStyle this footer should belong to. If this is unset or refers to the first section break in the document, the footer applies to the document style. */
  sectionBreakLocation?: DocsLocation
}

/** A criteria that matches a specific string of text in the document. */
export type DocsSubstringMatchCriteria = {
  /** Optional. True if the find value should be treated as a regular expression. Any backslashes in the pattern should be escaped. - `True`: the search text is treated as a regular expressions. - `False`: the search text is treated as a substring for matching. */
  searchByRegex?: boolean
  /** Indicates whether the search should respect case: - `True`: the search is case sensitive. - `False`: the search is case insensitive. */
  matchCase?: boolean
  /** The text to search for in the document. */
  text?: string
}

/** The named styles. Paragraphs in the document can inherit their TextStyle and ParagraphStyle from these named styles. */
export type DocsNamedStyles = {
  /** The named styles. There's an entry for each of the possible named style types. */
  styles?: Array<DocsNamedStyle>
}

/** The style of a TableCell. Inherited table cell styles are represented as unset fields in this message. A table cell style can inherit from the table's style. */
export type DocsTableCellStyle = {
  /** The column span of the cell. This property is read-only. */
  columnSpan?: number
  /** The bottom border of the cell. */
  borderBottom?: DocsTableCellBorder
  /** The top border of the cell. */
  borderTop?: DocsTableCellBorder
  /** The right padding of the cell. */
  paddingRight?: DocsDimension
  /** The bottom padding of the cell. */
  paddingBottom?: DocsDimension
  /** The background color of the cell. */
  backgroundColor?: DocsOptionalColor
  /** The left padding of the cell. */
  paddingLeft?: DocsDimension
  /** The left border of the cell. */
  borderLeft?: DocsTableCellBorder
  /** The top padding of the cell. */
  paddingTop?: DocsDimension
  /** The row span of the cell. This property is read-only. */
  rowSpan?: number
  /** The alignment of the content in the table cell. The default alignment matches the alignment for newly created table cells in the Docs editor. */
  contentAlignment?: "CONTENT_ALIGNMENT_UNSPECIFIED" | "CONTENT_ALIGNMENT_UNSUPPORTED" | "TOP" | "MIDDLE" | "BOTTOM"
  /** The right border of the cell. */
  borderRight?: DocsTableCellBorder
}

/** A suggested change to PositionedObjectProperties. */
export type DocsSuggestedPositionedObjectProperties = {
  /** A mask that indicates which of the fields on the base PositionedObjectProperties have been changed in this suggestion. */
  positionedObjectPropertiesSuggestionState?: DocsPositionedObjectPropertiesSuggestionState
  /** A PositionedObjectProperties that only includes the changes made in this suggestion. This can be used along with the positioned_object_properties_suggestion_state to see which fields have changed and their new values. */
  positionedObjectProperties?: DocsPositionedObjectProperties
}

/** Properties that apply to a section's column. */
export type DocsSectionColumnProperties = {
  /** Output only. The width of the column. */
  width?: DocsDimension
  /** The padding at the end of the column. */
  paddingEnd?: DocsDimension
}

/** Deletes a reply Post from a CommentThread or SuggestionThread. Returns a 400 bad request error if: - The requesting user is not the author of the post. - The reply post contains an action. - The reply post contains an assignee. */
export type DocsDeleteCommentReplyRequest = {
  /** The ID of the reply Post being deleted. */
  postId?: string
  /** The ID of the SuggestionThread which the post belongs to. */
  suggestionId?: string
  /** The ID of the CommentThread which the post belongs to. */
  commentId?: string
}

/** A border around an EmbeddedObject. */
export type DocsEmbeddedObjectBorder = {
  /** The dash style of the border. */
  dashStyle?: "DASH_STYLE_UNSPECIFIED" | "SOLID" | "DOT" | "DASH"
  /** The property state of the border property. */
  propertyState?: "RENDERED" | "NOT_RENDERED"
  /** The width of the border. */
  width?: DocsDimension
  /** The color of the border. */
  color?: DocsOptionalColor
}

/** A mask that indicates which of the fields on the base InlineObjectProperties have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsInlineObjectPropertiesSuggestionState = {
  /** A mask that indicates which of the fields in embedded_object have been changed in this suggestion. */
  embeddedObjectSuggestionState?: DocsEmbeddedObjectSuggestionState
}

/** A collection of all the NamedRanges in the document that share a given name. */
export type DocsNamedRanges = {
  /** The NamedRanges that share the same name. */
  namedRanges?: Array<DocsNamedRange>
  /** The name that all the named ranges share. */
  name?: string
}

/** An object that appears inline with text. An InlineObject contains an EmbeddedObject such as an image. */
export type DocsInlineObject = {
  /** The ID of this inline object. Can be used to update an object’s properties. */
  objectId?: string
  /** The suggested changes to the inline object properties, keyed by suggestion ID. */
  suggestedInlineObjectPropertiesChanges?: Record<string, DocsSuggestedInlineObjectProperties>
  /** The suggested insertion ID. If empty, then this is not a suggested insertion. */
  suggestedInsertionId?: string
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The properties of this inline object. */
  inlineObjectProperties?: DocsInlineObjectProperties
}

/** Inserts an empty column into a table. */
export type DocsInsertTableColumnRequest = {
  /** Whether to insert new column to the right of the reference cell location. - `True`: insert to the right. - `False`: insert to the left. */
  insertRight?: boolean
  /** The reference table cell location from which columns will be inserted. A new column will be inserted to the left (or right) of the column where the reference cell is. If the reference cell is a merged cell, a new column will be inserted to the left (or right) of the merged cell. */
  tableCellLocation?: DocsTableCellLocation
}

/** A border around a table cell. Table cell borders cannot be transparent. To hide a table cell border, make its width 0. */
export type DocsTableCellBorder = {
  /** The dash style of the border. */
  dashStyle?: "DASH_STYLE_UNSPECIFIED" | "SOLID" | "DOT" | "DASH"
  /** The width of the border. */
  width?: DocsDimension
  /** The color of the border. This color cannot be transparent. */
  color?: DocsOptionalColor
}

/** A document header. */
export type DocsHeader = {
  /** The ID of the header. */
  headerId?: string
  /** The contents of the header. The indexes for a header's content begin at zero. */
  content?: Array<DocsStructuralElement>
}

/** Response message for inserting a comment. */
export type DocsInsertCommentResponse = {
  /** The newly-inserted comment thread. */
  commentThread?: DocsCommentThread
}

/** Updates the properties of a Dropdown. */
export type DocsUpdateDropdownPropertiesRequest = {
  /** The ID of the tab that contains the dropdown to update. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
  /** The properties to update. */
  dropdownProperties?: DocsDropdownProperties
  /** The fields that should be updated. At least one field must be specified. The root `dropdown_properties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
  /** Required. The Dropdown ID. */
  dropdownId?: string
}

/** A tab in a document. */
export type DocsTab = {
  /** The child tabs nested within this tab. */
  childTabs?: Array<DocsTab>
  /** The properties of the tab, like ID and title. */
  tabProperties?: DocsTabProperties
  /** A tab with document contents, like text and images. */
  documentTab?: DocsDocumentTab
}

/** A solid color. */
export type DocsColor = {
  /** The RGB color value. */
  rgbColor?: DocsRgbColor
}

/** A document footer. */
export type DocsFooter = {
  /** The ID of the footer. */
  footerId?: string
  /** The contents of the footer. The indexes for a footer's content begin at zero. */
  content?: Array<DocsStructuralElement>
}

/** A suggested change to dropdown definition properties. */
export type DocsSuggestedDropdownDefinitionProperties = {
  /** A DropdownDefinitionProperties that only includes the changes made in this suggestion. This can be used along with the dropdown_definition_properties_suggestion_state to see which fields have changed and their new values. */
  dropdownDefinitionProperties?: DocsDropdownDefinitionProperties
  /** A mask that indicates which of the fields on the base DropdownDefinitionProperties have been changed in this suggestion. */
  dropdownDefinitionPropertiesSuggestionState?: DocsDropdownDefinitionPropertiesSuggestionState
}

/** A collection of object IDs. */
export type DocsObjectReferences = {
  /** The object IDs. */
  objectIds?: Array<string>
}

/** A StructuralElement representing a table of contents. */
export type DocsTableOfContents = {
  /** The suggested insertion IDs. A TableOfContents may have multiple insertion IDs if it is a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The content of the table of contents. */
  content?: Array<DocsStructuralElement>
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
}

/** A mask that indicates which of the fields on the base ListProperties have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsListPropertiesSuggestionState = {
  /** A mask that indicates which of the fields on the corresponding NestingLevel in nesting_levels have been changed in this suggestion. The nesting level suggestion states are returned in ascending order of the nesting level with the least nested returned first. */
  nestingLevelsSuggestionStates?: Array<DocsNestingLevelSuggestionState>
}

/** A StructuralElement describes content that provides structure to the document. */
export type DocsStructuralElement = {
  /** The zero-based start index of this structural element, in UTF-16 code units. */
  startIndex?: number
  /** A table type of structural element. */
  table?: DocsTable
  /** A table of contents type of structural element. */
  tableOfContents?: DocsTableOfContents
  /** A section break type of structural element. */
  sectionBreak?: DocsSectionBreak
  /** A paragraph type of structural element. */
  paragraph?: DocsParagraph
  /** The zero-based end index of this structural element, exclusive, in UTF-16 code units. */
  endIndex?: number
}

/** Inserts an InlineObject containing an image at the given location. */
export type DocsInsertInlineImageRequest = {
  /** Inserts the text at the end of a header, footer or the document body. Inline images cannot be inserted inside a footnote. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
  /** The size that the image should appear as in the document. This property is optional and the final size of the image in the document is determined by the following rules: * If neither width nor height is specified, then a default size of the image is calculated based on its resolution. * If one dimension is specified then the other dimension is calculated to preserve the aspect ratio of the image. * If both width and height are specified, the image is scaled to fit within the provided dimensions while maintaining its aspect ratio. */
  objectSize?: DocsSize
  /** The image URI. The image is fetched once at insertion time and a copy is stored for display inside the document. Images must be less than 50MB in size, cannot exceed 25 megapixels, and must be in one of PNG, JPEG, or GIF format. The provided URI must be publicly accessible and at most 2 kB in length. The URI itself is saved with the image, and exposed via the ImageProperties.content_uri field. */
  uri?: string
  /** Inserts the image at a specific index in the document. The image must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Inline images cannot be inserted inside a footnote or equation. */
  location?: DocsLocation
}

/** The document body. The body typically contains the full document contents except for headers, footers, and footnotes. */
export type DocsBody = {
  /** The contents of the body. The indexes for the body's content begin at zero. */
  content?: Array<DocsStructuralElement>
}

/** Inserts an empty row into a table. */
export type DocsInsertTableRowRequest = {
  /** The reference table cell location from which rows will be inserted. A new row will be inserted above (or below) the row where the reference cell is. If the reference cell is a merged cell, a new row will be inserted above (or below) the merged cell. */
  tableCellLocation?: DocsTableCellLocation
  /** Whether to insert new row below the reference cell location. - `True`: insert below the cell. - `False`: insert above the cell. */
  insertBelow?: boolean
}

/** Provides control over how write requests are executed. */
export type DocsWriteControl = {
  /** How the request updates should be applied to the document. If unspecified, the request updates will be applied as normal edits. */
  writeMode?: "WRITE_MODE_UNSPECIFIED" | "EDIT" | "SUGGEST"
  /** The optional revision ID of the document the write request is applied to. If this is not the latest revision of the document, the request is not processed and returns a 400 bad request error. When a required revision ID is returned in a response, it indicates the revision ID of the document after the request was applied. */
  requiredRevisionId?: string
  /** The optional target revision ID of the document the write request is applied to. If collaborator changes have occurred after the document was read using the API, the changes produced by this write request are applied against the collaborator changes. This results in a new revision of the document that incorporates both the collaborator changes and the changes in the request, with the Docs server resolving conflicting changes. When using target revision ID, the API client can be thought of as another collaborator of the document. The target revision ID can only be used to write to recent versions of a document. If the target revision is too far behind the latest revision, the request is not processed and returns a 400 bad request error. The request should be tried again after retrieving the latest version of the document. Usually a revision ID remains valid for use as a target revision for several minutes after it's read, but for frequently edited documents this window might be shorter. */
  targetRevisionId?: string
}

/** The result of creating a footer. */
export type DocsCreateFooterResponse = {
  /** The ID of the created footer. */
  footerId?: string
}

/** A dropdown definition in the document. */
export type DocsDropdownDefinition = {
  /** The properties of this dropdown definition. */
  dropdownDefinitionProperties?: DocsDropdownDefinitionProperties
  /** The ID of this dropdown definition. If you specify an ID, it must be unique among all IDs in the tab. The ID must start with `kix.` and match regex `^kix\.[a-zA-Z0-9_-]{2,14}$` (length 6-18 chars). If you don't specify an ID, a unique one is generated. */
  dropdownDefinitionId?: string
  /** ID for suggestion that deletes this dropdown definition. */
  suggestedDeletionId?: string
  /** ID for suggestion that inserts this dropdown definition. */
  suggestedInsertionId?: string
  /** Suggested property changes to this definition, keyed by suggestion ID. */
  suggestedDropdownDefinitionPropertiesChanges?: Record<string, DocsSuggestedDropdownDefinitionProperties>
}

/** The styling that applies to a section. */
export type DocsSectionStyle = {
  /** The content direction of this section. If unset, the value defaults to LEFT_TO_RIGHT. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  contentDirection?: "CONTENT_DIRECTION_UNSPECIFIED" | "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT"
  /** The header margin of the section. If unset, the value defaults to margin_header from DocumentStyle. If updated, use_custom_header_footer_margins is set to true on DocumentStyle. The value of use_custom_header_footer_margins on DocumentStyle indicates if a header margin is being respected for this section. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  marginHeader?: DocsDimension
  /** The left page margin of the section. If unset, the value defaults to margin_left from DocumentStyle. Updating the left margin causes columns in this section to resize. Since the margin affects column width, it's applied before column properties. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  marginLeft?: DocsDimension
  /** The ID of the header used only for even pages. If the value of DocumentStyle's use_even_page_header_footer is true, this value is used for the headers on even pages in the section. If it is false, the headers on even pages use the default_header_id. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's even_page_header_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  evenPageHeaderId?: string
  /** The top page margin of the section. If unset, the value defaults to margin_top from DocumentStyle. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  marginTop?: DocsDimension
  /** The ID of the header used only for the first page of the section. If use_first_page_header_footer is true, this value is used for the header on the first page of the section. If it's false, the header on the first page of the section uses the default_header_id. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's first_page_header_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  firstPageHeaderId?: string
  /** The ID of the footer used only for the first page of the section. If use_first_page_header_footer is true, this value is used for the footer on the first page of the section. If it's false, the footer on the first page of the section uses the default_footer_id. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's first_page_footer_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  firstPageFooterId?: string
  /** The ID of the default footer. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's default_footer_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  defaultFooterId?: string
  /** The footer margin of the section. If unset, the value defaults to margin_footer from DocumentStyle. If updated, use_custom_header_footer_margins is set to true on DocumentStyle. The value of use_custom_header_footer_margins on DocumentStyle indicates if a footer margin is being respected for this section If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  marginFooter?: DocsDimension
  /** The page number from which to start counting the number of pages for this section. If unset, page numbering continues from the previous section. If the value is unset in the first SectionBreak, refer to DocumentStyle's page_number_start. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  pageNumberStart?: number
  /** The bottom page margin of the section. If unset, the value defaults to margin_bottom from DocumentStyle. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  marginBottom?: DocsDimension
  /** Optional. Indicates whether to flip the dimensions of DocumentStyle's page_size for this section, which allows changing the page orientation between portrait and landscape. If unset, the value inherits from DocumentStyle's flip_page_orientation. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  flipPageOrientation?: boolean
  /** The ID of the footer used only for even pages. If the value of DocumentStyle's use_even_page_header_footer is true, this value is used for the footers on even pages in the section. If it is false, the footers on even pages use the default_footer_id. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's even_page_footer_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  evenPageFooterId?: string
  /** The right page margin of the section. If unset, the value defaults to margin_right from DocumentStyle. Updating the right margin causes columns in this section to resize. Since the margin affects column width, it's applied before column properties. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  marginRight?: DocsDimension
  /** The style of column separators. This style can be set even when there's one column in the section. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  columnSeparatorStyle?: "COLUMN_SEPARATOR_STYLE_UNSPECIFIED" | "NONE" | "BETWEEN_EACH_COLUMN"
  /** The section's columns properties. If empty, the section contains one column with the default properties in the Docs editor. A section can be updated to have no more than 3 columns. When updating this property, setting a concrete value is required. Unsetting this property will result in a 400 bad request error. */
  columnProperties?: Array<DocsSectionColumnProperties>
  /** Indicates whether to use the first page header / footer IDs for the first page of the section. If unset, it inherits from DocumentStyle's use_first_page_header_footer for the first section. If the value is unset for subsequent sectors, it should be interpreted as false. If DocumentMode is PAGELESS, this property will not be rendered. When updating this property, setting a concrete value is required. Unsetting this property results in a 400 bad request error. */
  useFirstPageHeaderFooter?: boolean
  /** Output only. The type of section. */
  sectionType?: "SECTION_TYPE_UNSPECIFIED" | "CONTINUOUS" | "NEXT_PAGE"
  /** The ID of the default header. If unset, the value inherits from the previous SectionBreak's SectionStyle. If the value is unset in the first SectionBreak, it inherits from DocumentStyle's default_header_id. If DocumentMode is PAGELESS, this property will not be rendered. This property is read-only. */
  defaultHeaderId?: string
}

/** Request message for BatchUpdateDocument. */
export type DocsBatchUpdateDocumentRequest = {
  /** A list of updates to apply to the document. */
  requests?: Array<DocsRequest>
  /** Provides control over how write requests are executed. */
  writeControl?: DocsWriteControl
}

/** A mask that indicates which of the fields on the base EmbeddedObject have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsEmbeddedObjectSuggestionState = {
  /** A mask that indicates which of the fields in linked_content_reference have been changed in this suggestion. */
  linkedContentReferenceSuggestionState?: DocsLinkedContentReferenceSuggestionState
  /** A mask that indicates which of the fields in size have been changed in this suggestion. */
  sizeSuggestionState?: DocsSizeSuggestionState
  /** Indicates if there was a suggested change to title. */
  titleSuggested?: boolean
  /** Indicates if there was a suggested change to margin_left. */
  marginLeftSuggested?: boolean
  /** Indicates if there was a suggested change to margin_bottom. */
  marginBottomSuggested?: boolean
  /** Indicates if there was a suggested change to description. */
  descriptionSuggested?: boolean
  /** A mask that indicates which of the fields in embedded_object_border have been changed in this suggestion. */
  embeddedObjectBorderSuggestionState?: DocsEmbeddedObjectBorderSuggestionState
  /** Indicates if there was a suggested change to margin_top. */
  marginTopSuggested?: boolean
  /** Indicates if there was a suggested change to margin_right. */
  marginRightSuggested?: boolean
  /** A mask that indicates which of the fields in image_properties have been changed in this suggestion. */
  imagePropertiesSuggestionState?: DocsImagePropertiesSuggestionState
  /** A mask that indicates which of the fields in embedded_drawing_properties have been changed in this suggestion. */
  embeddedDrawingPropertiesSuggestionState?: DocsEmbeddedDrawingPropertiesSuggestionState
}

/** A ParagraphElement that represents a run of text that all has the same styling. */
export type DocsTextRun = {
  /** The text style of this run. */
  textStyle?: DocsTextStyle
  /** The suggested insertion IDs. A TextRun may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The text of this run. Any non-text elements in the run are replaced with the Unicode character U+E907. */
  content?: string
  /** The suggested text style changes to this run, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
}

/** A tab stop within a paragraph. */
export type DocsTabStop = {
  /** The alignment of this tab stop. If unset, the value defaults to START. */
  alignment?: "TAB_STOP_ALIGNMENT_UNSPECIFIED" | "START" | "CENTER" | "END"
  /** The offset between this tab stop and the start margin. */
  offset?: DocsDimension
}

/** Properties of a DateElement. */
export type DocsDateElementProperties = {
  /** Output only. Indicates how the DateElement is displayed in the document. */
  displayText?: string
  /** Determines how the time part of the DateElement will be displayed in the document. If unset, the default value is TIME_FORMAT_DISABLED, indicating no time should be shown. */
  timeFormat?:
    | "TIME_FORMAT_UNSPECIFIED"
    | "TIME_FORMAT_DISABLED"
    | "TIME_FORMAT_HOUR_MINUTE"
    | "TIME_FORMAT_HOUR_MINUTE_TIMEZONE"
  /** The point in time to represent, in seconds and nanoseconds since Unix epoch: January 1, 1970 at midnight UTC. Timestamp is expected to be in UTC. If time_zone_id is set, the timestamp is adjusted according to the time zone. For example, a timestamp of `18000` with a date format of `DATE_FORMAT_ISO8601` and time format of `TIME_FORMAT_HOUR_MINUTE` would be displayed as `1970-01-01 5:00 AM`. A timestamp of `18000` with date format of `DATE_FORMAT_ISO8601`, time format of `TIME_FORMAT_HOUR_MINUTE`, and time zone set to `America/New_York` will instead be `1970-01-01 12:00 AM`. */
  timestamp?: string
  /** The language code of the DateElement. For example, `en`. If unset, the default locale is `en`. Limited to the following locales: `af`, `am`, `ar`, `as`, `az`, `be`, `bg`, `bn`, `ca`, `cs`, `da`, `de`, `el`, `en`, `en-CA`, `en-GB`, `es`, `es-419`, `et`, `eu`, `fa`, `fi`, `fil`, `fr`, `fr-CA`, `gl`, `gu`, `hi`, `hr`, `hu`, `hy`, `id`, `is`, `it`, `iw`, `ja`, `ka`, `kk`, `km`, `kn`, `ko`, `lo`, `lt`, `lv`, `mk`, `ml`, `mn`, `mr`, `ms`, `ne`, `nl`, `no`, `or`, `pa`, `pl`, `pt-BR`, `pt-PT`, `ro`, `ru`, `si`, `sk`, `sl`, `sq`, `sr`, `sv`, `sw`, `ta`, `te`, `th`, `tr`, `uk`, `ur`, `uz`, `vi`, `zh-CN`, `zh-HK`, `zh-TW`, `zu`, `cy`, `my`. */
  locale?: string
  /** The time zone of the DateElement, as defined by the Unicode Common Locale Data Repository (CLDR) project. For example, `America/New_York`. If unset, the default time zone is `etc/UTC`. */
  timeZoneId?: string
  /** Determines how the date part of the DateElement will be displayed in the document. If unset, the default value is DATE_FORMAT_MONTH_DAY_YEAR_ABBREVIATED, indicating the DateElement will be formatted as `MMM d, y` in `en`, or locale specific equivalent. */
  dateFormat?:
    | "DATE_FORMAT_UNSPECIFIED"
    | "DATE_FORMAT_CUSTOM"
    | "DATE_FORMAT_MONTH_DAY_ABBREVIATED"
    | "DATE_FORMAT_MONTH_DAY_FULL"
    | "DATE_FORMAT_MONTH_DAY_YEAR_ABBREVIATED"
    | "DATE_FORMAT_ISO8601"
}

/** A mask that indicates which of the fields on the base ParagraphStyle have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsParagraphStyleSuggestionState = {
  /** Indicates if there was a suggested change to indent_start. */
  indentStartSuggested?: boolean
  /** Indicates if there was a suggested change to border_bottom. */
  borderBottomSuggested?: boolean
  /** Indicates if there was a suggested change to spacing_mode. */
  spacingModeSuggested?: boolean
  /** Indicates if there was a suggested change to heading_id. */
  headingIdSuggested?: boolean
  /** Indicates if there was a suggested change to space_below. */
  spaceBelowSuggested?: boolean
  /** A mask that indicates which of the fields in shading have been changed in this suggestion. */
  shadingSuggestionState?: DocsShadingSuggestionState
  /** Indicates if there was a suggested change to direction. */
  directionSuggested?: boolean
  /** Indicates if there was a suggested change to page_break_before. */
  pageBreakBeforeSuggested?: boolean
  /** Indicates if there was a suggested change to avoid_widow_and_orphan. */
  avoidWidowAndOrphanSuggested?: boolean
  /** Indicates if there was a suggested change to keep_lines_together. */
  keepLinesTogetherSuggested?: boolean
  /** Indicates if there was a suggested change to named_style_type. */
  namedStyleTypeSuggested?: boolean
  /** Indicates if there was a suggested change to line_spacing. */
  lineSpacingSuggested?: boolean
  /** Indicates if there was a suggested change to border_right. */
  borderRightSuggested?: boolean
  /** Indicates if there was a suggested change to space_above. */
  spaceAboveSuggested?: boolean
  /** Indicates if there was a suggested change to alignment. */
  alignmentSuggested?: boolean
  /** Indicates if there was a suggested change to border_top. */
  borderTopSuggested?: boolean
  /** Indicates if there was a suggested change to border_between. */
  borderBetweenSuggested?: boolean
  /** Indicates if there was a suggested change to border_left. */
  borderLeftSuggested?: boolean
  /** Indicates if there was a suggested change to indent_end. */
  indentEndSuggested?: boolean
  /** Indicates if there was a suggested change to indent_first_line. */
  indentFirstLineSuggested?: boolean
  /** Indicates if there was a suggested change to keep_with_next. */
  keepWithNextSuggested?: boolean
}

/** Properties specific to a linked Person. */
export type DocsPersonProperties = {
  /** The name of the person if it's displayed in the link text instead of the person's email address. */
  name?: string
  /** The email address linked to this Person. This field is always present. */
  email?: string
}

/** A suggested change to a TableRowStyle. */
export type DocsSuggestedTableRowStyle = {
  /** A TableRowStyle that only includes the changes made in this suggestion. This can be used along with the table_row_style_suggestion_state to see which fields have changed and their new values. */
  tableRowStyle?: DocsTableRowStyle
  /** A mask that indicates which of the fields on the base TableRowStyle have been changed in this suggestion. */
  tableRowStyleSuggestionState?: DocsTableRowStyleSuggestionState
}

/** Unmerges cells in a Table. */
export type DocsUnmergeTableCellsRequest = {
  /** The table range specifying which cells of the table to unmerge. All merged cells in this range will be unmerged, and cells that are already unmerged will not be affected. If the range has no merged cells, the request will do nothing. If there is text in any of the merged cells, the text will remain in the "head" cell of the resulting block of unmerged cells. The "head" cell is the upper-left cell when the content direction is from left to right, and the upper-right otherwise. */
  tableRange?: DocsTableRange
}

/** Represents a single comment thread. */
export type DocsCommentThread = {
  /** The unique ID of the comment thread. */
  commentId?: string
  /** The quoted text from the document when the comment was created, formatted as plain-text. */
  plainTextQuote?: string
  /** Replies to the head post. */
  replies?: Array<DocsPost>
  /** The ID of the CommentAnchor in the document that this thread is tied to. Multiple comment threads may be anchored to the same CommentAnchor. */
  anchorId?: string
  /** The first post in the thread. */
  headPost?: DocsPost
  /** Whether the thread is open or resolved. */
  status?: "STATUS_UNSPECIFIED" | "OPEN" | "RESOLVED"
}

/** The properties of an image. */
export type DocsImageProperties = {
  /** The brightness effect of the image. The value should be in the interval [-1.0, 1.0], where 0 means no effect. */
  brightness?: number
  /** The clockwise rotation angle of the image, in radians. */
  angle?: number
  /** The source URI is the URI used to insert the image. The source URI can be empty. */
  sourceUri?: string
  /** A URI to the image with a default lifetime of 30 minutes. This URI is tagged with the account of the requester. Anyone with the URI effectively accesses the image as the original requester. Access to the image may be lost if the document's sharing settings change. */
  contentUri?: string
  /** The contrast effect of the image. The value should be in the interval [-1.0, 1.0], where 0 means no effect. */
  contrast?: number
  /** The transparency effect of the image. The value should be in the interval [0.0, 1.0], where 0 means no effect and 1 means transparent. */
  transparency?: number
  /** The crop properties of the image. */
  cropProperties?: DocsCropProperties
}

/** One or more locations in the document that are tied to CommentThreads with the same anchorId. Note: Multiple anchors may refer to the same location. */
export type DocsCommentAnchor = {
  /** The ID of the comment anchor. */
  anchorId?: string
  /** A collection of Ranges in the document which are tied to this anchor. */
  ranges?: Array<DocsRange>
}

/** Deletes a NamedRange. */
export type DocsDeleteNamedRangeRequest = {
  /** Optional. The criteria used to specify which tab(s) the range deletion should occur in. When omitted, the range deletion is applied to all tabs. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the range deletion applies to the singular tab. In a document containing multiple tabs: - If provided, the range deletion applies to the specified tabs. - If not provided, the range deletion applies to all tabs. */
  tabsCriteria?: DocsTabsCriteria
  /** The name of the range(s) to delete. All named ranges with the given name will be deleted. */
  name?: string
  /** The ID of the named range to delete. */
  namedRangeId?: string
}

/** A mask that indicates which of the fields on the base EmbeddedDrawingProperties have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsEmbeddedDrawingPropertiesSuggestionState = Record<string, unknown>

/** The properties of a column in a table. */
export type DocsTableColumnProperties = {
  /** The width type of the column. */
  widthType?: "WIDTH_TYPE_UNSPECIFIED" | "EVENLY_DISTRIBUTED" | "FIXED_WIDTH"
  /** The width of the column. Set when the column's `width_type` is FIXED_WIDTH. */
  width?: DocsDimension
}

/** A Google Docs document. */
export type DocsDocument = {
  /** Output only. The inline objects in the document, keyed by object ID. Legacy field: Instead, use Document.tabs.documentTab.inlineObjects, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  inlineObjects?: Record<string, DocsInlineObject>
  /** Output only. Tabs that are part of a document. Tabs can contain child tabs, a tab nested within another tab. Child tabs are represented by the Tab.childTabs field. */
  tabs?: Array<DocsTab>
  /** Output only. The footers in the document, keyed by footer ID. Legacy field: Instead, use Document.tabs.documentTab.footers, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  footers?: Record<string, DocsFooter>
  /** Output only. The suggestions associated with the document. Only populated if the commentsViewMode parameter is set to require comments (such as `COMMENTS_VIEW_MODE_INCLUDED`). */
  suggestions?: Array<DocsSuggestionThread>
  /** Output only. The ID of the document. */
  documentId?: string
  /** Output only. The named styles of the document. Legacy field: Instead, use Document.tabs.documentTab.namedStyles, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  namedStyles?: DocsNamedStyles
  /** Output only. The style of the document. Legacy field: Instead, use Document.tabs.documentTab.documentStyle, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  documentStyle?: DocsDocumentStyle
  /** Output only. The suggested changes to the style of the document, keyed by suggestion ID. Legacy field: Instead, use Document.tabs.documentTab.suggestedDocumentStyleChanges, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  suggestedDocumentStyleChanges?: Record<string, DocsSuggestedDocumentStyle>
  /** The title of the document. */
  title?: string
  /** Output only. The headers in the document, keyed by header ID. Legacy field: Instead, use Document.tabs.documentTab.headers, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  headers?: Record<string, DocsHeader>
  /** Output only. The comments view mode applied to the document. */
  commentsViewMode?:
    | "COMMENTS_VIEW_MODE_UNSPECIFIED"
    | "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS"
    | "COMMENTS_VIEW_MODE_OMITTED"
    | "COMMENTS_VIEW_MODE_INCLUDED"
  /** Output only. The positioned objects in the document, keyed by object ID. Legacy field: Instead, use Document.tabs.documentTab.positionedObjects, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  positionedObjects?: Record<string, DocsPositionedObject>
  /** Output only. The suggestions view mode applied to the document. Note: When editing a document, changes must be based on a document with SUGGESTIONS_INLINE. */
  suggestionsViewMode?:
    | "DEFAULT_FOR_CURRENT_ACCESS"
    | "SUGGESTIONS_INLINE"
    | "PREVIEW_SUGGESTIONS_ACCEPTED"
    | "PREVIEW_WITHOUT_SUGGESTIONS"
  /** Output only. The revision ID of the document. Can be used in update requests to specify which revision of a document to apply updates to and how the request should behave if the document has been edited since that revision. Only populated if the user has edit access to the document. The revision ID is not a sequential number but an opaque string. The format of the revision ID might change over time. A returned revision ID is only guaranteed to be valid for 24 hours after it has been returned and cannot be shared across users. If the revision ID is unchanged between calls, then the document has not changed. Conversely, a changed ID (for the same document and user) usually means the document has been updated. However, a changed ID can also be due to internal factors such as ID format changes. */
  revisionId?: string
  /** Output only. The footnotes in the document, keyed by footnote ID. Legacy field: Instead, use Document.tabs.documentTab.footnotes, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  footnotes?: Record<string, DocsFootnote>
  /** Output only. The suggested changes to the named styles of the document, keyed by suggestion ID. Legacy field: Instead, use Document.tabs.documentTab.suggestedNamedStylesChanges, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  suggestedNamedStylesChanges?: Record<string, DocsSuggestedNamedStyles>
  /** Output only. The lists in the document, keyed by list ID. Legacy field: Instead, use Document.tabs.documentTab.lists, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  lists?: Record<string, DocsList>
  /** Output only. The named ranges in the document, keyed by name. Legacy field: Instead, use Document.tabs.documentTab.namedRanges, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  namedRanges?: Record<string, DocsNamedRanges>
  /** Output only. The main body of the document. Legacy field: Instead, use Document.tabs.documentTab.body, which exposes the actual document content from all tabs when the includeTabsContent parameter is set to `true`. If `false` or unset, this field contains information about the first tab in the document. */
  body?: DocsBody
  /** Output only. The comments associated with the document. Only populated if the commentsViewMode parameter is set to require comments (such as `COMMENTS_VIEW_MODE_INCLUDED`). */
  comments?: Array<DocsCommentThread>
}

/** Properties of an InlineObject. */
export type DocsInlineObjectProperties = {
  /** The embedded object of this inline object. */
  embeddedObject?: DocsEmbeddedObject
}

/** A criteria that specifies in which tabs a request executes. */
export type DocsTabsCriteria = {
  /** The list of tab IDs in which the request executes. */
  tabIds?: Array<string>
}

/** A mask that indicates which of the fields on the base CropProperties have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsCropPropertiesSuggestionState = {
  /** Indicates if there was a suggested change to offset_right. */
  offsetRightSuggested?: boolean
  /** Indicates if there was a suggested change to offset_bottom. */
  offsetBottomSuggested?: boolean
  /** Indicates if there was a suggested change to angle. */
  angleSuggested?: boolean
  /** Indicates if there was a suggested change to offset_left. */
  offsetLeftSuggested?: boolean
  /** Indicates if there was a suggested change to offset_top. */
  offsetTopSuggested?: boolean
}

/** A mask that indicates which of the fields on the base DropdownDefinitionProperties have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsDropdownDefinitionPropertiesSuggestionState = {
  /** Indicates if there was a suggested change to options. */
  optionsSuggested?: boolean
  /** Indicates if there was a suggested change to title. */
  titleSuggested?: boolean
}

/** Response message from a BatchUpdateDocument request. */
export type DocsBatchUpdateDocumentResponse = {
  /** The reply of the updates. This maps 1:1 with the updates, although replies to some requests may be empty. */
  replies?: Array<DocsResponse>
  /** Whether comment updates were applied in the batch request. */
  commentUpdateState?:
    | "COMMENT_UPDATE_STATE_UNSPECIFIED"
    | "NO_UPDATES_REQUESTED"
    | "ALL_SAVED"
    | "ALL_FAILED_UNKNOWN_REASON"
  /** The ID of the document to which the updates were applied to. */
  documentId?: string
  /** The suggestions which were affected by each update. This maps 1:1 with the updates. */
  suggestionResponses?: Array<DocsSuggestionResponse>
  /** The updated write control after applying the request. */
  writeControl?: DocsWriteControl
}

/** Deletes a column from a table. */
export type DocsDeleteTableColumnRequest = {
  /** The reference table cell location from which the column will be deleted. The column this cell spans will be deleted. If this is a merged cell that spans multiple columns, all columns that the cell spans will be deleted. If no columns remain in the table after this deletion, the whole table is deleted. */
  tableCellLocation?: DocsTableCellLocation
}

/** A document footnote. */
export type DocsFootnote = {
  /** The contents of the footnote. The indexes for a footnote's content begin at zero. */
  content?: Array<DocsStructuralElement>
  /** The ID of the footnote. */
  footnoteId?: string
}

/** A mask that indicates which of the fields on the base LinkedContentReference have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsLinkedContentReferenceSuggestionState = {
  /** A mask that indicates which of the fields in sheets_chart_reference have been changed in this suggestion. */
  sheetsChartReferenceSuggestionState?: DocsSheetsChartReferenceSuggestionState
}

/** Updates a Post in a CommentThread or SuggestionThread. Returns a 400 bad request error if: - The post is the headPost of a SuggestionThread. - The requesting user is not the author of the post. */
export type DocsUpdateCommentPostRequest = {
  /** The ID of the post being updated. */
  postId?: string
  /** The new text of the comment, as plain text. This text content will be handled similarly to comments created in the Docs editor. It will have similar behaviors for formatting, notifications, etc. This field cannot be empty, and must not exceed 2048 UTF-8 code units. */
  content?: string
  /** The ID of the CommentThread which the post belongs to. */
  commentId?: string
  /** The ID of the SuggestionThread which the post belongs to. */
  suggestionId?: string
}

/** A suggested change to a TableCellStyle. */
export type DocsSuggestedTableCellStyle = {
  /** A mask that indicates which of the fields on the base TableCellStyle have been changed in this suggestion. */
  tableCellStyleSuggestionState?: DocsTableCellStyleSuggestionState
  /** A TableCellStyle that only includes the changes made in this suggestion. This can be used along with the table_cell_style_suggestion_state to see which fields have changed and their new values. */
  tableCellStyle?: DocsTableCellStyle
}

/** A ParagraphElement representing a column break. A column break makes the subsequent text start at the top of the next column. */
export type DocsColumnBreak = {
  /** The text style of this ColumnBreak. Similar to text content, like text runs and footnote references, the text style of a column break can affect content layout as well as the styling of text inserted next to it. */
  textStyle?: DocsTextStyle
  /** The suggested insertion IDs. A ColumnBreak may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The suggested text style changes to this ColumnBreak, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
}

/** Represents a font family and weight of text. */
export type DocsWeightedFontFamily = {
  /** The weight of the font. This field can have any value that's a multiple of `100` between `100` and `900`, inclusive. This range corresponds to the numerical values described in the CSS 2.1 Specification, [section 15.6](https://www.w3.org/TR/CSS21/fonts.html#font-boldness), with non-numerical values disallowed. The default value is `400` ("normal"). The font weight makes up just one component of the rendered font weight. A combination of the `weight` and the text style's resolved `bold` value determine the rendered weight, after accounting for inheritance: * If the text is bold and the weight is less than `400`, the rendered weight is 400. * If the text is bold and the weight is greater than or equal to `400` but is less than `700`, the rendered weight is `700`. * If the weight is greater than or equal to `700`, the rendered weight is equal to the weight. * If the text is not bold, the rendered weight is equal to the weight. */
  weight?: number
  /** The font family of the text. The font family can be any font from the Font menu in Docs or from [Google Fonts] (https://fonts.google.com/). If the font name is unrecognized, the text is rendered in `Arial`. */
  fontFamily?: string
}

/** Represents a user who authored a comment or suggestion post. */
export type DocsPostAuthor = {
  /** The display name of the user. May be absent if the author is anonymous. */
  displayName?: string
  /** Whether the user is anonymous. */
  anonymous?: boolean
  /** The resource name of the post author user, which can also be used to identify the user in the [Google People API](https://developers.google.com/people/api/rest/v1/people). Format: `users/{user}`. Will not be populated if the anonymous field is `true` or if the post is from an imported document. */
  user?: string
  /** Whether the user is the authenticated user making the request. */
  me?: boolean
}

/** A tab with document contents. */
export type DocsDocumentTab = {
  /** The main body of the document tab. */
  body?: DocsBody
  /** The suggested changes to the named styles of the document tab, keyed by suggestion ID. */
  suggestedNamedStylesChanges?: Record<string, DocsSuggestedNamedStyles>
  /** The named ranges in the document tab, keyed by name. */
  namedRanges?: Record<string, DocsNamedRanges>
  /** The positioned objects in the document tab, keyed by object ID. */
  positionedObjects?: Record<string, DocsPositionedObject>
  /** The suggested changes to the style of the document tab, keyed by suggestion ID. */
  suggestedDocumentStyleChanges?: Record<string, DocsSuggestedDocumentStyle>
  /** The style of the document tab. */
  documentStyle?: DocsDocumentStyle
  /** The headers in the document tab, keyed by header ID. */
  headers?: Record<string, DocsHeader>
  /** The inline objects in the document tab, keyed by object ID. */
  inlineObjects?: Record<string, DocsInlineObject>
  /** The named styles of the document tab. */
  namedStyles?: DocsNamedStyles
  /** The lists in the document tab, keyed by list ID. */
  lists?: Record<string, DocsList>
  /** The footnotes in the document tab, keyed by footnote ID. */
  footnotes?: Record<string, DocsFootnote>
  /** The footers in the document tab, keyed by footer ID. */
  footers?: Record<string, DocsFooter>
  /** The comment anchors in a document tab, keyed by anchor ID. Only populated if the commentsViewMode parameter is set to require comments (such as `COMMENTS_VIEW_MODE_INCLUDED`). */
  commentAnchors?: Record<string, DocsCommentAnchor>
  /** The dropdown definitions in a document tab, keyed by dropdown definition ID. */
  dropdownDefinitions?: Record<string, DocsDropdownDefinition>
}

/** Inserts a CommentThread into the document. */
export type DocsInsertCommentRequest = {
  /** The Range in the document that is tied to this comment. */
  range?: DocsRange
  /** Optional. The email address of the assignee of the comment. Leave empty for a non-assigned comment. May not exceed 2048 UTF-8 code units. */
  assigneeEmailAddress?: string
  /** The text of the comment, as plain text. This text content will be handled similarly to comments created in the Docs editor. It will have similar behaviors for formatting, notifications, etc. This field cannot be empty, and must not exceed 2048 UTF-8 code units. */
  content?: string
}

/** A suggested change to a ParagraphStyle. */
export type DocsSuggestedParagraphStyle = {
  /** A ParagraphStyle that only includes the changes made in this suggestion. This can be used along with the paragraph_style_suggestion_state to see which fields have changed and their new values. */
  paragraphStyle?: DocsParagraphStyle
  /** A mask that indicates which of the fields on the base ParagraphStyle have been changed in this suggestion. */
  paragraphStyleSuggestionState?: DocsParagraphStyleSuggestionState
}

/** Deletes a CommentThread. Returns a 400 bad request error if the requesting user is not the author of the headPost. */
export type DocsDeleteCommentRequest = {
  /** The ID of the CommentThread that is being deleted. */
  commentId?: string
}

/** Styles that apply to a table. */
export type DocsTableStyle = {
  /** The properties of each column. Note that in Docs, tables contain rows and rows contain cells, similar to HTML. So the properties for a row can be found on the row's table_row_style. */
  tableColumnProperties?: Array<DocsTableColumnProperties>
}

/** Updates the properties of a DropdownDefinition. */
export type DocsUpdateDropdownDefinitionPropertiesRequest = {
  /** The ID of the DropdownDefinition to update. */
  dropdownDefinitionId?: string
  /** The ID of the tab that contains the dropdown definition to update. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
  /** A map of option IDs to their replacements, used to automatically reassign orphaned Dropdown chips when an option is deleted. The keys are the IDs of the options being deleted, and the values are the IDs of their replacement options. If an option being deleted is selected in one or more Dropdown chips in the document, a replacement entry for that option must be provided in this map, and the replacement option ID must exist in the updated DropdownDefinition. If a replacement is required but not provided, a 400 bad request error is returned. Options being deleted that are not selected in any Dropdown chips do not require a replacement. For example, if option A is being replaced by option B, the map should be `{"A": "B"}`. */
  selectedOptionIdReplacements?: Record<string, string>
  /** The properties to update. */
  dropdownDefinitionProperties?: DocsDropdownDefinitionProperties
  /** The fields that should be updated. At least one field must be specified. The root `dropdown_definition_properties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. When `dropdown_definition_properties.options` is included in the field mask, the full, complete list of desired options must be provided in `dropdown_definition_properties.options`. */
  fields?: string
}

/** Response message for creating a dropdown definition. */
export type DocsCreateDropdownDefinitionResponse = {
  /** The newly-created DropdownDefinition. */
  dropdownDefinition?: DocsDropdownDefinition
}

/** Deletes a tab. If the tab has child tabs, they are deleted as well. */
export type DocsDeleteTabRequest = {
  /** The ID of the tab to delete. */
  tabId?: string
}

/** A mask that indicates which of the fields on the base PositionedObjectProperties have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsPositionedObjectPropertiesSuggestionState = {
  /** A mask that indicates which of the fields in positioning have been changed in this suggestion. */
  positioningSuggestionState?: DocsPositionedObjectPositioningSuggestionState
  /** A mask that indicates which of the fields in embedded_object have been changed in this suggestion. */
  embeddedObjectSuggestionState?: DocsEmbeddedObjectSuggestionState
}

/** A mask that indicates which of the fields on the base TableCellStyle have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsTableCellStyleSuggestionState = {
  /** Indicates if there was a suggested change to content_alignment. */
  contentAlignmentSuggested?: boolean
  /** Indicates if there was a suggested change to column_span. */
  columnSpanSuggested?: boolean
  /** Indicates if there was a suggested change to border_left. */
  borderLeftSuggested?: boolean
  /** Indicates if there was a suggested change to padding_top. */
  paddingTopSuggested?: boolean
  /** Indicates if there was a suggested change to padding_bottom. */
  paddingBottomSuggested?: boolean
  /** Indicates if there was a suggested change to border_bottom. */
  borderBottomSuggested?: boolean
  /** Indicates if there was a suggested change to padding_right. */
  paddingRightSuggested?: boolean
  /** Indicates if there was a suggested change to padding_left. */
  paddingLeftSuggested?: boolean
  /** Indicates if there was a suggested change to row_span. */
  rowSpanSuggested?: boolean
  /** Indicates if there was a suggested change to border_top. */
  borderTopSuggested?: boolean
  /** Indicates if there was a suggested change to background_color. */
  backgroundColorSuggested?: boolean
  /** Indicates if there was a suggested change to border_right. */
  borderRightSuggested?: boolean
}

/** The positioning of a PositionedObject. The positioned object is positioned relative to the beginning of the Paragraph it's tethered to. */
export type DocsPositionedObjectPositioning = {
  /** The offset of the left edge of the positioned object relative to the beginning of the Paragraph it's tethered to. The exact positioning of the object can depend on other content in the document and the document's styling. */
  leftOffset?: DocsDimension
  /** The layout of this positioned object. */
  layout?:
    | "POSITIONED_OBJECT_LAYOUT_UNSPECIFIED"
    | "WRAP_TEXT"
    | "BREAK_LEFT"
    | "BREAK_RIGHT"
    | "BREAK_LEFT_RIGHT"
    | "IN_FRONT_OF_TEXT"
    | "BEHIND_TEXT"
  /** The offset of the top edge of the positioned object relative to the beginning of the Paragraph it's tethered to. The exact positioning of the object can depend on other content in the document and the document's styling. */
  topOffset?: DocsDimension
}

/** Adds a document tab. When a tab is added at a given index, all subsequent tabs' indexes are incremented. */
export type DocsAddDocumentTabRequest = {
  /** The properties of the tab to add. All properties are optional. */
  tabProperties?: DocsTabProperties
}

/** A ParagraphElement representing an equation. */
export type DocsEquation = {
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The suggested insertion IDs. An Equation may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
}

/** Styles that apply to a table row. */
export type DocsTableRowStyle = {
  /** Whether the row is a table header. */
  tableHeader?: boolean
  /** The minimum height of the row. The row will be rendered in the Docs editor at a height equal to or greater than this value in order to show all the content in the row's cells. */
  minRowHeight?: DocsDimension
  /** Whether the row cannot overflow across page or column boundaries. */
  preventOverflow?: boolean
}

/** Represents document-level format settings. */
export type DocsDocumentFormat = {
  /** Whether the document has pages or is pageless. */
  documentMode?: "DOCUMENT_MODE_UNSPECIFIED" | "PAGES" | "PAGELESS"
}

/** Specifies a contiguous range of text. */
export type DocsRange = {
  /** The ID of the header, footer, or footnote that this range is contained in. An empty segment ID signifies the document's body. */
  segmentId?: string
  /** The zero-based end index of this range, exclusive, in UTF-16 code units. In all current uses, an end index must be provided. This field is an Int32Value in order to accommodate future use cases with open-ended ranges. */
  endIndex?: number
  /** The tab that contains this range. When omitted, the request applies to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
  /** The zero-based start index of this range, in UTF-16 code units. In all current uses, a start index must be provided. This field is an Int32Value in order to accommodate future use cases with open-ended ranges. */
  startIndex?: number
}

/** A date instance mentioned in a document. */
export type DocsDateElement = {
  /** The text style of this DateElement. */
  textStyle?: DocsTextStyle
  /** IDs for suggestions that remove this date from the document. A DateElement might have multiple deletion IDs if, for example, multiple users suggest deleting it. If empty, then this date isn't suggested for deletion. */
  suggestedDeletionIds?: Array<string>
  /** The suggested changes to the date element properties, keyed by suggestion ID. */
  suggestedDateElementPropertiesChanges?: Record<string, DocsSuggestedDateElementProperties>
  /** IDs for suggestions that insert this date into the document. A DateElement might have multiple insertion IDs if it's a nested suggested change (a suggestion within a suggestion made by a different user, for example). If empty, then this date isn't a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The properties of this DateElement. */
  dateElementProperties?: DocsDateElementProperties
  /** Output only. The unique ID of this date. */
  dateId?: string
  /** The suggested text style changes to this DateElement, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
}

/** A suggested change to ListProperties. */
export type DocsSuggestedListProperties = {
  /** A ListProperties that only includes the changes made in this suggestion. This can be used along with the list_properties_suggestion_state to see which fields have changed and their new values. */
  listProperties?: DocsListProperties
  /** A mask that indicates which of the fields on the base ListProperties have been changed in this suggestion. */
  listPropertiesSuggestionState?: DocsListPropertiesSuggestionState
}

/** A List represents the list attributes for a group of paragraphs that all belong to the same list. A paragraph that's part of a list has a reference to the list's ID in its bullet. */
export type DocsList = {
  /** The suggested changes to the list properties, keyed by suggestion ID. */
  suggestedListPropertiesChanges?: Record<string, DocsSuggestedListProperties>
  /** The suggested insertion ID. If empty, then this is not a suggested insertion. */
  suggestedInsertionId?: string
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this list. */
  suggestedDeletionIds?: Array<string>
  /** The properties of the list. */
  listProperties?: DocsListProperties
}

/** An option in a Dropdown. */
export type DocsDropdownOption = {
  /** The text style of this dropdown option. Currently, only the `foreground_color` and `background_color` properties are supported. If other properties are set, a 400 bad request error is returned. */
  textStyle?: DocsTextStyle
  /** The ID of this dropdown option. If you specify an ID, it must be unique among all options in this dropdown definition. The ID must start with `dropdownItem.` and match regex `^dropdownItem\.[a-zA-Z0-9_-]{2,14}$` (length 15-27 chars). If you don't specify an ID, a unique one is generated. */
  optionId?: string
  /** The display value of this dropdown option. */
  displayValue?: string
}

/** The crop properties of an image. The crop rectangle is represented using fractional offsets from the original content's 4 edges. - If the offset is in the interval (0, 1), the corresponding edge of crop rectangle is positioned inside of the image's original bounding rectangle. - If the offset is negative or greater than 1, the corresponding edge of crop rectangle is positioned outside of the image's original bounding rectangle. - If all offsets and rotation angles are 0, the image is not cropped. */
export type DocsCropProperties = {
  /** The offset specifies how far inwards the right edge of the crop rectangle is from the right edge of the original content as a fraction of the original content's width. */
  offsetRight?: number
  /** The offset specifies how far inwards the top edge of the crop rectangle is from the top edge of the original content as a fraction of the original content's height. */
  offsetTop?: number
  /** The offset specifies how far inwards the left edge of the crop rectangle is from the left edge of the original content as a fraction of the original content's width. */
  offsetLeft?: number
  /** The clockwise rotation angle of the crop rectangle around its center, in radians. Rotation is applied after the offsets. */
  angle?: number
  /** The offset specifies how far inwards the bottom edge of the crop rectangle is from the bottom edge of the original content as a fraction of the original content's height. */
  offsetBottom?: number
}

/** A border around a paragraph. */
export type DocsParagraphBorder = {
  /** The color of the border. */
  color?: DocsOptionalColor
  /** The width of the border. */
  width?: DocsDimension
  /** The padding of the border. */
  padding?: DocsDimension
  /** The dash style of the border. */
  dashStyle?: "DASH_STYLE_UNSPECIFIED" | "SOLID" | "DOT" | "DASH"
}

/** A suggested change to the NamedStyles. */
export type DocsSuggestedNamedStyles = {
  /** A NamedStyles that only includes the changes made in this suggestion. This can be used along with the named_styles_suggestion_state to see which fields have changed and their new values. */
  namedStyles?: DocsNamedStyles
  /** A mask that indicates which of the fields on the base NamedStyles have been changed in this suggestion. */
  namedStylesSuggestionState?: DocsNamedStylesSuggestionState
}

/** A mask that indicates which of the fields on the base Size have been changed in this suggestion. For any field set to true, the Size has a new suggested value. */
export type DocsSizeSuggestionState = {
  /** Indicates if there was a suggested change to height. */
  heightSuggested?: boolean
  /** Indicates if there was a suggested change to width. */
  widthSuggested?: boolean
}

/** A mask that indicates which of the fields on the base EmbeddedObjectBorder have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsEmbeddedObjectBorderSuggestionState = {
  /** Indicates if there was a suggested change to width. */
  widthSuggested?: boolean
  /** Indicates if there was a suggested change to dash_style. */
  dashStyleSuggested?: boolean
  /** Indicates if there was a suggested change to color. */
  colorSuggested?: boolean
  /** Indicates if there was a suggested change to property_state. */
  propertyStateSuggested?: boolean
}

/** Styles that apply to a whole paragraph. Inherited paragraph styles are represented as unset fields in this message. A paragraph style's parent depends on where the paragraph style is defined: * The ParagraphStyle on a Paragraph inherits from the paragraph's corresponding named style type. * The ParagraphStyle on a named style inherits from the normal text named style. * The ParagraphStyle of the normal text named style inherits from the default paragraph style in the Docs editor. * The ParagraphStyle on a Paragraph element that's contained in a table may inherit its paragraph style from the table style. If the paragraph style does not inherit from a parent, unsetting fields will revert the style to a value matching the defaults in the Docs editor. */
export type DocsParagraphStyle = {
  /** The amount of indentation for the paragraph on the side that corresponds to the end of the text, based on the current paragraph direction. If unset, the value is inherited from the parent. */
  indentEnd?: DocsDimension
  /** The border at the bottom of this paragraph. If unset, the value is inherited from the parent. The bottom border is rendered when the paragraph below has different border and indent properties. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety. */
  borderBottom?: DocsParagraphBorder
  /** Whether to avoid widows and orphans for the paragraph. If unset, the value is inherited from the parent. */
  avoidWidowAndOrphan?: boolean
  /** The heading ID of the paragraph. If empty, then this paragraph is not a heading. This property is read-only. */
  headingId?: string
  /** The border at the top of this paragraph. If unset, the value is inherited from the parent. The top border is rendered when the paragraph above has different border and indent properties. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety. */
  borderTop?: DocsParagraphBorder
  /** The border between this paragraph and the next and previous paragraphs. If unset, the value is inherited from the parent. The between border is rendered when the adjacent paragraph has the same border and indent properties. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety. */
  borderBetween?: DocsParagraphBorder
  /** The spacing mode for the paragraph. */
  spacingMode?: "SPACING_MODE_UNSPECIFIED" | "NEVER_COLLAPSE" | "COLLAPSE_LISTS"
  /** The amount of indentation for the first line of the paragraph. If unset, the value is inherited from the parent. */
  indentFirstLine?: DocsDimension
  /** The text direction of this paragraph. If unset, the value defaults to LEFT_TO_RIGHT since paragraph direction is not inherited. */
  direction?: "CONTENT_DIRECTION_UNSPECIFIED" | "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT"
  /** Whether all lines of the paragraph should be laid out on the same page or column if possible. If unset, the value is inherited from the parent. */
  keepLinesTogether?: boolean
  /** Whether at least a part of this paragraph should be laid out on the same page or column as the next paragraph if possible. If unset, the value is inherited from the parent. */
  keepWithNext?: boolean
  /** Whether the current paragraph should always start at the beginning of a page. If unset, the value is inherited from the parent. Attempting to update page_break_before for paragraphs in unsupported regions, including Table, Header, Footer and Footnote, can result in an invalid document state that returns a 400 bad request error. */
  pageBreakBefore?: boolean
  /** The amount of space between lines, as a percentage of normal, where normal is represented as 100.0. If unset, the value is inherited from the parent. */
  lineSpacing?: number
  /** The amount of indentation for the paragraph on the side that corresponds to the start of the text, based on the current paragraph direction. If unset, the value is inherited from the parent. */
  indentStart?: DocsDimension
  /** The amount of extra space below the paragraph. If unset, the value is inherited from the parent. */
  spaceBelow?: DocsDimension
  /** A list of the tab stops for this paragraph. The list of tab stops is not inherited. This property is read-only. */
  tabStops?: Array<DocsTabStop>
  /** The amount of extra space above the paragraph. If unset, the value is inherited from the parent. */
  spaceAbove?: DocsDimension
  /** The border to the left of this paragraph. If unset, the value is inherited from the parent. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety. */
  borderLeft?: DocsParagraphBorder
  /** The border to the right of this paragraph. If unset, the value is inherited from the parent. Paragraph borders cannot be partially updated. When changing a paragraph border, the new border must be specified in its entirety. */
  borderRight?: DocsParagraphBorder
  /** The named style type of the paragraph. Since updating the named style type affects other properties within ParagraphStyle, the named style type is applied before the other properties are updated. */
  namedStyleType?:
    | "NAMED_STYLE_TYPE_UNSPECIFIED"
    | "NORMAL_TEXT"
    | "TITLE"
    | "SUBTITLE"
    | "HEADING_1"
    | "HEADING_2"
    | "HEADING_3"
    | "HEADING_4"
    | "HEADING_5"
    | "HEADING_6"
  /** The shading of the paragraph. If unset, the value is inherited from the parent. */
  shading?: DocsShading
  /** The text alignment for this paragraph. */
  alignment?: "ALIGNMENT_UNSPECIFIED" | "START" | "CENTER" | "END" | "JUSTIFIED"
}

/** Updates the style of a range of table cells. */
export type DocsUpdateTableCellStyleRequest = {
  /** The fields that should be updated. At least one field must be specified. The root `tableCellStyle` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the table cell background color, set `fields` to `"backgroundColor"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset. */
  fields?: string
  /** The style to set on the table cells. When updating borders, if a cell shares a border with an adjacent cell, the corresponding border property of the adjacent cell is updated as well. Borders that are merged and invisible are not updated. Since updating a border shared by adjacent cells in the same request can cause conflicting border updates, border updates are applied in the following order: - `border_right` - `border_left` - `border_bottom` - `border_top` */
  tableCellStyle?: DocsTableCellStyle
  /** The table range representing the subset of the table to which the updates are applied. */
  tableRange?: DocsTableRange
  /** The location where the table starts in the document. When specified, the updates are applied to all the cells in the table. */
  tableStartLocation?: DocsLocation
}

/** A suggestion state of a NamedStyle message. */
export type DocsNamedStyleSuggestionState = {
  /** The named style type that this suggestion state corresponds to. This field is provided as a convenience for matching the NamedStyleSuggestionState with its corresponding NamedStyle. */
  namedStyleType?:
    | "NAMED_STYLE_TYPE_UNSPECIFIED"
    | "NORMAL_TEXT"
    | "TITLE"
    | "SUBTITLE"
    | "HEADING_1"
    | "HEADING_2"
    | "HEADING_3"
    | "HEADING_4"
    | "HEADING_5"
    | "HEADING_6"
  /** A mask that indicates which of the fields in paragraph style have been changed in this suggestion. */
  paragraphStyleSuggestionState?: DocsParagraphStyleSuggestionState
  /** A mask that indicates which of the fields in text style have been changed in this suggestion. */
  textStyleSuggestionState?: DocsTextStyleSuggestionState
}

/** A mask that indicates which of the fields on the base DateElementProperties have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsDateElementPropertiesSuggestionState = {
  /** Indicates if there was a suggested change to locale. */
  localeSuggested?: boolean
  /** Indicates if there was a suggested change to time_format. */
  timeFormatSuggested?: boolean
  /** Indicates if there was a suggested change to time_zone_id. */
  timeZoneIdSuggested?: boolean
  /** Indicates if there was a suggested change to timestamp. */
  timestampSuggested?: boolean
  /** Indicates if there was a suggested change to date_format. */
  dateFormatSuggested?: boolean
}

/** A suggested change to a DateElementProperties. */
export type DocsSuggestedDateElementProperties = {
  /** A mask that indicates which of the fields on the base DateElementProperties have been changed in this suggestion. */
  dateElementPropertiesSuggestionState?: DocsDateElementPropertiesSuggestionState
  /** DateElementProperties that only includes the changes made in this suggestion. This can be used along with the date_element_properties_suggestion_state to see which fields have changed and their new values. */
  dateElementProperties?: DocsDateElementProperties
}

/** A reference to another portion of a document or an external URL resource. */
export type DocsLink = {
  /** The ID of a tab in this document. */
  tabId?: string
  /** An external URL. */
  url?: string
  /** A heading in this document. In documents containing a single tab, links to headings within the singular tab continue to return Link.headingId when the includeTabsContent parameter is set to `false` or unset. Otherwise, this field is returned. */
  heading?: DocsHeadingLink
  /** The ID of a heading in this document. Legacy field: Instead, set includeTabsContent to `true` and use Link.heading for read and write operations. This field is only returned when includeTabsContent is set to `false` in documents containing a single tab and links to a heading within the singular tab. Otherwise, Link.heading is returned. If this field is used in a write request, the heading is considered to be from the tab ID specified in the request. If a tab ID is not specified in the request, it is considered to be from the first tab in the document. */
  headingId?: string
  /** The ID of a bookmark in this document. Legacy field: Instead, set includeTabsContent to `true` and use Link.bookmark for read and write operations. This field is only returned when includeTabsContent is set to `false` in documents containing a single tab and links to a bookmark within the singular tab. Otherwise, Link.bookmark is returned. If this field is used in a write request, the bookmark is considered to be from the tab ID specified in the request. If a tab ID is not specified in the request, it is considered to be from the first tab in the document. */
  bookmarkId?: string
  /** A bookmark in this document. In documents containing a single tab, links to bookmarks within the singular tab continue to return Link.bookmarkId when the includeTabsContent parameter is set to `false` or unset. Otherwise, this field is returned. */
  bookmark?: DocsBookmarkLink
}

/** Deletes a PositionedObject from the document. */
export type DocsDeletePositionedObjectRequest = {
  /** The ID of the positioned object to delete. */
  objectId?: string
  /** The tab that the positioned object to delete is in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
}

/** Deletes a DropdownDefinition. If the dropdown definition is referenced by any dropdown instances (chips) in the document, a 400 bad request error is returned. */
export type DocsDeleteDropdownDefinitionRequest = {
  /** The ID of the tab that contains the dropdown definition to delete. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
  /** The ID of the DropdownDefinition to delete. */
  dropdownDefinitionId?: string
}

/** Merges cells in a Table. */
export type DocsMergeTableCellsRequest = {
  /** The table range specifying which cells of the table to merge. Any text in the cells being merged will be concatenated and stored in the "head" cell of the range. This is the upper-left cell of the range when the content direction is left to right, and the upper-right cell of the range otherwise. If the range is non-rectangular (which can occur in some cases where the range covers cells that are already merged or where the table is non-rectangular), a 400 bad request error is returned. */
  tableRange?: DocsTableRange
}

/** A link to a Google resource (such as a file in Drive, a YouTube video, or a Calendar event). */
export type DocsRichLink = {
  /** Output only. The properties of this RichLink. This field is always present. */
  richLinkProperties?: DocsRichLinkProperties
  /** The suggested text style changes to this RichLink, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
  /** The text style of this RichLink. */
  textStyle?: DocsTextStyle
  /** IDs for suggestions that insert this link into the document. A RichLink might have multiple insertion IDs if it's a nested suggested change (a suggestion within a suggestion made by a different user, for example). If empty, then this person link isn't a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** Output only. The ID of this link. */
  richLinkId?: string
  /** IDs for suggestions that remove this link from the document. A RichLink might have multiple deletion IDs if, for example, multiple users suggest deleting it. If empty, then this person link isn't suggested for deletion. */
  suggestedDeletionIds?: Array<string>
}

/** Properties of a dropdown definition. */
export type DocsDropdownDefinitionProperties = {
  /** The title of the dropdown definition. */
  title?: string
  /** The list of options defined by this dropdown definition. A dropdown definition must have at least 2 options and at most 50 options. */
  options?: Array<DocsDropdownOption>
}

/** The result of creating a header. */
export type DocsCreateHeaderResponse = {
  /** The ID of the created header. */
  headerId?: string
}

/** A StructuralElement representing a paragraph. A paragraph is a range of content that's terminated with a newline character. */
export type DocsParagraph = {
  /** The suggested paragraph style changes to this paragraph, keyed by suggestion ID. */
  suggestedParagraphStyleChanges?: Record<string, DocsSuggestedParagraphStyle>
  /** The IDs of the positioned objects suggested to be attached to this paragraph, keyed by suggestion ID. */
  suggestedPositionedObjectIds?: Record<string, DocsObjectReferences>
  /** The style of this paragraph. */
  paragraphStyle?: DocsParagraphStyle
  /** The IDs of the positioned objects tethered to this paragraph. */
  positionedObjectIds?: Array<string>
  /** The bullet for this paragraph. If not present, the paragraph does not belong to a list. */
  bullet?: DocsBullet
  /** The suggested changes to this paragraph's bullet. */
  suggestedBulletChanges?: Record<string, DocsSuggestedBullet>
  /** The content of the paragraph, broken down into its component parts. */
  elements?: Array<DocsParagraphElement>
}

/** The result of creating a named range. */
export type DocsCreateNamedRangeResponse = {
  /** The ID of the created named range. */
  namedRangeId?: string
}

/** Represents the styling that can be applied to text. Inherited text styles are represented as unset fields in this message. A text style's parent depends on where the text style is defined: * The TextStyle of text in a Paragraph inherits from the paragraph's corresponding named style type. * The TextStyle on a named style inherits from the normal text named style. * The TextStyle of the normal text named style inherits from the default text style in the Docs editor. * The TextStyle on a Paragraph element that's contained in a table may inherit its text style from the table style. If the text style does not inherit from a parent, unsetting fields will revert the style to a value matching the defaults in the Docs editor. */
export type DocsTextStyle = {
  /** Whether or not the text is in small capital letters. */
  smallCaps?: boolean
  /** Whether or not the text is underlined. */
  underline?: boolean
  /** The size of the text's font. */
  fontSize?: DocsDimension
  /** Whether or not the text is rendered as bold. */
  bold?: boolean
  /** The text's vertical offset from its normal position. Text with `SUPERSCRIPT` or `SUBSCRIPT` baseline offsets is automatically rendered in a smaller font size, computed based on the `font_size` field. Changes in this field don't affect the `font_size`. */
  baselineOffset?: "BASELINE_OFFSET_UNSPECIFIED" | "NONE" | "SUPERSCRIPT" | "SUBSCRIPT"
  /** The hyperlink destination of the text. If unset, there's no link. Links are not inherited from parent text. Changing the link in an update request causes some other changes to the text style of the range: * When setting a link, the text foreground color will be updated to the default link color and the text will be underlined. If these fields are modified in the same request, those values will be used instead of the link defaults. * Setting a link on a text range that overlaps with an existing link will also update the existing link to point to the new URL. * Links are not settable on newline characters. As a result, setting a link on a text range that crosses a paragraph boundary, such as `"ABC\n123"`, will separate the newline character(s) into their own text runs. The link will be applied separately to the runs before and after the newline. * Removing a link will update the text style of the range to match the style of the preceding text (or the default text styles if the preceding text is another link) unless different styles are being set in the same request. */
  link?: DocsLink
  /** The background color of the text. If set, the color is either an RGB color or transparent, depending on the `color` field. */
  backgroundColor?: DocsOptionalColor
  /** The font family and rendered weight of the text. If an update request specifies values for both `weighted_font_family` and `bold`, the `weighted_font_family` is applied first, then `bold`. If `weighted_font_family#weight` is not set, it defaults to `400`. If `weighted_font_family` is set, then `weighted_font_family#font_family` must also be set with a non-empty value. Otherwise, a 400 bad request error is returned. */
  weightedFontFamily?: DocsWeightedFontFamily
  /** Whether or not the text is italicized. */
  italic?: boolean
  /** The foreground color of the text. If set, the color is either an RGB color or transparent, depending on the `color` field. */
  foregroundColor?: DocsOptionalColor
  /** Whether or not the text is struck through. */
  strikethrough?: boolean
}

/** Creates bullets for all of the paragraphs that overlap with the given range. The nesting level of each paragraph will be determined by counting leading tabs in front of each paragraph. To avoid excess space between the bullet and the corresponding paragraph, these leading tabs are removed by this request. This may change the indices of parts of the text. If the paragraph immediately before paragraphs being updated is in a list with a matching preset, the paragraphs being updated are added to that preceding list. */
export type DocsCreateParagraphBulletsRequest = {
  /** The range to apply the bullet preset to. */
  range?: DocsRange
  /** The kinds of bullet glyphs to be used. */
  bulletPreset?:
    | "BULLET_GLYPH_PRESET_UNSPECIFIED"
    | "BULLET_DISC_CIRCLE_SQUARE"
    | "BULLET_DIAMONDX_ARROW3D_SQUARE"
    | "BULLET_CHECKBOX"
    | "BULLET_ARROW_DIAMOND_DISC"
    | "BULLET_STAR_CIRCLE_SQUARE"
    | "BULLET_ARROW3D_CIRCLE_SQUARE"
    | "BULLET_LEFTTRIANGLE_DIAMOND_DISC"
    | "BULLET_DIAMONDX_HOLLOWDIAMOND_SQUARE"
    | "BULLET_DIAMOND_CIRCLE_SQUARE"
    | "NUMBERED_DECIMAL_ALPHA_ROMAN"
    | "NUMBERED_DECIMAL_ALPHA_ROMAN_PARENS"
    | "NUMBERED_DECIMAL_NESTED"
    | "NUMBERED_UPPERALPHA_ALPHA_ROMAN"
    | "NUMBERED_UPPERROMAN_UPPERALPHA_DECIMAL"
    | "NUMBERED_ZERODECIMAL_ALPHA_ROMAN"
}

/** Rejects a suggestion. Returns a 403 forbidden error if the requesting user does not have edit access to the document and is not the author of the suggestion. */
export type DocsRejectSuggestionRequest = {
  /** The ID of the suggestion. */
  suggestionId?: string
}

/** The result of creating a footnote. */
export type DocsCreateFootnoteResponse = {
  /** The ID of the created footnote. */
  footnoteId?: string
}

/** A StructuralElement representing a section break. A section is a range of content that has the same SectionStyle. A section break represents the start of a new section, and the section style applies to the section after the section break. The document body always begins with a section break. */
export type DocsSectionBreak = {
  /** The style of the section after this section break. */
  sectionStyle?: DocsSectionStyle
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The suggested insertion IDs. A SectionBreak may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
}

/** A suggested change to dropdown properties. */
export type DocsSuggestedDropdownProperties = {
  /** A mask that indicates which of the fields on the base DropdownProperties have been changed in this suggestion. */
  dropdownPropertiesSuggestionState?: DocsDropdownPropertiesSuggestionState
  /** A DropdownProperties that only includes the changes made in this suggestion. This can be used along with the dropdown_properties_suggestion_state to see which fields have changed and their new values. */
  dropdownProperties?: DocsDropdownProperties
}

/** A mask that indicates which of the fields on the base Background have been changed in this suggestion. For any field set to true, the Backgound has a new suggested value. */
export type DocsBackgroundSuggestionState = {
  /** Indicates whether the current background color has been modified in this suggestion. */
  backgroundColorSuggested?: boolean
}

/** Update the styling of all paragraphs that overlap with the given range. */
export type DocsUpdateParagraphStyleRequest = {
  /** The fields that should be updated. At least one field must be specified. The root `paragraph_style` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example, to update the paragraph style's alignment property, set `fields` to `"alignment"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset. */
  fields?: string
  /** The styles to set on the paragraphs. Certain paragraph style changes may cause other changes in order to mirror the behavior of the Docs editor. See the documentation of ParagraphStyle for more information. */
  paragraphStyle?: DocsParagraphStyle
  /** The range overlapping the paragraphs to style. */
  range?: DocsRange
}

/** A ParagraphElement that contains an InlineObject. */
export type DocsInlineObjectElement = {
  /** The text style of this InlineObjectElement. Similar to text content, like text runs and footnote references, the text style of an inline object element can affect content layout as well as the styling of text inserted next to it. */
  textStyle?: DocsTextStyle
  /** The ID of the InlineObject this element contains. */
  inlineObjectId?: string
  /** The suggested deletion IDs. If empty, then there are no suggested deletions of this content. */
  suggestedDeletionIds?: Array<string>
  /** The suggested text style changes to this InlineObject, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
  /** The suggested insertion IDs. An InlineObjectElement may have multiple insertion IDs if it's a nested suggested change. If empty, then this is not a suggested insertion. */
  suggestedInsertionIds?: Array<string>
}

/** Deletes a Footer from the document. */
export type DocsDeleteFooterRequest = {
  /** The tab that contains the footer to delete. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
  /** The id of the footer to delete. If this footer is defined on DocumentStyle, the reference to this footer is removed, resulting in no footer of that type for the first section of the document. If this footer is defined on a SectionStyle, the reference to this footer is removed and the footer of that type is now continued from the previous section. */
  footerId?: string
}

/** Updates the number of pinned table header rows in a table. */
export type DocsPinTableHeaderRowsRequest = {
  /** The location where the table starts in the document. */
  tableStartLocation?: DocsLocation
  /** The number of table rows to pin, where 0 implies that all rows are unpinned. */
  pinnedHeaderRowsCount?: number
}

/** A mask that indicates which of the fields on the base PositionedObjectPositioning have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsPositionedObjectPositioningSuggestionState = {
  /** Indicates if there was a suggested change to top_offset. */
  topOffsetSuggested?: boolean
  /** Indicates if there was a suggested change to left_offset. */
  leftOffsetSuggested?: boolean
  /** Indicates if there was a suggested change to layout. */
  layoutSuggested?: boolean
}

/** The result of inserting an embedded Google Sheets chart. */
export type DocsInsertInlineSheetsChartResponse = {
  /** The object ID of the inserted chart. */
  objectId?: string
}

/** Inserts a person mention. */
export type DocsInsertPersonRequest = {
  /** Inserts the person mention at the end of a header, footer, footnote or the document body. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
  /** Inserts the person mention at a specific index in the document. The person mention must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Person mentions cannot be inserted inside an equation. */
  location?: DocsLocation
  /** The properties of the person mention to insert. */
  personProperties?: DocsPersonProperties
}

/** Inserts a RichLink at the specified location. */
export type DocsInsertRichLinkRequest = {
  /** The properties of the rich link to insert. */
  richLinkProperties?: DocsRichLinkProperties
  /** Inserts the rich link at a specific index in the document. The rich link must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). The rich link cannot be inserted inside an equation. */
  location?: DocsLocation
  /** Inserts the rich link at the end of a header, footer, footnote or the document body. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
}

/** A mask that indicates which of the fields on the base Bullet have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsBulletSuggestionState = {
  /** Indicates if there was a suggested change to the nesting_level. */
  nestingLevelSuggested?: boolean
  /** Indicates if there was a suggested change to the list_id. */
  listIdSuggested?: boolean
  /** A mask that indicates which of the fields in text style have been changed in this suggestion. */
  textStyleSuggestionState?: DocsTextStyleSuggestionState
}

/** Updates the SectionStyle. */
export type DocsUpdateSectionStyleRequest = {
  /** The fields that should be updated. At least one field must be specified. The root `section_style` is implied and must not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the left margin, set `fields` to `"margin_left"`. */
  fields?: string
  /** The range overlapping the sections to style. Because section breaks can only be inserted inside the body, the segment ID field must be empty. */
  range?: DocsRange
  /** The styles to be set on the section. Certain section style changes may cause other changes in order to mirror the behavior of the Docs editor. See the documentation of SectionStyle for more information. */
  sectionStyle?: DocsSectionStyle
}

/** Inserts a Dropdown at the specified location. */
export type DocsInsertDropdownRequest = {
  /** The EndOfSegmentLocation in the document to insert the dropdown at. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
  /** Required. The DropdownDefinition ID. */
  dropdownDefinitionId?: string
  /** Optional initial value for the dropdown. If this field is not specified, the new dropdown will default to selecting the first option defined in the dropdown definition. If this field is specified but does not reference a valid option in the dropdown definition, a 400 bad request error is returned. */
  selectedOptionId?: string
  /** The Location in the document to insert the dropdown at. */
  location?: DocsLocation
}

/** A person or email address mentioned in a document. These mentions behave as a single, immutable element containing the person's name or email address. */
export type DocsPerson = {
  /** IDs for suggestions that remove this person link from the document. A Person might have multiple deletion IDs if, for example, multiple users suggest deleting it. If empty, then this person link isn't suggested for deletion. */
  suggestedDeletionIds?: Array<string>
  /** Output only. The unique ID of this link. */
  personId?: string
  /** The suggested text style changes to this Person, keyed by suggestion ID. */
  suggestedTextStyleChanges?: Record<string, DocsSuggestedTextStyle>
  /** IDs for suggestions that insert this person link into the document. A Person might have multiple insertion IDs if it's a nested suggested change (a suggestion within a suggestion made by a different user, for example). If empty, then this person link isn't a suggested insertion. */
  suggestedInsertionIds?: Array<string>
  /** The text style of this Person. */
  textStyle?: DocsTextStyle
  /** Output only. The properties of this Person. This field is always present. */
  personProperties?: DocsPersonProperties
}

/** The result of inserting an inline image. */
export type DocsInsertInlineImageResponse = {
  /** The ID of the created InlineObject. */
  objectId?: string
}

/** A single update to apply to a document. */
export type DocsRequest = {
  /** Inserts a section break at the specified location. */
  insertSectionBreak?: DocsInsertSectionBreakRequest
  /** Inserts an empty column into a table. */
  insertTableColumn?: DocsInsertTableColumnRequest
  /** Updates the properties of a DropdownDefinition. */
  updateDropdownDefinitionProperties?: DocsUpdateDropdownDefinitionPropertiesRequest
  /** Adds a document tab. */
  addDocumentTab?: DocsAddDocumentTabRequest
  /** Deletes a document tab. */
  deleteTab?: DocsDeleteTabRequest
  /** Creates a header. */
  createHeader?: DocsCreateHeaderRequest
  /** Inserts a page break at the specified location. */
  insertPageBreak?: DocsInsertPageBreakRequest
  /** Deletes a DropdownDefinition. */
  deleteDropdownDefinition?: DocsDeleteDropdownDefinitionRequest
  /** Deletes a positioned object from the document. */
  deletePositionedObject?: DocsDeletePositionedObjectRequest
  /** Creates a named range. */
  createNamedRange?: DocsCreateNamedRangeRequest
  /** Unmerges cells in a table. */
  unmergeTableCells?: DocsUnmergeTableCellsRequest
  /** Deletes a reply Post from a CommentThread or SuggestionThread. */
  deleteCommentReply?: DocsDeleteCommentReplyRequest
  /** Inserts a Dropdown at the specified location. */
  insertDropdown?: DocsInsertDropdownRequest
  /** Replaces an image in the document. */
  replaceImage?: DocsReplaceImageRequest
  /** Inserts text at the specified location. */
  insertText?: DocsInsertTextRequest
  /** Rejects a suggestion. */
  rejectSuggestion?: DocsRejectSuggestionRequest
  /** Replaces all instances of the specified text. */
  replaceAllText?: DocsReplaceAllTextRequest
  /** Updates the properties of a Dropdown. */
  updateDropdownProperties?: DocsUpdateDropdownPropertiesRequest
  /** Deletes a footer from the document. */
  deleteFooter?: DocsDeleteFooterRequest
  /** Inserts a CommentThread into the document. */
  insertComment?: DocsInsertCommentRequest
  /** Updates the section style of the specified range. */
  updateSectionStyle?: DocsUpdateSectionStyleRequest
  /** Deletes content from the document. */
  deleteContentRange?: DocsDeleteContentRangeRequest
  /** Updates the style of table cells. */
  updateTableCellStyle?: DocsUpdateTableCellStyleRequest
  /** Deletes a CommentThread. */
  deleteComment?: DocsDeleteCommentRequest
  /** Updates the style of the document. */
  updateDocumentStyle?: DocsUpdateDocumentStyleRequest
  /** Creates a DropdownDefinition. */
  createDropdownDefinition?: DocsCreateDropdownDefinitionRequest
  /** Merges cells in a table. */
  mergeTableCells?: DocsMergeTableCellsRequest
  /** Deletes a header from the document. */
  deleteHeader?: DocsDeleteHeaderRequest
  /** Updates a named style. */
  updateNamedStyle?: DocsUpdateNamedStyleRequest
  /** Updates the row style in a table. */
  updateTableRowStyle?: DocsUpdateTableRowStyleRequest
  /** Inserts an inline image at the specified location. */
  insertInlineImage?: DocsInsertInlineImageRequest
  /** Updates the text style at the specified range. */
  updateTextStyle?: DocsUpdateTextStyleRequest
  /** Updates the number of pinned header rows in a table. */
  pinTableHeaderRows?: DocsPinTableHeaderRowsRequest
  /** Accepts a suggestion. */
  acceptSuggestion?: DocsAcceptSuggestionRequest
  /** Updates an existing post (head post or reply) of a CommentThread or SuggestionThread. */
  updateCommentPost?: DocsUpdateCommentPostRequest
  /** Replaces the content in a named range. */
  replaceNamedRangeContent?: DocsReplaceNamedRangeContentRequest
  /** Inserts a table at the specified location. */
  insertTable?: DocsInsertTableRequest
  /** Adds a reply to a CommentThread or SuggestionThread. */
  addCommentReply?: DocsAddCommentReplyRequest
  /** Updates the paragraph style at the specified range. */
  updateParagraphStyle?: DocsUpdateParagraphStyleRequest
  /** Deletes a row from a table. */
  deleteTableRow?: DocsDeleteTableRowRequest
  /** Deletes a suggestion. */
  deleteSuggestion?: DocsDeleteSuggestionRequest
  /** Inserts a person mention. */
  insertPerson?: DocsInsertPersonRequest
  /** Insert a rich link. */
  insertRichLink?: DocsInsertRichLinkRequest
  /** Deletes bullets from paragraphs. */
  deleteParagraphBullets?: DocsDeleteParagraphBulletsRequest
  /** Creates a footer. */
  createFooter?: DocsCreateFooterRequest
  /** Inserts a date. */
  insertDate?: DocsInsertDateRequest
  /** Deletes a named range. */
  deleteNamedRange?: DocsDeleteNamedRangeRequest
  /** Creates bullets for paragraphs. */
  createParagraphBullets?: DocsCreateParagraphBulletsRequest
  /** Inserts an empty row into a table. */
  insertTableRow?: DocsInsertTableRowRequest
  /** Deletes a column from a table. */
  deleteTableColumn?: DocsDeleteTableColumnRequest
  /** Updates the properties of columns in a table. */
  updateTableColumnProperties?: DocsUpdateTableColumnPropertiesRequest
  /** Creates a footnote. */
  createFootnote?: DocsCreateFootnoteRequest
  /** Updates the properties of a document tab. */
  updateDocumentTabProperties?: DocsUpdateDocumentTabPropertiesRequest
}

/** Inserts a page break followed by a newline at the specified location. */
export type DocsInsertPageBreakRequest = {
  /** Inserts the page break at the end of the document body. Page breaks cannot be inserted inside a footnote, header or footer. Since page breaks can only be inserted inside the body, the segment ID field must be empty. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
  /** Inserts the page break at a specific index in the document. The page break must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Page breaks cannot be inserted inside a table, equation, footnote, header or footer. Since page breaks can only be inserted inside the body, the segment ID field must be empty. */
  location?: DocsLocation
}

/** A mask that indicates which of the fields on the base DocumentStyle have been changed in this suggestion. For any field set to true, there's a new suggested value. */
export type DocsDocumentStyleSuggestionState = {
  /** Indicates if there was a suggested change to default_footer_id. */
  defaultFooterIdSuggested?: boolean
  /** Indicates if there was a suggested change to margin_header. */
  marginHeaderSuggested?: boolean
  /** Indicates if there was a suggested change to use_even_page_header_footer. */
  useEvenPageHeaderFooterSuggested?: boolean
  /** Indicates if there was a suggested change to even_page_header_id. */
  evenPageHeaderIdSuggested?: boolean
  /** Indicates if there was a suggested change to default_header_id. */
  defaultHeaderIdSuggested?: boolean
  /** Indicates if there was a suggested change to use_first_page_header_footer. */
  useFirstPageHeaderFooterSuggested?: boolean
  /** Indicates if there was a suggested change to even_page_footer_id. */
  evenPageFooterIdSuggested?: boolean
  /** A mask that indicates which of the fields in size have been changed in this suggestion. */
  pageSizeSuggestionState?: DocsSizeSuggestionState
  /** Indicates if there was a suggested change to page_number_start. */
  pageNumberStartSuggested?: boolean
  /** Indicates if there was a suggested change to margin_top. */
  marginTopSuggested?: boolean
  /** Indicates if there was a suggested change to first_page_footer_id. */
  firstPageFooterIdSuggested?: boolean
  /** Indicates if there was a suggested change to use_custom_header_footer_margins. */
  useCustomHeaderFooterMarginsSuggested?: boolean
  /** A mask that indicates which of the fields in background have been changed in this suggestion. */
  backgroundSuggestionState?: DocsBackgroundSuggestionState
  /** Optional. Indicates if there was a suggested change to flip_page_orientation. */
  flipPageOrientationSuggested?: boolean
  /** Indicates if there was a suggested change to margin_left. */
  marginLeftSuggested?: boolean
  /** Indicates if there was a suggested change to margin_right. */
  marginRightSuggested?: boolean
  /** Indicates if there was a suggested change to first_page_header_id. */
  firstPageHeaderIdSuggested?: boolean
  /** Indicates if there was a suggested change to margin_bottom. */
  marginBottomSuggested?: boolean
  /** Indicates if there was a suggested change to margin_footer. */
  marginFooterSuggested?: boolean
}

/** A mask that indicates which of the fields on the base Shading have been changed in this suggested change. For any field set to true, there's a new suggested value. */
export type DocsShadingSuggestionState = {
  /** Indicates if there was a suggested change to the Shading. */
  backgroundColorSuggested?: boolean
}

/** A table range represents a reference to a subset of a table. It's important to note that the cells specified by a table range do not necessarily form a rectangle. For example, let's say we have a 3 x 3 table where all the cells of the last row are merged together. The table looks like this: [ ] A table range with table cell location = (table_start_location, row = 0, column = 0), row span = 3 and column span = 2 specifies the following cells: x x [ x x x ] */
export type DocsTableRange = {
  /** The column span of the table range. */
  columnSpan?: number
  /** The cell location where the table range starts. */
  tableCellLocation?: DocsTableCellLocation
  /** The row span of the table range. */
  rowSpan?: number
}

/** Creates a new DropdownDefinition in the document. */
export type DocsCreateDropdownDefinitionRequest = {
  /** Required. The DropdownDefinition to create. */
  dropdownDefinition?: DocsDropdownDefinition
  /** The ID of the tab to create the dropdown definition in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
}

/** A ParagraphElement describes content within a Paragraph. */
export type DocsParagraphElement = {
  /** The zero-base end index of this paragraph element, exclusive, in UTF-16 code units. */
  endIndex?: number
  /** A paragraph element that links to a Google resource (such as a file in Google Drive, a YouTube video, or a Calendar event.) */
  richLink?: DocsRichLink
  /** An inline object paragraph element. */
  inlineObjectElement?: DocsInlineObjectElement
  /** A page break paragraph element. */
  pageBreak?: DocsPageBreak
  /** An equation paragraph element. */
  equation?: DocsEquation
  /** A horizontal rule paragraph element. */
  horizontalRule?: DocsHorizontalRule
  /** A paragraph element that represents a date. */
  dateElement?: DocsDateElement
  /** An auto text paragraph element. */
  autoText?: DocsAutoText
  /** A footnote reference paragraph element. */
  footnoteReference?: DocsFootnoteReference
  /** A paragraph element that represents a dropdown menu. */
  dropdown?: DocsDropdown
  /** A paragraph element that links to a person or email address. */
  person?: DocsPerson
  /** A text run paragraph element. */
  textRun?: DocsTextRun
  /** A column break paragraph element. */
  columnBreak?: DocsColumnBreak
  /** The zero-based start index of this paragraph element, in UTF-16 code units. */
  startIndex?: number
}

/** A suggested change to a Bullet. */
export type DocsSuggestedBullet = {
  /** A Bullet that only includes the changes made in this suggestion. This can be used along with the bullet_suggestion_state to see which fields have changed and their new values. */
  bullet?: DocsBullet
  /** A mask that indicates which of the fields on the base Bullet have been changed in this suggestion. */
  bulletSuggestionState?: DocsBulletSuggestionState
}

/** Represents a single post in a comment or suggestion thread. */
export type DocsPost = {
  /** Output only. Whether the post is from a copied document. This field cannot be set directly by callers. */
  fromCopiedDocument?: boolean
  /** Optional. The action type for comment posts. */
  commentAction?: "COMMENT_ACTION_TYPE_UNSPECIFIED" | "NO_COMMENT_ACTION_CHANGE" | "RESOLVE" | "REOPEN"
  /** The content of the post. Required to be non-empty if commentAction is not `RESOLVE` or `REOPEN`. This text content will be handled similarly to comments created in the Docs editor. It will have similar behaviors for formatting, notifications, etc. May not exceed 2048 UTF-8 code units. */
  content?: string
  /** Output only. Whether the post is deleted. If `true`, content and author fields will be empty. */
  deleted?: boolean
  /** Output only. Whether the post is from a document comparison. This field cannot be set directly by callers. */
  fromDocumentComparison?: boolean
  /** Output only. The unique ID of the post. */
  postId?: string
  /** Output only. The content of the post as HTML. */
  contentHtml?: string
  /** Output only. The action type for suggestion posts. */
  suggestionAction?: "SUGGESTION_ACTION_TYPE_UNSPECIFIED" | "NO_SUGGESTION_ACTION_CHANGE" | "ACCEPT" | "REJECT"
  /** Optional. The email of the user who is being newly assigned to the thread as part of this post. Returns a 400 bad request error if: - The parent thread is a CommentThread whose headPost does not have an assignee. - The parent thread is a SuggestionThread. - commentAction is specified as `RESOLVE` or `REOPEN`. - `assigneeEmail` exceeds 2048 UTF-8 code units. */
  assigneeEmail?: string
  /** Output only. Whether the post is from an imported document. This field cannot be set directly by callers. */
  fromImportedDocument?: boolean
  /** Output only. The user who created the post. */
  author?: DocsPostAuthor
  /** Output only. The time the post was last updated. */
  updateTime?: string
  /** Output only. The time the post was created. */
  createTime?: string
}

/** Updates the TableRowStyle of rows in a table. */
export type DocsUpdateTableRowStyleRequest = {
  /** The styles to be set on the rows. */
  tableRowStyle?: DocsTableRowStyle
  /** The fields that should be updated. At least one field must be specified. The root `tableRowStyle` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the minimum row height, set `fields` to `"min_row_height"`. */
  fields?: string
  /** The list of zero-based row indices whose style should be updated. If no indices are specified, all rows will be updated. */
  rowIndices?: Array<number>
  /** The location where the table starts in the document. */
  tableStartLocation?: DocsLocation
}

/** Inserts a section break at the given location. A newline character will be inserted before the section break. */
export type DocsInsertSectionBreakRequest = {
  /** The type of section to insert. */
  sectionType?: "SECTION_TYPE_UNSPECIFIED" | "CONTINUOUS" | "NEXT_PAGE"
  /** Inserts a newline and a section break at the end of the document body. Section breaks cannot be inserted inside a footnote, header or footer. Because section breaks can only be inserted inside the body, the segment ID field must be empty. */
  endOfSegmentLocation?: DocsEndOfSegmentLocation
  /** Inserts a newline and a section break at a specific index in the document. The section break must be inserted inside the bounds of an existing Paragraph. For instance, it cannot be inserted at a table's start index (i.e. between the table and its preceding paragraph). Section breaks cannot be inserted inside a table, equation, footnote, header, or footer. Since section breaks can only be inserted inside the body, the segment ID field must be empty. */
  location?: DocsLocation
}

/** Replaces the contents of the specified NamedRange or NamedRanges with the given replacement content. Note that an individual NamedRange may consist of multiple discontinuous ranges. In this case, only the content in the first range will be replaced. The other ranges and their content will be deleted. In cases where replacing or deleting any ranges would result in an invalid document structure, a 400 bad request error is returned. */
export type DocsReplaceNamedRangeContentRequest = {
  /** Replaces the content of the specified named range(s) with the given text. */
  text?: string
  /** The name of the NamedRanges whose content will be replaced. If there are multiple named ranges with the given name, then the content of each one will be replaced. If there are no named ranges with the given name, then the request will be a no-op. */
  namedRangeName?: string
  /** The ID of the named range whose content will be replaced. If there is no named range with the given ID a 400 bad request error is returned. */
  namedRangeId?: string
  /** Optional. The criteria used to specify in which tabs the replacement occurs. When omitted, the replacement applies to all tabs. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the replacement applies to the singular tab. In a document containing multiple tabs: - If provided, the replacement applies to the specified tabs. - If omitted, the replacement applies to all tabs. */
  tabsCriteria?: DocsTabsCriteria
}

/** A particular location in the document. */
export type DocsLocation = {
  /** The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document's body. */
  segmentId?: string
  /** The tab that the location is in. When omitted, the request is applied to the first tab. In a document containing a single tab: - If provided, must match the singular tab's ID. - If omitted, the request applies to the singular tab. In a document containing multiple tabs: - If provided, the request applies to the specified tab. - If omitted, the request applies to the first tab in the document. */
  tabId?: string
  /** The zero-based index, in UTF-16 code units. The index is relative to the beginning of the segment specified by segment_id. */
  index?: number
}

/** A width and height. */
export type DocsSize = {
  /** The height of the object. */
  height?: DocsDimension
  /** The width of the object. */
  width?: DocsDimension
}

/** Updates the TableColumnProperties of columns in a table. */
export type DocsUpdateTableColumnPropertiesRequest = {
  /** The fields that should be updated. At least one field must be specified. The root `tableColumnProperties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the column width, set `fields` to `"width"`. */
  fields?: string
  /** The table column properties to update. If the value of `table_column_properties#width` is less than 5 points (5/72 inch), a 400 bad request error is returned. */
  tableColumnProperties?: DocsTableColumnProperties
  /** The location where the table starts in the document. */
  tableStartLocation?: DocsLocation
  /** The list of zero-based column indices whose property should be updated. If no indices are specified, all columns will be updated. */
  columnIndices?: Array<number>
}

/** The result of adding a document tab. */
export type DocsAddDocumentTabResponse = {
  /** The properties of the newly added tab. */
  tabProperties?: DocsTabProperties
}

/** A magnitude in a single direction in the specified units. */
export type DocsDimension = {
  /** The units for magnitude. */
  unit?: "UNIT_UNSPECIFIED" | "PT"
  /** The magnitude. */
  magnitude?: number
}

/** Represents a single suggestion thread. Suggestion threads are created as a byproduct of saving changes to the document while in suggestion mode, and cannot be created directly. */
export type DocsSuggestionThread = {
  /** Whether the thread is open, accepted, or rejected. */
  status?: "STATUS_UNSPECIFIED" | "OPEN" | "ACCEPTED" | "REJECTED"
  /** The unique ID of the suggestion. */
  suggestionId?: string
  /** The first post in the thread. */
  headPost?: DocsPost
  /** Summary of the suggested differences in the document, in HTML. May be empty. */
  summaryHtml?: string
  /** Replies to the head post. */
  replies?: Array<DocsPost>
  /** Summary of the suggested differences in the document, in plain text. May be empty. */
  summaryText?: string
}

/** A reference to a bookmark in this document. */
export type DocsBookmarkLink = {
  /** The ID of the tab containing this bookmark. */
  tabId?: string
  /** The ID of a bookmark in this document. */
  id?: string
}

/** Label changes that were made on the Target. */
export type DriveactivityAppliedLabelChange = {
  /** Changes that were made to the Label on the Target. */
  changes?: Array<DriveactivityAppliedLabelChangeDetail>
}

/** A strategy that consolidates activities using the grouping rules from the legacy V1 Activity API. Similar actions occurring within a window of time can be grouped across multiple targets (such as moving a set of files at once) or multiple actors (such as several users editing the same item). Grouping rules for this strategy are specific to each type of action. */
export type DriveactivityLegacy = Record<string, unknown>

/** A change in the object's data leak prevention status. */
export type DriveactivityDataLeakPreventionChange = {
  /** The type of Data Leak Prevention (DLP) change. */
  type?: "TYPE_UNSPECIFIED" | "FLAGGED" | "CLEARED"
}

/** Wrapper for User Field value. */
export type DriveactivitySingleUser = {
  /** User value as email. */
  value?: string
}

/** A lightweight reference to the target of activity. */
export type DriveactivityTargetReference = {
  /** The target is a Drive item. */
  driveItem?: DriveactivityDriveItemReference
  /** This field is deprecated; please use the `drive` field instead. */
  teamDrive?: DriveactivityTeamDriveReference
  /** The target is a shared drive. */
  drive?: DriveactivityDriveReference
}

/** A regular posted comment. */
export type DriveactivityPost = {
  /** The sub-type of this event. */
  subtype?: "SUBTYPE_UNSPECIFIED" | "ADDED" | "DELETED" | "REPLY_ADDED" | "REPLY_DELETED" | "RESOLVED" | "REOPENED"
}

/** Information about an impersonation, where an admin acts on behalf of an end user. Information about the acting admin is not currently available. */
export type DriveactivityImpersonation = {
  /** The impersonated user. */
  impersonatedUser?: DriveactivityUser
}

/** Change to a Field value. */
export type DriveactivityFieldValueChange = {
  /** The ID of this field. Field IDs are unique within a Label. */
  fieldId?: string
  /** The value that was previously set on the field. If not present, the field was newly set. At least one of {old_value|new_value} is always set. */
  oldValue?: DriveactivityFieldValue
  /** The value that is now set on the field. If not present, the field was cleared. At least one of {old_value|new_value} is always set. */
  newValue?: DriveactivityFieldValue
  /** The human-readable display name for this field. */
  displayName?: string
}

/** Empty message representing an administrator. */
export type DriveactivityAdministrator = Record<string, unknown>

/** A lightweight reference to a shared drive. */
export type DriveactivityDriveReference = {
  /** The resource name of the shared drive. The format is `COLLECTION_ID/DRIVE_ID`. Clients should not assume a specific collection ID for this resource name. */
  name?: string
  /** The title of the shared drive. */
  title?: string
}

/** Information about time ranges. */
export type DriveactivityTimeRange = {
  /** The start of the time range. */
  startTime?: string
  /** The end of the time range. */
  endTime?: string
}

/** A single Drive activity comprising one or more Actions by one or more Actors on one or more Targets. Some Action groupings occur spontaneously, such as moving an item into a shared folder triggering a permission change. Other groupings of related Actions, such as multiple Actors editing one item or moving multiple files into a new folder, are controlled by the selection of a ConsolidationStrategy in the QueryDriveActivityRequest. */
export type DriveactivityDriveActivity = {
  /** All actor(s) responsible for the activity. */
  actors?: Array<DriveactivityActor>
  /** The activity occurred over this time range. */
  timeRange?: DriveactivityTimeRange
  /** All Google Drive objects this activity is about (e.g. file, folder, drive). This represents the state of the target immediately after the actions occurred. */
  targets?: Array<DriveactivityTarget>
  /** Key information about the primary action for this activity. This is either representative, or the most important, of all actions in the activity, according to the ConsolidationStrategy in the request. */
  primaryActionDetail?: DriveactivityActionDetail
  /** Details on all actions in this activity. */
  actions?: Array<DriveactivityAction>
  /** The activity occurred at this specific time. */
  timestamp?: string
}

/** Wrapper for SelectionList Field value. */
export type DriveactivitySelectionList = {
  /** Selection values. */
  values?: Array<DriveactivitySelection>
}

/** This item is deprecated; please see `DriveFile` instead. */
export type DriveactivityFile = Record<string, unknown>

/** An object was deleted. */
export type DriveactivityDelete = {
  /** The type of delete action taken. */
  type?: "TYPE_UNSPECIFIED" | "TRASH" | "PERMANENT_DELETE"
}

/** Information about restriction policy changes to a feature. */
export type DriveactivityRestrictionChange = {
  /** The feature which had a change in restriction policy. */
  feature?:
    | "FEATURE_UNSPECIFIED"
    | "SHARING_OUTSIDE_DOMAIN"
    | "DIRECT_SHARING"
    | "ITEM_DUPLICATION"
    | "DRIVE_FILE_STREAM"
    | "FILE_ORGANIZER_CAN_SHARE_FOLDERS"
    | "READERS_CAN_DOWNLOAD"
    | "WRITERS_CAN_DOWNLOAD"
  /** The restriction in place after the change. */
  newRestriction?: "RESTRICTION_UNSPECIFIED" | "UNRESTRICTED" | "FULLY_RESTRICTED"
}

/** An object was created from scratch. */
export type DriveactivityNew = Record<string, unknown>

/** Wrapper for Integer Field value. */
export type DriveactivityInteger = {
  /** Integer value. */
  value?: string
}

/** A suggestion. */
export type DriveactivitySuggestion = {
  /** The sub-type of this event. */
  subtype?:
    | "SUBTYPE_UNSPECIFIED"
    | "ADDED"
    | "DELETED"
    | "REPLY_ADDED"
    | "REPLY_DELETED"
    | "ACCEPTED"
    | "REJECTED"
    | "ACCEPT_DELETED"
    | "REJECT_DELETED"
}

/** Information about a group. */
export type DriveactivityGroup = {
  /** The email address of the group. */
  email?: string
  /** The title of the group. */
  title?: string
}

/** Response message for querying Drive activity. */
export type DriveactivityQueryDriveActivityResponse = {
  /** List of activity requested. */
  activities?: Array<DriveactivityDriveActivity>
  /** Token to retrieve the next page of results, or empty if there are no more results in the list. */
  nextPageToken?: string
}

/** Data describing the type and additional information of an action. */
export type DriveactivityActionDetail = {
  /** A deleted object was restored. */
  restore?: DriveactivityRestore
  /** The permission on an object was changed. */
  permissionChange?: DriveactivityPermissionChange
  /** A change happened in data leak prevention status. */
  dlpChange?: DriveactivityDataLeakPreventionChange
  /** An object was edited. */
  edit?: DriveactivityEdit
  /** Settings were changed. */
  settingsChange?: DriveactivitySettingsChange
  /** An object was referenced in an application outside of Drive/Docs. */
  reference?: DriveactivityApplicationReference
  /** An object was created. */
  create?: DriveactivityCreate
  /** An object was renamed. */
  rename?: DriveactivityRename
  /** An object was moved. */
  move?: DriveactivityMove
  /** Label was changed. */
  appliedLabelChange?: DriveactivityAppliedLabelChange
  /** A change about comments was made. */
  comment?: DriveactivityComment
  /** An object was deleted. */
  delete?: DriveactivityDelete
}

/** Information about the action. */
export type DriveactivityAction = {
  /** The type and detailed information about the action. */
  detail?: DriveactivityActionDetail
  /** The action occurred at this specific time. */
  timestamp?: string
  /** The target this action affects (or empty if affecting all targets). This represents the state of the target immediately after this action occurred. */
  target?: DriveactivityTarget
  /** The action occurred over this time range. */
  timeRange?: DriveactivityTimeRange
  /** The actor responsible for this action (or empty if all actors are responsible). */
  actor?: DriveactivityActor
}

/** A change about comments on an object. */
export type DriveactivityComment = {
  /** A change on a suggestion. */
  suggestion?: DriveactivitySuggestion
  /** A change on an assignment. */
  assignment?: DriveactivityAssignment
  /** A change on a regular posted comment. */
  post?: DriveactivityPost
  /** Users who are mentioned in this comment. */
  mentionedUsers?: Array<DriveactivityUser>
}

/** A comment on a file. */
export type DriveactivityFileComment = {
  /** The comment in the discussion thread. This identifier is an opaque string compatible with the Drive API; see https://developers.google.com/workspace/drive/v3/reference/comments/get */
  legacyCommentId?: string
  /** The link to the discussion thread containing this comment, for example, `https://docs.google.com/DOCUMENT_ID/edit?disco=THREAD_ID`. */
  linkToDiscussion?: string
  /** The discussion thread to which the comment was added. This identifier is an opaque string compatible with the Drive API and references the first comment in a discussion; see https://developers.google.com/workspace/drive/v3/reference/comments/get */
  legacyDiscussionId?: string
  /** The Drive item containing this comment. */
  parent?: DriveactivityDriveItem
}

/** A comment with an assignment. */
export type DriveactivityAssignment = {
  /** The sub-type of this event. */
  subtype?:
    | "SUBTYPE_UNSPECIFIED"
    | "ADDED"
    | "DELETED"
    | "REPLY_ADDED"
    | "REPLY_DELETED"
    | "RESOLVED"
    | "REOPENED"
    | "REASSIGNED"
  /** The user to whom the comment was assigned. */
  assignedUser?: DriveactivityUser
}

/** A strategy that does no consolidation of individual activities. */
export type DriveactivityNoConsolidation = Record<string, unknown>

/** A Drive item which is a file. */
export type DriveactivityDriveFile = Record<string, unknown>

/** Wrapper for Text Field value. */
export type DriveactivityText = {
  /** Value of Text Field. */
  value?: string
}

/** An object was moved. */
export type DriveactivityMove = {
  /** The added parent object(s). */
  addedParents?: Array<DriveactivityTargetReference>
  /** The removed parent object(s). */
  removedParents?: Array<DriveactivityTargetReference>
}

/** A user about whom nothing is currently known. */
export type DriveactivityUnknownUser = Record<string, unknown>

/** Information about settings changes. */
export type DriveactivitySettingsChange = {
  /** The set of changes made to restrictions. */
  restrictionChanges?: Array<DriveactivityRestrictionChange>
}

/** Activity in applications other than Drive. */
export type DriveactivityApplicationReference = {
  /** The reference type corresponding to this event. */
  type?: "UNSPECIFIED_REFERENCE_TYPE" | "LINK" | "DISCUSS"
}

/** An empty message indicating an object was edited. */
export type DriveactivityEdit = Record<string, unknown>

/** Represents any user (including a logged out user). */
export type DriveactivityAnyone = Record<string, unknown>

/** This item is deprecated; please see `Drive` instead. */
export type DriveactivityTeamDrive = {
  /** This field is deprecated; please see `Drive.title` instead. */
  title?: string
  /** This field is deprecated; please see `Drive.name` instead. */
  name?: string
  /** This field is deprecated; please see `Drive.root` instead. */
  root?: DriveactivityDriveItem
}

/** Event triggered by system operations instead of end users. */
export type DriveactivitySystemEvent = {
  /** The type of the system event that may triggered activity. */
  type?: "TYPE_UNSPECIFIED" | "USER_DELETION" | "TRASH_AUTO_PURGE"
}

/** Information about a domain. */
export type DriveactivityDomain = {
  /** An opaque string used to identify this domain. */
  legacyId?: string
  /** The name of the domain, e.g. `google.com`. */
  name?: string
}

/** The actor of a Drive activity. */
export type DriveactivityActor = {
  /** An anonymous user. */
  anonymous?: DriveactivityAnonymousUser
  /** An end user. */
  user?: DriveactivityUser
  /** A non-user actor (i.e. system triggered). */
  system?: DriveactivitySystemEvent
  /** An administrator. */
  administrator?: DriveactivityAdministrator
  /** An account acting on behalf of another. */
  impersonation?: DriveactivityImpersonation
}

/** Wrapper for Selection Field value as combined value/display_name pair for selected choice. */
export type DriveactivitySelection = {
  /** Selection value as Field Choice ID. */
  value?: string
  /** Selection value as human-readable display string. */
  displayName?: string
}

/** The permission setting of an object. */
export type DriveactivityPermission = {
  /** If true, the item can be discovered (e.g. in the user's "Shared with me" collection) without needing a link to the item. */
  allowDiscovery?: boolean
  /** Indicates the [Google Drive permissions role](https://developers.google.com/workspace/drive/web/manage-sharing#roles). The role determines a user's ability to read, write, and comment on items. */
  role?:
    | "ROLE_UNSPECIFIED"
    | "OWNER"
    | "ORGANIZER"
    | "FILE_ORGANIZER"
    | "EDITOR"
    | "COMMENTER"
    | "VIEWER"
    | "PUBLISHED_VIEWER"
  /** The domain to whom this permission applies. */
  domain?: DriveactivityDomain
  /** The user to whom this permission applies. */
  user?: DriveactivityUser
  /** The group to whom this permission applies. */
  group?: DriveactivityGroup
  /** If set, this permission applies to anyone, even logged out users. */
  anyone?: DriveactivityAnyone
}

/** An object was renamed. */
export type DriveactivityRename = {
  /** The previous title of the drive object. */
  oldTitle?: string
  /** The new title of the drive object. */
  newTitle?: string
}

/** A deleted object was restored. */
export type DriveactivityRestore = {
  /** The type of restore action taken. */
  type?: "TYPE_UNSPECIFIED" | "UNTRASH"
}

/** A known user. */
export type DriveactivityKnownUser = {
  /** True if this is the user making the request. */
  isCurrentUser?: boolean
  /** The identifier for this user that can be used with the People API to get more information. The format is `people/ACCOUNT_ID`. See https://developers.google.com/people/. */
  personName?: string
}

/** Wrapper for UserList Field value. */
export type DriveactivityUserList = {
  /** User values. */
  values?: Array<DriveactivitySingleUser>
}

/** The request message for querying Drive activity. */
export type DriveactivityQueryDriveActivityRequest = {
  /** The minimum number of activities desired in the response; the server attempts to return at least this quantity. The server may also return fewer activities if it has a partial response ready before the request times out. If not set, a default value is used. */
  pageSize?: number
  /** Return activities for this Drive folder, plus all children and descendants. The format is `items/ITEM_ID`. */
  ancestorName?: string
  /** The filtering for items returned from this query request. The format of the filter string is a sequence of expressions, joined by an optional "AND", where each expression is of the form "field operator value". Supported fields: - `time`: Uses numerical operators on date values either in terms of milliseconds since Jan 1, 1970 or in RFC 3339 format. Examples: - `time > 1452409200000 AND time <= 1492812924310` - `time >= "2016-01-10T01:02:03-05:00"` - `detail.action_detail_case`: Uses the "has" operator (:) and either a singular value or a list of allowed action types enclosed in parentheses, separated by a space. To exclude a result from the response, prepend a hyphen (`-`) to the beginning of the filter string. Examples: - `detail.action_detail_case:RENAME` - `detail.action_detail_case:(CREATE RESTORE)` - `-detail.action_detail_case:MOVE` */
  filter?: string
  /** Details on how to consolidate related actions that make up the activity. If not set, then related actions aren't consolidated. */
  consolidationStrategy?: DriveactivityConsolidationStrategy
  /** Return activities for this Drive item. The format is `items/ITEM_ID`. */
  itemName?: string
  /** The token identifies which page of results to return. Set this to the next_page_token value returned from a previous query to obtain the following page of results. If not set, the first page of results is returned. */
  pageToken?: string
}

/** An object was uploaded into Drive. */
export type DriveactivityUpload = Record<string, unknown>

/** An object was created. */
export type DriveactivityCreate = {
  /** If present, indicates the object originated externally and was uploaded to Drive. */
  upload?: DriveactivityUpload
  /** If present, indicates the object was created by copying an existing Drive object. */
  copy?: DriveactivityCopy
  /** If present, indicates the object was newly created (e.g. as a blank document), not derived from a Drive object or external object. */
  new?: DriveactivityNew
}

/** Information about an end user. */
export type DriveactivityUser = {
  /** A known user. */
  knownUser?: DriveactivityKnownUser
  /** A user whose account has since been deleted. */
  deletedUser?: DriveactivityDeletedUser
  /** A user about whom nothing is currently known. */
  unknownUser?: DriveactivityUnknownUser
}

/** Information about a shared drive. */
export type DriveactivityDrive = {
  /** The resource name of the shared drive. The format is `COLLECTION_ID/DRIVE_ID`. Clients should not assume a specific collection ID for this resource name. */
  name?: string
  /** The root of this shared drive. */
  root?: DriveactivityDriveItem
  /** The title of the shared drive. */
  title?: string
}

/** A lightweight reference to a Drive item, such as a file or folder. */
export type DriveactivityDriveItemReference = {
  /** The target Drive item. The format is `items/ITEM_ID`. */
  name?: string
  /** The title of the Drive item. */
  title?: string
  /** The Drive item is a folder. Includes information about the type of folder. */
  driveFolder?: DriveactivityDriveFolder
  /** This field is deprecated; please use the `driveFolder` field instead. */
  folder?: DriveactivityFolder
  /** The Drive item is a file. */
  driveFile?: DriveactivityDriveFile
  /** This field is deprecated; please use the `driveFile` field instead. */
  file?: DriveactivityFile
}

/** A change made to a Label on the Target. */
export type DriveactivityAppliedLabelChangeDetail = {
  /** Field Changes. Only present if `types` contains `LABEL_FIELD_VALUE_CHANGED`. */
  fieldChanges?: Array<DriveactivityFieldValueChange>
  /** The Label name representing the Label that changed. This name always contains the revision of the Label that was used when this Action occurred. The format is `labels/id@revision`. */
  label?: string
  /** The types of changes made to the Label on the Target. */
  types?: Array<
    "TYPE_UNSPECIFIED" | "LABEL_ADDED" | "LABEL_REMOVED" | "LABEL_FIELD_VALUE_CHANGED" | "LABEL_APPLIED_BY_ITEM_CREATE"
  >
  /** The human-readable title of the label that changed. */
  title?: string
}

/** Empty message representing an anonymous user or indicating the authenticated user should be anonymized. */
export type DriveactivityAnonymousUser = Record<string, unknown>

/** Contains a value of a Field. */
export type DriveactivityFieldValue = {
  /** User List Field value. */
  userList?: DriveactivityUserList
  /** Date Field value. */
  date?: DriveactivityDate
  /** Integer Field value. */
  integer?: DriveactivityInteger
  /** Selection List Field value. */
  selectionList?: DriveactivitySelectionList
  /** Text List Field value. */
  textList?: DriveactivityTextList
  /** Text Field value. */
  text?: DriveactivityText
  /** User Field value. */
  user?: DriveactivitySingleUser
  /** Selection Field value. */
  selection?: DriveactivitySelection
}

/** A user whose account has since been deleted. */
export type DriveactivityDeletedUser = Record<string, unknown>

/** A Drive item, such as a file or folder. */
export type DriveactivityDriveItem = {
  /** The MIME type of the Drive item. See https://developers.google.com/workspace/drive/v3/web/mime-types. */
  mimeType?: string
  /** The target Drive item. The format is `items/ITEM_ID`. */
  name?: string
  /** The Drive item is a folder. Includes information about the type of folder. */
  driveFolder?: DriveactivityDriveFolder
  /** This field is deprecated; please use the `driveFolder` field instead. */
  folder?: DriveactivityFolder
  /** Information about the owner of this Drive item. */
  owner?: DriveactivityOwner
  /** The Drive item is a file. */
  driveFile?: DriveactivityDriveFile
  /** This field is deprecated; please use the `driveFile` field instead. */
  file?: DriveactivityFile
  /** The title of the Drive item. */
  title?: string
}

/** This item is deprecated; please see `DriveFolder` instead. */
export type DriveactivityFolder = {
  /** This field is deprecated; please see `DriveFolder.type` instead. */
  type?: "TYPE_UNSPECIFIED" | "MY_DRIVE_ROOT" | "TEAM_DRIVE_ROOT" | "STANDARD_FOLDER"
}

/** Wrapper for Text List Field value. */
export type DriveactivityTextList = {
  /** Text values. */
  values?: Array<DriveactivityText>
}

/** Information about the target of activity. For more information on how activity history is shared with users, see [Activity history visibility](https://developers.google.com/workspace/drive/activity/v2#activityhistory). */
export type DriveactivityTarget = {
  /** The target is a shared drive. */
  drive?: DriveactivityDrive
  /** The target is a Drive item. */
  driveItem?: DriveactivityDriveItem
  /** This field is deprecated; please use the `drive` field instead. */
  teamDrive?: DriveactivityTeamDrive
  /** The target is a comment on a Drive file. */
  fileComment?: DriveactivityFileComment
}

/** A Drive item which is a folder. */
export type DriveactivityDriveFolder = {
  /** The type of Drive folder. */
  type?: "TYPE_UNSPECIFIED" | "MY_DRIVE_ROOT" | "SHARED_DRIVE_ROOT" | "STANDARD_FOLDER"
}

/** How the individual activities are consolidated. If a set of activities is related they can be consolidated into one combined activity, such as one actor performing the same action on multiple targets, or multiple actors performing the same action on a single target. The strategy defines the rules for which activities are related. */
export type DriveactivityConsolidationStrategy = {
  /** The individual activities are consolidated using the legacy strategy. */
  legacy?: DriveactivityLegacy
  /** The individual activities are not consolidated. */
  none?: DriveactivityNoConsolidation
}

/** A change of the permission setting on an item. */
export type DriveactivityPermissionChange = {
  /** The set of permissions added by this change. */
  addedPermissions?: Array<DriveactivityPermission>
  /** The set of permissions removed by this change. */
  removedPermissions?: Array<DriveactivityPermission>
}

/** This item is deprecated; please see `DriveReference` instead. */
export type DriveactivityTeamDriveReference = {
  /** This field is deprecated; please see `DriveReference.name` instead. */
  name?: string
  /** This field is deprecated; please see `DriveReference.title` instead. */
  title?: string
}

/** An object was created by copying an existing object. */
export type DriveactivityCopy = {
  /** The original object. */
  originalObject?: DriveactivityTargetReference
}

/** Wrapper for Date Field value. */
export type DriveactivityDate = {
  /** Date value. */
  value?: string
}

/** Information about the owner of a Drive item. */
export type DriveactivityOwner = {
  /** The domain of the Drive item owner. */
  domain?: DriveactivityDomain
  /** This field is deprecated; please use the `drive` field instead. */
  teamDrive?: DriveactivityTeamDriveReference
  /** The user that owns the Drive item. */
  user?: DriveactivityUser
  /** The drive that owns the item. */
  drive?: DriveactivityDriveReference
}

/** Represents a single post in a comment thread. */
export type SheetsPost = {
  /** Optional. The email of the user who is being newly assigned to the thread as part of this post. Returns a 400 bad request error if: - The parent thread is a CommentThread whose headPost does not have an assignee. - commentAction is specified as `RESOLVE` or `REOPEN`. - `assignee_email` exceeds 2048 UTF-8 code units. */
  assigneeEmail?: string
  /** Output only. The time the post was last updated. */
  updateTime?: string
  /** Output only. Whether the post is deleted. If `true`, content and author fields will be empty. */
  deleted?: boolean
  /** Output only. The unique ID of the post. */
  postId?: string
  /** Action taken as part of creating the post. */
  commentAction?: "COMMENT_ACTION_TYPE_UNSPECIFIED" | "NO_COMMENT_ACTION_CHANGE" | "RESOLVE" | "REOPEN"
  /** Output only. The user who created the post. */
  author?: SheetsPostAuthor
  /** Output only. Whether the post is from an imported spreadsheet. This field cannot be set directly by callers. */
  fromImportedSpreadsheet?: boolean
  /** Output only. Whether the post is from a copied spreadsheet. This field cannot be set directly by callers. */
  fromCopiedSpreadsheet?: boolean
  /** Output only. The content of the post as HTML. */
  contentHtml?: string
  /** Output only. The time the post was created. */
  createTime?: string
  /** The content of the post. Required to be non-empty if comment_action is not `RESOLVE` or `REOPEN`. This text content will be handled similarly to comments created in the Sheets editor. It will have similar behaviors for formatting, notifications, etc. May not exceed 2048 UTF-8 code units. */
  content?: string
}

/** Adds a new table to the spreadsheet. */
export type SheetsAddTableRequest = {
  /** Required. The table to add. */
  table?: SheetsTable
}

/** The result of adding a slicer to a spreadsheet. */
export type SheetsAddSlicerResponse = {
  /** The newly added slicer. */
  slicer?: SheetsSlicer
}

/** The result of removing duplicates in a range. */
export type SheetsDeleteDuplicatesResponse = {
  /** The number of duplicate rows removed. */
  duplicatesRemovedCount?: number
}

/** Trims the whitespace (such as spaces, tabs, or new lines) in every cell in the specified range. This request removes all whitespace from the start and end of each cell's text, and reduces any subsequence of remaining whitespace characters to a single space. If the resulting trimmed text starts with a '+' or '=' character, the text remains as a string value and isn't interpreted as a formula. */
export type SheetsTrimWhitespaceRequest = {
  /** The range whose cells to trim. */
  range?: SheetsGridRange
}

/** The domain of a chart. For example, if charting stock prices over time, this would be the date. */
export type SheetsBasicChartDomain = {
  /** True to reverse the order of the domain values (horizontal axis). */
  reversed?: boolean
  /** The data of the domain. For example, if charting stock prices over time, this is the data representing the dates. */
  domain?: SheetsChartData
}

/** Position settings for text. */
export type SheetsTextPosition = {
  /** Horizontal alignment setting for the piece of text. */
  horizontalAlignment?: "HORIZONTAL_ALIGN_UNSPECIFIED" | "LEFT" | "CENTER" | "RIGHT"
}

/** Appends rows or columns to the end of a sheet. */
export type SheetsAppendDimensionRequest = {
  /** The sheet to append rows or columns to. */
  sheetId?: number
  /** The number of rows or columns to append. */
  length?: number
  /** Whether rows or columns should be appended. */
  dimension?: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS"
}

/** The response when updating a range of values in a spreadsheet. */
export type SheetsUpdateValuesResponse = {
  /** The number of columns where at least one cell in the column was updated. */
  updatedColumns?: number
  /** The spreadsheet the updates were applied to. */
  spreadsheetId?: string
  /** The number of cells updated. */
  updatedCells?: number
  /** The range (in A1 notation) that updates were applied to. */
  updatedRange?: string
  /** The number of rows where at least one cell in the row was updated. */
  updatedRows?: number
  /** The values of the cells after updates were applied. This is only included if the request's `includeValuesInResponse` field was `true`. */
  updatedData?: SheetsValueRange
}

/** Allows you to organize the date-time values in a source data column into buckets based on selected parts of their date or time values. */
export type SheetsChartDateTimeRule = {
  /** The type of date-time grouping to apply. */
  type?:
    | "CHART_DATE_TIME_RULE_TYPE_UNSPECIFIED"
    | "SECOND"
    | "MINUTE"
    | "HOUR"
    | "HOUR_MINUTE"
    | "HOUR_MINUTE_AMPM"
    | "DAY_OF_WEEK"
    | "DAY_OF_YEAR"
    | "DAY_OF_MONTH"
    | "DAY_MONTH"
    | "MONTH"
    | "QUARTER"
    | "YEAR"
    | "YEAR_MONTH"
    | "YEAR_QUARTER"
    | "YEAR_MONTH_DAY"
}

/** A rule that may or may not match, depending on the condition. */
export type SheetsBooleanRule = {
  /** The format to apply. Conditional formatting can only apply a subset of formatting: bold, italic, strikethrough, foreground color and, background color. */
  format?: SheetsCellFormat
  /** The condition of the rule. If the condition evaluates to true, the format is applied. */
  condition?: SheetsBooleanCondition
}

/** Merges all cells in the range. */
export type SheetsMergeCellsRequest = {
  /** The range of cells to merge. */
  range?: SheetsGridRange
  /** How the cells should be merged. */
  mergeType?: "MERGE_ALL" | "MERGE_COLUMNS" | "MERGE_ROWS"
}

/** The result of adding a data source. */
export type SheetsAddDataSourceResponse = {
  /** The data execution status. */
  dataExecutionStatus?: SheetsDataExecutionStatus
  /** The data source that was created. */
  dataSource?: SheetsDataSource
}

/** The format of a run of text in a cell. Absent values indicate that the field isn't specified. */
export type SheetsTextFormat = {
  /** The link destination of the text, if any. Setting the link field in a TextFormatRun will clear the cell's existing links or a cell-level link set in the same request. When a link is set, the text foreground color will be set to the default link color and the text will be underlined. If these fields are modified in the same request, those values will be used instead of the link defaults. */
  link?: SheetsLink
  /** The size of the font. */
  fontSize?: number
  /** The foreground color of the text. Deprecated: Use foreground_color_style. */
  foregroundColor?: SheetsColor
  /** True if the text is bold. */
  bold?: boolean
  /** The font family. */
  fontFamily?: string
  /** True if the text is italicized. */
  italic?: boolean
  /** True if the text is underlined. */
  underline?: boolean
  /** The foreground color of the text. If foreground_color is also set, this field takes precedence. */
  foregroundColorStyle?: SheetsColorStyle
  /** True if the text has a strikethrough. */
  strikethrough?: boolean
}

/** A waterfall chart. */
export type SheetsWaterfallChartSpec = {
  /** True to hide connector lines between columns. */
  hideConnectorLines?: boolean
  /** True to interpret the first value as a total. */
  firstValueIsTotal?: boolean
  /** The domain data (horizontal axis) for the waterfall chart. */
  domain?: SheetsWaterfallChartDomain
  /** The stacked type. */
  stackedType?: "WATERFALL_STACKED_TYPE_UNSPECIFIED" | "STACKED" | "SEQUENTIAL"
  /** The line style for the connector lines. */
  connectorLineStyle?: SheetsLineStyle
  /** Controls whether to display additional data labels on stacked charts which sum the total value of all stacked values at each value along the domain axis. stacked_type must be STACKED and neither CUSTOM nor placement can be set on the total_data_label. */
  totalDataLabel?: SheetsDataLabel
  /** The data this waterfall chart is visualizing. */
  series?: Array<SheetsWaterfallChartSeries>
}

/** Adds a new banded range to the spreadsheet. */
export type SheetsAddBandingRequest = {
  /** The banded range to add. The bandedRangeId field is optional; if one is not set, an id will be randomly generated. (It is an error to specify the ID of a range that already exists.) */
  bandedRange?: SheetsBandedRange
}

/** A border along a cell. */
export type SheetsBorder = {
  /** The color of the border. If color is also set, this field takes precedence. */
  colorStyle?: SheetsColorStyle
  /** The width of the border, in pixels. Deprecated; the width is determined by the "style" field. */
  width?: number
  /** The style of the border. */
  style?: "STYLE_UNSPECIFIED" | "DOTTED" | "DASHED" | "SOLID" | "SOLID_MEDIUM" | "SOLID_THICK" | "NONE" | "DOUBLE"
  /** The color of the border. Deprecated: Use color_style. */
  color?: SheetsColor
}

/** A location where metadata may be associated in a spreadsheet. */
export type SheetsDeveloperMetadataLocation = {
  /** The type of location this object represents. This field is read-only. */
  locationType?: "DEVELOPER_METADATA_LOCATION_TYPE_UNSPECIFIED" | "ROW" | "COLUMN" | "SHEET" | "SPREADSHEET"
  /** The ID of the sheet when metadata is associated with an entire sheet. */
  sheetId?: number
  /** Represents the row or column when metadata is associated with a dimension. The specified DimensionRange must represent a single row or column. It cannot be unbounded or span multiple rows or columns. */
  dimensionRange?: SheetsDimensionRange
  /** True when metadata is associated with an entire spreadsheet. */
  spreadsheet?: boolean
}

/** Updates a conditional format rule at the given index, or moves a conditional format rule to another index. */
export type SheetsUpdateConditionalFormatRuleRequest = {
  /** The sheet of the rule to move. Required if new_index is set, unused otherwise. */
  sheetId?: number
  /** The rule that should replace the rule at the given index. */
  rule?: SheetsConditionalFormatRule
  /** The zero-based new index the rule should end up at. */
  newIndex?: number
  /** The zero-based index of the rule that should be replaced or moved. */
  index?: number
}

/** An org chart. Org charts require a unique set of labels in labels and may optionally include parent_labels and tooltips. parent_labels contain, for each node, the label identifying the parent node. tooltips contain, for each node, an optional tooltip. For example, to describe an OrgChart with Alice as the CEO, Bob as the President (reporting to Alice) and Cathy as VP of Sales (also reporting to Alice), have labels contain "Alice", "Bob", "Cathy", parent_labels contain "", "Alice", "Alice" and tooltips contain "CEO", "President", "VP Sales". */
export type SheetsOrgChartSpec = {
  /** The data containing the tooltip for the corresponding node. A blank value results in no tooltip being displayed for the node. This field is optional. */
  tooltips?: SheetsChartData
  /** The color of the org chart nodes. Deprecated: Use node_color_style. */
  nodeColor?: SheetsColor
  /** The data containing the labels for all the nodes in the chart. Labels must be unique. */
  labels?: SheetsChartData
  /** The size of the org chart nodes. */
  nodeSize?: "ORG_CHART_LABEL_SIZE_UNSPECIFIED" | "SMALL" | "MEDIUM" | "LARGE"
  /** The data containing the label of the parent for the corresponding node. A blank value indicates that the node has no parent and is a top-level node. This field is optional. */
  parentLabels?: SheetsChartData
  /** The color of the selected org chart nodes. Deprecated: Use selected_node_color_style. */
  selectedNodeColor?: SheetsColor
  /** The color of the org chart nodes. If node_color is also set, this field takes precedence. */
  nodeColorStyle?: SheetsColorStyle
  /** The color of the selected org chart nodes. If selected_node_color is also set, this field takes precedence. */
  selectedNodeColorStyle?: SheetsColorStyle
}

/** The request to copy a sheet across spreadsheets. */
export type SheetsCopySheetToAnotherSpreadsheetRequest = {
  /** The ID of the spreadsheet to copy the sheet to. */
  destinationSpreadsheetId?: string
}

/** Data within a range of the spreadsheet. */
export type SheetsValueRange = {
  /** The data that was read or to be written. This is an array of arrays, the outer array representing all the data and each inner array representing a major dimension. Each item in the inner array corresponds with one cell. For output, empty trailing rows and columns will not be included. For input, supported value types are: bool, string, and double. Null values will be skipped. To set a cell to an empty value, set the string value to an empty string. */
  values?: Array<Array<unknown>>
  /** The range the values cover, in [A1 notation](https://developers.google.com/workspace/sheets/api/guides/concepts#cell). For output, this range indicates the entire requested range, even though the values will exclude trailing rows and columns. When appending values, this field represents the range to search for a table, after which values will be appended. */
  range?: string
  /** The major dimension of the values. For output, if the spreadsheet data is: `A1=1,B1=2,A2=3,B2=4`, then requesting `range=A1:B2,majorDimension=ROWS` will return `[[1,2],[3,4]]`, whereas requesting `range=A1:B2,majorDimension=COLUMNS` will return `[[1,3],[2,4]]`. For input, with `range=A1:B2,majorDimension=ROWS` then `[[1,2],[3,4]]` will set `A1=1,B1=2,A2=3,B2=4`. With `range=A1:B2,majorDimension=COLUMNS` then `[[1,2],[3,4]]` will set `A1=1,B1=3,A2=2,B2=4`. When writing, if this field is not set, it defaults to ROWS. */
  majorDimension?: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS"
}

/** The Candlestick chart data, each containing the low, open, close, and high values for a series. */
export type SheetsCandlestickData = {
  /** The range data (vertical axis) for the close/final value for each candle. This is the top of the candle body. If greater than the open value the candle will be filled. Otherwise the candle will be hollow. */
  closeSeries?: SheetsCandlestickSeries
  /** The range data (vertical axis) for the high/maximum value for each candle. This is the top of the candle's center line. */
  highSeries?: SheetsCandlestickSeries
  /** The range data (vertical axis) for the low/minimum value for each candle. This is the bottom of the candle's center line. */
  lowSeries?: SheetsCandlestickSeries
  /** The range data (vertical axis) for the open/initial value for each candle. This is the bottom of the candle body. If less than the close value the candle will be filled. Otherwise the candle will be hollow. */
  openSeries?: SheetsCandlestickSeries
}

/** Selects DeveloperMetadata that matches all of the specified fields. For example, if only a metadata ID is specified this considers the DeveloperMetadata with that particular unique ID. If a metadata key is specified, this considers all developer metadata with that key. If a key, visibility, and location type are all specified, this considers all developer metadata with that key and visibility that are associated with a location of that type. In general, this selects all DeveloperMetadata that match the intersection of all the specified fields; any field or combination of fields may be specified. */
export type SheetsDeveloperMetadataLookup = {
  /** Limits the selected developer metadata to that which has a matching DeveloperMetadata.metadata_value. */
  metadataValue?: string
  /** Limits the selected developer metadata to that which has a matching DeveloperMetadata.metadata_key. */
  metadataKey?: string
  /** Limits the selected developer metadata to those entries which are associated with locations of the specified type. For example, when this field is specified as ROW this lookup only considers developer metadata associated on rows. If the field is left unspecified, all location types are considered. This field cannot be specified as SPREADSHEET when the locationMatchingStrategy is specified as INTERSECTING or when the metadataLocation is specified as a non-spreadsheet location. Spreadsheet metadata cannot intersect any other developer metadata location. This field also must be left unspecified when the locationMatchingStrategy is specified as EXACT. */
  locationType?: "DEVELOPER_METADATA_LOCATION_TYPE_UNSPECIFIED" | "ROW" | "COLUMN" | "SHEET" | "SPREADSHEET"
  /** Limits the selected developer metadata to that which has a matching DeveloperMetadata.visibility. If left unspecified, all developer metadata visible to the requesting project is considered. */
  visibility?: "DEVELOPER_METADATA_VISIBILITY_UNSPECIFIED" | "DOCUMENT" | "PROJECT"
  /** Limits the selected developer metadata to that which has a matching DeveloperMetadata.metadata_id. */
  metadataId?: number
  /** Limits the selected developer metadata to those entries associated with the specified location. This field either matches exact locations or all intersecting locations according the specified locationMatchingStrategy. */
  metadataLocation?: SheetsDeveloperMetadataLocation
  /** Determines how this lookup matches the location. If this field is specified as EXACT, only developer metadata associated on the exact location specified is matched. If this field is specified to INTERSECTING, developer metadata associated on intersecting locations is also matched. If left unspecified, this field assumes a default value of INTERSECTING. If this field is specified, a metadataLocation must also be specified. */
  locationMatchingStrategy?:
    | "DEVELOPER_METADATA_LOCATION_MATCHING_STRATEGY_UNSPECIFIED"
    | "EXACT_LOCATION"
    | "INTERSECTING_LOCATION"
}

/** The specification of a Looker data source. */
export type SheetsLookerDataSourceSpec = {
  /** Name of a Looker model explore. */
  explore?: string
  /** Name of a Looker model. */
  model?: string
  /** A Looker instance URL. */
  instanceUri?: string
}

/** Allows you to organize the numeric values in a source data column into buckets of a constant size. All values from HistogramRule.start to HistogramRule.end are placed into groups of size HistogramRule.interval. In addition, all values below HistogramRule.start are placed in one group, and all values above HistogramRule.end are placed in another. Only HistogramRule.interval is required, though if HistogramRule.start and HistogramRule.end are both provided, HistogramRule.start must be less than HistogramRule.end. For example, a pivot table showing average purchase amount by age that has 50+ rows: +-----+-------------------+ | Age | AVERAGE of Amount | +-----+-------------------+ | 16 | $27.13 | | 17 | $5.24 | | 18 | $20.15 | ... +-----+-------------------+ could be turned into a pivot table that looks like the one below by applying a histogram group rule with a HistogramRule.start of 25, an HistogramRule.interval of 20, and an HistogramRule.end of 65. +-------------+-------------------+ | Grouped Age | AVERAGE of Amount | +-------------+-------------------+ | < 25 | $19.34 | | 25-45 | $31.43 | | 45-65 | $35.87 | | > 65 | $27.55 | +-------------+-------------------+ | Grand Total | $29.12 | +-------------+-------------------+ */
export type SheetsHistogramRule = {
  /** The minimum value at which items are placed into buckets of constant size. Values below start are lumped into a single bucket. This field is optional. */
  start?: number
  /** The maximum value at which items are placed into buckets of constant size. Values above end are lumped into a single bucket. This field is optional. */
  end?: number
  /** The size of the buckets that are created. Must be positive. */
  interval?: number
}

/** Unmerges cells in the given range. */
export type SheetsUnmergeCellsRequest = {
  /** The range within which all cells should be unmerged. If the range spans multiple merges, all will be unmerged. The range must not partially span any merge. */
  range?: SheetsGridRange
}

/** The response when clearing a range of values in a spreadsheet. */
export type SheetsBatchClearValuesResponse = {
  /** The ranges that were cleared, in A1 notation. If the requests are for an unbounded range or a range larger than the bounds of the sheet, this is the actual ranges that were cleared, bounded to the sheet's limits. */
  clearedRanges?: Array<string>
  /** The spreadsheet the updates were applied to. */
  spreadsheetId?: string
}

/** The response from cancelling one or multiple data source object refreshes. */
export type SheetsCancelDataSourceRefreshResponse = {
  /** The cancellation statuses of refreshes of all data source objects specified in the request. If is_all is specified, the field contains only those in failure status. Refreshing and canceling refresh the same data source object is also not allowed in the same `batchUpdate`. */
  statuses?: Array<SheetsCancelDataSourceRefreshStatus>
}

/** Updates properties of the named range with the specified namedRangeId. */
export type SheetsUpdateNamedRangeRequest = {
  /** The named range to update with the new properties. */
  namedRange?: SheetsNamedRange
  /** The fields that should be updated. At least one field must be specified. The root `namedRange` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** Updates an embedded object's border property. */
export type SheetsUpdateEmbeddedObjectBorderRequest = {
  /** The border that applies to the embedded object. */
  border?: SheetsEmbeddedObjectBorder
  /** The fields that should be updated. At least one field must be specified. The root `border` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
  /** The ID of the embedded object to update. */
  objectId?: number
}

/** The response from updating data source. */
export type SheetsUpdateDataSourceResponse = {
  /** The updated data source. */
  dataSource?: SheetsDataSource
  /** The data execution status. */
  dataExecutionStatus?: SheetsDataExecutionStatus
}

/** The default filter associated with a sheet. For more information, see [Manage data visibility with filters](https://developers.google.com/workspace/sheets/api/guides/filters). */
export type SheetsBasicFilter = {
  /** The filter criteria per column. Both criteria and filter_specs are populated in responses. If both fields are specified in an update request, this field takes precedence. */
  filterSpecs?: Array<SheetsFilterSpec>
  /** The criteria for showing/hiding values per column. The map's key is the column index, and the value is the criteria for that column. This field is deprecated in favor of filter_specs. */
  criteria?: Record<string, SheetsFilterCriteria>
  /** The sort order per column. Later specifications are used when values are equal in the earlier specifications. */
  sortSpecs?: Array<SheetsSortSpec>
  /** The table this filter is backed by, if any. When writing, only one of range or table_id may be set. */
  tableId?: string
  /** The range the filter covers. */
  range?: SheetsGridRange
}

/** The format of a cell. */
export type SheetsCellFormat = {
  /** The vertical alignment of the value in the cell. */
  verticalAlignment?: "VERTICAL_ALIGN_UNSPECIFIED" | "TOP" | "MIDDLE" | "BOTTOM"
  /** The rotation applied to text in the cell. */
  textRotation?: SheetsTextRotation
  /** If one exists, how a hyperlink should be displayed in the cell. */
  hyperlinkDisplayType?: "HYPERLINK_DISPLAY_TYPE_UNSPECIFIED" | "LINKED" | "PLAIN_TEXT"
  /** A format describing how number values should be represented to the user. */
  numberFormat?: SheetsNumberFormat
  /** The format of the text in the cell (unless overridden by a format run). Setting a cell-level link here clears the cell's existing links. Setting the link field in a TextFormatRun takes precedence over the cell-level link. */
  textFormat?: SheetsTextFormat
  /** The background color of the cell. Deprecated: Use background_color_style. */
  backgroundColor?: SheetsColor
  /** The wrap strategy for the value in the cell. */
  wrapStrategy?: "WRAP_STRATEGY_UNSPECIFIED" | "OVERFLOW_CELL" | "LEGACY_WRAP" | "CLIP" | "WRAP"
  /** The direction of the text in the cell. */
  textDirection?: "TEXT_DIRECTION_UNSPECIFIED" | "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT"
  /** The background color of the cell. If background_color is also set, this field takes precedence. */
  backgroundColorStyle?: SheetsColorStyle
  /** The horizontal alignment of the value in the cell. */
  horizontalAlignment?: "HORIZONTAL_ALIGN_UNSPECIFIED" | "LEFT" | "CENTER" | "RIGHT"
  /** The padding of the cell. */
  padding?: SheetsPadding
  /** The borders of the cell. */
  borders?: SheetsBorders
}

/** A rule describing a conditional format. */
export type SheetsConditionalFormatRule = {
  /** The formatting will vary based on the gradients in the rule. */
  gradientRule?: SheetsGradientRule
  /** The ranges that are formatted if the condition is true. All the ranges must be on the same grid. */
  ranges?: Array<SheetsGridRange>
  /** The formatting is either "on" or "off" according to the rule. */
  booleanRule?: SheetsBooleanRule
}

/** Clears the basic filter, if any exists on the sheet. */
export type SheetsClearBasicFilterRequest = {
  /** The sheet ID on which the basic filter should be cleared. */
  sheetId?: number
}

/** The editors of a protected range. */
export type SheetsEditors = {
  /** True if anyone in the document's domain has edit access to the protected range. Domain protection is only supported on documents within a domain. */
  domainUsersCanEdit?: boolean
  /** The email addresses of groups with edit access to the protected range. */
  groups?: Array<string>
  /** The email addresses of users with edit access to the protected range. */
  users?: Array<string>
}

/** A monthly schedule for data to refresh on specific days in the month in a given time interval. */
export type SheetsDataSourceRefreshMonthlySchedule = {
  /** The start time of a time interval in which a data source refresh is scheduled. Only `hours` part is used. The time interval size defaults to that in the Sheets editor. */
  startTime?: SheetsTimeOfDay
  /** Days of the month to refresh. Only 1-28 are supported, mapping to the 1st to the 28th day. At least one day must be specified. */
  daysOfMonth?: Array<number>
}

/** Updates all cells in the range to the values in the given Cell object. Only the fields listed in the fields field are updated; others are unchanged. If writing a cell with a formula, the formula's ranges will automatically increment for each field in the range. For example, if writing a cell with formula `=A1` into range B2:C4, B2 would be `=A1`, B3 would be `=A2`, B4 would be `=A3`, C2 would be `=B1`, C3 would be `=B2`, C4 would be `=B3`. To keep the formula's ranges static, use the `$` indicator. For example, use the formula `=$A$1` to prevent both the row and the column from incrementing. */
export type SheetsRepeatCellRequest = {
  /** The range to repeat the cell in. */
  range?: SheetsGridRange
  /** The fields that should be updated. At least one field must be specified. The root `cell` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
  /** The data to write. */
  cell?: SheetsCellData
}

/** A custom subtotal column for a waterfall chart series. */
export type SheetsWaterfallChartCustomSubtotal = {
  /** A label for the subtotal column. */
  label?: string
  /** True if the data point at subtotal_index is the subtotal. If false, the subtotal will be computed and appear after the data point. */
  dataIsSubtotal?: boolean
  /** The zero-based index of a data point within the series. If data_is_subtotal is true, the data point at this index is the subtotal. Otherwise, the subtotal appears after the data point with this index. A series can have multiple subtotals at arbitrary indices, but subtotals do not affect the indices of the data points. For example, if a series has three data points, their indices will always be 0, 1, and 2, regardless of how many subtotals exist on the series or what data points they are associated with. */
  subtotalIndex?: number
}

/** A sort order associated with a specific column or row. */
export type SheetsSortSpec = {
  /** The foreground color to sort by; cells with this foreground color are sorted to the top. Mutually exclusive with background_color, and must be an RGB-type color. If foreground_color is also set, this field takes precedence. */
  foregroundColorStyle?: SheetsColorStyle
  /** The background fill color to sort by; cells with this fill color are sorted to the top. Mutually exclusive with foreground_color, and must be an RGB-type color. If background_color is also set, this field takes precedence. */
  backgroundColorStyle?: SheetsColorStyle
  /** The dimension the sort should be applied to. */
  dimensionIndex?: number
  /** Reference to a data source column. */
  dataSourceColumnReference?: SheetsDataSourceColumnReference
  /** The foreground color to sort by; cells with this foreground color are sorted to the top. Mutually exclusive with background_color. Deprecated: Use foreground_color_style. */
  foregroundColor?: SheetsColor
  /** The order data should be sorted. */
  sortOrder?: "SORT_ORDER_UNSPECIFIED" | "ASCENDING" | "DESCENDING"
  /** The background fill color to sort by; cells with this fill color are sorted to the top. Mutually exclusive with foreground_color. Deprecated: Use background_color_style. */
  backgroundColor?: SheetsColor
}

/** Updates properties of the filter view. */
export type SheetsUpdateFilterViewRequest = {
  /** The new properties of the filter view. */
  filter?: SheetsFilterView
  /** The fields that should be updated. At least one field must be specified. The root `filter` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** Allows you to manually organize the values in a source data column into buckets with names of your choosing. For example, a pivot table that aggregates population by state: +-------+-------------------+ | State | SUM of Population | +-------+-------------------+ | AK | 0.7 | | AL | 4.8 | | AR | 2.9 | ... +-------+-------------------+ could be turned into a pivot table that aggregates population by time zone by providing a list of groups (for example, groupName = 'Central', items = ['AL', 'AR', 'IA', ...]) to a manual group rule. Note that a similar effect could be achieved by adding a time zone column to the source data and adjusting the pivot table. +-----------+-------------------+ | Time Zone | SUM of Population | +-----------+-------------------+ | Central | 106.3 | | Eastern | 151.9 | | Mountain | 17.4 | ... +-----------+-------------------+ */
export type SheetsManualRule = {
  /** The list of group names and the corresponding items from the source data that map to each group name. */
  groups?: Array<SheetsManualRuleGroup>
}

/** The Smart Chip. */
export type SheetsChip = {
  /** Properties of a linked person. */
  personProperties?: SheetsPersonProperties
  /** Properties of a rich link. */
  richLinkProperties?: SheetsRichLinkProperties
}

/** Deletes the dimensions from the sheet. */
export type SheetsDeleteDimensionRequest = {
  /** The dimensions to delete from the sheet. */
  range?: SheetsDimensionRange
}

/** Removes rows within this range that contain values in the specified columns that are duplicates of values in any previous row. Rows with identical values but different letter cases, formatting, or formulas are considered to be duplicates. This request also removes duplicate rows hidden from view (for example, due to a filter). When removing duplicates, the first instance of each duplicate row scanning from the top downwards is kept in the resulting range. Content outside of the specified range isn't removed, and rows considered duplicates do not have to be adjacent to each other in the range. */
export type SheetsDeleteDuplicatesRequest = {
  /** The range to remove duplicates rows from. */
  range?: SheetsGridRange
  /** The columns in the range to analyze for duplicate values. If no columns are selected then all columns are analyzed for duplicates. */
  comparisonColumns?: Array<SheetsDimensionRange>
}

/** Properties of a grid. */
export type SheetsGridProperties = {
  /** The number of rows that are frozen in the grid. */
  frozenRowCount?: number
  /** True if the row grouping control toggle is shown after the group. */
  rowGroupControlAfter?: boolean
  /** The number of columns that are frozen in the grid. */
  frozenColumnCount?: number
  /** The number of rows in the grid. */
  rowCount?: number
  /** The number of columns in the grid. */
  columnCount?: number
  /** True if the grid isn't showing gridlines in the UI. */
  hideGridlines?: boolean
  /** True if the column grouping control toggle is shown after the group. */
  columnGroupControlAfter?: boolean
}

/** Data about each cell in a row. */
export type SheetsRowData = {
  /** The values in the row, one per column. */
  values?: Array<SheetsCellData>
}

/** Deletes a group over the specified range by decrementing the depth of the dimensions in the range. For example, assume the sheet has a depth-1 group over B:E and a depth-2 group over C:D. Deleting a group over D:E leaves the sheet with a depth-1 group over B:D and a depth-2 group over C:C. */
export type SheetsDeleteDimensionGroupRequest = {
  /** The range of the group to be deleted. */
  range?: SheetsDimensionRange
}

/** A group name and a list of items from the source data that should be placed in the group with this name. */
export type SheetsManualRuleGroup = {
  /** The group name, which must be a string. Each group in a given ManualRule must have a unique group name. */
  groupName?: SheetsExtendedValue
  /** The items in the source data that should be placed into this group. Each item may be a string, number, or boolean. Items may appear in at most one group within a given ManualRule. Items that do not appear in any group will appear on their own. */
  items?: Array<SheetsExtendedValue>
}

/** An optional setting on a PivotGroup that defines buckets for the values in the source data column rather than breaking out each individual value. Only one PivotGroup with a group rule may be added for each column in the source data, though on any given column you may add both a PivotGroup that has a rule and a PivotGroup that does not. */
export type SheetsPivotGroupRule = {
  /** A DateTimeRule. */
  dateTimeRule?: SheetsDateTimeRule
  /** A HistogramRule. */
  histogramRule?: SheetsHistogramRule
  /** A ManualRule. */
  manualRule?: SheetsManualRule
}

/** Information about which values in a pivot group should be used for sorting. */
export type SheetsPivotGroupSortValueBucket = {
  /** The offset in the PivotTable.values list which the values in this grouping should be sorted by. */
  valuesIndex?: number
  /** Determines the bucket from which values are chosen to sort. For example, in a pivot table with one row group & two column groups, the row group can list up to two values. The first value corresponds to a value within the first column group, and the second value corresponds to a value in the second column group. If no values are listed, this would indicate that the row should be sorted according to the "Grand Total" over the column groups. If a single value is listed, this would correspond to using the "Total" of that bucket. */
  buckets?: Array<SheetsExtendedValue>
}

/** A bubble chart. */
export type SheetsBubbleChartSpec = {
  /** The bubble border color. Deprecated: Use bubble_border_color_style. */
  bubbleBorderColor?: SheetsColor
  /** The data containing the bubble sizes. Bubble sizes are used to draw the bubbles at different sizes relative to each other. If specified, group_ids must also be specified. This field is optional. */
  bubbleSizes?: SheetsChartData
  /** The data containing the bubble y-values. These values locate the bubbles in the chart vertically. */
  series?: SheetsChartData
  /** The bubble border color. If bubble_border_color is also set, this field takes precedence. */
  bubbleBorderColorStyle?: SheetsColorStyle
  /** The opacity of the bubbles between 0 and 1.0. 0 is fully transparent and 1 is fully opaque. */
  bubbleOpacity?: number
  /** The max radius size of the bubbles, in pixels. If specified, the field must be a positive value. */
  bubbleMaxRadiusSize?: number
  /** The data containing the bubble labels. These do not need to be unique. */
  bubbleLabels?: SheetsChartData
  /** The data containing the bubble x-values. These values locate the bubbles in the chart horizontally. */
  domain?: SheetsChartData
  /** Where the legend of the chart should be drawn. */
  legendPosition?:
    | "BUBBLE_CHART_LEGEND_POSITION_UNSPECIFIED"
    | "BOTTOM_LEGEND"
    | "LEFT_LEGEND"
    | "RIGHT_LEGEND"
    | "TOP_LEGEND"
    | "NO_LEGEND"
    | "INSIDE_LEGEND"
  /** The data containing the bubble group IDs. All bubbles with the same group ID are drawn in the same color. If bubble_sizes is specified then this field must also be specified but may contain blank values. This field is optional. */
  groupIds?: SheetsChartData
  /** The format of the text inside the bubbles. Strikethrough, underline, and link are not supported. */
  bubbleTextStyle?: SheetsTextFormat
  /** The minimum radius size of the bubbles, in pixels. If specific, the field must be a positive value. */
  bubbleMinRadiusSize?: number
}

/** Inserts data into the spreadsheet starting at the specified coordinate. */
export type SheetsPasteDataRequest = {
  /** The coordinate at which the data should start being inserted. */
  coordinate?: SheetsGridCoordinate
  /** True if the data is HTML. */
  html?: boolean
  /** The delimiter in the data. */
  delimiter?: string
  /** The data to insert. */
  data?: string
  /** How the data should be pasted. */
  type?:
    | "PASTE_NORMAL"
    | "PASTE_VALUES"
    | "PASTE_FORMAT"
    | "PASTE_NO_BORDERS"
    | "PASTE_FORMULA"
    | "PASTE_DATA_VALIDATION"
    | "PASTE_CONDITIONAL_FORMATTING"
}

/** The result of adding a group. */
export type SheetsAddDimensionGroupResponse = {
  /** All groups of a dimension after adding a group to that dimension. */
  dimensionGroups?: Array<SheetsDimensionGroup>
}

/** The domain of a CandlestickChart. */
export type SheetsCandlestickDomain = {
  /** The data of the CandlestickDomain. */
  data?: SheetsChartData
  /** True to reverse the order of the domain values (horizontal axis). */
  reversed?: boolean
}

/** Data in the grid, as well as metadata about the dimensions. */
export type SheetsGridData = {
  /** Metadata about the requested columns in the grid, starting with the column in start_column. */
  columnMetadata?: Array<SheetsDimensionProperties>
  /** The data in the grid, one entry per row, starting with the row in startRow. The values in RowData will correspond to columns starting at start_column. */
  rowData?: Array<SheetsRowData>
  /** Metadata about the requested rows in the grid, starting with the row in start_row. */
  rowMetadata?: Array<SheetsDimensionProperties>
  /** The first row this GridData refers to, zero-based. */
  startRow?: number
  /** The first column this GridData refers to, zero-based. */
  startColumn?: number
}

/** Updates the borders of a range. If a field is not set in the request, that means the border remains as-is. For example, with two subsequent UpdateBordersRequest: 1. range: A1:A5 `{ top: RED, bottom: WHITE }` 2. range: A1:A5 `{ left: BLUE }` That would result in A1:A5 having a borders of `{ top: RED, bottom: WHITE, left: BLUE }`. If you want to clear a border, explicitly set the style to NONE. */
export type SheetsUpdateBordersRequest = {
  /** The border to put at the bottom of the range. */
  bottom?: SheetsBorder
  /** The border to put at the left of the range. */
  left?: SheetsBorder
  /** The border to put at the top of the range. */
  top?: SheetsBorder
  /** The vertical border to put within the range. */
  innerVertical?: SheetsBorder
  /** The horizontal border to put within the range. */
  innerHorizontal?: SheetsBorder
  /** The range whose borders should be updated. */
  range?: SheetsGridRange
  /** The border to put at the right of the range. */
  right?: SheetsBorder
}

/** A sheet in a spreadsheet. */
export type SheetsSheet = {
  /** The properties of the sheet. */
  properties?: SheetsSheetProperties
  /** The ranges that are merged together. */
  merges?: Array<SheetsGridRange>
  /** Data in the grid, if this is a grid sheet. The number of GridData objects returned is dependent on the number of ranges requested on this sheet. For example, if this is representing `Sheet1`, and the spreadsheet was requested with ranges `Sheet1!A1:C10` and `Sheet1!D15:E20`, then the first GridData will have a startRow/startColumn of `0`, while the second one will have `startRow 14` (zero-based row 15), and `startColumn 3` (zero-based column D). For a DATA_SOURCE sheet, you can not request a specific range, the GridData contains all the values. */
  data?: Array<SheetsGridData>
  /** The protected ranges in this sheet. */
  protectedRanges?: Array<SheetsProtectedRange>
  /** The comment anchors on this sheet. */
  commentAnchors?: Array<SheetsCommentAnchor>
  /** The specifications of every chart on this sheet. */
  charts?: Array<SheetsEmbeddedChart>
  /** The banded (alternating colors) ranges on this sheet. */
  bandedRanges?: Array<SheetsBandedRange>
  /** The tables on this sheet. */
  tables?: Array<SheetsTable>
  /** The developer metadata associated with a sheet. */
  developerMetadata?: Array<SheetsDeveloperMetadata>
  /** The filter on this sheet, if any. */
  basicFilter?: SheetsBasicFilter
  /** The slicers on this sheet. */
  slicers?: Array<SheetsSlicer>
  /** The conditional format rules in this sheet. */
  conditionalFormats?: Array<SheetsConditionalFormatRule>
  /** All row groups on this sheet, ordered by increasing range start index, then by group depth. */
  rowGroups?: Array<SheetsDimensionGroup>
  /** The filter views in this sheet. */
  filterViews?: Array<SheetsFilterView>
  /** All column groups on this sheet, ordered by increasing range start index, then by group depth. */
  columnGroups?: Array<SheetsDimensionGroup>
}

/** The response when retrieving more than one range of values in a spreadsheet. */
export type SheetsBatchGetValuesResponse = {
  /** The ID of the spreadsheet the data was retrieved from. */
  spreadsheetId?: string
  /** The requested values. The order of the ValueRanges is the same as the order of the requested ranges. */
  valueRanges?: Array<SheetsValueRange>
}

/** The position of an embedded object such as a chart. */
export type SheetsEmbeddedObjectPosition = {
  /** If true, the embedded object is put on a new sheet whose ID is chosen for you. Used only when writing. */
  newSheet?: boolean
  /** The sheet this is on. Set only if the embedded object is on its own sheet. Must be non-negative. */
  sheetId?: number
  /** The position at which the object is overlaid on top of a grid. */
  overlayPosition?: SheetsOverlayPosition
}

/** Metadata about a value in a pivot grouping. */
export type SheetsPivotGroupValueMetadata = {
  /** The calculated value the metadata corresponds to. (Note that formulaValue is not valid, because the values will be calculated.) */
  value?: SheetsExtendedValue
  /** True if the data corresponding to the value is collapsed. */
  collapsed?: boolean
}

/** Moves data from the source to the destination. */
export type SheetsCutPasteRequest = {
  /** What kind of data to paste. All the source data will be cut, regardless of what is pasted. */
  pasteType?:
    | "PASTE_NORMAL"
    | "PASTE_VALUES"
    | "PASTE_FORMAT"
    | "PASTE_NO_BORDERS"
    | "PASTE_FORMULA"
    | "PASTE_DATA_VALIDATION"
    | "PASTE_CONDITIONAL_FORMATTING"
  /** The top-left coordinate where the data should be pasted. */
  destination?: SheetsGridCoordinate
  /** The source data to cut. */
  source?: SheetsGridRange
}

/** The result of trimming whitespace in cells. */
export type SheetsTrimWhitespaceResponse = {
  /** The number of cells that were trimmed of whitespace. */
  cellsChangedCount?: number
}

/** The result of a filter view being duplicated. */
export type SheetsDuplicateFilterViewResponse = {
  /** The newly created filter. */
  filter?: SheetsFilterView
}

/** The status of a refresh cancellation. You can send a cancel request to explicitly cancel one or multiple data source object refreshes. */
export type SheetsRefreshCancellationStatus = {
  /** The state of a call to cancel a refresh in Sheets. */
  state?: "REFRESH_CANCELLATION_STATE_UNSPECIFIED" | "CANCEL_SUCCEEDED" | "CANCEL_FAILED"
  /** The error code. */
  errorCode?:
    | "REFRESH_CANCELLATION_ERROR_CODE_UNSPECIFIED"
    | "EXECUTION_NOT_FOUND"
    | "CANCEL_PERMISSION_DENIED"
    | "QUERY_EXECUTION_COMPLETED"
    | "CONCURRENT_CANCELLATION"
    | "CANCEL_OTHER_ERROR"
}

/** A condition that can evaluate to true or false. BooleanConditions are used by conditional formatting, data validation, and the criteria in filters. */
export type SheetsBooleanCondition = {
  /** The values of the condition. The number of supported values depends on the condition type. Some support zero values, others one or two values, and ConditionType.ONE_OF_LIST supports an arbitrary number of values. */
  values?: Array<SheetsConditionValue>
  /** The type of condition. */
  type?:
    | "CONDITION_TYPE_UNSPECIFIED"
    | "NUMBER_GREATER"
    | "NUMBER_GREATER_THAN_EQ"
    | "NUMBER_LESS"
    | "NUMBER_LESS_THAN_EQ"
    | "NUMBER_EQ"
    | "NUMBER_NOT_EQ"
    | "NUMBER_BETWEEN"
    | "NUMBER_NOT_BETWEEN"
    | "TEXT_CONTAINS"
    | "TEXT_NOT_CONTAINS"
    | "TEXT_STARTS_WITH"
    | "TEXT_ENDS_WITH"
    | "TEXT_EQ"
    | "TEXT_IS_EMAIL"
    | "TEXT_IS_URL"
    | "DATE_EQ"
    | "DATE_BEFORE"
    | "DATE_AFTER"
    | "DATE_ON_OR_BEFORE"
    | "DATE_ON_OR_AFTER"
    | "DATE_BETWEEN"
    | "DATE_NOT_BETWEEN"
    | "DATE_IS_VALID"
    | "ONE_OF_RANGE"
    | "ONE_OF_LIST"
    | "BLANK"
    | "NOT_BLANK"
    | "CUSTOM_FORMULA"
    | "BOOLEAN"
    | "TEXT_NOT_EQ"
    | "DATE_NOT_EQ"
    | "FILTER_EXPRESSION"
}

/** The response when clearing a range of values selected with DataFilters in a spreadsheet. */
export type SheetsBatchClearValuesByDataFilterResponse = {
  /** The spreadsheet the updates were applied to. */
  spreadsheetId?: string
  /** The ranges that were cleared, in [A1 notation](https://developers.google.com/workspace/sheets/api/guides/concepts#cell). If the requests are for an unbounded range or a range larger than the bounds of the sheet, this is the actual ranges that were cleared, bounded to the sheet's limits. */
  clearedRanges?: Array<string>
}

/** An unique identifier that references a data source column. */
export type SheetsDataSourceColumnReference = {
  /** The display name of the column. It should be unique within a data source. */
  name?: string
}

/** Data about a specific cell. */
export type SheetsCellData = {
  /** A hyperlink this cell points to, if any. If the cell contains multiple hyperlinks, this field will be empty. This field is read-only. To set it, use a `=HYPERLINK` formula in the userEnteredValue.formulaValue field. A cell-level link can also be set from the userEnteredFormat.textFormat field. Alternatively, set a hyperlink in the textFormatRun.format.link field that spans the entire cell. */
  hyperlink?: string
  /** The formatted value of the cell. This is the value as it's shown to the user. This field is read-only. */
  formattedValue?: string
  /** The value the user entered in the cell. e.g., `1234`, `'Hello'`, or `=NOW()` Note: Dates, Times and DateTimes are represented as doubles in serial number format. */
  userEnteredValue?: SheetsExtendedValue
  /** Runs of rich text applied to subsections of the cell. Runs are only valid on user entered strings, not formulas, bools, or numbers. Properties of a run start at a specific index in the text and continue until the next run. Runs will inherit the properties of the cell unless explicitly changed. When writing, the new runs will overwrite any prior runs. When writing a new user_entered_value, previous runs are erased. */
  textFormatRuns?: Array<SheetsTextFormatRun>
  /** A pivot table anchored at this cell. The size of pivot table itself is computed dynamically based on its data, grouping, filters, values, etc. Only the top-left cell of the pivot table contains the pivot table definition. The other cells will contain the calculated values of the results of the pivot in their effective_value fields. */
  pivotTable?: SheetsPivotTable
  /** The format the user entered for the cell. When writing, the new format will be merged with the existing format. */
  userEnteredFormat?: SheetsCellFormat
  /** The effective format being used by the cell. This includes the results of applying any conditional formatting and, if the cell contains a formula, the computed number format. If the effective format is the default format, effective format will not be written. This field is read-only. */
  effectiveFormat?: SheetsCellFormat
  /** Output only. Information about a data source formula on the cell. The field is set if user_entered_value is a formula referencing some DATA_SOURCE sheet, e.g. `=SUM(DataSheet!Column)`. */
  dataSourceFormula?: SheetsDataSourceFormula
  /** A data source table anchored at this cell. The size of data source table itself is computed dynamically based on its configuration. Only the first cell of the data source table contains the data source table definition. The other cells will contain the display values of the data source table result in their effective_value fields. */
  dataSourceTable?: SheetsDataSourceTable
  /** The effective value of the cell. For cells with formulas, this is the calculated value. For cells with literals, this is the same as the user_entered_value. This field is read-only. */
  effectiveValue?: SheetsExtendedValue
  /** A data validation rule on the cell, if any. When writing, the new data validation rule will overwrite any prior rule. */
  dataValidation?: SheetsDataValidationRule
  /** Optional. Runs of chips applied to subsections of the cell. Properties of a run start at a specific index in the text and continue until the next run. When reading, all chipped and non-chipped runs are included. Non-chipped runs will have an empty Chip. When writing, only runs with chips are included. Runs containing chips are of length 1 and are represented in the user-entered text by an “@” placeholder symbol. New runs will overwrite any prior runs. Writing a new user_entered_value will erase previous runs. */
  chipRuns?: Array<SheetsChipRun>
  /** Any note on the cell. */
  note?: string
}

/** The number format of a cell. */
export type SheetsNumberFormat = {
  /** The type of the number format. When writing, this field must be set. */
  type?:
    | "NUMBER_FORMAT_TYPE_UNSPECIFIED"
    | "TEXT"
    | "NUMBER"
    | "PERCENT"
    | "CURRENCY"
    | "DATE"
    | "TIME"
    | "DATE_TIME"
    | "SCIENTIFIC"
  /** Pattern string used for formatting. If not set, a default pattern based on the spreadsheet's locale will be used if necessary for the given type. See the [Date and Number Formats guide](https://developers.google.com/workspace/sheets/api/guides/formats) for more information about the supported patterns. */
  pattern?: string
}

/** Represents a user who authored a comment post. */
export type SheetsPostAuthor = {
  /** The resource name of the post author user, which can also be used to identify the user in the [Google People API](https://developers.google.com/people/api/rest/v1/people). Format: `users/{user}`. Will not be populated if the anonymous field is `true` or if the post is from an imported spreadsheet. */
  user?: string
  /** The display name of the user. May be absent if the author is anonymous. */
  displayName?: string
  /** Whether the user is anonymous. */
  anonymous?: boolean
  /** Whether the user is the authenticated user making the request. */
  me?: boolean
}

/** Adds a data source. After the data source is added successfully, an associated DATA_SOURCE sheet is created and an execution is triggered to refresh the sheet to read data from the data source. The request requires an additional `bigquery.readonly` OAuth scope if you are adding a BigQuery data source. */
export type SheetsAddDataSourceRequest = {
  /** The data source to add. */
  dataSource?: SheetsDataSource
}

/** Deletes a CommentThread. Returns a 400 bad request error if the requesting user is not the author of the headPost. */
export type SheetsDeleteCommentRequest = {
  /** The ID of the CommentThread that is being deleted. */
  commentId?: string
}

/** A color value. */
export type SheetsColorStyle = {
  /** RGB color. The [`alpha`](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#Color.FIELDS.alpha) value in the [`Color`](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#color) object isn't generally supported. */
  rgbColor?: SheetsColor
  /** Theme color. */
  themeColor?:
    | "THEME_COLOR_TYPE_UNSPECIFIED"
    | "TEXT"
    | "BACKGROUND"
    | "ACCENT1"
    | "ACCENT2"
    | "ACCENT3"
    | "ACCENT4"
    | "ACCENT5"
    | "ACCENT6"
    | "LINK"
}

/** A weekly schedule for data to refresh on specific days in a given time interval. */
export type SheetsDataSourceRefreshWeeklySchedule = {
  /** Days of the week to refresh. At least one day must be specified. */
  daysOfWeek?: Array<
    "DAY_OF_WEEK_UNSPECIFIED" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
  >
  /** The start time of a time interval in which a data source refresh is scheduled. Only `hours` part is used. The time interval size defaults to that in the Sheets editor. */
  startTime?: SheetsTimeOfDay
}

/** The filter criteria associated with a specific column. */
export type SheetsFilterSpec = {
  /** The zero-based column index. */
  columnIndex?: number
  /** The criteria for the column. */
  filterCriteria?: SheetsFilterCriteria
  /** Reference to a data source column. */
  dataSourceColumnReference?: SheetsDataSourceColumnReference
}

/** Updates a slicer's specifications. (This does not move or resize a slicer. To move or resize a slicer use UpdateEmbeddedObjectPositionRequest. */
export type SheetsUpdateSlicerSpecRequest = {
  /** The id of the slicer to update. */
  slicerId?: number
  /** The specification to apply to the slicer. */
  spec?: SheetsSlicerSpec
  /** The fields that should be updated. At least one field must be specified. The root `SlicerSpec` is implied and should not be specified. A single "*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** A border along an embedded object. */
export type SheetsEmbeddedObjectBorder = {
  /** The color of the border. Deprecated: Use color_style. */
  color?: SheetsColor
  /** The color of the border. If color is also set, this field takes precedence. */
  colorStyle?: SheetsColorStyle
}

/** The amount of padding around the cell, in pixels. When updating padding, every field must be specified. */
export type SheetsPadding = {
  /** The bottom padding of the cell. */
  bottom?: number
  /** The top padding of the cell. */
  top?: number
  /** The left padding of the cell. */
  left?: number
  /** The right padding of the cell. */
  right?: number
}

/** The request for retrieving a Spreadsheet. */
export type SheetsGetSpreadsheetByDataFilterRequest = {
  /** The DataFilters used to select which ranges to retrieve from the spreadsheet. */
  dataFilters?: Array<SheetsDataFilter>
  /** True if tables should be excluded in the banded ranges. False if not set. */
  excludeTablesInBandedRanges?: boolean
  /** The comments view mode to apply to the spreadsheet. This allows viewing the spreadsheet with comments omitted or included. If one is not specified, COMMENTS_VIEW_MODE_OMITTED is used. */
  commentsViewMode?:
    | "COMMENTS_VIEW_MODE_UNSPECIFIED"
    | "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS"
    | "COMMENTS_VIEW_MODE_OMITTED"
    | "COMMENTS_VIEW_MODE_INCLUDED"
  /** True if grid data should be returned. This parameter is ignored if a field mask was set in the request. */
  includeGridData?: boolean
}

/** The result of deleting a group. */
export type SheetsDeleteDimensionGroupResponse = {
  /** All groups of a dimension after deleting a group from that dimension. */
  dimensionGroups?: Array<SheetsDimensionGroup>
}

/** The rotation applied to text in a cell. */
export type SheetsTextRotation = {
  /** The angle between the standard orientation and the desired orientation. Measured in degrees. Valid values are between -90 and 90. Positive angles are angled upwards, negative are angled downwards. Note: For LTR text direction positive angles are in the counterclockwise direction, whereas for RTL they are in the clockwise direction */
  angle?: number
  /** If true, text reads top to bottom, but the orientation of individual characters is unchanged. For example: | V | | e | | r | | t | | i | | c | | a | | l | */
  vertical?: boolean
}

/** Deletes the requested sheet. */
export type SheetsDeleteSheetRequest = {
  /** The ID of the sheet to delete. If the sheet is of DATA_SOURCE type, the associated DataSource is also deleted. */
  sheetId?: number
}

/** The domain of a waterfall chart. */
export type SheetsWaterfallChartDomain = {
  /** The data of the WaterfallChartDomain. */
  data?: SheetsChartData
  /** True to reverse the order of the domain values (horizontal axis). */
  reversed?: boolean
}

/** A developer metadata entry and the data filters specified in the original request that matched it. */
export type SheetsMatchedDeveloperMetadata = {
  /** The developer metadata matching the specified filters. */
  developerMetadata?: SheetsDeveloperMetadata
  /** All filters matching the returned developer metadata. */
  dataFilters?: Array<SheetsDataFilter>
}

/** The specification of a BigQuery data source that's connected to a sheet. */
export type SheetsBigQueryDataSourceSpec = {
  /** A BigQueryQuerySpec. */
  querySpec?: SheetsBigQueryQuerySpec
  /** The ID of a BigQuery enabled Google Cloud project with a billing account attached. For any queries executed against the data source, the project is charged. */
  projectId?: string
  /** A BigQueryTableSpec. */
  tableSpec?: SheetsBigQueryTableSpec
}

/** The data execution status. A data execution is created to sync a data source object with the latest data from a DataSource. It is usually scheduled to run at background, you can check its state to tell if an execution completes There are several scenarios where a data execution is triggered to run: * Adding a data source creates an associated data source sheet as well as a data execution to sync the data from the data source to the sheet. * Updating a data source creates a data execution to refresh the associated data source sheet similarly. * You can send refresh request to explicitly refresh one or multiple data source objects. */
export type SheetsDataExecutionStatus = {
  /** The error code. */
  errorCode?:
    | "DATA_EXECUTION_ERROR_CODE_UNSPECIFIED"
    | "TIMED_OUT"
    | "TOO_MANY_ROWS"
    | "TOO_MANY_COLUMNS"
    | "TOO_MANY_CELLS"
    | "ENGINE"
    | "PARAMETER_INVALID"
    | "UNSUPPORTED_DATA_TYPE"
    | "DUPLICATE_COLUMN_NAMES"
    | "INTERRUPTED"
    | "CONCURRENT_QUERY"
    | "OTHER"
    | "TOO_MANY_CHARS_PER_CELL"
    | "DATA_NOT_FOUND"
    | "PERMISSION_DENIED"
    | "MISSING_COLUMN_ALIAS"
    | "OBJECT_NOT_FOUND"
    | "OBJECT_IN_ERROR_STATE"
    | "OBJECT_SPEC_INVALID"
    | "DATA_EXECUTION_CANCELLED"
  /** Gets the time the data last successfully refreshed. */
  lastRefreshTime?: string
  /** The state of the data execution. */
  state?: "DATA_EXECUTION_STATE_UNSPECIFIED" | "NOT_STARTED" | "RUNNING" | "CANCELLING" | "SUCCEEDED" | "FAILED"
  /** The error message, which may be empty. */
  errorMessage?: string
}

/** The result of adding a named range. */
export type SheetsAddNamedRangeResponse = {
  /** The named range to add. */
  namedRange?: SheetsNamedRange
}

/** The result of updating an embedded object's position. */
export type SheetsUpdateEmbeddedObjectPositionResponse = {
  /** The new position of the embedded object. */
  position?: SheetsEmbeddedObjectPosition
}

/** A rule that applies a gradient color scale format, based on the interpolation points listed. The format of a cell will vary based on its contents as compared to the values of the interpolation points. */
export type SheetsGradientRule = {
  /** An optional midway interpolation point. */
  midpoint?: SheetsInterpolationPoint
  /** The starting interpolation point. */
  minpoint?: SheetsInterpolationPoint
  /** The final interpolation point. */
  maxpoint?: SheetsInterpolationPoint
}

/** Deletes the protected range with the given ID. */
export type SheetsDeleteProtectedRangeRequest = {
  /** The ID of the protected range to delete. */
  protectedRangeId?: number
}

/** The table row properties. */
export type SheetsTableRowsProperties = {
  /** The color of the header row. If this field is set, the header row is filled with the specified color. Otherwise, the header row is filled with a default color. */
  headerColorStyle?: SheetsColorStyle
  /** The color of the last row. If this field is not set a footer is not added, the last row is filled with either first_band_color_style or second_band_color_style, depending on the color of the previous row. If updating an existing table without a footer to have a footer, the range will be expanded by 1 row. If updating an existing table with a footer and removing a footer, the range will be shrunk by 1 row. */
  footerColorStyle?: SheetsColorStyle
  /** The second color that is alternating. If this field is set, the second banded row is filled with the specified color. Otherwise, the second banded row is filled with a default color. */
  secondBandColorStyle?: SheetsColorStyle
  /** The first color that is alternating. If this field is set, the first banded row is filled with the specified color. Otherwise, the first banded row is filled with a default color. */
  firstBandColorStyle?: SheetsColorStyle
}

/** The response when updating a range of values in a spreadsheet. */
export type SheetsBatchUpdateValuesByDataFilterResponse = {
  /** The spreadsheet the updates were applied to. */
  spreadsheetId?: string
  /** The total number of cells updated. */
  totalUpdatedCells?: number
  /** The response for each range updated. */
  responses?: Array<SheetsUpdateValuesByDataFilterResponse>
  /** The total number of sheets where at least one cell in the sheet was updated. */
  totalUpdatedSheets?: number
  /** The total number of rows where at least one cell in the row was updated. */
  totalUpdatedRows?: number
  /** The total number of columns where at least one cell in the column was updated. */
  totalUpdatedColumns?: number
}

/** A single series of data for a waterfall chart. */
export type SheetsWaterfallChartSeries = {
  /** Styles for all columns in this series with positive values. */
  positiveColumnsStyle?: SheetsWaterfallChartColumnStyle
  /** Styles for all columns in this series with negative values. */
  negativeColumnsStyle?: SheetsWaterfallChartColumnStyle
  /** Information about the data labels for this series. */
  dataLabel?: SheetsDataLabel
  /** Custom subtotal columns appearing in this series. The order in which subtotals are defined is not significant. Only one subtotal may be defined for each data point. */
  customSubtotals?: Array<SheetsWaterfallChartCustomSubtotal>
  /** The data being visualized in this series. */
  data?: SheetsChartData
  /** True to hide the subtotal column from the end of the series. By default, a subtotal column will appear at the end of each series. Setting this field to true will hide that subtotal column for this series. */
  hideTrailingSubtotal?: boolean
  /** Styles for all subtotal columns in this series. */
  subtotalColumnsStyle?: SheetsWaterfallChartColumnStyle
}

/** The request for clearing more than one range of values in a spreadsheet. */
export type SheetsBatchClearValuesRequest = {
  /** The ranges to clear, in [A1 notation or R1C1 notation](https://developers.google.com/workspace/sheets/api/guides/concepts#cell). */
  ranges?: Array<string>
}

/** A list of references to data source objects. */
export type SheetsDataSourceObjectReferences = {
  /** The references. */
  references?: Array<SheetsDataSourceObjectReference>
}

/** Properties of a link to a Google resource (such as a file in Drive, a YouTube video, a Maps address, or a Calendar event). Only Drive files can be written as chips. All other rich link types are read only. URIs cannot exceed 2000 bytes when writing. NOTE: Writing Drive file chips requires at least one of the `drive.file`, `drive.readonly`, or `drive` OAuth scopes. */
export type SheetsRichLinkProperties = {
  /** Required. The URI to the link. This is always present. */
  uri?: string
  /** Output only. The [MIME type](https://developers.google.com/drive/api/v3/mime-types) of the link, if there's one (for example, when it's a file in Drive). */
  mimeType?: string
}

/** Represents a single comment thread inside a spreadsheet. */
export type SheetsCommentThread = {
  /** Replies to the head post. */
  replies?: Array<SheetsPost>
  /** The ID of the CommentAnchor in the sheet that this thread is tied to. */
  anchorId?: string
  /** Whether the thread is open or resolved. */
  status?: "STATUS_UNSPECIFIED" | "OPEN" | "RESOLVED"
  /** The unique ID of the comment thread. */
  commentId?: string
  /** The first post in the thread. */
  headPost?: SheetsPost
  /** The quoted text from the spreadsheet when the comment was created, formatted as plain-text. */
  plainTextQuote?: string
}

/** An optional setting on the ChartData of the domain of a data source chart that defines buckets for the values in the domain rather than breaking out each individual value. For example, when plotting a data source chart, you can specify a histogram rule on the domain (it should only contain numeric values), grouping its values into buckets. Any values of a chart series that fall into the same bucket are aggregated based on the aggregate_type. */
export type SheetsChartGroupRule = {
  /** A ChartDateTimeRule. */
  dateTimeRule?: SheetsChartDateTimeRule
  /** A ChartHistogramRule */
  histogramRule?: SheetsChartHistogramRule
}

/** Settings to control how circular dependencies are resolved with iterative calculation. */
export type SheetsIterativeCalculationSettings = {
  /** When iterative calculation is enabled, the maximum number of calculation rounds to perform. */
  maxIterations?: number
  /** When iterative calculation is enabled and successive results differ by less than this threshold value, the calculation rounds stop. */
  convergenceThreshold?: number
}

/** Inserts cells into a range, shifting the existing cells over or down. */
export type SheetsInsertRangeRequest = {
  /** The dimension which will be shifted when inserting cells. If ROWS, existing cells will be shifted down. If COLUMNS, existing cells will be shifted right. */
  shiftDimension?: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS"
  /** The range to insert new cells into. The range is constrained to the current sheet boundaries. */
  range?: SheetsGridRange
}

/** Deletes a reply Post from a CommentThread. Returns a 400 bad request error if: - The requesting user is not the author of the post. - The reply post contains a comment action. - The reply post contains an assignee. */
export type SheetsDeleteCommentReplyRequest = {
  /** The ID of the CommentThread which the post belongs to. */
  commentId?: string
  /** The ID of the reply Post being deleted. */
  postId?: string
}

/** The response when updating a range of values in a spreadsheet. */
export type SheetsBatchUpdateValuesResponse = {
  /** The total number of columns where at least one cell in the column was updated. */
  totalUpdatedColumns?: number
  /** The total number of cells updated. */
  totalUpdatedCells?: number
  /** The spreadsheet the updates were applied to. */
  spreadsheetId?: string
  /** The total number of sheets where at least one cell in the sheet was updated. */
  totalUpdatedSheets?: number
  /** One UpdateValuesResponse per requested range, in the same order as the requests appeared. */
  responses?: Array<SheetsUpdateValuesResponse>
  /** The total number of rows where at least one cell in the row was updated. */
  totalUpdatedRows?: number
}

/** A column in a data source. */
export type SheetsDataSourceColumn = {
  /** The column reference. */
  reference?: SheetsDataSourceColumnReference
  /** The formula of the calculated column. */
  formula?: string
}

/** The reply for batch updating a spreadsheet. */
export type SheetsBatchUpdateSpreadsheetResponse = {
  /** The spreadsheet the updates were applied to. */
  spreadsheetId?: string
  /** The spreadsheet after updates were applied. This is only set if BatchUpdateSpreadsheetRequest.include_spreadsheet_in_response is `true`. */
  updatedSpreadsheet?: SheetsSpreadsheet
  /** The reply of the updates. This maps 1:1 with the updates, although replies to some requests may be empty. */
  replies?: Array<SheetsResponse>
  /** Whether comment updates were applied in the batch request. */
  commentUpdateState?:
    | "COMMENT_UPDATE_STATE_UNSPECIFIED"
    | "NO_UPDATES_REQUESTED"
    | "ALL_SAVED"
    | "ALL_FAILED_UNKNOWN_REASON"
}

/** The pivot table filter criteria associated with a specific source column offset. */
export type SheetsPivotFilterSpec = {
  /** The criteria for the column. */
  filterCriteria?: SheetsPivotFilterCriteria
  /** The reference to the data source column. */
  dataSourceColumnReference?: SheetsDataSourceColumnReference
  /** The zero-based column offset of the source range. */
  columnOffsetIndex?: number
}

/** Adds a chart to a sheet in the spreadsheet. */
export type SheetsAddChartRequest = {
  /** The chart that should be added to the spreadsheet, including the position where it should be placed. The chartId field is optional; if one is not set, an id will be randomly generated. (It is an error to specify the ID of an embedded object that already exists.) */
  chart?: SheetsEmbeddedChart
}

/** A filter view. For more information, see [Manage data visibility with filters](https://developers.google.com/workspace/sheets/api/guides/filters). */
export type SheetsFilterView = {
  /** The criteria for showing/hiding values per column. The map's key is the column index, and the value is the criteria for that column. This field is deprecated in favor of filter_specs. */
  criteria?: Record<string, SheetsFilterCriteria>
  /** The sort order per column. Later specifications are used when values are equal in the earlier specifications. */
  sortSpecs?: Array<SheetsSortSpec>
  /** The filter criteria for showing or hiding values per column. Both criteria and filter_specs are populated in responses. If both fields are specified in an update request, this field takes precedence. */
  filterSpecs?: Array<SheetsFilterSpec>
  /** The range this filter view covers. When writing, only one of range, named_range_id, or table_id may be set. */
  range?: SheetsGridRange
  /** The ID of the filter view. */
  filterViewId?: number
  /** The table this filter view is backed by, if any. When writing, only one of range, named_range_id, or table_id may be set. */
  tableId?: string
  /** The name of the filter view. */
  title?: string
  /** The named range this filter view is backed by, if any. When writing, only one of range, named_range_id, or table_id may be set. */
  namedRangeId?: string
}

/** A range of values whose location is specified by a DataFilter. */
export type SheetsDataFilterValueRange = {
  /** The major dimension of the values. */
  majorDimension?: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS"
  /** The data filter describing the location of the values in the spreadsheet. */
  dataFilter?: SheetsDataFilter
  /** The data to be written. If the provided values exceed any of the ranges matched by the data filter then the request fails. If the provided values are less than the matched ranges only the specified values are written, existing values in the matched ranges remain unaffected. */
  values?: Array<Array<unknown>>
}

/** A single response from an update. */
export type SheetsResponse = {
  /** A reply from removing rows containing duplicate values. */
  deleteDuplicates?: SheetsDeleteDuplicatesResponse
  /** A reply from updating a data source. */
  updateDataSource?: SheetsUpdateDataSourceResponse
  /** A reply from adding a named range. */
  addNamedRange?: SheetsAddNamedRangeResponse
  /** A reply from cancelling data source object refreshes. */
  cancelDataSourceRefresh?: SheetsCancelDataSourceRefreshResponse
  /** A reply from trimming whitespace. */
  trimWhitespace?: SheetsTrimWhitespaceResponse
  /** A reply from updating a developer metadata entry. */
  updateDeveloperMetadata?: SheetsUpdateDeveloperMetadataResponse
  /** The result of creating a reply. */
  addCommentReply?: SheetsAddCommentReplyResponse
  /** A reply from adding a filter view. */
  addFilterView?: SheetsAddFilterViewResponse
  /** A reply from duplicating a sheet. */
  duplicateSheet?: SheetsDuplicateSheetResponse
  /** A reply from creating a developer metadata entry. */
  createDeveloperMetadata?: SheetsCreateDeveloperMetadataResponse
  /** The result of creating a comment. */
  insertComment?: SheetsInsertCommentResponse
  /** A reply from deleting a developer metadata entry. */
  deleteDeveloperMetadata?: SheetsDeleteDeveloperMetadataResponse
  /** A reply from doing a find/replace. */
  findReplace?: SheetsFindReplaceResponse
  /** A reply from adding a dimension group. */
  addDimensionGroup?: SheetsAddDimensionGroupResponse
  /** A reply from refreshing data source objects. */
  refreshDataSource?: SheetsRefreshDataSourceResponse
  /** A reply from deleting a dimension group. */
  deleteDimensionGroup?: SheetsDeleteDimensionGroupResponse
  /** A reply from updating a conditional format rule. */
  updateConditionalFormatRule?: SheetsUpdateConditionalFormatRuleResponse
  /** A reply from adding a chart. */
  addChart?: SheetsAddChartResponse
  /** A reply from updating an embedded object's position. */
  updateEmbeddedObjectPosition?: SheetsUpdateEmbeddedObjectPositionResponse
  /** A reply from deleting a conditional format rule. */
  deleteConditionalFormatRule?: SheetsDeleteConditionalFormatRuleResponse
  /** A reply from adding a data source. */
  addDataSource?: SheetsAddDataSourceResponse
  /** A reply from adding a table. */
  addTable?: SheetsAddTableResponse
  /** A reply from adding a slicer. */
  addSlicer?: SheetsAddSlicerResponse
  /** A reply from adding a protected range. */
  addProtectedRange?: SheetsAddProtectedRangeResponse
  /** A reply from adding a banded range. */
  addBanding?: SheetsAddBandingResponse
  /** A reply from duplicating a filter view. */
  duplicateFilterView?: SheetsDuplicateFilterViewResponse
  /** A reply from adding a sheet. */
  addSheet?: SheetsAddSheetResponse
}

/** The result of adding a chart to a spreadsheet. */
export type SheetsAddChartResponse = {
  /** The newly added chart. */
  chart?: SheetsEmbeddedChart
}

/** Duplicates a particular filter view. */
export type SheetsDuplicateFilterViewRequest = {
  /** The ID of the filter being duplicated. */
  filterId?: number
}

/** Formatting options for key value. */
export type SheetsKeyValueFormat = {
  /** Specifies the horizontal text positioning of key value. This field is optional. If not specified, default positioning is used. */
  position?: SheetsTextPosition
  /** Text formatting options for key value. The link field is not supported. */
  textFormat?: SheetsTextFormat
}

/** Properties specific to a linked person. */
export type SheetsPersonProperties = {
  /** Required. The email address linked to this person. This field is always present. */
  email?: string
  /** Optional. The display format of the person chip. If not set, the default display format is used. */
  displayFormat?: "DISPLAY_FORMAT_UNSPECIFIED" | "DEFAULT" | "LAST_NAME_COMMA_FIRST_NAME" | "EMAIL"
}

/** A request to update properties of developer metadata. Updates the properties of the developer metadata selected by the filters to the values provided in the DeveloperMetadata resource. Callers must specify the properties they wish to update in the fields parameter, as well as specify at least one DataFilter matching the metadata they wish to update. */
export type SheetsUpdateDeveloperMetadataRequest = {
  /** The filters matching the developer metadata entries to update. */
  dataFilters?: Array<SheetsDataFilter>
  /** The value that all metadata matched by the data filters will be updated to. */
  developerMetadata?: SheetsDeveloperMetadata
  /** The fields that should be updated. At least one field must be specified. The root `developerMetadata` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** The response from refreshing one or multiple data source objects. */
export type SheetsRefreshDataSourceResponse = {
  /** All the refresh status for the data source object references specified in the request. If is_all is specified, the field contains only those in failure status. */
  statuses?: Array<SheetsRefreshDataSourceObjectExecutionStatus>
}

/** Inserts a CommentThread into the spreadsheet. */
export type SheetsInsertCommentRequest = {
  /** Optional. The email address of the assignee of the comment. Leave empty for a non-assigned comment. May not exceed 2048 UTF-8 code units. */
  assigneeEmailAddress?: string
  /** The GridCoordinate in the sheet that is tied to this comment. */
  coordinate?: SheetsGridCoordinate
  /** The text of the comment, as plain text. This text content will be handled similarly to comments created in the Sheets editor. It will have similar behaviors for formatting, notifications, etc. This field cannot be empty, and must not exceed 2048 UTF-8 code units. */
  content?: string
}

/** The result of duplicating a sheet. */
export type SheetsDuplicateSheetResponse = {
  /** The properties of the duplicate sheet. */
  properties?: SheetsSheetProperties
}

/** A scorecard chart. Scorecard charts are used to highlight key performance indicators, known as KPIs, on the spreadsheet. A scorecard chart can represent things like total sales, average cost, or a top selling item. You can specify a single data value, or aggregate over a range of data. Percentage or absolute difference from a baseline value can be highlighted, like changes over time. */
export type SheetsScorecardChartSpec = {
  /** The number format source used in the scorecard chart. This field is optional. */
  numberFormatSource?: "CHART_NUMBER_FORMAT_SOURCE_UNDEFINED" | "FROM_DATA" | "CUSTOM"
  /** Formatting options for baseline value. This field is needed only if baseline_value_data is specified. */
  baselineValueFormat?: SheetsBaselineValueFormat
  /** Custom formatting options for numeric key/baseline values in scorecard chart. This field is used only when number_format_source is set to CUSTOM. This field is optional. */
  customFormatOptions?: SheetsChartCustomNumberFormatOptions
  /** The aggregation type for key and baseline chart data in scorecard chart. This field is not supported for data source charts. Use the ChartData.aggregateType field of the key_value_data or baseline_value_data instead for data source charts. This field is optional. */
  aggregateType?: "CHART_AGGREGATE_TYPE_UNSPECIFIED" | "AVERAGE" | "COUNT" | "MAX" | "MEDIAN" | "MIN" | "SUM"
  /** The data for scorecard key value. */
  keyValueData?: SheetsChartData
  /** Formatting options for key value. */
  keyValueFormat?: SheetsKeyValueFormat
  /** Value to scale scorecard key and baseline value. For example, a factor of 10 can be used to divide all values in the chart by 10. This field is optional. */
  scaleFactor?: number
  /** The data for scorecard baseline value. This field is optional. */
  baselineValueData?: SheetsChartData
}

/** Deletes a data source. The request also deletes the associated data source sheet, and unlinks all associated data source objects. */
export type SheetsDeleteDataSourceRequest = {
  /** The ID of the data source to delete. */
  dataSourceId?: string
}

/** A single interpolation point on a gradient conditional format. These pin the gradient color scale according to the color, type and value chosen. */
export type SheetsInterpolationPoint = {
  /** How the value should be interpreted. */
  type?: "INTERPOLATION_POINT_TYPE_UNSPECIFIED" | "MIN" | "MAX" | "NUMBER" | "PERCENT" | "PERCENTILE"
  /** The color this interpolation point should use. If color is also set, this field takes precedence. */
  colorStyle?: SheetsColorStyle
  /** The color this interpolation point should use. Deprecated: Use color_style. */
  color?: SheetsColor
  /** The value this interpolation point uses. May be a formula. Unused if type is MIN or MAX. */
  value?: string
}

/** Developer metadata associated with a location or object in a spreadsheet. For more information, see [Read, write, and search metadata](https://developers.google.com/workspace/sheets/api/guides/metadata). Developer metadata may be used to associate arbitrary data with various parts of a spreadsheet and it will remain associated at those locations as they move around and the spreadsheet is edited. For example, if developer metadata is associated with row 5 and another row is then subsequently inserted above row 5, that original metadata is still associated with the row it was first associated with (what is now row 6). If the associated object is deleted then its metadata is deleted too. */
export type SheetsDeveloperMetadata = {
  /** The metadata key. There may be multiple metadata in a spreadsheet with the same key. Developer metadata must always have a key specified. */
  metadataKey?: string
  /** The spreadsheet-scoped unique ID that identifies the metadata. IDs may be specified when metadata is created, otherwise one will be randomly generated and assigned. Must be positive. */
  metadataId?: number
  /** The metadata visibility. Developer metadata must always have visibility specified. */
  visibility?: "DEVELOPER_METADATA_VISIBILITY_UNSPECIFIED" | "DOCUMENT" | "PROJECT"
  /** Data associated with the metadata's key. */
  metadataValue?: string
  /** The location where the metadata is associated. */
  location?: SheetsDeveloperMetadataLocation
}

/** Adds a slicer to a sheet in the spreadsheet. */
export type SheetsAddSlicerRequest = {
  /** The slicer that should be added to the spreadsheet, including the position where it should be placed. The slicerId field is optional; if one is not set, an id will be randomly generated. (It is an error to specify the ID of a slicer that already exists.) */
  slicer?: SheetsSlicer
}

/** The result of adding a banded range. */
export type SheetsAddBandingResponse = {
  /** The banded range that was added. */
  bandedRange?: SheetsBandedRange
}

/** The table column. */
export type SheetsTableColumnProperties = {
  /** The column name. */
  columnName?: string
  /** The 0-based column index. This index is relative to its position in the table and is not necessarily the same as the column index in the sheet. */
  columnIndex?: number
  /** The column data validation rule. Only set for dropdown column type. */
  dataValidationRule?: SheetsTableColumnDataValidationRule
  /** The column type. */
  columnType?:
    | "COLUMN_TYPE_UNSPECIFIED"
    | "DOUBLE"
    | "CURRENCY"
    | "PERCENT"
    | "DATE"
    | "TIME"
    | "DATE_TIME"
    | "TEXT"
    | "BOOLEAN"
    | "DROPDOWN"
    | "FILES_CHIP"
    | "PEOPLE_CHIP"
    | "FINANCE_CHIP"
    | "PLACE_CHIP"
    | "RATINGS_CHIP"
}

/** The specifications of a chart. */
export type SheetsChartSpec = {
  /** If present, the field contains data source chart specific properties. */
  dataSourceChartProperties?: SheetsDataSourceChartProperties
  /** A candlestick chart specification. */
  candlestickChart?: SheetsCandlestickChartSpec
  /** A histogram chart specification. */
  histogramChart?: SheetsHistogramChartSpec
  /** The order to sort the chart data by. Only a single sort spec is supported. Only supported for data source charts. */
  sortSpecs?: Array<SheetsSortSpec>
  /** A bubble chart specification. */
  bubbleChart?: SheetsBubbleChartSpec
  /** The title text position. This field is optional. */
  titleTextPosition?: SheetsTextPosition
  /** An org chart specification. */
  orgChart?: SheetsOrgChartSpec
  /** A basic chart specification, can be one of many kinds of charts. See BasicChartType for the list of all charts this supports. */
  basicChart?: SheetsBasicChartSpec
  /** The subtitle of the chart. */
  subtitle?: string
  /** True to make a chart fill the entire space in which it's rendered with minimum padding. False to use the default padding. (Not applicable to Geo and Org charts.) */
  maximized?: boolean
  /** A pie chart specification. */
  pieChart?: SheetsPieChartSpec
  /** A waterfall chart specification. */
  waterfallChart?: SheetsWaterfallChartSpec
  /** The title text format. Strikethrough, underline, and link are not supported. */
  titleTextFormat?: SheetsTextFormat
  /** The subtitle text position. This field is optional. */
  subtitleTextPosition?: SheetsTextPosition
  /** The title of the chart. */
  title?: string
  /** A scorecard chart specification. */
  scorecardChart?: SheetsScorecardChartSpec
  /** The background color of the entire chart. Not applicable to Org charts. Deprecated: Use background_color_style. */
  backgroundColor?: SheetsColor
  /** The filters applied to the source data of the chart. Only supported for data source charts. */
  filterSpecs?: Array<SheetsFilterSpec>
  /** Determines how the charts will use hidden rows or columns. */
  hiddenDimensionStrategy?:
    | "CHART_HIDDEN_DIMENSION_STRATEGY_UNSPECIFIED"
    | "SKIP_HIDDEN_ROWS_AND_COLUMNS"
    | "SKIP_HIDDEN_ROWS"
    | "SKIP_HIDDEN_COLUMNS"
    | "SHOW_ALL"
  /** The alternative text that describes the chart. This is often used for accessibility. */
  altText?: string
  /** The name of the font to use by default for all chart text (e.g. title, axis labels, legend). If a font is specified for a specific part of the chart it will override this font name. */
  fontName?: string
  /** The background color of the entire chart. Not applicable to Org charts. If background_color is also set, this field takes precedence. */
  backgroundColorStyle?: SheetsColorStyle
  /** The subtitle text format. Strikethrough, underline, and link are not supported. */
  subtitleTextFormat?: SheetsTextFormat
  /** A treemap chart specification. */
  treemapChart?: SheetsTreemapChartSpec
}

/** Splits a column of text into multiple columns, based on a delimiter in each cell. */
export type SheetsTextToColumnsRequest = {
  /** The delimiter type to use. */
  delimiterType?: "DELIMITER_TYPE_UNSPECIFIED" | "COMMA" | "SEMICOLON" | "PERIOD" | "SPACE" | "CUSTOM" | "AUTODETECT"
  /** The source data range. This must span exactly one column. */
  source?: SheetsGridRange
  /** The delimiter to use. Used only if delimiterType is CUSTOM. */
  delimiter?: string
}

/** A data source formula. */
export type SheetsDataSourceFormula = {
  /** Output only. The data execution status. */
  dataExecutionStatus?: SheetsDataExecutionStatus
  /** The ID of the data source the formula is associated with. */
  dataSourceId?: string
}

/** A run of a text format. The format of this run continues until the start index of the next run. When updating, all fields must be set. */
export type SheetsTextFormatRun = {
  /** The format of this run. Absent values inherit the cell's format. */
  format?: SheetsTextFormat
  /** The zero-based character index where this run starts, in UTF-16 code units. */
  startIndex?: number
}

/** A single series of data in a chart. For example, if charting stock prices over time, multiple series may exist, one for the "Open Price", "High Price", "Low Price" and "Close Price". */
export type SheetsBasicChartSeries = {
  /** The minor axis that will specify the range of values for this series. For example, if charting stocks over time, the "Volume" series may want to be pinned to the right with the prices pinned to the left, because the scale of trading volume is different than the scale of prices. It is an error to specify an axis that isn't a valid minor axis for the chart's type. */
  targetAxis?: "BASIC_CHART_AXIS_POSITION_UNSPECIFIED" | "BOTTOM_AXIS" | "LEFT_AXIS" | "RIGHT_AXIS"
  /** The data being visualized in this chart series. */
  series?: SheetsChartData
  /** The line style of this series. Valid only if the chartType is AREA, LINE, or SCATTER. COMBO charts are also supported if the series chart type is AREA or LINE. */
  lineStyle?: SheetsLineStyle
  /** The color for elements (such as bars, lines, and points) associated with this series. If empty, a default color is used. If color is also set, this field takes precedence. */
  colorStyle?: SheetsColorStyle
  /** Style override settings for series data points. */
  styleOverrides?: Array<SheetsBasicSeriesDataPointStyleOverride>
  /** The color for elements (such as bars, lines, and points) associated with this series. If empty, a default color is used. Deprecated: Use color_style. */
  color?: SheetsColor
  /** Information about the data labels for this series. */
  dataLabel?: SheetsDataLabel
  /** The style for points associated with this series. Valid only if the chartType is AREA, LINE, or SCATTER. COMBO charts are also supported if the series chart type is AREA, LINE, or SCATTER. If empty, a default point style is used. */
  pointStyle?: SheetsPointStyle
  /** The type of this series. Valid only if the chartType is COMBO. Different types will change the way the series is visualized. Only LINE, AREA, and COLUMN are supported. */
  type?: "BASIC_CHART_TYPE_UNSPECIFIED" | "BAR" | "LINE" | "AREA" | "COLUMN" | "SCATTER" | "COMBO" | "STEPPED_AREA"
}

/** Sorts data in rows based on a sort order per column. */
export type SheetsSortRangeRequest = {
  /** The range to sort. */
  range?: SheetsGridRange
  /** The sort order per column. Later specifications are used when values are equal in the earlier specifications. */
  sortSpecs?: Array<SheetsSortSpec>
}

/** A pivot table. */
export type SheetsPivotTable = {
  /** An optional mapping of filters per source column offset. The filters are applied before aggregating data into the pivot table. The map's key is the column offset of the source range that you want to filter, and the value is the criteria for that column. For example, if the source was `C10:E15`, a key of `0` will have the filter for column `C`, whereas the key `1` is for column `D`. This field is deprecated in favor of filter_specs. */
  criteria?: Record<string, SheetsPivotFilterCriteria>
  /** Output only. The data execution status for data source pivot tables. */
  dataExecutionStatus?: SheetsDataExecutionStatus
  /** The range the pivot table is reading data from. */
  source?: SheetsGridRange
  /** A list of values to include in the pivot table. */
  values?: Array<SheetsPivotValue>
  /** The ID of the data source the pivot table is reading data from. */
  dataSourceId?: string
  /** Each row grouping in the pivot table. */
  rows?: Array<SheetsPivotGroup>
  /** The filters applied to the source columns before aggregating data for the pivot table. Both criteria and filter_specs are populated in responses. If both fields are specified in an update request, this field takes precedence. */
  filterSpecs?: Array<SheetsPivotFilterSpec>
  /** Whether values should be listed horizontally (as columns) or vertically (as rows). */
  valueLayout?: "HORIZONTAL" | "VERTICAL"
  /** Each column grouping in the pivot table. */
  columns?: Array<SheetsPivotGroup>
}

/** Updates all cells in a range with new data. */
export type SheetsUpdateCellsRequest = {
  /** The coordinate to start writing data at. Any number of rows and columns (including a different number of columns per row) may be written. */
  start?: SheetsGridCoordinate
  /** The fields of CellData that should be updated. At least one field must be specified. The root is the CellData; 'row.values.' should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
  /** The data to write. */
  rows?: Array<SheetsRowData>
  /** The range to write data to. If the data in rows does not cover the entire requested range, the fields matching those set in fields will be cleared. */
  range?: SheetsGridRange
}

/** The execution status of refreshing one data source object. */
export type SheetsRefreshDataSourceObjectExecutionStatus = {
  /** The data execution status. */
  dataExecutionStatus?: SheetsDataExecutionStatus
  /** Reference to a data source object being refreshed. */
  reference?: SheetsDataSourceObjectReference
}

/** Sets the basic filter associated with a sheet. */
export type SheetsSetBasicFilterRequest = {
  /** The filter to set. */
  filter?: SheetsBasicFilter
}

/** Specifies a custom BigQuery query. */
export type SheetsBigQueryQuerySpec = {
  /** The raw query string. */
  rawQuery?: string
}

/** Schedule for refreshing the data source. Data sources in the spreadsheet are refreshed within a time interval. You can specify the start time by clicking the Scheduled Refresh button in the Sheets editor, but the interval is fixed at 4 hours. For example, if you specify a start time of 8 AM , the refresh will take place between 8 AM and 12 PM every day. */
export type SheetsDataSourceRefreshSchedule = {
  /** Daily refresh schedule. */
  dailySchedule?: SheetsDataSourceRefreshDailySchedule
  /** Weekly refresh schedule. */
  weeklySchedule?: SheetsDataSourceRefreshWeeklySchedule
  /** Output only. The time interval of the next run. */
  nextRun?: SheetsInterval
  /** True if the refresh schedule is enabled, or false otherwise. */
  enabled?: boolean
  /** The scope of the refresh. Must be ALL_DATA_SOURCES. */
  refreshScope?: "DATA_SOURCE_REFRESH_SCOPE_UNSPECIFIED" | "ALL_DATA_SOURCES"
  /** Monthly refresh schedule. */
  monthlySchedule?: SheetsDataSourceRefreshMonthlySchedule
}

/** Properties that describe the style of a line. */
export type SheetsLineStyle = {
  /** The thickness of the line, in px. */
  width?: number
  /** The dash type of the line. */
  type?:
    | "LINE_DASH_TYPE_UNSPECIFIED"
    | "INVISIBLE"
    | "CUSTOM"
    | "SOLID"
    | "DOTTED"
    | "MEDIUM_DASHED"
    | "MEDIUM_DASHED_DOTTED"
    | "LONG_DASHED"
    | "LONG_DASHED_DOTTED"
}

/** The specifications of a slicer. */
export type SheetsSlicerSpec = {
  /** The filtering criteria of the slicer. */
  filterCriteria?: SheetsFilterCriteria
  /** The title of the slicer. */
  title?: string
  /** The background color of the slicer. Deprecated: Use background_color_style. */
  backgroundColor?: SheetsColor
  /** True if the filter should apply to pivot tables. If not set, default to `True`. */
  applyToPivotTables?: boolean
  /** The zero-based column index in the data table on which the filter is applied to. */
  columnIndex?: number
  /** The text format of title in the slicer. The link field is not supported. */
  textFormat?: SheetsTextFormat
  /** The data range of the slicer. */
  dataRange?: SheetsGridRange
  /** The background color of the slicer. If background_color is also set, this field takes precedence. */
  backgroundColorStyle?: SheetsColorStyle
  /** The horizontal alignment of title in the slicer. If unspecified, defaults to `LEFT` */
  horizontalAlignment?: "HORIZONTAL_ALIGN_UNSPECIFIED" | "LEFT" | "CENTER" | "RIGHT"
}

/** The result of adding a filter view. */
export type SheetsAddFilterViewResponse = {
  /** The newly added filter view. */
  filter?: SheetsFilterView
}

/** A single kind of update to apply to a spreadsheet. */
export type SheetsRequest = {
  /** Duplicates a filter view. */
  duplicateFilterView?: SheetsDuplicateFilterViewRequest
  /** Inserts new rows or columns in a sheet. */
  insertDimension?: SheetsInsertDimensionRequest
  /** Updates dimensions' properties. */
  updateDimensionProperties?: SheetsUpdateDimensionPropertiesRequest
  /** Appends cells after the last row with data in a sheet. */
  appendCells?: SheetsAppendCellsRequest
  /** Cancels refreshes of one or multiple data sources and associated dbobjects. */
  cancelDataSourceRefresh?: SheetsCancelDataSourceRefreshRequest
  /** Updates an existing developer metadata entry */
  updateDeveloperMetadata?: SheetsUpdateDeveloperMetadataRequest
  /** Updates the properties of a filter view. */
  updateFilterView?: SheetsUpdateFilterViewRequest
  /** Deletes a group over the specified range. */
  deleteDimensionGroup?: SheetsDeleteDimensionGroupRequest
  /** Updates an embedded object's (e.g. chart, image) position. */
  updateEmbeddedObjectPosition?: SheetsUpdateEmbeddedObjectPositionRequest
  /** Automatically fills in more data based on existing data. */
  autoFill?: SheetsAutoFillRequest
  /** Automatically resizes one or more dimensions based on the contents of the cells in that dimension. */
  autoResizeDimensions?: SheetsAutoResizeDimensionsRequest
  /** Adds a reply to a CommentThread. */
  addCommentReply?: SheetsAddCommentReplyRequest
  /** Deletes a data source. */
  deleteDataSource?: SheetsDeleteDataSourceRequest
  /** Removes a banded range */
  deleteBanding?: SheetsDeleteBandingRequest
  /** Updates an existing post (head post or reply) of a CommentThread. */
  updateCommentPost?: SheetsUpdateCommentPostRequest
  /** Adds a new banded range */
  addBanding?: SheetsAddBandingRequest
  /** Randomizes the order of the rows in a range. */
  randomizeRange?: SheetsRandomizeRangeRequest
  /** Creates a group over the specified range. */
  addDimensionGroup?: SheetsAddDimensionGroupRequest
  /** Pastes data (HTML or delimited) into a sheet. */
  pasteData?: SheetsPasteDataRequest
  /** Creates new developer metadata */
  createDeveloperMetadata?: SheetsCreateDeveloperMetadataRequest
  /** Updates a table. */
  updateTable?: SheetsUpdateTableRequest
  /** Sets data validation for one or more cells. */
  setDataValidation?: SheetsSetDataValidationRequest
  /** Updates the state of the specified group. */
  updateDimensionGroup?: SheetsUpdateDimensionGroupRequest
  /** Repeats a single cell across a range. */
  repeatCell?: SheetsRepeatCellRequest
  /** Deletes a protected range. */
  deleteProtectedRange?: SheetsDeleteProtectedRangeRequest
  /** Updates an embedded object's border. */
  updateEmbeddedObjectBorder?: SheetsUpdateEmbeddedObjectBorderRequest
  /** Updates the spreadsheet's properties. */
  updateSpreadsheetProperties?: SheetsUpdateSpreadsheetPropertiesRequest
  /** Deletes a named range. */
  deleteNamedRange?: SheetsDeleteNamedRangeRequest
  /** Inserts a CommentThread into the spreadsheet. */
  insertComment?: SheetsInsertCommentRequest
  /** Adds a filter view. */
  addFilterView?: SheetsAddFilterViewRequest
  /** Duplicates a sheet. */
  duplicateSheet?: SheetsDuplicateSheetRequest
  /** Adds a sheet. */
  addSheet?: SheetsAddSheetRequest
  /** Trims cells of whitespace (such as spaces, tabs, or new lines). */
  trimWhitespace?: SheetsTrimWhitespaceRequest
  /** Copies data from one area and pastes it to another. */
  copyPaste?: SheetsCopyPasteRequest
  /** Adds a protected range. */
  addProtectedRange?: SheetsAddProtectedRangeRequest
  /** Clears the basic filter on a sheet. */
  clearBasicFilter?: SheetsClearBasicFilterRequest
  /** Deletes rows or columns in a sheet. */
  deleteDimension?: SheetsDeleteDimensionRequest
  /** Updates a banded range */
  updateBanding?: SheetsUpdateBandingRequest
  /** Updates an existing conditional format rule. */
  updateConditionalFormatRule?: SheetsUpdateConditionalFormatRuleRequest
  /** Updates a data source. */
  updateDataSource?: SheetsUpdateDataSourceRequest
  /** Adds a named range. */
  addNamedRange?: SheetsAddNamedRangeRequest
  /** Sets the basic filter on a sheet. */
  setBasicFilter?: SheetsSetBasicFilterRequest
  /** Adds a chart. */
  addChart?: SheetsAddChartRequest
  /** Deletes a sheet. */
  deleteSheet?: SheetsDeleteSheetRequest
  /** Adds a new conditional format rule. */
  addConditionalFormatRule?: SheetsAddConditionalFormatRuleRequest
  /** Sorts data in a range. */
  sortRange?: SheetsSortRangeRequest
  /** Updates a chart's specifications. */
  updateChartSpec?: SheetsUpdateChartSpecRequest
  /** Updates many cells at once. */
  updateCells?: SheetsUpdateCellsRequest
  /** Adds a data source. */
  addDataSource?: SheetsAddDataSourceRequest
  /** Updates a slicer's specifications. */
  updateSlicerSpec?: SheetsUpdateSlicerSpecRequest
  /** Updates the borders in a range of cells. */
  updateBorders?: SheetsUpdateBordersRequest
  /** Refreshes one or multiple data sources and associated dbobjects. */
  refreshDataSource?: SheetsRefreshDataSourceRequest
  /** Unmerges merged cells. */
  unmergeCells?: SheetsUnmergeCellsRequest
  /** Deletes developer metadata */
  deleteDeveloperMetadata?: SheetsDeleteDeveloperMetadataRequest
  /** Moves rows or columns to another location in a sheet. */
  moveDimension?: SheetsMoveDimensionRequest
  /** Appends dimensions to the end of a sheet. */
  appendDimension?: SheetsAppendDimensionRequest
  /** Inserts new cells in a sheet, shifting the existing cells. */
  insertRange?: SheetsInsertRangeRequest
  /** Adds a table. */
  addTable?: SheetsAddTableRequest
  /** Updates a sheet's properties. */
  updateSheetProperties?: SheetsUpdateSheetPropertiesRequest
  /** Finds and replaces occurrences of some text with other text. */
  findReplace?: SheetsFindReplaceRequest
  /** Converts a column of text into many columns of text. */
  textToColumns?: SheetsTextToColumnsRequest
  /** Updates a named range. */
  updateNamedRange?: SheetsUpdateNamedRangeRequest
  /** Deletes a range of cells from a sheet, shifting the remaining cells. */
  deleteRange?: SheetsDeleteRangeRequest
  /** Deletes a CommentThread. */
  deleteComment?: SheetsDeleteCommentRequest
  /** Merges cells together. */
  mergeCells?: SheetsMergeCellsRequest
  /** Deletes a filter view from a sheet. */
  deleteFilterView?: SheetsDeleteFilterViewRequest
  /** Deletes an existing conditional format rule. */
  deleteConditionalFormatRule?: SheetsDeleteConditionalFormatRuleRequest
  /** Deletes a reply Post from a CommentThread */
  deleteCommentReply?: SheetsDeleteCommentReplyRequest
  /** Updates a protected range. */
  updateProtectedRange?: SheetsUpdateProtectedRangeRequest
  /** Removes rows containing duplicate values in specified columns of a cell range. */
  deleteDuplicates?: SheetsDeleteDuplicatesRequest
  /** Deletes an embedded object (e.g, chart, image) in a sheet. */
  deleteEmbeddedObject?: SheetsDeleteEmbeddedObjectRequest
  /** A request for deleting a table. */
  deleteTable?: SheetsDeleteTableRequest
  /** Cuts data from one area and pastes it to another. */
  cutPaste?: SheetsCutPasteRequest
  /** Adds a slicer. */
  addSlicer?: SheetsAddSlicerRequest
}

/** A combination of a source range and how to extend that source. */
export type SheetsSourceAndDestination = {
  /** The number of rows or columns that data should be filled into. Positive numbers expand beyond the last row or last column of the source. Negative numbers expand before the first row or first column of the source. */
  fillLength?: number
  /** The location of the data to use as the source of the autofill. */
  source?: SheetsGridRange
  /** The dimension that data should be filled into. */
  dimension?: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS"
}

/** A coordinate in a sheet. All indexes are zero-based. */
export type SheetsGridCoordinate = {
  /** The column index of the coordinate. */
  columnIndex?: number
  /** The sheet this coordinate is on. */
  sheetId?: number
  /** The row index of the coordinate. */
  rowIndex?: number
}

/** Adds a named range to the spreadsheet. */
export type SheetsAddNamedRangeRequest = {
  /** The named range to add. The namedRangeId field is optional; if one is not set, an id will be randomly generated. (It is an error to specify the ID of a range that already exists.) */
  namedRange?: SheetsNamedRange
}

/** Properties of a data source chart. */
export type SheetsDataSourceChartProperties = {
  /** Output only. The data execution status. */
  dataExecutionStatus?: SheetsDataExecutionStatus
  /** ID of the data source that the chart is associated with. */
  dataSourceId?: string
}

/** Specifies a BigQuery table definition. Only [native tables](https://cloud.google.com/bigquery/docs/tables-intro) are allowed. */
export type SheetsBigQueryTableSpec = {
  /** The BigQuery dataset id. */
  datasetId?: string
  /** The ID of a BigQuery project the table belongs to. If not specified, the project_id is assumed. */
  tableProjectId?: string
  /** The BigQuery table id. */
  tableId?: string
}

/** Updates a chart's specifications. (This does not move or resize a chart. To move or resize a chart, use UpdateEmbeddedObjectPositionRequest.) */
export type SheetsUpdateChartSpecRequest = {
  /** The specification to apply to the chart. */
  spec?: SheetsChartSpec
  /** The ID of the chart to update. */
  chartId?: number
}

/** Adds a new sheet. When a sheet is added at a given index, all subsequent sheets' indexes are incremented. To add an object sheet, use AddChartRequest instead and specify EmbeddedObjectPosition.sheetId or EmbeddedObjectPosition.newSheet. */
export type SheetsAddSheetRequest = {
  /** The properties the new sheet should have. All properties are optional. The sheetId field is optional; if one is not set, an id will be randomly generated. (It is an error to specify the ID of a sheet that already exists.) */
  properties?: SheetsSheetProperties
}

/** Properties about a dimension. */
export type SheetsDimensionProperties = {
  /** The developer metadata associated with a single row or column. */
  developerMetadata?: Array<SheetsDeveloperMetadata>
  /** True if this dimension is explicitly hidden. */
  hiddenByUser?: boolean
  /** The height (if a row) or width (if a column) of the dimension in pixels. */
  pixelSize?: number
  /** Output only. If set, this is a column in a data source sheet. */
  dataSourceColumnReference?: SheetsDataSourceColumnReference
  /** True if this dimension is being filtered. This field is read-only. */
  hiddenByFilter?: boolean
}

/** The specification for a basic chart. See BasicChartType for the list of charts this supports. */
export type SheetsBasicChartSpec = {
  /** The domain of data this is charting. Only a single domain is supported. */
  domains?: Array<SheetsBasicChartDomain>
  /** The behavior of tooltips and data highlighting when hovering on data and chart area. */
  compareMode?: "BASIC_CHART_COMPARE_MODE_UNSPECIFIED" | "DATUM" | "CATEGORY"
  /** Controls whether to display additional data labels on stacked charts which sum the total value of all stacked values at each value along the domain axis. These data labels can only be set when chart_type is one of AREA, BAR, COLUMN, COMBO or STEPPED_AREA and stacked_type is either STACKED or PERCENT_STACKED. In addition, for COMBO, this will only be supported if there is only one type of stackable series type or one type has more series than the others and each of the other types have no more than one series. For example, if a chart has two stacked bar series and one area series, the total data labels will be supported. If it has three bar series and two area series, total data labels are not allowed. Neither CUSTOM nor placement can be set on the total_data_label. */
  totalDataLabel?: SheetsDataLabel
  /** The axis on the chart. */
  axis?: Array<SheetsBasicChartAxis>
  /** The type of the chart. */
  chartType?: "BASIC_CHART_TYPE_UNSPECIFIED" | "BAR" | "LINE" | "AREA" | "COLUMN" | "SCATTER" | "COMBO" | "STEPPED_AREA"
  /** The number of rows or columns in the data that are "headers". If not set, Google Sheets will guess how many rows are headers based on the data. (Note that BasicChartAxis.title may override the axis title inferred from the header values.) */
  headerCount?: number
  /** The position of the chart legend. */
  legendPosition?:
    | "BASIC_CHART_LEGEND_POSITION_UNSPECIFIED"
    | "BOTTOM_LEGEND"
    | "LEFT_LEGEND"
    | "RIGHT_LEGEND"
    | "TOP_LEGEND"
    | "NO_LEGEND"
  /** True to make the chart 3D. Applies to Bar and Column charts. */
  threeDimensional?: boolean
  /** The stacked type for charts that support vertical stacking. Applies to Area, Bar, Column, Combo, and Stepped Area charts. */
  stackedType?: "BASIC_CHART_STACKED_TYPE_UNSPECIFIED" | "NOT_STACKED" | "STACKED" | "PERCENT_STACKED"
  /** If some values in a series are missing, gaps may appear in the chart (e.g, segments of lines in a line chart will be missing). To eliminate these gaps set this to true. Applies to Line, Area, and Combo charts. */
  interpolateNulls?: boolean
  /** Gets whether all lines should be rendered smooth or straight by default. Applies to Line charts. */
  lineSmoothing?: boolean
  /** The data this chart is visualizing. */
  series?: Array<SheetsBasicChartSeries>
}

/** Refreshes one or multiple data source objects in the spreadsheet by the specified references. The request requires an additional `bigquery.readonly` OAuth scope if you are refreshing a BigQuery data source. If there are multiple refresh requests referencing the same data source objects in one batch, only the last refresh request is processed, and all those requests will have the same response accordingly. */
export type SheetsRefreshDataSourceRequest = {
  /** Reference to a DataSource. If specified, refreshes all associated data source objects for the data source. */
  dataSourceId?: string
  /** References to data source objects to refresh. */
  references?: SheetsDataSourceObjectReferences
  /** Refreshes all existing data source objects in the spreadsheet. */
  isAll?: boolean
  /** Refreshes the data source objects regardless of the current state. If not set and a referenced data source object was in error state, the refresh will fail immediately. */
  force?: boolean
}

/** Allows you to organize numeric values in a source data column into buckets of constant size. */
export type SheetsChartHistogramRule = {
  /** The minimum value at which items are placed into buckets. Values that are less than the minimum are grouped into a single bucket. If omitted, it is determined by the minimum item value. */
  minValue?: number
  /** The maximum value at which items are placed into buckets. Values greater than the maximum are grouped into a single bucket. If omitted, it is determined by the maximum item value. */
  maxValue?: number
  /** The size of the buckets that are created. Must be positive. */
  intervalSize?: number
}

/** Updates an existing protected range with the specified protectedRangeId. */
export type SheetsUpdateProtectedRangeRequest = {
  /** The protected range to update with the new properties. */
  protectedRange?: SheetsProtectedRange
  /** The fields that should be updated. At least one field must be specified. The root `protectedRange` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** An error in a cell. */
export type SheetsErrorValue = {
  /** A message with more information about the error (in the spreadsheet's locale). */
  message?: string
  /** The type of error. */
  type?:
    | "ERROR_TYPE_UNSPECIFIED"
    | "ERROR"
    | "NULL_VALUE"
    | "DIVIDE_BY_ZERO"
    | "VALUE"
    | "REF"
    | "NAME"
    | "NUM"
    | "N_A"
    | "LOADING"
}

/** Inserts a reply Post into a CommentThread. */
export type SheetsAddCommentReplyRequest = {
  /** The ID of the CommentThread to add the reply to. */
  commentId?: string
  /** The Post representing the reply. */
  post?: SheetsPost
}

/** A slicer in a sheet. */
export type SheetsSlicer = {
  /** The specification of the slicer. */
  spec?: SheetsSlicerSpec
  /** The ID of the slicer. */
  slicerId?: number
  /** The position of the slicer. Note that slicer can be positioned only on existing sheet. Also, width and height of slicer can be automatically adjusted to keep it within permitted limits. */
  position?: SheetsEmbeddedObjectPosition
}

/** The location an object is overlaid on top of a grid. */
export type SheetsOverlayPosition = {
  /** The height of the object, in pixels. Defaults to 371. */
  heightPixels?: number
  /** The cell the object is anchored to. */
  anchorCell?: SheetsGridCoordinate
  /** The vertical offset, in pixels, that the object is offset from the anchor cell. */
  offsetYPixels?: number
  /** The width of the object, in pixels. Defaults to 600. */
  widthPixels?: number
  /** The horizontal offset, in pixels, that the object is offset from the anchor cell. */
  offsetXPixels?: number
}

/** A reply to a developer metadata search request. */
export type SheetsSearchDeveloperMetadataResponse = {
  /** The metadata matching the criteria of the search request. */
  matchedDeveloperMetadata?: Array<SheetsMatchedDeveloperMetadata>
}

/** A request to delete developer metadata. */
export type SheetsDeleteDeveloperMetadataRequest = {
  /** The data filter describing the criteria used to select which developer metadata entry to delete. */
  dataFilter?: SheetsDataFilter
}

/** The data included in a domain or series. */
export type SheetsChartData = {
  /** The source ranges of the data. */
  sourceRange?: SheetsChartSourceRange
  /** The rule to group the data by if the ChartData backs the domain of a data source chart. Only supported for data source charts. */
  groupRule?: SheetsChartGroupRule
  /** The aggregation type for the series of a data source chart. Only supported for data source charts. */
  aggregateType?: "CHART_AGGREGATE_TYPE_UNSPECIFIED" | "AVERAGE" | "COUNT" | "MAX" | "MEDIAN" | "MIN" | "SUM"
  /** The reference to the data source column that the data reads from. */
  columnReference?: SheetsDataSourceColumnReference
}

/** The request for updating more than one range of values in a spreadsheet. */
export type SheetsBatchUpdateValuesRequest = {
  /** Determines how dates, times, and durations in the response should be rendered. This is ignored if response_value_render_option is FORMATTED_VALUE. The default dateTime render option is SERIAL_NUMBER. */
  responseDateTimeRenderOption?: "SERIAL_NUMBER" | "FORMATTED_STRING"
  /** How the input data should be interpreted. */
  valueInputOption?: "INPUT_VALUE_OPTION_UNSPECIFIED" | "RAW" | "USER_ENTERED"
  /** The new values to apply to the spreadsheet. */
  data?: Array<SheetsValueRange>
  /** Determines how values in the response should be rendered. The default render option is FORMATTED_VALUE. */
  responseValueRenderOption?: "FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA"
  /** Determines if the update response should include the values of the cells that were updated. By default, responses do not include the updated values. The `updatedData` field within each of the BatchUpdateValuesResponse.responses contains the updated values. If the range to write was larger than the range actually written, the response includes all values in the requested range (excluding trailing empty rows and columns). */
  includeValuesInResponse?: boolean
}

/** Copies data from the source to the destination. */
export type SheetsCopyPasteRequest = {
  /** The location to paste to. If the range covers a span that's a multiple of the source's height or width, then the data will be repeated to fill in the destination range. If the range is smaller than the source range, the entire source data will still be copied (beyond the end of the destination range). */
  destination?: SheetsGridRange
  /** What kind of data to paste. */
  pasteType?:
    | "PASTE_NORMAL"
    | "PASTE_VALUES"
    | "PASTE_FORMAT"
    | "PASTE_NO_BORDERS"
    | "PASTE_FORMULA"
    | "PASTE_DATA_VALIDATION"
    | "PASTE_CONDITIONAL_FORMATTING"
  /** How that data should be oriented when pasting. */
  pasteOrientation?: "NORMAL" | "TRANSPOSE"
  /** The source range to copy. */
  source?: SheetsGridRange
}

/** A protected range. */
export type SheetsProtectedRange = {
  /** The description of this protected range. */
  description?: string
  /** The named range this protected range is backed by, if any. When writing, only one of range or named_range_id or table_id may be set. */
  namedRangeId?: string
  /** The list of unprotected ranges within a protected sheet. Unprotected ranges are only supported on protected sheets. */
  unprotectedRanges?: Array<SheetsGridRange>
  /** The users and groups with edit access to the protected range. This field is only visible to users with edit access to the protected range and the document. Editors are not supported with warning_only protection. */
  editors?: SheetsEditors
  /** The range that is being protected. The range may be fully unbounded, in which case this is considered a protected sheet. When writing, only one of range or named_range_id or table_id may be set. */
  range?: SheetsGridRange
  /** True if this protected range will show a warning when editing. Warning-based protection means that every user can edit data in the protected range, except editing will prompt a warning asking the user to confirm the edit. When writing: if this field is true, then editors are ignored. Additionally, if this field is changed from true to false and the `editors` field is not set (nor included in the field mask), then the editors will be set to all the editors in the document. */
  warningOnly?: boolean
  /** The table this protected range is backed by, if any. When writing, only one of range or named_range_id or table_id may be set. */
  tableId?: string
  /** True if the user who requested this protected range can edit the protected area. This field is read-only. */
  requestingUserCanEdit?: boolean
  /** The ID of the protected range. This field is read-only. */
  protectedRangeId?: number
}

/** A histogram series containing the series color and data. */
export type SheetsHistogramSeries = {
  /** The color of the column representing this series in each bucket. This field is optional. If bar_color is also set, this field takes precedence. */
  barColorStyle?: SheetsColorStyle
  /** The data for this histogram series. */
  data?: SheetsChartData
  /** The color of the column representing this series in each bucket. This field is optional. Deprecated: Use bar_color_style. */
  barColor?: SheetsColor
}

/** Updates a table in the spreadsheet. */
export type SheetsUpdateTableRequest = {
  /** Required. The table to update. */
  table?: SheetsTable
  /** Required. The fields that should be updated. At least one field must be specified. The root `table` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** A pie chart. */
export type SheetsPieChartSpec = {
  /** Where the legend of the pie chart should be drawn. */
  legendPosition?:
    | "PIE_CHART_LEGEND_POSITION_UNSPECIFIED"
    | "BOTTOM_LEGEND"
    | "LEFT_LEGEND"
    | "RIGHT_LEGEND"
    | "TOP_LEGEND"
    | "NO_LEGEND"
    | "LABELED_LEGEND"
  /** True if the pie is three dimensional. */
  threeDimensional?: boolean
  /** The data that covers the one and only series of the pie chart. */
  series?: SheetsChartData
  /** The size of the hole in the pie chart. */
  pieHole?: number
  /** The data that covers the domain of the pie chart. */
  domain?: SheetsChartData
}

/** The response from creating developer metadata. */
export type SheetsCreateDeveloperMetadataResponse = {
  /** The developer metadata that was created. */
  developerMetadata?: SheetsDeveloperMetadata
}

/** Represents spreadsheet theme */
export type SheetsSpreadsheetTheme = {
  /** Name of the primary font family. */
  primaryFontFamily?: string
  /** The spreadsheet theme color pairs. To update you must provide all theme color pairs. */
  themeColors?: Array<SheetsThemeColorPair>
}

/** The result of adding a table. */
export type SheetsAddTableResponse = {
  /** Output only. The table that was added. */
  table?: SheetsTable
}

/** Information about an external data source in the spreadsheet. */
export type SheetsDataSource = {
  /** The spreadsheet-scoped unique ID that identifies the data source. Example: 1080547365. */
  dataSourceId?: string
  /** The DataSourceSpec for the data source connected with this spreadsheet. */
  spec?: SheetsDataSourceSpec
  /** All calculated columns in the data source. */
  calculatedColumns?: Array<SheetsDataSourceColumn>
  /** The ID of the Sheet connected with the data source. The field cannot be changed once set. When creating a data source, an associated DATA_SOURCE sheet is also created, if the field is not specified, the ID of the created sheet will be randomly generated. */
  sheetId?: number
}

/** A range along a single dimension on a sheet. All indexes are zero-based. Indexes are half open: the start index is inclusive and the end index is exclusive. Missing indexes indicate the range is unbounded on that side. */
export type SheetsDimensionRange = {
  /** The dimension of the span. */
  dimension?: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS"
  /** The sheet this span is on. */
  sheetId?: number
  /** The end (exclusive) of the span, or not set if unbounded. */
  endIndex?: number
  /** The start (inclusive) of the span, or not set if unbounded. */
  startIndex?: number
}

/** A pair mapping a spreadsheet theme color type to the concrete color it represents. */
export type SheetsThemeColorPair = {
  /** The type of the spreadsheet theme color. */
  colorType?:
    | "THEME_COLOR_TYPE_UNSPECIFIED"
    | "TEXT"
    | "BACKGROUND"
    | "ACCENT1"
    | "ACCENT2"
    | "ACCENT3"
    | "ACCENT4"
    | "ACCENT5"
    | "ACCENT6"
    | "LINK"
  /** The concrete color corresponding to the theme color type. */
  color?: SheetsColorStyle
}

/** Settings for one set of data labels. Data labels are annotations that appear next to a set of data, such as the points on a line chart, and provide additional information about what the data represents, such as a text representation of the value behind that point on the graph. */
export type SheetsDataLabel = {
  /** The type of the data label. */
  type?: "DATA_LABEL_TYPE_UNSPECIFIED" | "NONE" | "DATA" | "CUSTOM"
  /** Data to use for custom labels. Only used if type is set to CUSTOM. This data must be the same length as the series or other element this data label is applied to. In addition, if the series is split into multiple source ranges, this source data must come from the next column in the source data. For example, if the series is B2:B4,E6:E8 then this data must come from C2:C4,F6:F8. */
  customLabelData?: SheetsChartData
  /** The placement of the data label relative to the labeled data. */
  placement?:
    | "DATA_LABEL_PLACEMENT_UNSPECIFIED"
    | "CENTER"
    | "LEFT"
    | "RIGHT"
    | "ABOVE"
    | "BELOW"
    | "INSIDE_END"
    | "INSIDE_BASE"
    | "OUTSIDE_END"
  /** The text format used for the data label. The link field is not supported. */
  textFormat?: SheetsTextFormat
}

/** Represents a time of day. The date and time zone are either not significant or are specified elsewhere. An API may choose to allow leap seconds. Related types are google.type.Date and `google.protobuf.Timestamp`. */
export type SheetsTimeOfDay = {
  /** Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds. */
  seconds?: number
  /** Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999. */
  nanos?: number
  /** Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time. */
  hours?: number
  /** Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59. */
  minutes?: number
}

/** The options that define a "view window" for a chart (such as the visible values in an axis). */
export type SheetsChartAxisViewWindowOptions = {
  /** The maximum numeric value to be shown in this view window. If unset, will automatically determine a maximum value that looks good for the data. */
  viewWindowMax?: number
  /** The view window's mode. */
  viewWindowMode?: "DEFAULT_VIEW_WINDOW_MODE" | "VIEW_WINDOW_MODE_UNSUPPORTED" | "EXPLICIT" | "PRETTY"
  /** The minimum numeric value to be shown in this view window. If unset, will automatically determine a minimum value that looks good for the data. */
  viewWindowMin?: number
}

/** Inserts rows or columns in a sheet at a particular index. */
export type SheetsInsertDimensionRequest = {
  /** The dimensions to insert. Both the start and end indexes must be bounded. */
  range?: SheetsDimensionRange
  /** Whether dimension properties should be extended from the dimensions before or after the newly inserted dimensions. True to inherit from the dimensions before (in which case the start index must be greater than 0), and false to inherit from the dimensions after. For example, if row index 0 has red background and row index 1 has a green background, then inserting 2 rows at index 1 can inherit either the green or red background. If `inheritFromBefore` is true, the two new rows will be red (because the row before the insertion point was red), whereas if `inheritFromBefore` is false, the two new rows will be green (because the row after the insertion point was green). */
  inheritFromBefore?: boolean
}

/** Resource that represents a spreadsheet. */
export type SheetsSpreadsheet = {
  /** Overall properties of a spreadsheet. */
  properties?: SheetsSpreadsheetProperties
  /** The comment threads associated with the spreadsheet. */
  comments?: Array<SheetsCommentThread>
  /** The named ranges defined in a spreadsheet. */
  namedRanges?: Array<SheetsNamedRange>
  /** The developer metadata associated with a spreadsheet. */
  developerMetadata?: Array<SheetsDeveloperMetadata>
  /** A list of external data sources connected with the spreadsheet. */
  dataSources?: Array<SheetsDataSource>
  /** The sheets that are part of a spreadsheet. */
  sheets?: Array<SheetsSheet>
  /** The url of the spreadsheet. This field is read-only. */
  spreadsheetUrl?: string
  /** Output only. A list of data source refresh schedules. */
  dataSourceSchedules?: Array<SheetsDataSourceRefreshSchedule>
  /** The ID of the spreadsheet. This field is read-only. */
  spreadsheetId?: string
  /** Output only. The comments view mode applied to the spreadsheet. */
  commentsViewMode?:
    | "COMMENTS_VIEW_MODE_UNSPECIFIED"
    | "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS"
    | "COMMENTS_VIEW_MODE_OMITTED"
    | "COMMENTS_VIEW_MODE_INCLUDED"
}

/** A color scale for a treemap chart. */
export type SheetsTreemapChartColorScale = {
  /** The background color for cells that have no color data associated with them. Defaults to #000000 if not specified. If no_data_color is also set, this field takes precedence. */
  noDataColorStyle?: SheetsColorStyle
  /** The background color for cells with a color value greater than or equal to maxValue. Defaults to #109618 if not specified. If max_value_color is also set, this field takes precedence. */
  maxValueColorStyle?: SheetsColorStyle
  /** The background color for cells with a color value at the midpoint between minValue and maxValue. Defaults to #efe6dc if not specified. Deprecated: Use mid_value_color_style. */
  midValueColor?: SheetsColor
  /** The background color for cells that have no color data associated with them. Defaults to #000000 if not specified. Deprecated: Use no_data_color_style. */
  noDataColor?: SheetsColor
  /** The background color for cells with a color value less than or equal to minValue. Defaults to #dc3912 if not specified. If min_value_color is also set, this field takes precedence. */
  minValueColorStyle?: SheetsColorStyle
  /** The background color for cells with a color value less than or equal to minValue. Defaults to #dc3912 if not specified. Deprecated: Use min_value_color_style. */
  minValueColor?: SheetsColor
  /** The background color for cells with a color value at the midpoint between minValue and maxValue. Defaults to #efe6dc if not specified. If mid_value_color is also set, this field takes precedence. */
  midValueColorStyle?: SheetsColorStyle
  /** The background color for cells with a color value greater than or equal to maxValue. Defaults to #109618 if not specified. Deprecated: Use max_value_color_style. */
  maxValueColor?: SheetsColor
}

/** Source ranges for a chart. */
export type SheetsChartSourceRange = {
  /** The ranges of data for a series or domain. Exactly one dimension must have a length of 1, and all sources in the list must have the same dimension with length 1. The domain (if it exists) & all series must have the same number of source ranges. If using more than one source range, then the source range at a given offset must be in order and contiguous across the domain and series. For example, these are valid configurations: domain sources: A1:A5 series1 sources: B1:B5 series2 sources: D6:D10 domain sources: A1:A5, C10:C12 series1 sources: B1:B5, D10:D12 series2 sources: C1:C5, E10:E12 */
  sources?: Array<SheetsGridRange>
}

/** The series of a CandlestickData. */
export type SheetsCandlestickSeries = {
  /** The data of the CandlestickSeries. */
  data?: SheetsChartData
}

/** A data validation rule. */
export type SheetsDataValidationRule = {
  /** The condition that data in the cell must match. */
  condition?: SheetsBooleanCondition
  /** A message to show the user when adding data to the cell. */
  inputMessage?: string
  /** True if the UI should be customized based on the kind of condition. If true, "List" conditions will show a dropdown. */
  showCustomUi?: boolean
  /** True if invalid data should be rejected. */
  strict?: boolean
}

/** Updates properties of a spreadsheet. */
export type SheetsUpdateSpreadsheetPropertiesRequest = {
  /** The properties to update. */
  properties?: SheetsSpreadsheetProperties
  /** The fields that should be updated. At least one field must be specified. The root 'properties' is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** A candlestick chart. */
export type SheetsCandlestickChartSpec = {
  /** The Candlestick chart data. Only one CandlestickData is supported. */
  data?: Array<SheetsCandlestickData>
  /** The domain data (horizontal axis) for the candlestick chart. String data will be treated as discrete labels, other data will be treated as continuous values. */
  domain?: SheetsCandlestickDomain
}

/** The request for updating any aspect of a spreadsheet. */
export type SheetsBatchUpdateSpreadsheetRequest = {
  /** A list of updates to apply to the spreadsheet. Requests will be applied in the order they are specified. If any request is not valid, no requests will be applied. */
  requests?: Array<SheetsRequest>
  /** Determines if the update response should include the spreadsheet resource. */
  includeSpreadsheetInResponse?: boolean
  /** True if grid data should be returned. Meaningful only if include_spreadsheet_in_response is 'true'. This parameter is ignored if a field mask was set in the request. */
  responseIncludeGridData?: boolean
  /** Limits the ranges included in the response spreadsheet. Meaningful only if include_spreadsheet_in_response is 'true'. */
  responseRanges?: Array<string>
  /** The comments view mode to apply to the spreadsheet. This allows viewing the spreadsheet with comments omitted or included. If one is not specified, COMMENTS_VIEW_MODE_OMITTED is used. Meaningful only if include_spreadsheet_in_response is 'true'. */
  commentsViewMode?:
    | "COMMENTS_VIEW_MODE_UNSPECIFIED"
    | "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS"
    | "COMMENTS_VIEW_MODE_OMITTED"
    | "COMMENTS_VIEW_MODE_INCLUDED"
}

/** The response when updating a range of values in a spreadsheet. */
export type SheetsAppendValuesResponse = {
  /** Information about the updates that were applied. */
  updates?: SheetsUpdateValuesResponse
  /** The range (in A1 notation) of the table that values are being appended to (before the values were appended). Empty if no table was found. */
  tableRange?: string
  /** The spreadsheet the updates were applied to. */
  spreadsheetId?: string
}

/** Properties of a spreadsheet. */
export type SheetsSpreadsheetProperties = {
  /** The locale of the spreadsheet in one of the following formats: * an ISO 639-1 language code such as `en` * an ISO 639-2 language code such as `fil`, if no 639-1 code exists * a combination of the ISO language code and country code, such as `en_US` Note: when updating this field, not all locales/languages are supported. */
  locale?: string
  /** The time zone of the spreadsheet, in CLDR format such as `America/New_York`. If the time zone isn't recognized, this may be a custom time zone such as `GMT-07:00`. */
  timeZone?: string
  /** The title of the spreadsheet. */
  title?: string
  /** The default format of all cells in the spreadsheet. CellData.effectiveFormat will not be set if the cell's format is equal to this default format. This field is read-only. */
  defaultFormat?: SheetsCellFormat
  /** The amount of time to wait before volatile functions are recalculated. */
  autoRecalc?: "RECALCULATION_INTERVAL_UNSPECIFIED" | "ON_CHANGE" | "MINUTE" | "HOUR"
  /** Whether to allow external URL access for image and import functions. Read only when true. When false, you can set to true. This value will be bypassed and always return true if the admin has enabled the [allowlisting feature](https://support.google.com/a?p=url_allowlist). */
  importFunctionsExternalUrlAccessAllowed?: boolean
  /** Determines whether and how circular references are resolved with iterative calculation. Absence of this field means that circular references result in calculation errors. */
  iterativeCalculationSettings?: SheetsIterativeCalculationSettings
  /** Theme applied to the spreadsheet. */
  spreadsheetTheme?: SheetsSpreadsheetTheme
}

/** A data source table, which allows the user to import a static table of data from the DataSource into Sheets. This is also known as "Extract" in the Sheets editor. */
export type SheetsDataSourceTable = {
  /** Output only. The data execution status. */
  dataExecutionStatus?: SheetsDataExecutionStatus
  /** The type to select columns for the data source table. Defaults to SELECTED. */
  columnSelectionType?: "DATA_SOURCE_TABLE_COLUMN_SELECTION_TYPE_UNSPECIFIED" | "SELECTED" | "SYNC_ALL"
  /** Columns selected for the data source table. The column_selection_type must be SELECTED. */
  columns?: Array<SheetsDataSourceColumnReference>
  /** Filter specifications in the data source table. */
  filterSpecs?: Array<SheetsFilterSpec>
  /** The ID of the data source the data source table is associated with. */
  dataSourceId?: string
  /** Sort specifications in the data source table. The result of the data source table is sorted based on the sort specifications in order. */
  sortSpecs?: Array<SheetsSortSpec>
  /** The limit of rows to return. If not set, a default limit is applied. Please refer to the Sheets editor for the default and max limit. */
  rowLimit?: number
}

/** Allows you to organize the date-time values in a source data column into buckets based on selected parts of their date or time values. For example, consider a pivot table showing sales transactions by date: +----------+--------------+ | Date | SUM of Sales | +----------+--------------+ | 1/1/2017 | $621.14 | | 2/3/2017 | $708.84 | | 5/8/2017 | $326.84 | ... +----------+--------------+ Applying a date-time group rule with a DateTimeRuleType of YEAR_MONTH results in the following pivot table. +--------------+--------------+ | Grouped Date | SUM of Sales | +--------------+--------------+ | 2017-Jan | $53,731.78 | | 2017-Feb | $83,475.32 | | 2017-Mar | $94,385.05 | ... +--------------+--------------+ */
export type SheetsDateTimeRule = {
  /** The type of date-time grouping to apply. */
  type?:
    | "DATE_TIME_RULE_TYPE_UNSPECIFIED"
    | "SECOND"
    | "MINUTE"
    | "HOUR"
    | "HOUR_MINUTE"
    | "HOUR_MINUTE_AMPM"
    | "DAY_OF_WEEK"
    | "DAY_OF_YEAR"
    | "DAY_OF_MONTH"
    | "DAY_MONTH"
    | "MONTH"
    | "QUARTER"
    | "YEAR"
    | "YEAR_MONTH"
    | "YEAR_QUARTER"
    | "YEAR_MONTH_DAY"
}

/** A range along a single dimension on a DATA_SOURCE sheet. */
export type SheetsDataSourceSheetDimensionRange = {
  /** The ID of the data source sheet the range is on. */
  sheetId?: number
  /** The columns on the data source sheet. */
  columnReferences?: Array<SheetsDataSourceColumnReference>
}

/** The request for updating more than one range of values in a spreadsheet. */
export type SheetsBatchUpdateValuesByDataFilterRequest = {
  /** Determines how dates, times, and durations in the response should be rendered. This is ignored if response_value_render_option is FORMATTED_VALUE. The default dateTime render option is SERIAL_NUMBER. */
  responseDateTimeRenderOption?: "SERIAL_NUMBER" | "FORMATTED_STRING"
  /** How the input data should be interpreted. */
  valueInputOption?: "INPUT_VALUE_OPTION_UNSPECIFIED" | "RAW" | "USER_ENTERED"
  /** The new values to apply to the spreadsheet. If more than one range is matched by the specified DataFilter the specified values are applied to all of those ranges. */
  data?: Array<SheetsDataFilterValueRange>
  /** Determines if the update response should include the values of the cells that were updated. By default, responses do not include the updated values. The `updatedData` field within each of the BatchUpdateValuesResponse.responses contains the updated values. If the range to write was larger than the range actually written, the response includes all values in the requested range (excluding trailing empty rows and columns). */
  includeValuesInResponse?: boolean
  /** Determines how values in the response should be rendered. The default render option is FORMATTED_VALUE. */
  responseValueRenderOption?: "FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA"
}

/** Moves one or more rows or columns. */
export type SheetsMoveDimensionRequest = {
  /** The zero-based start index of where to move the source data to, based on the coordinates *before* the source data is removed from the grid. Existing data will be shifted down or right (depending on the dimension) to make room for the moved dimensions. The source dimensions are removed from the grid, so the the data may end up in a different index than specified. For example, given `A1..A5` of `0, 1, 2, 3, 4` and wanting to move `"1"` and `"2"` to between `"3"` and `"4"`, the source would be `ROWS [1..3)`,and the destination index would be `"4"` (the zero-based index of row 5). The end result would be `A1..A5` of `0, 3, 1, 2, 4`. */
  destinationIndex?: number
  /** The source dimensions to move. */
  source?: SheetsDimensionRange
}

/** Duplicates the contents of a sheet. */
export type SheetsDuplicateSheetRequest = {
  /** The name of the new sheet. If empty, a new name is chosen for you. */
  newSheetName?: string
  /** The zero-based index where the new sheet should be inserted. The index of all sheets after this are incremented. */
  insertSheetIndex?: number
  /** The sheet to duplicate. If the source sheet is of DATA_SOURCE type, its backing DataSource is also duplicated and associated with the new copy of the sheet. No data execution is triggered, the grid data of this sheet is also copied over but only available after the batch request completes. */
  sourceSheetId?: number
  /** If set, the ID of the new sheet. If not set, an ID is chosen. If set, the ID must not conflict with any existing sheet ID. If set, it must be non-negative. */
  newSheetId?: number
}

/** A table. */
export type SheetsTable = {
  /** The table column properties. */
  columnProperties?: Array<SheetsTableColumnProperties>
  /** The id of the table. */
  tableId?: string
  /** The table rows properties. */
  rowsProperties?: SheetsTableRowsProperties
  /** The table range. */
  range?: SheetsGridRange
  /** The table name. This is unique to all tables in the same spreadsheet. */
  name?: string
}

/** The count limit on rows or columns in the pivot group. */
export type SheetsPivotGroupLimit = {
  /** The count limit. */
  countLimit?: number
  /** The order in which the group limit is applied to the pivot table. Pivot group limits are applied from lower to higher order number. Order numbers are normalized to consecutive integers from 0. For write request, to fully customize the applying orders, all pivot group limits should have this field set with an unique number. Otherwise, the order is determined by the index in the PivotTable.rows list and then the PivotTable.columns list. */
  applyOrder?: number
}

/** Updates the state of the specified group. */
export type SheetsUpdateDimensionGroupRequest = {
  /** The fields that should be updated. At least one field must be specified. The root `dimensionGroup` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
  /** The group whose state should be updated. The range and depth of the group should specify a valid group on the sheet, and all other fields updated. */
  dimensionGroup?: SheetsDimensionGroup
}

/** An external or local reference. */
export type SheetsLink = {
  /** The link identifier. */
  uri?: string
}

/** Adds a new protected range. */
export type SheetsAddProtectedRangeRequest = {
  /** The protected range to be added. The protectedRangeId field is optional; if one is not set, an id will be randomly generated. (It is an error to specify the ID of a range that already exists.) */
  protectedRange?: SheetsProtectedRange
}

/** Updates a Post in a CommentThread. Returns a 400 bad request error if: - The requesting user is not the author of the post. */
export type SheetsUpdateCommentPostRequest = {
  /** The new text of the comment, as plain text. This text content will be handled similarly to comments created in the Sheets editor. It will have similar behaviors for formatting, notifications, etc. This field cannot be empty, and must not exceed 2048 UTF-8 code units. */
  content?: string
  /** The ID of the CommentThread which the post belongs to. */
  commentId?: string
  /** The ID of the post being updated. */
  postId?: string
}

/** The result of creating a reply. */
export type SheetsAddCommentReplyResponse = {
  /** The newly-inserted reply Post. */
  post?: SheetsPost
}

/** Deletes a range of cells, shifting other cells into the deleted area. */
export type SheetsDeleteRangeRequest = {
  /** The range of cells to delete. */
  range?: SheetsGridRange
  /** The dimension from which deleted cells will be replaced with. If ROWS, existing cells will be shifted upward to replace the deleted cells. If COLUMNS, existing cells will be shifted left to replace the deleted cells. */
  shiftDimension?: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS"
}

/** Adds a new conditional format rule at the given index. All subsequent rules' indexes are incremented. */
export type SheetsAddConditionalFormatRuleRequest = {
  /** The zero-based index where the rule should be inserted. */
  index?: number
  /** The rule to add. */
  rule?: SheetsConditionalFormatRule
}

/** The response when updating a range of values by a data filter in a spreadsheet. */
export type SheetsUpdateValuesByDataFilterResponse = {
  /** The data filter that selected the range that was updated. */
  dataFilter?: SheetsDataFilter
  /** The number of columns where at least one cell in the column was updated. */
  updatedColumns?: number
  /** The range (in [A1 notation](https://developers.google.com/workspace/sheets/api/guides/concepts#cell)) that updates were applied to. */
  updatedRange?: string
  /** The number of rows where at least one cell in the row was updated. */
  updatedRows?: number
  /** The values of the cells in the range matched by the dataFilter after all updates were applied. This is only included if the request's `includeValuesInResponse` field was `true`. */
  updatedData?: SheetsValueRange
  /** The number of cells updated. */
  updatedCells?: number
}

/** Deletes a conditional format rule at the given index. All subsequent rules' indexes are decremented. */
export type SheetsDeleteConditionalFormatRuleRequest = {
  /** The zero-based index of the rule to be deleted. */
  index?: number
  /** The sheet the rule is being deleted from. */
  sheetId?: number
}

/** The run of a chip. The chip continues until the start index of the next run. */
export type SheetsChipRun = {
  /** Optional. The chip of this run. */
  chip?: SheetsChip
  /** Required. The zero-based character index where this run starts, in UTF-16 code units. */
  startIndex?: number
}

/** The value of the condition. */
export type SheetsConditionValue = {
  /** A value the condition is based on. The value is parsed as if the user typed into a cell. Formulas are supported (and must begin with an `=` or a '+'). */
  userEnteredValue?: string
  /** A relative date (based on the current date). Valid only if the type is DATE_BEFORE, DATE_AFTER, DATE_ON_OR_BEFORE or DATE_ON_OR_AFTER. Relative dates are not supported in data validation. They are supported only in conditional formatting and conditional filters. */
  relativeDate?:
    | "RELATIVE_DATE_UNSPECIFIED"
    | "PAST_YEAR"
    | "PAST_MONTH"
    | "PAST_WEEK"
    | "YESTERDAY"
    | "TODAY"
    | "TOMORROW"
}

/** The response when retrieving more than one range of values in a spreadsheet selected by DataFilters. */
export type SheetsBatchGetValuesByDataFilterResponse = {
  /** The ID of the spreadsheet the data was retrieved from. */
  spreadsheetId?: string
  /** The requested values with the list of data filters that matched them. */
  valueRanges?: Array<SheetsMatchedValueRange>
}

/** Criteria for showing/hiding rows in a pivot table. */
export type SheetsPivotFilterCriteria = {
  /** Values that should be included. Values not listed here are excluded. */
  visibleValues?: Array<string>
  /** A condition that must be true for values to be shown. (`visibleValues` does not override this -- even if a value is listed there, it is still hidden if it does not meet the condition.) Condition values that refer to ranges in A1-notation are evaluated relative to the pivot table sheet. References are treated absolutely, so are not filled down the pivot table. For example, a condition value of `=A1` on "Pivot Table 1" is treated as `'Pivot Table 1'!$A$1`. The source data of the pivot table can be referenced by column header name. For example, if the source data has columns named "Revenue" and "Cost" and a condition is applied to the "Revenue" column with type `NUMBER_GREATER` and value `=Cost`, then only columns where "Revenue" > "Cost" are included. */
  condition?: SheetsBooleanCondition
  /** Whether values are visible by default. If true, the visible_values are ignored, all values that meet condition (if specified) are shown. If false, values that are both in visible_values and meet condition are shown. */
  visibleByDefault?: boolean
}

/** A parameter in a data source's query. The parameter allows the user to pass in values from the spreadsheet into a query. */
export type SheetsDataSourceParameter = {
  /** ID of a NamedRange. Its size must be 1x1. */
  namedRangeId?: string
  /** A range that contains the value of the parameter. Its size must be 1x1. */
  range?: SheetsGridRange
  /** Named parameter. Must be a legitimate identifier for the DataSource that supports it. For example, [BigQuery identifier](https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#identifiers). */
  name?: string
}

/** The request for clearing a range of values in a spreadsheet. */
export type SheetsClearValuesRequest = Record<string, unknown>

/** A Treemap chart. */
export type SheetsTreemapChartSpec = {
  /** True to hide tooltips. */
  hideTooltips?: boolean
  /** The text format for all labels on the chart. The link field is not supported. */
  textFormat?: SheetsTextFormat
  /** The color scale for data cells in the treemap chart. Data cells are assigned colors based on their color values. These color values come from color_data, or from size_data if color_data is not specified. Cells with color values less than or equal to min_value will have minValueColor as their background color. Cells with color values greater than or equal to max_value will have maxValueColor as their background color. Cells with color values between min_value and max_value will have background colors on a gradient between minValueColor and maxValueColor, the midpoint of the gradient being midValueColor. Cells with missing or non-numeric color values will have noDataColor as their background color. */
  colorScale?: SheetsTreemapChartColorScale
  /** The background color for header cells. If header_color is also set, this field takes precedence. */
  headerColorStyle?: SheetsColorStyle
  /** The number of data levels to show on the treemap chart. These levels are interactive and are shown with their labels. Defaults to 2 if not specified. */
  levels?: number
  /** The data the contains the treemap cells' parent labels. */
  parentLabels?: SheetsChartData
  /** The data that contains the treemap cell labels. */
  labels?: SheetsChartData
  /** The minimum possible data value. Cells with values less than this will have the same color as cells with this value. If not specified, defaults to the actual minimum value from color_data, or the minimum value from size_data if color_data is not specified. */
  minValue?: number
  /** The number of additional data levels beyond the labeled levels to be shown on the treemap chart. These levels are not interactive and are shown without their labels. Defaults to 0 if not specified. */
  hintedLevels?: number
  /** The data that determines the size of each treemap data cell. This data is expected to be numeric. The cells corresponding to non-numeric or missing data will not be rendered. If color_data is not specified, this data is used to determine data cell background colors as well. */
  sizeData?: SheetsChartData
  /** The data that determines the background color of each treemap data cell. This field is optional. If not specified, size_data is used to determine background colors. If specified, the data is expected to be numeric. color_scale will determine how the values in this data map to data cell background colors. */
  colorData?: SheetsChartData
  /** The maximum possible data value. Cells with values greater than this will have the same color as cells with this value. If not specified, defaults to the actual maximum value from color_data, or the maximum value from size_data if color_data is not specified. */
  maxValue?: number
  /** The background color for header cells. Deprecated: Use header_color_style. */
  headerColor?: SheetsColor
}

/** Criteria for showing or hiding rows in a filter or filter view. */
export type SheetsFilterCriteria = {
  /** The foreground color to filter by; only cells with this foreground color are shown. Mutually exclusive with visible_background_color. Deprecated: Use visible_foreground_color_style. */
  visibleForegroundColor?: SheetsColor
  /** The background fill color to filter by; only cells with this fill color are shown. Mutually exclusive with visible_foreground_color. Deprecated: Use visible_background_color_style. */
  visibleBackgroundColor?: SheetsColor
  /** The background fill color to filter by; only cells with this fill color are shown. This field is mutually exclusive with visible_foreground_color, and must be set to an RGB-type color. If visible_background_color is also set, this field takes precedence. */
  visibleBackgroundColorStyle?: SheetsColorStyle
  /** Values that should be hidden. */
  hiddenValues?: Array<string>
  /** The foreground color to filter by; only cells with this foreground color are shown. This field is mutually exclusive with visible_background_color, and must be set to an RGB-type color. If visible_foreground_color is also set, this field takes precedence. */
  visibleForegroundColorStyle?: SheetsColorStyle
  /** A condition that must be `true` for values to be shown. (This does not override hidden_values -- if a value is listed there, it will still be hidden.) */
  condition?: SheetsBooleanCondition
}

/** A chart embedded in a sheet. */
export type SheetsEmbeddedChart = {
  /** The ID of the chart. */
  chartId?: number
  /** The specification of the chart. */
  spec?: SheetsChartSpec
  /** The border of the chart. */
  border?: SheetsEmbeddedObjectBorder
  /** The position of the chart. */
  position?: SheetsEmbeddedObjectPosition
}

/** Represents a color in the RGBA color space. This representation is designed for simplicity of conversion to and from color representations in various languages over compactness. For example, the fields of this representation can be trivially provided to the constructor of `java.awt.Color` in Java; it can also be trivially provided to UIColor's `+colorWithRed:green:blue:alpha` method in iOS; and, with just a little work, it can be easily formatted into a CSS `rgba()` string in JavaScript. This reference page doesn't have information about the absolute color space that should be used to interpret the RGB value—for example, sRGB, Adobe RGB, DCI-P3, and BT.2020. By default, applications should assume the sRGB color space. When color equality needs to be decided, implementations, unless documented otherwise, treat two colors as equal if all their red, green, blue, and alpha values each differ by at most `1e-5`. Example (Java): import com.google.type.Color; // ... public static java.awt.Color fromProto(Color protocolor) { float alpha = protocolor.hasAlpha() ? protocolor.getAlpha().getValue() : 1.0; return new java.awt.Color( protocolor.getRed(), protocolor.getGreen(), protocolor.getBlue(), alpha); } public static Color toProto(java.awt.Color color) { float red = (float) color.getRed(); float green = (float) color.getGreen(); float blue = (float) color.getBlue(); float denominator = 255.0; Color.Builder resultBuilder = Color .newBuilder() .setRed(red / denominator) .setGreen(green / denominator) .setBlue(blue / denominator); int alpha = color.getAlpha(); if (alpha != 255) { result.setAlpha( FloatValue .newBuilder() .setValue(((float) alpha) / denominator) .build()); } return resultBuilder.build(); } // ... Example (iOS / Obj-C): // ... static UIColor* fromProto(Color* protocolor) { float red = [protocolor red]; float green = [protocolor green]; float blue = [protocolor blue]; FloatValue* alpha_wrapper = [protocolor alpha]; float alpha = 1.0; if (alpha_wrapper != nil) { alpha = [alpha_wrapper value]; } return [UIColor colorWithRed:red green:green blue:blue alpha:alpha]; } static Color* toProto(UIColor* color) { CGFloat red, green, blue, alpha; if (![color getRed:&red green:&green blue:&blue alpha:&alpha]) { return nil; } Color* result = [[Color alloc] init]; [result setRed:red]; [result setGreen:green]; [result setBlue:blue]; if (alpha <= 0.9999) { [result setAlpha:floatWrapperWithValue(alpha)]; } [result autorelease]; return result; } // ... Example (JavaScript): // ... var protoToCssColor = function(rgb_color) { var redFrac = rgb_color.red || 0.0; var greenFrac = rgb_color.green || 0.0; var blueFrac = rgb_color.blue || 0.0; var red = Math.floor(redFrac * 255); var green = Math.floor(greenFrac * 255); var blue = Math.floor(blueFrac * 255); if (!('alpha' in rgb_color)) { return rgbToCssColor(red, green, blue); } var alphaFrac = rgb_color.alpha.value || 0.0; var rgbParams = [red, green, blue].join(','); return ['rgba(', rgbParams, ',', alphaFrac, ')'].join(''); }; var rgbToCssColor = function(red, green, blue) { var rgbNumber = new Number((red << 16) | (green << 8) | blue); var hexString = rgbNumber.toString(16); var missingZeros = 6 - hexString.length; var resultBuilder = ['#']; for (var i = 0; i < missingZeros; i++) { resultBuilder.push('0'); } resultBuilder.push(hexString); return resultBuilder.join(''); }; // ... */
export type SheetsColor = {
  /** The amount of green in the color as a value in the interval [0, 1]. */
  green?: number
  /** The amount of blue in the color as a value in the interval [0, 1]. */
  blue?: number
  /** The fraction of this color that should be applied to the pixel. That is, the final pixel color is defined by the equation: `pixel color = alpha * (this color) + (1.0 - alpha) * (background color)` This means that a value of 1.0 corresponds to a solid color, whereas a value of 0.0 corresponds to a completely transparent color. This uses a wrapper message rather than a simple float scalar so that it is possible to distinguish between a default value and the value being unset. If omitted, this color object is rendered as a solid color (as if the alpha value had been explicitly given a value of 1.0). */
  alpha?: number
  /** The amount of red in the color as a value in the interval [0, 1]. */
  red?: number
}

/** Cancels one or multiple refreshes of data source objects in the spreadsheet by the specified references. The request requires an additional `bigquery.readonly` OAuth scope if you are cancelling a refresh on a BigQuery data source. */
export type SheetsCancelDataSourceRefreshRequest = {
  /** References to data source objects whose refreshes are to be cancelled. */
  references?: SheetsDataSourceObjectReferences
  /** Reference to a DataSource. If specified, cancels all associated data source object refreshes for this data source. */
  dataSourceId?: string
  /** Cancels all existing data source object refreshes for all data sources in the spreadsheet. */
  isAll?: boolean
}

/** Deletes a particular filter view. */
export type SheetsDeleteFilterViewRequest = {
  /** The ID of the filter to delete. */
  filterId?: number
}

/** Additional properties of a DATA_SOURCE sheet. */
export type SheetsDataSourceSheetProperties = {
  /** The columns displayed on the sheet, corresponding to the values in RowData. */
  columns?: Array<SheetsDataSourceColumn>
  /** ID of the DataSource the sheet is connected to. */
  dataSourceId?: string
  /** The data execution status. */
  dataExecutionStatus?: SheetsDataExecutionStatus
}

/** The result of adding a new protected range. */
export type SheetsAddProtectedRangeResponse = {
  /** The newly added protected range. */
  protectedRange?: SheetsProtectedRange
}

/** The request for clearing more than one range selected by a DataFilter in a spreadsheet. */
export type SheetsBatchClearValuesByDataFilterRequest = {
  /** The DataFilters used to determine which ranges to clear. */
  dataFilters?: Array<SheetsDataFilter>
}

/** The borders of the cell. */
export type SheetsBorders = {
  /** The left border of the cell. */
  left?: SheetsBorder
  /** The right border of the cell. */
  right?: SheetsBorder
  /** The top border of the cell. */
  top?: SheetsBorder
  /** The bottom border of the cell. */
  bottom?: SheetsBorder
}

/** A request to retrieve all developer metadata matching the set of specified criteria. */
export type SheetsSearchDeveloperMetadataRequest = {
  /** The data filters describing the criteria used to determine which DeveloperMetadata entries to return. DeveloperMetadata matching any of the specified filters are included in the response. */
  dataFilters?: Array<SheetsDataFilter>
}

/** The response when clearing a range of values in a spreadsheet. */
export type SheetsClearValuesResponse = {
  /** The range (in A1 notation) that was cleared. (If the request was for an unbounded range or a range larger than the bounds of the sheet, this will be the actual range that was cleared, bounded to the sheet's limits.) */
  clearedRange?: string
  /** The spreadsheet the updates were applied to. */
  spreadsheetId?: string
}

/** A single grouping (either row or column) in a pivot table. */
export type SheetsPivotGroup = {
  /** True if the headings in this pivot group should be repeated. This is only valid for row groupings and is ignored by columns. By default, we minimize repetition of headings by not showing higher level headings where they are the same. For example, even though the third row below corresponds to "Q1 Mar", "Q1" is not shown because it is redundant with previous rows. Setting repeat_headings to true would cause "Q1" to be repeated for "Feb" and "Mar". +--------------+ | Q1 | Jan | | | Feb | | | Mar | +--------+-----+ | Q1 Total | +--------------+ */
  repeatHeadings?: boolean
  /** The group rule to apply to this row/column group. */
  groupRule?: SheetsPivotGroupRule
  /** The reference to the data source column this grouping is based on. */
  dataSourceColumnReference?: SheetsDataSourceColumnReference
  /** True if the pivot table should include the totals for this grouping. */
  showTotals?: boolean
  /** The column offset of the source range that this grouping is based on. For example, if the source was `C10:E15`, a `sourceColumnOffset` of `0` means this group refers to column `C`, whereas the offset `1` would refer to column `D`. */
  sourceColumnOffset?: number
  /** The count limit on rows or columns to apply to this pivot group. */
  groupLimit?: SheetsPivotGroupLimit
  /** The bucket of the opposite pivot group to sort by. If not specified, sorting is alphabetical by this group's values. */
  valueBucket?: SheetsPivotGroupSortValueBucket
  /** The labels to use for the row/column groups which can be customized. For example, in the following pivot table, the row label is `Region` (which could be renamed to `State`) and the column label is `Product` (which could be renamed `Item`). Pivot tables created before December 2017 do not have header labels. If you'd like to add header labels to an existing pivot table, please delete the existing pivot table and then create a new pivot table with same parameters. +--------------+---------+-------+ | SUM of Units | Product | | | Region | Pen | Paper | +--------------+---------+-------+ | New York | 345 | 98 | | Oregon | 234 | 123 | | Tennessee | 531 | 415 | +--------------+---------+-------+ | Grand Total | 1110 | 636 | +--------------+---------+-------+ */
  label?: string
  /** The order the values in this group should be sorted. */
  sortOrder?: "SORT_ORDER_UNSPECIFIED" | "ASCENDING" | "DESCENDING"
  /** Metadata about values in the grouping. */
  valueMetadata?: Array<SheetsPivotGroupValueMetadata>
}

/** A range on a sheet. All indexes are zero-based. Indexes are half open, i.e. the start index is inclusive and the end index is exclusive -- [start_index, end_index). Missing indexes indicate the range is unbounded on that side. For example, if `"Sheet1"` is sheet ID 123456, then: `Sheet1!A1:A1 == sheet_id: 123456, start_row_index: 0, end_row_index: 1, start_column_index: 0, end_column_index: 1` `Sheet1!A3:B4 == sheet_id: 123456, start_row_index: 2, end_row_index: 4, start_column_index: 0, end_column_index: 2` `Sheet1!A:B == sheet_id: 123456, start_column_index: 0, end_column_index: 2` `Sheet1!A5:B == sheet_id: 123456, start_row_index: 4, start_column_index: 0, end_column_index: 2` `Sheet1 == sheet_id: 123456` The start index must always be less than or equal to the end index. If the start index equals the end index, then the range is empty. Empty ranges are typically not meaningful and are usually rendered in the UI as `#REF!`. */
export type SheetsGridRange = {
  /** The sheet this range is on. */
  sheetId?: number
  /** The end column (exclusive) of the range, or not set if unbounded. */
  endColumnIndex?: number
  /** The end row (exclusive) of the range, or not set if unbounded. */
  endRowIndex?: number
  /** The start row (inclusive) of the range, or not set if unbounded. */
  startRowIndex?: number
  /** The start column (inclusive) of the range, or not set if unbounded. */
  startColumnIndex?: number
}

/** Represents a time interval, encoded as a Timestamp start (inclusive) and a Timestamp end (exclusive). The start must be less than or equal to the end. When the start equals the end, the interval is empty (matches no time). When both start and end are unspecified, the interval matches any time. */
export type SheetsInterval = {
  /** Optional. Exclusive end of the interval. If specified, a Timestamp matching this interval will have to be before the end. */
  endTime?: string
  /** Optional. Inclusive start of the interval. If specified, a Timestamp matching this interval will have to be the same or after the start. */
  startTime?: string
}

/** Automatically resizes one or more dimensions based on the contents of the cells in that dimension. */
export type SheetsAutoResizeDimensionsRequest = {
  /** The dimensions to automatically resize. */
  dimensions?: SheetsDimensionRange
  /** The dimensions on a data source sheet to automatically resize. */
  dataSourceSheetDimensions?: SheetsDataSourceSheetDimensionRange
}

/** Reference to a data source object. */
export type SheetsDataSourceObjectReference = {
  /** References to a DataSourceTable anchored at the cell. */
  dataSourceTableAnchorCell?: SheetsGridCoordinate
  /** References to a data source chart. */
  chartId?: number
  /** References to a DATA_SOURCE sheet. */
  sheetId?: string
  /** References to a data source PivotTable anchored at the cell. */
  dataSourcePivotTableAnchorCell?: SheetsGridCoordinate
  /** References to a cell containing DataSourceFormula. */
  dataSourceFormulaCell?: SheetsGridCoordinate
}

/** The result of adding a sheet. */
export type SheetsAddSheetResponse = {
  /** The properties of the newly added sheet. */
  properties?: SheetsSheetProperties
}

/** Updates properties of dimensions within the specified range. */
export type SheetsUpdateDimensionPropertiesRequest = {
  /** Properties to update. */
  properties?: SheetsDimensionProperties
  /** The fields that should be updated. At least one field must be specified. The root `properties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
  /** The rows or columns to update. */
  range?: SheetsDimensionRange
  /** The columns on a data source sheet to update. */
  dataSourceSheetRange?: SheetsDataSourceSheetDimensionRange
}

/** Custom number formatting options for chart attributes. */
export type SheetsChartCustomNumberFormatOptions = {
  /** Custom prefix to be prepended to the chart attribute. This field is optional. */
  prefix?: string
  /** Custom suffix to be appended to the chart attribute. This field is optional. */
  suffix?: string
}

/** The response from updating developer metadata. */
export type SheetsUpdateDeveloperMetadataResponse = {
  /** The updated developer metadata. */
  developerMetadata?: Array<SheetsDeveloperMetadata>
}

/** The result of deleting a conditional format rule. */
export type SheetsDeleteConditionalFormatRuleResponse = {
  /** The rule that was deleted. */
  rule?: SheetsConditionalFormatRule
}

/** The result of updating a conditional format rule. */
export type SheetsUpdateConditionalFormatRuleResponse = {
  /** The old index of the rule. Not set if a rule was replaced (because it is the same as new_index). */
  oldIndex?: number
  /** The index of the new rule. */
  newIndex?: number
  /** The old (deleted) rule. Not set if a rule was moved (because it is the same as new_rule). */
  oldRule?: SheetsConditionalFormatRule
  /** The new rule that replaced the old rule (if replacing), or the rule that was moved (if moved) */
  newRule?: SheetsConditionalFormatRule
}

/** A histogram chart. A histogram chart groups data items into bins, displaying each bin as a column of stacked items. Histograms are used to display the distribution of a dataset. Each column of items represents a range into which those items fall. The number of bins can be chosen automatically or specified explicitly. */
export type SheetsHistogramChartSpec = {
  /** The outlier percentile is used to ensure that outliers do not adversely affect the calculation of bucket sizes. For example, setting an outlier percentile of 0.05 indicates that the top and bottom 5% of values when calculating buckets. The values are still included in the chart, they will be added to the first or last buckets instead of their own buckets. Must be between 0.0 and 0.5. */
  outlierPercentile?: number
  /** The series for a histogram may be either a single series of values to be bucketed or multiple series, each of the same length, containing the name of the series followed by the values to be bucketed for that series. */
  series?: Array<SheetsHistogramSeries>
  /** Whether horizontal divider lines should be displayed between items in each column. */
  showItemDividers?: boolean
  /** By default the bucket size (the range of values stacked in a single column) is chosen automatically, but it may be overridden here. E.g., A bucket size of 1.5 results in buckets from 0 - 1.5, 1.5 - 3.0, etc. Cannot be negative. This field is optional. */
  bucketSize?: number
  /** The position of the chart legend. */
  legendPosition?:
    | "HISTOGRAM_CHART_LEGEND_POSITION_UNSPECIFIED"
    | "BOTTOM_LEGEND"
    | "LEFT_LEGEND"
    | "RIGHT_LEGEND"
    | "TOP_LEGEND"
    | "NO_LEGEND"
    | "INSIDE_LEGEND"
}

/** Deletes the embedded object with the given ID. */
export type SheetsDeleteEmbeddedObjectRequest = {
  /** The ID of the embedded object to delete. */
  objectId?: number
}

/** A group over an interval of rows or columns on a sheet, which can contain or be contained within other groups. A group can be collapsed or expanded as a unit on the sheet. */
export type SheetsDimensionGroup = {
  /** This field is true if this group is collapsed. A collapsed group remains collapsed if an overlapping group at a shallower depth is expanded. A true value does not imply that all dimensions within the group are hidden, since a dimension's visibility can change independently from this group property. However, when this property is updated, all dimensions within it are set to hidden if this field is true, or set to visible if this field is false. */
  collapsed?: boolean
  /** The range over which this group exists. */
  range?: SheetsDimensionRange
  /** The depth of the group, representing how many groups have a range that wholly contains the range of this group. */
  depth?: number
}

/** The result of the find/replace. */
export type SheetsFindReplaceResponse = {
  /** The number of rows changed. */
  rowsChanged?: number
  /** The number of sheets changed. */
  sheetsChanged?: number
  /** The number of formula cells changed. */
  formulasChanged?: number
  /** The number of occurrences (possibly multiple within a cell) changed. For example, if replacing `"e"` with `"o"` in `"Google Sheets"`, this would be `"3"` because `"Google Sheets"` -> `"Googlo Shoots"`. */
  occurrencesChanged?: number
  /** The number of non-formula cells changed. */
  valuesChanged?: number
}

/** Styles for a waterfall chart column. */
export type SheetsWaterfallChartColumnStyle = {
  /** The label of the column's legend. */
  label?: string
  /** The color of the column. Deprecated: Use color_style. */
  color?: SheetsColor
  /** The color of the column. If color is also set, this field takes precedence. */
  colorStyle?: SheetsColorStyle
}

/** Creates a group over the specified range. If the requested range is a superset of the range of an existing group G, then the depth of G is incremented and this new group G' has the depth of that group. For example, a group [C:D, depth 1] + [B:E] results in groups [B:E, depth 1] and [C:D, depth 2]. If the requested range is a subset of the range of an existing group G, then the depth of the new group G' becomes one greater than the depth of G. For example, a group [B:E, depth 1] + [C:D] results in groups [B:E, depth 1] and [C:D, depth 2]. If the requested range starts before and ends within, or starts within and ends after, the range of an existing group G, then the range of the existing group G becomes the union of the ranges, and the new group G' has depth one greater than the depth of G and range as the intersection of the ranges. For example, a group [B:D, depth 1] + [C:E] results in groups [B:E, depth 1] and [C:D, depth 2]. */
export type SheetsAddDimensionGroupRequest = {
  /** The range over which to create a group. */
  range?: SheetsDimensionRange
}

/** Updates properties of the supplied banded range. */
export type SheetsUpdateBandingRequest = {
  /** The fields that should be updated. At least one field must be specified. The root `bandedRange` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
  /** The banded range to update with the new properties. */
  bandedRange?: SheetsBandedRange
}

/** A schedule for data to refresh every day in a given time interval. */
export type SheetsDataSourceRefreshDailySchedule = {
  /** The start time of a time interval in which a data source refresh is scheduled. Only `hours` part is used. The time interval size defaults to that in the Sheets editor. */
  startTime?: SheetsTimeOfDay
}

/** The style of a point on the chart. */
export type SheetsPointStyle = {
  /** The point size. If empty, a default size is used. */
  size?: number
  /** The point shape. If empty or unspecified, a default shape is used. */
  shape?:
    | "POINT_SHAPE_UNSPECIFIED"
    | "CIRCLE"
    | "DIAMOND"
    | "HEXAGON"
    | "PENTAGON"
    | "SQUARE"
    | "STAR"
    | "TRIANGLE"
    | "X_MARK"
}

/** Removes the table with the given ID from the spreadsheet. */
export type SheetsDeleteTableRequest = {
  /** The ID of the table to delete. */
  tableId?: string
}

/** The response from deleting developer metadata. */
export type SheetsDeleteDeveloperMetadataResponse = {
  /** The metadata that was deleted. */
  deletedDeveloperMetadata?: Array<SheetsDeveloperMetadata>
}

/** Removes the named range with the given ID from the spreadsheet. */
export type SheetsDeleteNamedRangeRequest = {
  /** The ID of the named range to delete. */
  namedRangeId?: string
}

/** Formatting options for baseline value. */
export type SheetsBaselineValueFormat = {
  /** The comparison type of key value with baseline value. */
  comparisonType?: "COMPARISON_TYPE_UNDEFINED" | "ABSOLUTE_DIFFERENCE" | "PERCENTAGE_DIFFERENCE"
  /** Color to be used, in case baseline value represents a negative change for key value. This field is optional. Deprecated: Use negative_color_style. */
  negativeColor?: SheetsColor
  /** Description which is appended after the baseline value. This field is optional. */
  description?: string
  /** Specifies the horizontal text positioning of baseline value. This field is optional. If not specified, default positioning is used. */
  position?: SheetsTextPosition
  /** Text formatting options for baseline value. The link field is not supported. */
  textFormat?: SheetsTextFormat
  /** Color to be used, in case baseline value represents a positive change for key value. This field is optional. If positive_color is also set, this field takes precedence. */
  positiveColorStyle?: SheetsColorStyle
  /** Color to be used, in case baseline value represents a negative change for key value. This field is optional. If negative_color is also set, this field takes precedence. */
  negativeColorStyle?: SheetsColorStyle
  /** Color to be used, in case baseline value represents a positive change for key value. This field is optional. Deprecated: Use positive_color_style. */
  positiveColor?: SheetsColor
}

/** Fills in more data based on existing data. */
export type SheetsAutoFillRequest = {
  /** The source and destination areas to autofill. This explicitly lists the source of the autofill and where to extend that data. */
  sourceAndDestination?: SheetsSourceAndDestination
  /** True if we should generate data with the "alternate" series. This differs based on the type and amount of source data. */
  useAlternateSeries?: boolean
  /** The range to autofill. This will examine the range and detect the location that has data and automatically fill that data in to the rest of the range. */
  range?: SheetsGridRange
}

/** Properties of a sheet. */
export type SheetsSheetProperties = {
  /** The name of the sheet. */
  title?: string
  /** True if the sheet is an RTL sheet instead of an LTR sheet. */
  rightToLeft?: boolean
  /** True if the sheet is hidden in the UI, false if it's visible. */
  hidden?: boolean
  /** The ID of the sheet. Must be non-negative. This field cannot be changed once set. */
  sheetId?: number
  /** Additional properties of the sheet if this sheet is a grid. (If the sheet is an object sheet, containing a chart or image, then this field will be absent.) When writing it is an error to set any grid properties on non-grid sheets. If this sheet is a DATA_SOURCE sheet, this field is output only but contains the properties that reflect how a data source sheet is rendered in the UI, e.g. row_count. */
  gridProperties?: SheetsGridProperties
  /** Output only. If present, the field contains DATA_SOURCE sheet specific properties. */
  dataSourceSheetProperties?: SheetsDataSourceSheetProperties
  /** The index of the sheet within the spreadsheet. When adding or updating sheet properties, if this field is excluded then the sheet is added or moved to the end of the sheet list. When updating sheet indices or inserting sheets, movement is considered in "before the move" indexes. For example, if there were three sheets (S1, S2, S3) in order to move S1 ahead of S2 the index would have to be set to 2. A sheet index update request is ignored if the requested index is identical to the sheets current index or if the requested new index is equal to the current sheet index + 1. */
  index?: number
  /** The color of the tab in the UI. If tab_color is also set, this field takes precedence. */
  tabColorStyle?: SheetsColorStyle
  /** The color of the tab in the UI. Deprecated: Use tab_color_style. */
  tabColor?: SheetsColor
  /** The type of sheet. Defaults to GRID. This field cannot be changed once set. */
  sheetType?: "SHEET_TYPE_UNSPECIFIED" | "GRID" | "OBJECT" | "DATA_SOURCE"
}

/** A banded (alternating colors) range in a sheet. */
export type SheetsBandedRange = {
  /** Output only. The reference of the banded range, used to identify the ID that is not supported by the banded_range_id. */
  bandedRangeReference?: string
  /** Properties for column bands. These properties are applied on a column- by-column basis throughout all the columns in the range. At least one of row_properties or column_properties must be specified. */
  columnProperties?: SheetsBandingProperties
  /** Properties for row bands. These properties are applied on a row-by-row basis throughout all the rows in the range. At least one of row_properties or column_properties must be specified. */
  rowProperties?: SheetsBandingProperties
  /** The range over which these properties are applied. */
  range?: SheetsGridRange
  /** The ID of the banded range. If unset, refer to banded_range_reference. */
  bandedRangeId?: number
}

/** A named range. */
export type SheetsNamedRange = {
  /** The range this represents. */
  range?: SheetsGridRange
  /** The name of the named range. */
  name?: string
  /** The ID of the named range. */
  namedRangeId?: string
}

/** Style override settings for a single series data point. */
export type SheetsBasicSeriesDataPointStyleOverride = {
  /** The zero-based index of the series data point. */
  index?: number
  /** Point style of the series data point. Valid only if the chartType is AREA, LINE, or SCATTER. COMBO charts are also supported if the series chart type is AREA, LINE, or SCATTER. If empty, the series default is used. */
  pointStyle?: SheetsPointStyle
  /** Color of the series data point. If empty, the series default is used. If color is also set, this field takes precedence. */
  colorStyle?: SheetsColorStyle
  /** Color of the series data point. If empty, the series default is used. Deprecated: Use color_style. */
  color?: SheetsColor
}

/** Randomizes the order of the rows in a range. */
export type SheetsRandomizeRangeRequest = {
  /** The range to randomize. */
  range?: SheetsGridRange
}

/** Adds new cells after the last row with data in a sheet, inserting new rows into the sheet if necessary. */
export type SheetsAppendCellsRequest = {
  /** The sheet ID to append the data to. */
  sheetId?: number
  /** The ID of the table to append data to. The data will be only appended to the table body. This field also takes precedence over the `sheet_id` field. */
  tableId?: string
  /** The data to append. */
  rows?: Array<SheetsRowData>
  /** The fields of CellData that should be updated. At least one field must be specified. The root is the CellData; 'row.values.' should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** Properties referring a single dimension (either row or column). If both BandedRange.row_properties and BandedRange.column_properties are set, the fill colors are applied to cells according to the following rules: * header_color and footer_color take priority over band colors. * first_band_color takes priority over second_band_color. * row_properties takes priority over column_properties. For example, the first row color takes priority over the first column color, but the first column color takes priority over the second row color. Similarly, the row header takes priority over the column header in the top left cell, but the column header takes priority over the first row color if the row header is not set. */
export type SheetsBandingProperties = {
  /** The color of the last row or column. If this field is not set, the last row or column is filled with either first_band_color or second_band_color, depending on the color of the previous row or column. Deprecated: Use footer_color_style. */
  footerColor?: SheetsColor
  /** The first color that is alternating. (Required) Deprecated: Use first_band_color_style. */
  firstBandColor?: SheetsColor
  /** The first color that is alternating. (Required) If first_band_color is also set, this field takes precedence. */
  firstBandColorStyle?: SheetsColorStyle
  /** The second color that is alternating. (Required) Deprecated: Use second_band_color_style. */
  secondBandColor?: SheetsColor
  /** The color of the first row or column. If this field is set, the first row or column is filled with this color and the colors alternate between first_band_color and second_band_color starting from the second row or column. Otherwise, the first row or column is filled with first_band_color and the colors proceed to alternate as they normally would. If header_color is also set, this field takes precedence. */
  headerColorStyle?: SheetsColorStyle
  /** The color of the last row or column. If this field is not set, the last row or column is filled with either first_band_color or second_band_color, depending on the color of the previous row or column. If footer_color is also set, this field takes precedence. */
  footerColorStyle?: SheetsColorStyle
  /** The color of the first row or column. If this field is set, the first row or column is filled with this color and the colors alternate between first_band_color and second_band_color starting from the second row or column. Otherwise, the first row or column is filled with first_band_color and the colors proceed to alternate as they normally would. Deprecated: Use header_color_style. */
  headerColor?: SheetsColor
  /** The second color that is alternating. (Required) If second_band_color is also set, this field takes precedence. */
  secondBandColorStyle?: SheetsColorStyle
}

/** Removes the banded range with the given ID from the spreadsheet. */
export type SheetsDeleteBandingRequest = {
  /** The ID of the banded range to delete. */
  bandedRangeId?: number
}

/** The definition of how a value in a pivot table should be calculated. */
export type SheetsPivotValue = {
  /** A custom formula to calculate the value. The formula must start with an `=` character. */
  formula?: string
  /** If specified, indicates that pivot values should be displayed as the result of a calculation with another pivot value. For example, if calculated_display_type is specified as PERCENT_OF_GRAND_TOTAL, all the pivot values are displayed as the percentage of the grand total. In the Sheets editor, this is referred to as "Show As" in the value section of a pivot table. */
  calculatedDisplayType?:
    | "PIVOT_VALUE_CALCULATED_DISPLAY_TYPE_UNSPECIFIED"
    | "PERCENT_OF_ROW_TOTAL"
    | "PERCENT_OF_COLUMN_TOTAL"
    | "PERCENT_OF_GRAND_TOTAL"
  /** The reference to the data source column that this value reads from. */
  dataSourceColumnReference?: SheetsDataSourceColumnReference
  /** A function to summarize the value. If formula is set, the only supported values are SUM and CUSTOM. If sourceColumnOffset is set, then `CUSTOM` is not supported. */
  summarizeFunction?:
    | "PIVOT_STANDARD_VALUE_FUNCTION_UNSPECIFIED"
    | "SUM"
    | "COUNTA"
    | "COUNT"
    | "COUNTUNIQUE"
    | "AVERAGE"
    | "MAX"
    | "MIN"
    | "MEDIAN"
    | "PRODUCT"
    | "STDEV"
    | "STDEVP"
    | "VAR"
    | "VARP"
    | "CUSTOM"
    | "NONE"
  /** The column offset of the source range that this value reads from. For example, if the source was `C10:E15`, a `sourceColumnOffset` of `0` means this value refers to column `C`, whereas the offset `1` would refer to column `D`. */
  sourceColumnOffset?: number
  /** A name to use for the value. */
  name?: string
}

/** A data validation rule for a column in a table. */
export type SheetsTableColumnDataValidationRule = {
  /** The condition that data in the cell must match. Valid only if the [BooleanCondition.type] is ONE_OF_LIST. */
  condition?: SheetsBooleanCondition
}

/** The request for retrieving a range of values in a spreadsheet selected by a set of DataFilters. */
export type SheetsBatchGetValuesByDataFilterRequest = {
  /** How values should be represented in the output. The default render option is FORMATTED_VALUE. */
  valueRenderOption?: "FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA"
  /** The data filters used to match the ranges of values to retrieve. Ranges that match any of the specified data filters are included in the response. */
  dataFilters?: Array<SheetsDataFilter>
  /** The major dimension that results should use. For example, if the spreadsheet data is: `A1=1,B1=2,A2=3,B2=4`, then a request that selects that range and sets `majorDimension=ROWS` returns `[[1,2],[3,4]]`, whereas a request that sets `majorDimension=COLUMNS` returns `[[1,3],[2,4]]`. */
  majorDimension?: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS"
  /** How dates, times, and durations should be represented in the output. This is ignored if value_render_option is FORMATTED_VALUE. The default dateTime render option is SERIAL_NUMBER. */
  dateTimeRenderOption?: "SERIAL_NUMBER" | "FORMATTED_STRING"
}

/** The kinds of value that a cell in a spreadsheet can have. */
export type SheetsExtendedValue = {
  /** Represents an error. This field is read-only. */
  errorValue?: SheetsErrorValue
  /** Represents a boolean value. */
  boolValue?: boolean
  /** Represents a string value. Leading single quotes are not included. For example, if the user typed `'123` into the UI, this would be represented as a `stringValue` of `"123"`. */
  stringValue?: string
  /** Represents a formula. */
  formulaValue?: string
  /** Represents a double value. Note: Dates, Times and DateTimes are represented as doubles in SERIAL_NUMBER format. */
  numberValue?: number
}

/** Updates properties of the sheet with the specified sheetId. */
export type SheetsUpdateSheetPropertiesRequest = {
  /** The properties to update. */
  properties?: SheetsSheetProperties
  /** The fields that should be updated. At least one field must be specified. The root `properties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** Update an embedded object's position (such as a moving or resizing a chart or image). */
export type SheetsUpdateEmbeddedObjectPositionRequest = {
  /** The ID of the object to moved. */
  objectId?: number
  /** An explicit position to move the embedded object to. If newPosition.sheetId is set, a new sheet with that ID will be created. If newPosition.newSheet is set to true, a new sheet will be created with an ID that will be chosen for you. */
  newPosition?: SheetsEmbeddedObjectPosition
  /** The fields of OverlayPosition that should be updated when setting a new position. Used only if newPosition.overlayPosition is set, in which case at least one field must be specified. The root `newPosition.overlayPosition` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
}

/** Updates a data source. After the data source is updated successfully, an execution is triggered to refresh the associated DATA_SOURCE sheet to read data from the updated data source. The request requires an additional `bigquery.readonly` OAuth scope if you are updating a BigQuery data source. */
export type SheetsUpdateDataSourceRequest = {
  /** The fields that should be updated. At least one field must be specified. The root `dataSource` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. */
  fields?: string
  /** The data source to update. */
  dataSource?: SheetsDataSource
}

/** Finds and replaces data in cells over a range, sheet, or all sheets. */
export type SheetsFindReplaceRequest = {
  /** The range to find/replace over. */
  range?: SheetsGridRange
  /** True if the search is case sensitive. */
  matchCase?: boolean
  /** The value to search. */
  find?: string
  /** True to find/replace over all sheets. */
  allSheets?: boolean
  /** True if the search should include cells with formulas. False to skip cells with formulas. */
  includeFormulas?: boolean
  /** The value to use as the replacement. */
  replacement?: string
  /** True if the find value is a regex. The regular expression and replacement should follow Java regex rules at https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html. The replacement string is allowed to refer to capturing groups. For example, if one cell has the contents `"Google Sheets"` and another has `"Google Docs"`, then searching for `"o.* (.*)"` with a replacement of `"$1 Rocks"` would change the contents of the cells to `"GSheets Rocks"` and `"GDocs Rocks"` respectively. */
  searchByRegex?: boolean
  /** The sheet to find/replace over. */
  sheetId?: number
  /** True if the find value should match the entire cell. */
  matchEntireCell?: boolean
}

/** Filter that describes what data should be selected or returned from a request. For more information, see [Read, write, and search metadata](https://developers.google.com/workspace/sheets/api/guides/metadata). */
export type SheetsDataFilter = {
  /** Selects data that matches the specified A1 range. */
  a1Range?: string
  /** Selects data that matches the range described by the GridRange. */
  gridRange?: SheetsGridRange
  /** Selects data associated with the developer metadata matching the criteria described by this DeveloperMetadataLookup. */
  developerMetadataLookup?: SheetsDeveloperMetadataLookup
}

/** Sets a data validation rule to every cell in the range. To clear validation in a range, call this with no rule specified. */
export type SheetsSetDataValidationRequest = {
  /** The range the data validation rule should apply to. */
  range?: SheetsGridRange
  /** The data validation rule to set on each cell in the range, or empty to clear the data validation in the range. */
  rule?: SheetsDataValidationRule
  /** Optional. If true, the data validation rule will be applied to the filtered rows as well. */
  filteredRowsIncluded?: boolean
}

/** A location in the spreadsheet that is tied to a CommentThread with the same anchorId. Note: Multiple anchors may refer to the same location. */
export type SheetsCommentAnchor = {
  /** The unique ID of the comment anchor. Output only. */
  anchorId?: string
  /** The coordinate range inside the sheet where this comment is anchored. */
  range?: SheetsGridRange
}

/** An axis of the chart. A chart may not have more than one axis per axis position. */
export type SheetsBasicChartAxis = {
  /** The view window options for this axis. */
  viewWindowOptions?: SheetsChartAxisViewWindowOptions
  /** The title of this axis. If set, this overrides any title inferred from headers of the data. */
  title?: string
  /** The axis title text position. */
  titleTextPosition?: SheetsTextPosition
  /** The format of the title. Only valid if the axis is not associated with the domain. The link field is not supported. */
  format?: SheetsTextFormat
  /** The position of this axis. */
  position?: "BASIC_CHART_AXIS_POSITION_UNSPECIFIED" | "BOTTOM_AXIS" | "LEFT_AXIS" | "RIGHT_AXIS"
}

/** A request to create developer metadata. */
export type SheetsCreateDeveloperMetadataRequest = {
  /** The developer metadata to create. */
  developerMetadata?: SheetsDeveloperMetadata
}

/** The result of creating a comment. */
export type SheetsInsertCommentResponse = {
  /** The newly-inserted comment thread. */
  commentThread?: SheetsCommentThread
}

/** This specifies the details of the data source. For example, for BigQuery, this specifies information about the BigQuery source. */
export type SheetsDataSourceSpec = {
  /** The parameters of the data source, used when querying the data source. */
  parameters?: Array<SheetsDataSourceParameter>
  /** A BigQueryDataSourceSpec. */
  bigQuery?: SheetsBigQueryDataSourceSpec
  /** A LookerDatasourceSpec. */
  looker?: SheetsLookerDataSourceSpec
}

/** The status of cancelling a single data source object refresh. */
export type SheetsCancelDataSourceRefreshStatus = {
  /** The cancellation status. */
  refreshCancellationStatus?: SheetsRefreshCancellationStatus
  /** Reference to the data source object whose refresh is being cancelled. */
  reference?: SheetsDataSourceObjectReference
}

/** A value range that was matched by one or more data filers. */
export type SheetsMatchedValueRange = {
  /** The values matched by the DataFilter. */
  valueRange?: SheetsValueRange
  /** The DataFilters from the request that matched the range of values. */
  dataFilters?: Array<SheetsDataFilter>
}

/** Adds a filter view. */
export type SheetsAddFilterViewRequest = {
  /** The filter to add. The filterViewId field is optional. If one is not set, an ID will be randomly generated. (It is an error to specify the ID of a filter that already exists.) */
  filter?: SheetsFilterView
}
