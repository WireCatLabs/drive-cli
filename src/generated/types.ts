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
