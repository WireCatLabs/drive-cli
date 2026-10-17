// GENERATED. DO NOT EDIT.
// Source: spec/google/*.json, verified by provenance.json
// Run: pnpm generate

import { integer, number } from "@wirecat/cli-base/codegen/runtime"
import * as v from "valibot"
import type * as T from "./types.js"

export const DriveOperation: v.GenericSchema<unknown, T.DriveOperation> = v.looseObject({
  response: v.optional(v.record(v.string(), v.unknown())),
  metadata: v.optional(v.record(v.string(), v.unknown())),
  error: v.optional(v.lazy(() => DriveStatus)),
  name: v.optional(v.string()),
  done: v.optional(v.boolean()),
})

export const DrivePermission: v.GenericSchema<unknown, T.DrivePermission> = v.looseObject({
  type: v.optional(v.string()),
  permissionDetails: v.optional(
    v.array(
      v.looseObject({
        role: v.optional(v.string()),
        inheritedFrom: v.optional(v.string()),
        inherited: v.optional(v.boolean()),
        permissionType: v.optional(v.string()),
      }),
    ),
  ),
  teamDrivePermissionDetails: v.optional(
    v.array(
      v.looseObject({
        inherited: v.optional(v.boolean()),
        inheritedFrom: v.optional(v.string()),
        teamDrivePermissionType: v.optional(v.string()),
        role: v.optional(v.string()),
      }),
    ),
  ),
  deleted: v.optional(v.boolean()),
  allowFileDiscovery: v.optional(v.boolean()),
  kind: v.optional(v.string()),
  role: v.optional(v.string()),
  id: v.optional(v.string()),
  photoLink: v.optional(v.string()),
  inheritedPermissionsDisabled: v.optional(v.boolean()),
  pendingOwner: v.optional(v.boolean()),
  expirationTime: v.optional(v.string()),
  emailAddress: v.optional(v.string()),
  displayName: v.optional(v.string()),
  domain: v.optional(v.string()),
  view: v.optional(v.string()),
})

export const DriveAddReviewer: v.GenericSchema<unknown, T.DriveAddReviewer> = v.looseObject({
  addedReviewerEmail: v.optional(v.string()),
})

export const DriveTeamDrive: v.GenericSchema<unknown, T.DriveTeamDrive> = v.looseObject({
  capabilities: v.optional(
    v.looseObject({
      canEdit: v.optional(v.boolean()),
      canListChildren: v.optional(v.boolean()),
      canRenameTeamDrive: v.optional(v.boolean()),
      canChangeTeamMembersOnlyRestriction: v.optional(v.boolean()),
      canChangeSharingFoldersRequiresOrganizerPermissionRestriction: v.optional(v.boolean()),
      canReadRevisions: v.optional(v.boolean()),
      canChangeDomainUsersOnlyRestriction: v.optional(v.boolean()),
      canDeleteChildren: v.optional(v.boolean()),
      canChangeDownloadRestriction: v.optional(v.boolean()),
      canResetTeamDriveRestrictions: v.optional(v.boolean()),
      canShare: v.optional(v.boolean()),
      canRename: v.optional(v.boolean()),
      canManageMembers: v.optional(v.boolean()),
      canChangeTeamDriveBackground: v.optional(v.boolean()),
      canChangeCopyRequiresWriterPermissionRestriction: v.optional(v.boolean()),
      canAddChildren: v.optional(v.boolean()),
      canDownload: v.optional(v.boolean()),
      canDeleteTeamDrive: v.optional(v.boolean()),
      canCopy: v.optional(v.boolean()),
      canComment: v.optional(v.boolean()),
      canTrashChildren: v.optional(v.boolean()),
      canRemoveChildren: v.optional(v.boolean()),
    }),
  ),
  id: v.optional(v.string()),
  restrictions: v.optional(
    v.looseObject({
      sharingFoldersRequiresOrganizerPermission: v.optional(v.boolean()),
      teamMembersOnly: v.optional(v.boolean()),
      copyRequiresWriterPermission: v.optional(v.boolean()),
      adminManagedRestrictions: v.optional(v.boolean()),
      downloadRestriction: v.optional(v.lazy(() => DriveDownloadRestriction)),
      domainUsersOnly: v.optional(v.boolean()),
    }),
  ),
  orgUnitId: v.optional(v.string()),
  themeId: v.optional(v.string()),
  name: v.optional(v.string()),
  backgroundImageFile: v.optional(
    v.looseObject({
      width: v.optional(number()),
      id: v.optional(v.string()),
      xCoordinate: v.optional(number()),
      yCoordinate: v.optional(number()),
    }),
  ),
  kind: v.optional(v.string()),
  backgroundImageLink: v.optional(v.string()),
  createdTime: v.optional(v.string()),
  colorRgb: v.optional(v.string()),
})

export const DriveListAccessProposalsResponse: v.GenericSchema<unknown, T.DriveListAccessProposalsResponse> =
  v.looseObject({
    nextPageToken: v.optional(v.string()),
    accessProposals: v.optional(v.array(v.lazy(() => DriveAccessProposal))),
  })

export const DriveReply: v.GenericSchema<unknown, T.DriveReply> = v.looseObject({
  createdTime: v.optional(v.string()),
  mentionedEmailAddresses: v.optional(v.array(v.string())),
  assigneeEmailAddress: v.optional(v.string()),
  content: v.optional(v.string()),
  id: v.optional(v.string()),
  author: v.optional(v.lazy(() => DriveUser)),
  action: v.optional(v.string()),
  deleted: v.optional(v.boolean()),
  kind: v.optional(v.string()),
  modifiedTime: v.optional(v.string()),
  htmlContent: v.optional(v.string()),
})

export const DriveComment: v.GenericSchema<unknown, T.DriveComment> = v.looseObject({
  resolved: v.optional(v.boolean()),
  replies: v.optional(v.array(v.lazy(() => DriveReply))),
  quotedFileContent: v.optional(
    v.looseObject({
      value: v.optional(v.string()),
      mimeType: v.optional(v.string()),
    }),
  ),
  kind: v.optional(v.string()),
  anchor: v.optional(v.string()),
  modifiedTime: v.optional(v.string()),
  htmlContent: v.optional(v.string()),
  author: v.optional(v.lazy(() => DriveUser)),
  content: v.optional(v.string()),
  assigneeEmailAddress: v.optional(v.string()),
  mentionedEmailAddresses: v.optional(v.array(v.string())),
  deleted: v.optional(v.boolean()),
  id: v.optional(v.string()),
  createdTime: v.optional(v.string()),
})

export const DriveChange: v.GenericSchema<unknown, T.DriveChange> = v.looseObject({
  drive: v.optional(v.lazy(() => DriveDrive)),
  kind: v.optional(v.string()),
  removed: v.optional(v.boolean()),
  time: v.optional(v.string()),
  teamDrive: v.optional(v.lazy(() => DriveTeamDrive)),
  driveId: v.optional(v.string()),
  type: v.optional(v.string()),
  teamDriveId: v.optional(v.string()),
  fileId: v.optional(v.string()),
  changeType: v.optional(v.string()),
  file: v.optional(v.lazy(() => DriveFile)),
})

export const DriveDecryptionMetadata: v.GenericSchema<unknown, T.DriveDecryptionMetadata> = v.looseObject({
  kaclsId: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
  jwt: v.optional(v.string()),
  kaclsName: v.optional(v.string()),
  keyFormat: v.optional(v.string()),
  wrappedKey: v.optional(v.string()),
  encryptionResourceKeyHash: v.optional(v.string()),
  aes256GcmChunkSize: v.optional(v.string()),
})

export const DriveLabelFieldModification: v.GenericSchema<unknown, T.DriveLabelFieldModification> = v.looseObject({
  setDateValues: v.optional(v.array(v.string())),
  setTextValues: v.optional(v.array(v.string())),
  setIntegerValues: v.optional(v.array(v.pipe(v.string(), v.regex(/^-?\d+$/)))),
  unsetValues: v.optional(v.boolean()),
  kind: v.optional(v.string()),
  fieldId: v.optional(v.string()),
  setSelectionValues: v.optional(v.array(v.string())),
  setUserValues: v.optional(v.array(v.string())),
})

export const DriveApprovalList: v.GenericSchema<unknown, T.DriveApprovalList> = v.looseObject({
  nextPageToken: v.optional(v.string()),
  items: v.optional(v.array(v.lazy(() => DriveApproval))),
  kind: v.optional(v.string()),
})

export const DriveDriveList: v.GenericSchema<unknown, T.DriveDriveList> = v.looseObject({
  drives: v.optional(v.array(v.lazy(() => DriveDrive))),
  nextPageToken: v.optional(v.string()),
  kind: v.optional(v.string()),
})

export const DriveStartPageToken: v.GenericSchema<unknown, T.DriveStartPageToken> = v.looseObject({
  kind: v.optional(v.string()),
  startPageToken: v.optional(v.string()),
})

export const DriveCommentApprovalRequest: v.GenericSchema<unknown, T.DriveCommentApprovalRequest> = v.looseObject({
  message: v.optional(v.string()),
})

export const DriveDownloadRestriction: v.GenericSchema<unknown, T.DriveDownloadRestriction> = v.looseObject({
  restrictedForWriters: v.optional(v.boolean()),
  restrictedForReaders: v.optional(v.boolean()),
})

export const DriveTeamDriveList: v.GenericSchema<unknown, T.DriveTeamDriveList> = v.looseObject({
  nextPageToken: v.optional(v.string()),
  kind: v.optional(v.string()),
  teamDrives: v.optional(v.array(v.lazy(() => DriveTeamDrive))),
})

export const DriveReassignApprovalRequest: v.GenericSchema<unknown, T.DriveReassignApprovalRequest> = v.looseObject({
  replaceReviewers: v.optional(v.array(v.lazy(() => DriveReplaceReviewer))),
  addReviewers: v.optional(v.array(v.lazy(() => DriveAddReviewer))),
  message: v.optional(v.string()),
})

export const DriveReplaceReviewer: v.GenericSchema<unknown, T.DriveReplaceReviewer> = v.looseObject({
  addedReviewerEmail: v.optional(v.string()),
  removedReviewerEmail: v.optional(v.string()),
})

export const DriveLabelField: v.GenericSchema<unknown, T.DriveLabelField> = v.looseObject({
  dateString: v.optional(v.array(v.string())),
  kind: v.optional(v.string()),
  valueType: v.optional(v.string()),
  id: v.optional(v.string()),
  user: v.optional(v.array(v.lazy(() => DriveUser))),
  text: v.optional(v.array(v.string())),
  integer: v.optional(v.array(v.pipe(v.string(), v.regex(/^-?\d+$/)))),
  selection: v.optional(v.array(v.string())),
})

export const DriveApproval: v.GenericSchema<unknown, T.DriveApproval> = v.looseObject({
  reviewerResponses: v.optional(v.array(v.lazy(() => DriveReviewerResponse))),
  targetFileId: v.optional(v.string()),
  createTime: v.optional(v.string()),
  dueTime: v.optional(v.string()),
  approvalId: v.optional(v.string()),
  kind: v.optional(v.string()),
  status: v.optional(v.picklist(["STATUS_UNSPECIFIED", "IN_PROGRESS", "APPROVED", "CANCELLED", "DECLINED"])),
  modifyTime: v.optional(v.string()),
  fileContentChangeBehavior: v.optional(
    v.picklist(["FILE_CONTENT_CHANGE_BEHAVIOR_UNSPECIFIED", "RESET_APPROVAL", "NO_APPROVAL_ACTION"]),
  ),
  initiator: v.optional(v.lazy(() => DriveUser)),
  completeTime: v.optional(v.string()),
})

export const DriveChangeList: v.GenericSchema<unknown, T.DriveChangeList> = v.looseObject({
  nextPageToken: v.optional(v.string()),
  newStartPageToken: v.optional(v.string()),
  kind: v.optional(v.string()),
  changes: v.optional(v.array(v.lazy(() => DriveChange))),
})

export const DriveDeclineApprovalRequest: v.GenericSchema<unknown, T.DriveDeclineApprovalRequest> = v.looseObject({
  message: v.optional(v.string()),
})

export const DriveGeneratedIds: v.GenericSchema<unknown, T.DriveGeneratedIds> = v.looseObject({
  ids: v.optional(v.array(v.string())),
  kind: v.optional(v.string()),
  space: v.optional(v.string()),
})

export const DriveClientEncryptionDetails: v.GenericSchema<unknown, T.DriveClientEncryptionDetails> = v.looseObject({
  encryptionState: v.optional(v.string()),
  decryptionMetadata: v.optional(v.lazy(() => DriveDecryptionMetadata)),
})

export const DriveRevisionList: v.GenericSchema<unknown, T.DriveRevisionList> = v.looseObject({
  kind: v.optional(v.string()),
  nextPageToken: v.optional(v.string()),
  revisions: v.optional(v.array(v.lazy(() => DriveRevision))),
})

export const DriveLabelModification: v.GenericSchema<unknown, T.DriveLabelModification> = v.looseObject({
  labelId: v.optional(v.string()),
  kind: v.optional(v.string()),
  removeLabel: v.optional(v.boolean()),
  fieldModifications: v.optional(v.array(v.lazy(() => DriveLabelFieldModification))),
})

export const DriveChannel: v.GenericSchema<unknown, T.DriveChannel> = v.looseObject({
  address: v.optional(v.string()),
  type: v.optional(v.string()),
  id: v.optional(v.string()),
  resourceUri: v.optional(v.string()),
  payload: v.optional(v.boolean()),
  params: v.optional(v.record(v.string(), v.string())),
  expiration: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
  token: v.optional(v.string()),
  resourceId: v.optional(v.string()),
  kind: v.optional(v.string()),
})

export const DriveModifyLabelsResponse: v.GenericSchema<unknown, T.DriveModifyLabelsResponse> = v.looseObject({
  kind: v.optional(v.string()),
  modifiedLabels: v.optional(v.array(v.lazy(() => DriveLabel))),
})

export const DriveReplyList: v.GenericSchema<unknown, T.DriveReplyList> = v.looseObject({
  nextPageToken: v.optional(v.string()),
  kind: v.optional(v.string()),
  replies: v.optional(v.array(v.lazy(() => DriveReply))),
})

export const DriveFileList: v.GenericSchema<unknown, T.DriveFileList> = v.looseObject({
  kind: v.optional(v.string()),
  incompleteSearch: v.optional(v.boolean()),
  nextPageToken: v.optional(v.string()),
  files: v.optional(v.array(v.lazy(() => DriveFile))),
})

export const DriveRevision: v.GenericSchema<unknown, T.DriveRevision> = v.looseObject({
  publishedLink: v.optional(v.string()),
  kind: v.optional(v.string()),
  size: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
  publishedOutsideDomain: v.optional(v.boolean()),
  id: v.optional(v.string()),
  md5Checksum: v.optional(v.string()),
  exportLinks: v.optional(v.record(v.string(), v.string())),
  mimeType: v.optional(v.string()),
  published: v.optional(v.boolean()),
  modifiedTime: v.optional(v.string()),
  publishAuto: v.optional(v.boolean()),
  lastModifyingUser: v.optional(v.lazy(() => DriveUser)),
  originalFilename: v.optional(v.string()),
  keepForever: v.optional(v.boolean()),
})

export const DriveAppIcons: v.GenericSchema<unknown, T.DriveAppIcons> = v.looseObject({
  iconUrl: v.optional(v.string()),
  category: v.optional(v.string()),
  size: v.optional(integer()),
})

export const DriveAccessProposal: v.GenericSchema<unknown, T.DriveAccessProposal> = v.looseObject({
  requesterEmailAddress: v.optional(v.string()),
  recipientEmailAddress: v.optional(v.string()),
  requestMessage: v.optional(v.string()),
  fileId: v.optional(v.string()),
  proposalId: v.optional(v.string()),
  createTime: v.optional(v.string()),
  rolesAndViews: v.optional(v.array(v.lazy(() => DriveAccessProposalRoleAndView))),
})

export const DriveDownloadRestrictionsMetadata: v.GenericSchema<unknown, T.DriveDownloadRestrictionsMetadata> =
  v.looseObject({
    itemDownloadRestriction: v.optional(v.lazy(() => DriveDownloadRestriction)),
    effectiveDownloadRestrictionWithContext: v.optional(v.lazy(() => DriveDownloadRestriction)),
  })

export const DriveUser: v.GenericSchema<unknown, T.DriveUser> = v.looseObject({
  displayName: v.optional(v.string()),
  photoLink: v.optional(v.string()),
  permissionId: v.optional(v.string()),
  me: v.optional(v.boolean()),
  emailAddress: v.optional(v.string()),
  kind: v.optional(v.string()),
})

export const DriveAccessProposalRoleAndView: v.GenericSchema<unknown, T.DriveAccessProposalRoleAndView> = v.looseObject(
  {
    role: v.optional(v.string()),
    view: v.optional(v.string()),
  },
)

export const DriveLabelList: v.GenericSchema<unknown, T.DriveLabelList> = v.looseObject({
  labels: v.optional(v.array(v.lazy(() => DriveLabel))),
  kind: v.optional(v.string()),
  nextPageToken: v.optional(v.string()),
})

export const DriveAppList: v.GenericSchema<unknown, T.DriveAppList> = v.looseObject({
  selfLink: v.optional(v.string()),
  defaultAppIds: v.optional(v.array(v.string())),
  kind: v.optional(v.string()),
  items: v.optional(v.array(v.lazy(() => DriveApp))),
})

export const DriveGenerateCseTokenResponse: v.GenericSchema<unknown, T.DriveGenerateCseTokenResponse> = v.looseObject({
  fileId: v.optional(v.string()),
  currentKaclsName: v.optional(v.string()),
  kind: v.optional(v.string()),
  currentKaclsId: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
  jwt: v.optional(v.string()),
})

export const DriveStatus: v.GenericSchema<unknown, T.DriveStatus> = v.looseObject({
  code: v.optional(integer()),
  details: v.optional(v.array(v.record(v.string(), v.unknown()))),
  message: v.optional(v.string()),
})

export const DrivePermissionList: v.GenericSchema<unknown, T.DrivePermissionList> = v.looseObject({
  permissions: v.optional(v.array(v.lazy(() => DrivePermission))),
  kind: v.optional(v.string()),
  nextPageToken: v.optional(v.string()),
})

export const DriveStartApprovalRequest: v.GenericSchema<unknown, T.DriveStartApprovalRequest> = v.looseObject({
  fileContentChangeBehavior: v.optional(
    v.picklist(["FILE_CONTENT_CHANGE_BEHAVIOR_UNSPECIFIED", "RESET_APPROVAL", "NO_APPROVAL_ACTION"]),
  ),
  reviewerEmails: v.optional(v.array(v.string())),
  lockFile: v.optional(v.boolean()),
  dueTime: v.optional(v.string()),
  message: v.optional(v.string()),
})

export const DriveCommentList: v.GenericSchema<unknown, T.DriveCommentList> = v.looseObject({
  comments: v.optional(v.array(v.lazy(() => DriveComment))),
  nextPageToken: v.optional(v.string()),
  kind: v.optional(v.string()),
})

export const DriveLabel: v.GenericSchema<unknown, T.DriveLabel> = v.looseObject({
  kind: v.optional(v.string()),
  id: v.optional(v.string()),
  fields: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DriveLabelField),
    ),
  ),
  revisionId: v.optional(v.string()),
})

export const DriveCancelApprovalRequest: v.GenericSchema<unknown, T.DriveCancelApprovalRequest> = v.looseObject({
  message: v.optional(v.string()),
})

export const DriveReviewerResponse: v.GenericSchema<unknown, T.DriveReviewerResponse> = v.looseObject({
  kind: v.optional(v.string()),
  reviewer: v.optional(v.lazy(() => DriveUser)),
  response: v.optional(v.picklist(["RESPONSE_UNSPECIFIED", "NO_RESPONSE", "APPROVED", "DECLINED"])),
})

export const DriveContentRestriction: v.GenericSchema<unknown, T.DriveContentRestriction> = v.looseObject({
  systemRestricted: v.optional(v.boolean()),
  restrictingUser: v.optional(v.lazy(() => DriveUser)),
  readOnly: v.optional(v.boolean()),
  ownerRestricted: v.optional(v.boolean()),
  reason: v.optional(v.string()),
  type: v.optional(v.string()),
  restrictionTime: v.optional(v.string()),
})

export const DriveApproveApprovalRequest: v.GenericSchema<unknown, T.DriveApproveApprovalRequest> = v.looseObject({
  message: v.optional(v.string()),
})

export const DriveApp: v.GenericSchema<unknown, T.DriveApp> = v.looseObject({
  longDescription: v.optional(v.string()),
  supportsOfflineCreate: v.optional(v.boolean()),
  primaryFileExtensions: v.optional(v.array(v.string())),
  name: v.optional(v.string()),
  createUrl: v.optional(v.string()),
  authorized: v.optional(v.boolean()),
  useByDefault: v.optional(v.boolean()),
  createInFolderTemplate: v.optional(v.string()),
  icons: v.optional(v.array(v.lazy(() => DriveAppIcons))),
  objectType: v.optional(v.string()),
  id: v.optional(v.string()),
  secondaryMimeTypes: v.optional(v.array(v.string())),
  productId: v.optional(v.string()),
  openUrlTemplate: v.optional(v.string()),
  supportsMultiOpen: v.optional(v.boolean()),
  supportsImport: v.optional(v.boolean()),
  kind: v.optional(v.string()),
  hasDriveWideScope: v.optional(v.boolean()),
  productUrl: v.optional(v.string()),
  secondaryFileExtensions: v.optional(v.array(v.string())),
  installed: v.optional(v.boolean()),
  shortDescription: v.optional(v.string()),
  primaryMimeTypes: v.optional(v.array(v.string())),
  supportsCreate: v.optional(v.boolean()),
})

export const DriveFile: v.GenericSchema<unknown, T.DriveFile> = v.looseObject({
  hasAugmentedPermissions: v.optional(v.boolean()),
  starred: v.optional(v.boolean()),
  trashed: v.optional(v.boolean()),
  sha1Checksum: v.optional(v.string()),
  originalFilename: v.optional(v.string()),
  permissionIds: v.optional(v.array(v.string())),
  modifiedByMeTime: v.optional(v.string()),
  videoMediaMetadata: v.optional(
    v.looseObject({
      durationMillis: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
      width: v.optional(integer()),
      height: v.optional(integer()),
    }),
  ),
  isAppAuthorized: v.optional(v.boolean()),
  shared: v.optional(v.boolean()),
  explicitlyTrashed: v.optional(v.boolean()),
  permissions: v.optional(v.array(v.lazy(() => DrivePermission))),
  clientEncryptionDetails: v.optional(v.lazy(() => DriveClientEncryptionDetails)),
  contentHints: v.optional(
    v.looseObject({
      thumbnail: v.optional(
        v.looseObject({
          image: v.optional(v.string()),
          mimeType: v.optional(v.string()),
        }),
      ),
      indexableText: v.optional(v.string()),
    }),
  ),
  sharingUser: v.optional(v.lazy(() => DriveUser)),
  linkShareMetadata: v.optional(
    v.looseObject({
      securityUpdateEnabled: v.optional(v.boolean()),
      securityUpdateEligible: v.optional(v.boolean()),
    }),
  ),
  viewersCanCopyContent: v.optional(v.boolean()),
  sha256Checksum: v.optional(v.string()),
  copyRequiresWriterPermission: v.optional(v.boolean()),
  md5Checksum: v.optional(v.string()),
  viewedByMeTime: v.optional(v.string()),
  lastModifyingUser: v.optional(v.lazy(() => DriveUser)),
  exportLinks: v.optional(v.record(v.string(), v.string())),
  createdTime: v.optional(v.string()),
  name: v.optional(v.string()),
  spaces: v.optional(v.array(v.string())),
  viewedByMe: v.optional(v.boolean()),
  fileExtension: v.optional(v.string()),
  imageMediaMetadata: v.optional(
    v.looseObject({
      exposureMode: v.optional(v.string()),
      cameraMake: v.optional(v.string()),
      aperture: v.optional(number()),
      exposureTime: v.optional(number()),
      sensor: v.optional(v.string()),
      subjectDistance: v.optional(integer()),
      focalLength: v.optional(number()),
      width: v.optional(integer()),
      isoSpeed: v.optional(integer()),
      lens: v.optional(v.string()),
      rotation: v.optional(integer()),
      height: v.optional(integer()),
      whiteBalance: v.optional(v.string()),
      cameraModel: v.optional(v.string()),
      time: v.optional(v.string()),
      flashUsed: v.optional(v.boolean()),
      location: v.optional(
        v.looseObject({
          altitude: v.optional(number()),
          latitude: v.optional(number()),
          longitude: v.optional(number()),
        }),
      ),
      maxApertureValue: v.optional(number()),
      colorSpace: v.optional(v.string()),
      meteringMode: v.optional(v.string()),
      exposureBias: v.optional(number()),
    }),
  ),
  description: v.optional(v.string()),
  labelInfo: v.optional(
    v.looseObject({
      labels: v.optional(v.array(v.lazy(() => DriveLabel))),
    }),
  ),
  ownedByMe: v.optional(v.boolean()),
  folderColorRgb: v.optional(v.string()),
  writersCanShare: v.optional(v.boolean()),
  webContentLink: v.optional(v.string()),
  trashingUser: v.optional(v.lazy(() => DriveUser)),
  driveId: v.optional(v.string()),
  shortcutDetails: v.optional(
    v.looseObject({
      targetId: v.optional(v.string()),
      targetMimeType: v.optional(v.string()),
      targetResourceKey: v.optional(v.string()),
    }),
  ),
  contentRestrictions: v.optional(v.array(v.lazy(() => DriveContentRestriction))),
  hasThumbnail: v.optional(v.boolean()),
  teamDriveId: v.optional(v.string()),
  modifiedTime: v.optional(v.string()),
  sharedWithMeTime: v.optional(v.string()),
  resourceKey: v.optional(v.string()),
  kind: v.optional(v.string()),
  owners: v.optional(v.array(v.lazy(() => DriveUser))),
  parents: v.optional(v.array(v.string())),
  thumbnailLink: v.optional(v.string()),
  headRevisionId: v.optional(v.string()),
  trashedTime: v.optional(v.string()),
  appProperties: v.optional(v.record(v.string(), v.string())),
  capabilities: v.optional(
    v.looseObject({
      canDeleteChildren: v.optional(v.boolean()),
      canChangeSecurityUpdateEnabled: v.optional(v.boolean()),
      canTrashChildren: v.optional(v.boolean()),
      canChangeViewersCanCopyContent: v.optional(v.boolean()),
      canAcceptOwnership: v.optional(v.boolean()),
      canListChildren: v.optional(v.boolean()),
      canMoveItemWithinDrive: v.optional(v.boolean()),
      canRemoveContentRestriction: v.optional(v.boolean()),
      canReadLabels: v.optional(v.boolean()),
      canUntrash: v.optional(v.boolean()),
      canTrash: v.optional(v.boolean()),
      canMoveTeamDriveItem: v.optional(v.boolean()),
      canAddChildren: v.optional(v.boolean()),
      canStartApproval: v.optional(v.boolean()),
      canRemoveChildren: v.optional(v.boolean()),
      canReadRevisions: v.optional(v.boolean()),
      canMoveItemIntoTeamDrive: v.optional(v.boolean()),
      canAccessViaGenAi: v.optional(v.boolean()),
      canModifyLabels: v.optional(v.boolean()),
      canChangeItemDownloadRestriction: v.optional(v.boolean()),
      canRemoveMyDriveParent: v.optional(v.boolean()),
      canRename: v.optional(v.boolean()),
      canMoveChildrenWithinDrive: v.optional(v.boolean()),
      canDelete: v.optional(v.boolean()),
      canCopy: v.optional(v.boolean()),
      canMoveChildrenWithinTeamDrive: v.optional(v.boolean()),
      canModifyEditorContentRestriction: v.optional(v.boolean()),
      canEnableInheritedPermissions: v.optional(v.boolean()),
      canMoveChildrenOutOfTeamDrive: v.optional(v.boolean()),
      canMoveItemWithinTeamDrive: v.optional(v.boolean()),
      canModifyOwnerContentRestriction: v.optional(v.boolean()),
      canModifyContentRestriction: v.optional(v.boolean()),
      canMoveItemOutOfTeamDrive: v.optional(v.boolean()),
      canAddFolderFromAnotherDrive: v.optional(v.boolean()),
      canModifyContent: v.optional(v.boolean()),
      canMoveChildrenOutOfDrive: v.optional(v.boolean()),
      canDownload: v.optional(v.boolean()),
      canReadTeamDrive: v.optional(v.boolean()),
      canShare: v.optional(v.boolean()),
      canMoveItemOutOfDrive: v.optional(v.boolean()),
      canReadDrive: v.optional(v.boolean()),
      canChangeCopyRequiresWriterPermission: v.optional(v.boolean()),
      canDisableInheritedPermissions: v.optional(v.boolean()),
      canEdit: v.optional(v.boolean()),
      canAddMyDriveParent: v.optional(v.boolean()),
      canComment: v.optional(v.boolean()),
    }),
  ),
  properties: v.optional(v.record(v.string(), v.string())),
  mimeType: v.optional(v.string()),
  webViewLink: v.optional(v.string()),
  thumbnailVersion: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
  inheritedPermissionsDisabled: v.optional(v.boolean()),
  quotaBytesUsed: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
  size: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
  modifiedByMe: v.optional(v.boolean()),
  fullFileExtension: v.optional(v.string()),
  version: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
  downloadRestrictions: v.optional(v.lazy(() => DriveDownloadRestrictionsMetadata)),
  id: v.optional(v.string()),
  iconLink: v.optional(v.string()),
})

export const DriveAbout: v.GenericSchema<unknown, T.DriveAbout> = v.looseObject({
  importFormats: v.optional(v.record(v.string(), v.array(v.string()))),
  maxUploadSize: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
  canCreateTeamDrives: v.optional(v.boolean()),
  maxImportSizes: v.optional(v.record(v.string(), v.pipe(v.string(), v.regex(/^-?\d+$/)))),
  teamDriveThemes: v.optional(
    v.array(
      v.looseObject({
        id: v.optional(v.string()),
        colorRgb: v.optional(v.string()),
        backgroundImageLink: v.optional(v.string()),
      }),
    ),
  ),
  storageQuota: v.optional(
    v.looseObject({
      usageInDrive: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
      usage: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
      usageInDriveTrash: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
      limit: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
    }),
  ),
  canCreateDrives: v.optional(v.boolean()),
  exportFormats: v.optional(v.record(v.string(), v.array(v.string()))),
  kind: v.optional(v.string()),
  appInstalled: v.optional(v.boolean()),
  folderColorPalette: v.optional(v.array(v.string())),
  driveThemes: v.optional(
    v.array(
      v.looseObject({
        colorRgb: v.optional(v.string()),
        id: v.optional(v.string()),
        backgroundImageLink: v.optional(v.string()),
      }),
    ),
  ),
  user: v.optional(v.lazy(() => DriveUser)),
})

export const DriveDrive: v.GenericSchema<unknown, T.DriveDrive> = v.looseObject({
  name: v.optional(v.string()),
  capabilities: v.optional(
    v.looseObject({
      canManageMembers: v.optional(v.boolean()),
      canRename: v.optional(v.boolean()),
      canChangeDriveMembersOnlyRestriction: v.optional(v.boolean()),
      canListChildren: v.optional(v.boolean()),
      canAddChildren: v.optional(v.boolean()),
      canChangeSharingFoldersRequiresOrganizerPermissionRestriction: v.optional(v.boolean()),
      canChangeCopyRequiresWriterPermissionRestriction: v.optional(v.boolean()),
      canChangeDomainUsersOnlyRestriction: v.optional(v.boolean()),
      canDownload: v.optional(v.boolean()),
      canDeleteDrive: v.optional(v.boolean()),
      canShare: v.optional(v.boolean()),
      canRenameDrive: v.optional(v.boolean()),
      canReadRevisions: v.optional(v.boolean()),
      canCopy: v.optional(v.boolean()),
      canTrashChildren: v.optional(v.boolean()),
      canChangeDownloadRestriction: v.optional(v.boolean()),
      canComment: v.optional(v.boolean()),
      canEdit: v.optional(v.boolean()),
      canDeleteChildren: v.optional(v.boolean()),
      canChangeDriveBackground: v.optional(v.boolean()),
      canResetDriveRestrictions: v.optional(v.boolean()),
    }),
  ),
  restrictions: v.optional(
    v.looseObject({
      adminManagedRestrictions: v.optional(v.boolean()),
      sharingFoldersRequiresOrganizerPermission: v.optional(v.boolean()),
      driveMembersOnly: v.optional(v.boolean()),
      downloadRestriction: v.optional(v.lazy(() => DriveDownloadRestriction)),
      copyRequiresWriterPermission: v.optional(v.boolean()),
      domainUsersOnly: v.optional(v.boolean()),
    }),
  ),
  hidden: v.optional(v.boolean()),
  backgroundImageLink: v.optional(v.string()),
  colorRgb: v.optional(v.string()),
  kind: v.optional(v.string()),
  id: v.optional(v.string()),
  backgroundImageFile: v.optional(
    v.looseObject({
      id: v.optional(v.string()),
      xCoordinate: v.optional(number()),
      yCoordinate: v.optional(number()),
      width: v.optional(number()),
    }),
  ),
  themeId: v.optional(v.string()),
  orgUnitId: v.optional(v.string()),
  createdTime: v.optional(v.string()),
})

export const DriveModifyLabelsRequest: v.GenericSchema<unknown, T.DriveModifyLabelsRequest> = v.looseObject({
  labelModifications: v.optional(v.array(v.lazy(() => DriveLabelModification))),
  kind: v.optional(v.string()),
})

export const DriveResolveAccessProposalRequest: v.GenericSchema<unknown, T.DriveResolveAccessProposalRequest> =
  v.looseObject({
    sendNotification: v.optional(v.boolean()),
    role: v.optional(v.array(v.string())),
    view: v.optional(v.string()),
    action: v.optional(v.picklist(["ACTION_UNSPECIFIED", "ACCEPT", "DENY"])),
  })

export const DocsBullet: v.GenericSchema<unknown, T.DocsBullet> = v.looseObject({
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  nestingLevel: v.optional(integer()),
  listId: v.optional(v.string()),
})

export const DocsLinkedContentReference: v.GenericSchema<unknown, T.DocsLinkedContentReference> = v.looseObject({
  sheetsChartReference: v.optional(v.lazy(() => DocsSheetsChartReference)),
})

export const DocsPositionedObjectProperties: v.GenericSchema<unknown, T.DocsPositionedObjectProperties> = v.looseObject(
  {
    positioning: v.optional(v.lazy(() => DocsPositionedObjectPositioning)),
    embeddedObject: v.optional(v.lazy(() => DocsEmbeddedObject)),
  },
)

export const DocsPositionedObject: v.GenericSchema<unknown, T.DocsPositionedObject> = v.looseObject({
  suggestedPositionedObjectPropertiesChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedPositionedObjectProperties),
    ),
  ),
  suggestedInsertionId: v.optional(v.string()),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  objectId: v.optional(v.string()),
  positionedObjectProperties: v.optional(v.lazy(() => DocsPositionedObjectProperties)),
})

export const DocsRgbColor: v.GenericSchema<unknown, T.DocsRgbColor> = v.looseObject({
  red: v.optional(number()),
  blue: v.optional(number()),
  green: v.optional(number()),
})

export const DocsTableCell: v.GenericSchema<unknown, T.DocsTableCell> = v.looseObject({
  tableCellStyle: v.optional(v.lazy(() => DocsTableCellStyle)),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  suggestedTableCellStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTableCellStyle),
    ),
  ),
  content: v.optional(v.array(v.lazy(() => DocsStructuralElement))),
  startIndex: v.optional(integer()),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  endIndex: v.optional(integer()),
})

export const DocsReplaceImageRequest: v.GenericSchema<unknown, T.DocsReplaceImageRequest> = v.looseObject({
  uri: v.optional(v.string()),
  imageReplaceMethod: v.optional(v.picklist(["IMAGE_REPLACE_METHOD_UNSPECIFIED", "CENTER_CROP"])),
  tabId: v.optional(v.string()),
  imageObjectId: v.optional(v.string()),
})

export const DocsTableRowStyleSuggestionState: v.GenericSchema<unknown, T.DocsTableRowStyleSuggestionState> =
  v.looseObject({
    minRowHeightSuggested: v.optional(v.boolean()),
  })

export const DocsBackground: v.GenericSchema<unknown, T.DocsBackground> = v.looseObject({
  color: v.optional(v.lazy(() => DocsOptionalColor)),
})

export const DocsAutoText: v.GenericSchema<unknown, T.DocsAutoText> = v.looseObject({
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  type: v.optional(v.picklist(["TYPE_UNSPECIFIED", "PAGE_NUMBER", "PAGE_COUNT"])),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
})

export const DocsDropdown: v.GenericSchema<unknown, T.DocsDropdown> = v.looseObject({
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  dropdownId: v.optional(v.string()),
  suggestedDropdownPropertiesChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedDropdownProperties),
    ),
  ),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
  dropdownProperties: v.optional(v.lazy(() => DocsDropdownProperties)),
})

export const DocsReplaceAllTextResponse: v.GenericSchema<unknown, T.DocsReplaceAllTextResponse> = v.looseObject({
  occurrencesChanged: v.optional(integer()),
})

export const DocsUpdateNamedStyleRequest: v.GenericSchema<unknown, T.DocsUpdateNamedStyleRequest> = v.looseObject({
  tabId: v.optional(v.string()),
  namedStyle: v.optional(v.lazy(() => DocsNamedStyle)),
  fields: v.optional(v.string()),
})

export const DocsSuggestedTextStyle: v.GenericSchema<unknown, T.DocsSuggestedTextStyle> = v.looseObject({
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  textStyleSuggestionState: v.optional(v.lazy(() => DocsTextStyleSuggestionState)),
})

export const DocsRichLinkProperties: v.GenericSchema<unknown, T.DocsRichLinkProperties> = v.looseObject({
  uri: v.optional(v.string()),
  title: v.optional(v.string()),
  mimeType: v.optional(v.string()),
})

export const DocsPageBreak: v.GenericSchema<unknown, T.DocsPageBreak> = v.looseObject({
  suggestedInsertionIds: v.optional(v.array(v.string())),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
})

export const DocsDropdownProperties: v.GenericSchema<unknown, T.DocsDropdownProperties> = v.looseObject({
  selectedOptionId: v.optional(v.string()),
  displayValue: v.optional(v.string()),
  dropdownDefinitionId: v.optional(v.string()),
})

export const DocsSheetsChartReferenceSuggestionState: v.GenericSchema<
  unknown,
  T.DocsSheetsChartReferenceSuggestionState
> = v.looseObject({
  spreadsheetIdSuggested: v.optional(v.boolean()),
  chartIdSuggested: v.optional(v.boolean()),
})

export const DocsShading: v.GenericSchema<unknown, T.DocsShading> = v.looseObject({
  backgroundColor: v.optional(v.lazy(() => DocsOptionalColor)),
})

export const DocsReplaceAllTextRequest: v.GenericSchema<unknown, T.DocsReplaceAllTextRequest> = v.looseObject({
  containsText: v.optional(v.lazy(() => DocsSubstringMatchCriteria)),
  replaceText: v.optional(v.string()),
  tabsCriteria: v.optional(v.lazy(() => DocsTabsCriteria)),
})

export const DocsSheetsChartReference: v.GenericSchema<unknown, T.DocsSheetsChartReference> = v.looseObject({
  chartId: v.optional(integer()),
  spreadsheetId: v.optional(v.string()),
})

export const DocsNestingLevel: v.GenericSchema<unknown, T.DocsNestingLevel> = v.looseObject({
  glyphType: v.optional(
    v.picklist([
      "GLYPH_TYPE_UNSPECIFIED",
      "NONE",
      "DECIMAL",
      "ZERO_DECIMAL",
      "UPPER_ALPHA",
      "ALPHA",
      "UPPER_ROMAN",
      "ROMAN",
    ]),
  ),
  indentStart: v.optional(v.lazy(() => DocsDimension)),
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  startNumber: v.optional(integer()),
  glyphSymbol: v.optional(v.string()),
  glyphFormat: v.optional(v.string()),
  indentFirstLine: v.optional(v.lazy(() => DocsDimension)),
  bulletAlignment: v.optional(v.picklist(["BULLET_ALIGNMENT_UNSPECIFIED", "START", "CENTER", "END"])),
})

export const DocsSuggestionResponse: v.GenericSchema<unknown, T.DocsSuggestionResponse> = v.looseObject({
  deletedSuggestionIds: v.optional(v.array(v.string())),
  createdSuggestionIds: v.optional(v.array(v.string())),
  acceptedSuggestionIds: v.optional(v.array(v.string())),
  rejectedSuggestionIds: v.optional(v.array(v.string())),
  updatedSummarySuggestionIds: v.optional(v.array(v.string())),
})

export const DocsFootnoteReference: v.GenericSchema<unknown, T.DocsFootnoteReference> = v.looseObject({
  footnoteNumber: v.optional(v.string()),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
  footnoteId: v.optional(v.string()),
  suggestedInsertionIds: v.optional(v.array(v.string())),
})

export const DocsTextStyleSuggestionState: v.GenericSchema<unknown, T.DocsTextStyleSuggestionState> = v.looseObject({
  italicSuggested: v.optional(v.boolean()),
  smallCapsSuggested: v.optional(v.boolean()),
  weightedFontFamilySuggested: v.optional(v.boolean()),
  linkSuggested: v.optional(v.boolean()),
  fontSizeSuggested: v.optional(v.boolean()),
  backgroundColorSuggested: v.optional(v.boolean()),
  foregroundColorSuggested: v.optional(v.boolean()),
  boldSuggested: v.optional(v.boolean()),
  underlineSuggested: v.optional(v.boolean()),
  baselineOffsetSuggested: v.optional(v.boolean()),
  strikethroughSuggested: v.optional(v.boolean()),
})

export const DocsDropdownPropertiesSuggestionState: v.GenericSchema<unknown, T.DocsDropdownPropertiesSuggestionState> =
  v.looseObject({
    selectedOptionIdSuggested: v.optional(v.boolean()),
  })

export const DocsNestingLevelSuggestionState: v.GenericSchema<unknown, T.DocsNestingLevelSuggestionState> =
  v.looseObject({
    textStyleSuggestionState: v.optional(v.lazy(() => DocsTextStyleSuggestionState)),
    glyphFormatSuggested: v.optional(v.boolean()),
    glyphTypeSuggested: v.optional(v.boolean()),
    bulletAlignmentSuggested: v.optional(v.boolean()),
    startNumberSuggested: v.optional(v.boolean()),
    indentStartSuggested: v.optional(v.boolean()),
    glyphSymbolSuggested: v.optional(v.boolean()),
    indentFirstLineSuggested: v.optional(v.boolean()),
  })

export const DocsTable: v.GenericSchema<unknown, T.DocsTable> = v.looseObject({
  rows: v.optional(integer()),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  tableRows: v.optional(v.array(v.lazy(() => DocsTableRow))),
  columns: v.optional(integer()),
  tableStyle: v.optional(v.lazy(() => DocsTableStyle)),
})

export const DocsTableCellLocation: v.GenericSchema<unknown, T.DocsTableCellLocation> = v.looseObject({
  rowIndex: v.optional(integer()),
  columnIndex: v.optional(integer()),
  tableStartLocation: v.optional(v.lazy(() => DocsLocation)),
})

export const DocsResponse: v.GenericSchema<unknown, T.DocsResponse> = v.looseObject({
  addCommentReply: v.optional(v.lazy(() => DocsAddCommentReplyResponse)),
  addDocumentTab: v.optional(v.lazy(() => DocsAddDocumentTabResponse)),
  insertDropdown: v.optional(v.lazy(() => DocsInsertDropdownResponse)),
  replaceAllText: v.optional(v.lazy(() => DocsReplaceAllTextResponse)),
  insertInlineImage: v.optional(v.lazy(() => DocsInsertInlineImageResponse)),
  insertInlineSheetsChart: v.optional(v.lazy(() => DocsInsertInlineSheetsChartResponse)),
  createDropdownDefinition: v.optional(v.lazy(() => DocsCreateDropdownDefinitionResponse)),
  createFootnote: v.optional(v.lazy(() => DocsCreateFootnoteResponse)),
  createFooter: v.optional(v.lazy(() => DocsCreateFooterResponse)),
  createHeader: v.optional(v.lazy(() => DocsCreateHeaderResponse)),
  insertComment: v.optional(v.lazy(() => DocsInsertCommentResponse)),
  createNamedRange: v.optional(v.lazy(() => DocsCreateNamedRangeResponse)),
})

export const DocsDocumentStyle: v.GenericSchema<unknown, T.DocsDocumentStyle> = v.looseObject({
  marginHeader: v.optional(v.lazy(() => DocsDimension)),
  marginTop: v.optional(v.lazy(() => DocsDimension)),
  marginLeft: v.optional(v.lazy(() => DocsDimension)),
  defaultHeaderId: v.optional(v.string()),
  marginFooter: v.optional(v.lazy(() => DocsDimension)),
  background: v.optional(v.lazy(() => DocsBackground)),
  useFirstPageHeaderFooter: v.optional(v.boolean()),
  evenPageFooterId: v.optional(v.string()),
  marginBottom: v.optional(v.lazy(() => DocsDimension)),
  flipPageOrientation: v.optional(v.boolean()),
  pageNumberStart: v.optional(integer()),
  marginRight: v.optional(v.lazy(() => DocsDimension)),
  evenPageHeaderId: v.optional(v.string()),
  pageSize: v.optional(v.lazy(() => DocsSize)),
  defaultFooterId: v.optional(v.string()),
  firstPageHeaderId: v.optional(v.string()),
  firstPageFooterId: v.optional(v.string()),
  useCustomHeaderFooterMargins: v.optional(v.boolean()),
  useEvenPageHeaderFooter: v.optional(v.boolean()),
  documentFormat: v.optional(v.lazy(() => DocsDocumentFormat)),
})

export const DocsDeleteTableRowRequest: v.GenericSchema<unknown, T.DocsDeleteTableRowRequest> = v.looseObject({
  tableCellLocation: v.optional(v.lazy(() => DocsTableCellLocation)),
})

export const DocsCreateFootnoteRequest: v.GenericSchema<unknown, T.DocsCreateFootnoteRequest> = v.looseObject({
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
  location: v.optional(v.lazy(() => DocsLocation)),
})

export const DocsCreateHeaderRequest: v.GenericSchema<unknown, T.DocsCreateHeaderRequest> = v.looseObject({
  type: v.optional(v.picklist(["HEADER_FOOTER_TYPE_UNSPECIFIED", "DEFAULT"])),
  sectionBreakLocation: v.optional(v.lazy(() => DocsLocation)),
})

export const DocsAddCommentReplyRequest: v.GenericSchema<unknown, T.DocsAddCommentReplyRequest> = v.looseObject({
  suggestionId: v.optional(v.string()),
  post: v.optional(v.lazy(() => DocsPost)),
  commentId: v.optional(v.string()),
})

export const DocsDeleteParagraphBulletsRequest: v.GenericSchema<unknown, T.DocsDeleteParagraphBulletsRequest> =
  v.looseObject({
    range: v.optional(v.lazy(() => DocsRange)),
  })

export const DocsNamedStylesSuggestionState: v.GenericSchema<unknown, T.DocsNamedStylesSuggestionState> = v.looseObject(
  {
    stylesSuggestionStates: v.optional(v.array(v.lazy(() => DocsNamedStyleSuggestionState))),
  },
)

export const DocsTabProperties: v.GenericSchema<unknown, T.DocsTabProperties> = v.looseObject({
  index: v.optional(integer()),
  nestingLevel: v.optional(integer()),
  tabId: v.optional(v.string()),
  parentTabId: v.optional(v.string()),
  iconEmoji: v.optional(v.string()),
  title: v.optional(v.string()),
})

export const DocsSuggestedDocumentStyle: v.GenericSchema<unknown, T.DocsSuggestedDocumentStyle> = v.looseObject({
  documentStyleSuggestionState: v.optional(v.lazy(() => DocsDocumentStyleSuggestionState)),
  documentStyle: v.optional(v.lazy(() => DocsDocumentStyle)),
})

export const DocsCreateNamedRangeRequest: v.GenericSchema<unknown, T.DocsCreateNamedRangeRequest> = v.looseObject({
  name: v.optional(v.string()),
  range: v.optional(v.lazy(() => DocsRange)),
})

export const DocsEmbeddedObject: v.GenericSchema<unknown, T.DocsEmbeddedObject> = v.looseObject({
  embeddedDrawingProperties: v.optional(v.lazy(() => DocsEmbeddedDrawingProperties)),
  marginRight: v.optional(v.lazy(() => DocsDimension)),
  size: v.optional(v.lazy(() => DocsSize)),
  embeddedObjectBorder: v.optional(v.lazy(() => DocsEmbeddedObjectBorder)),
  marginLeft: v.optional(v.lazy(() => DocsDimension)),
  marginTop: v.optional(v.lazy(() => DocsDimension)),
  description: v.optional(v.string()),
  linkedContentReference: v.optional(v.lazy(() => DocsLinkedContentReference)),
  title: v.optional(v.string()),
  marginBottom: v.optional(v.lazy(() => DocsDimension)),
  imageProperties: v.optional(v.lazy(() => DocsImageProperties)),
})

export const DocsDeleteHeaderRequest: v.GenericSchema<unknown, T.DocsDeleteHeaderRequest> = v.looseObject({
  tabId: v.optional(v.string()),
  headerId: v.optional(v.string()),
})

export const DocsInsertTableRequest: v.GenericSchema<unknown, T.DocsInsertTableRequest> = v.looseObject({
  rows: v.optional(integer()),
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
  location: v.optional(v.lazy(() => DocsLocation)),
  columns: v.optional(integer()),
})

export const DocsInsertDropdownResponse: v.GenericSchema<unknown, T.DocsInsertDropdownResponse> = v.looseObject({
  dropdown: v.optional(v.lazy(() => DocsDropdown)),
})

export const DocsInsertDateRequest: v.GenericSchema<unknown, T.DocsInsertDateRequest> = v.looseObject({
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
  location: v.optional(v.lazy(() => DocsLocation)),
  dateElementProperties: v.optional(v.lazy(() => DocsDateElementProperties)),
})

export const DocsAddCommentReplyResponse: v.GenericSchema<unknown, T.DocsAddCommentReplyResponse> = v.looseObject({
  post: v.optional(v.lazy(() => DocsPost)),
})

export const DocsTableRow: v.GenericSchema<unknown, T.DocsTableRow> = v.looseObject({
  suggestedTableRowStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTableRowStyle),
    ),
  ),
  endIndex: v.optional(integer()),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  tableRowStyle: v.optional(v.lazy(() => DocsTableRowStyle)),
  startIndex: v.optional(integer()),
  tableCells: v.optional(v.array(v.lazy(() => DocsTableCell))),
})

export const DocsListProperties: v.GenericSchema<unknown, T.DocsListProperties> = v.looseObject({
  nestingLevels: v.optional(v.array(v.lazy(() => DocsNestingLevel))),
})

export const DocsImagePropertiesSuggestionState: v.GenericSchema<unknown, T.DocsImagePropertiesSuggestionState> =
  v.looseObject({
    transparencySuggested: v.optional(v.boolean()),
    contrastSuggested: v.optional(v.boolean()),
    contentUriSuggested: v.optional(v.boolean()),
    cropPropertiesSuggestionState: v.optional(v.lazy(() => DocsCropPropertiesSuggestionState)),
    brightnessSuggested: v.optional(v.boolean()),
    sourceUriSuggested: v.optional(v.boolean()),
    angleSuggested: v.optional(v.boolean()),
  })

export const DocsNamedRange: v.GenericSchema<unknown, T.DocsNamedRange> = v.looseObject({
  ranges: v.optional(v.array(v.lazy(() => DocsRange))),
  namedRangeId: v.optional(v.string()),
  name: v.optional(v.string()),
})

export const DocsNamedStyle: v.GenericSchema<unknown, T.DocsNamedStyle> = v.looseObject({
  namedStyleType: v.optional(
    v.picklist([
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
    ]),
  ),
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  paragraphStyle: v.optional(v.lazy(() => DocsParagraphStyle)),
})

export const DocsEmbeddedDrawingProperties: v.GenericSchema<unknown, T.DocsEmbeddedDrawingProperties> = v.looseObject(
  {},
)

export const DocsDeleteSuggestionRequest: v.GenericSchema<unknown, T.DocsDeleteSuggestionRequest> = v.looseObject({
  suggestionId: v.optional(v.string()),
})

export const DocsUpdateDocumentTabPropertiesRequest: v.GenericSchema<
  unknown,
  T.DocsUpdateDocumentTabPropertiesRequest
> = v.looseObject({
  tabProperties: v.optional(v.lazy(() => DocsTabProperties)),
  fields: v.optional(v.string()),
})

export const DocsDeleteContentRangeRequest: v.GenericSchema<unknown, T.DocsDeleteContentRangeRequest> = v.looseObject({
  range: v.optional(v.lazy(() => DocsRange)),
})

export const DocsAcceptSuggestionRequest: v.GenericSchema<unknown, T.DocsAcceptSuggestionRequest> = v.looseObject({
  suggestionId: v.optional(v.string()),
})

export const DocsHorizontalRule: v.GenericSchema<unknown, T.DocsHorizontalRule> = v.looseObject({
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  suggestedDeletionIds: v.optional(v.array(v.string())),
})

export const DocsHeadingLink: v.GenericSchema<unknown, T.DocsHeadingLink> = v.looseObject({
  tabId: v.optional(v.string()),
  id: v.optional(v.string()),
})

export const DocsUpdateTextStyleRequest: v.GenericSchema<unknown, T.DocsUpdateTextStyleRequest> = v.looseObject({
  range: v.optional(v.lazy(() => DocsRange)),
  fields: v.optional(v.string()),
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
})

export const DocsUpdateDocumentStyleRequest: v.GenericSchema<unknown, T.DocsUpdateDocumentStyleRequest> = v.looseObject(
  {
    tabId: v.optional(v.string()),
    fields: v.optional(v.string()),
    documentStyle: v.optional(v.lazy(() => DocsDocumentStyle)),
  },
)

export const DocsOptionalColor: v.GenericSchema<unknown, T.DocsOptionalColor> = v.looseObject({
  color: v.optional(v.lazy(() => DocsColor)),
})

export const DocsEndOfSegmentLocation: v.GenericSchema<unknown, T.DocsEndOfSegmentLocation> = v.looseObject({
  segmentId: v.optional(v.string()),
  tabId: v.optional(v.string()),
})

export const DocsSuggestedInlineObjectProperties: v.GenericSchema<unknown, T.DocsSuggestedInlineObjectProperties> =
  v.looseObject({
    inlineObjectProperties: v.optional(v.lazy(() => DocsInlineObjectProperties)),
    inlineObjectPropertiesSuggestionState: v.optional(v.lazy(() => DocsInlineObjectPropertiesSuggestionState)),
  })

export const DocsInsertTextRequest: v.GenericSchema<unknown, T.DocsInsertTextRequest> = v.looseObject({
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
  location: v.optional(v.lazy(() => DocsLocation)),
  text: v.optional(v.string()),
})

export const DocsCreateFooterRequest: v.GenericSchema<unknown, T.DocsCreateFooterRequest> = v.looseObject({
  type: v.optional(v.picklist(["HEADER_FOOTER_TYPE_UNSPECIFIED", "DEFAULT"])),
  sectionBreakLocation: v.optional(v.lazy(() => DocsLocation)),
})

export const DocsSubstringMatchCriteria: v.GenericSchema<unknown, T.DocsSubstringMatchCriteria> = v.looseObject({
  searchByRegex: v.optional(v.boolean()),
  matchCase: v.optional(v.boolean()),
  text: v.optional(v.string()),
})

export const DocsNamedStyles: v.GenericSchema<unknown, T.DocsNamedStyles> = v.looseObject({
  styles: v.optional(v.array(v.lazy(() => DocsNamedStyle))),
})

export const DocsTableCellStyle: v.GenericSchema<unknown, T.DocsTableCellStyle> = v.looseObject({
  columnSpan: v.optional(integer()),
  borderBottom: v.optional(v.lazy(() => DocsTableCellBorder)),
  borderTop: v.optional(v.lazy(() => DocsTableCellBorder)),
  paddingRight: v.optional(v.lazy(() => DocsDimension)),
  paddingBottom: v.optional(v.lazy(() => DocsDimension)),
  backgroundColor: v.optional(v.lazy(() => DocsOptionalColor)),
  paddingLeft: v.optional(v.lazy(() => DocsDimension)),
  borderLeft: v.optional(v.lazy(() => DocsTableCellBorder)),
  paddingTop: v.optional(v.lazy(() => DocsDimension)),
  rowSpan: v.optional(integer()),
  contentAlignment: v.optional(
    v.picklist(["CONTENT_ALIGNMENT_UNSPECIFIED", "CONTENT_ALIGNMENT_UNSUPPORTED", "TOP", "MIDDLE", "BOTTOM"]),
  ),
  borderRight: v.optional(v.lazy(() => DocsTableCellBorder)),
})

export const DocsSuggestedPositionedObjectProperties: v.GenericSchema<
  unknown,
  T.DocsSuggestedPositionedObjectProperties
> = v.looseObject({
  positionedObjectPropertiesSuggestionState: v.optional(v.lazy(() => DocsPositionedObjectPropertiesSuggestionState)),
  positionedObjectProperties: v.optional(v.lazy(() => DocsPositionedObjectProperties)),
})

export const DocsSectionColumnProperties: v.GenericSchema<unknown, T.DocsSectionColumnProperties> = v.looseObject({
  width: v.optional(v.lazy(() => DocsDimension)),
  paddingEnd: v.optional(v.lazy(() => DocsDimension)),
})

export const DocsDeleteCommentReplyRequest: v.GenericSchema<unknown, T.DocsDeleteCommentReplyRequest> = v.looseObject({
  postId: v.optional(v.string()),
  suggestionId: v.optional(v.string()),
  commentId: v.optional(v.string()),
})

export const DocsEmbeddedObjectBorder: v.GenericSchema<unknown, T.DocsEmbeddedObjectBorder> = v.looseObject({
  dashStyle: v.optional(v.picklist(["DASH_STYLE_UNSPECIFIED", "SOLID", "DOT", "DASH"])),
  propertyState: v.optional(v.picklist(["RENDERED", "NOT_RENDERED"])),
  width: v.optional(v.lazy(() => DocsDimension)),
  color: v.optional(v.lazy(() => DocsOptionalColor)),
})

export const DocsInlineObjectPropertiesSuggestionState: v.GenericSchema<
  unknown,
  T.DocsInlineObjectPropertiesSuggestionState
> = v.looseObject({
  embeddedObjectSuggestionState: v.optional(v.lazy(() => DocsEmbeddedObjectSuggestionState)),
})

export const DocsNamedRanges: v.GenericSchema<unknown, T.DocsNamedRanges> = v.looseObject({
  namedRanges: v.optional(v.array(v.lazy(() => DocsNamedRange))),
  name: v.optional(v.string()),
})

export const DocsInlineObject: v.GenericSchema<unknown, T.DocsInlineObject> = v.looseObject({
  objectId: v.optional(v.string()),
  suggestedInlineObjectPropertiesChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedInlineObjectProperties),
    ),
  ),
  suggestedInsertionId: v.optional(v.string()),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  inlineObjectProperties: v.optional(v.lazy(() => DocsInlineObjectProperties)),
})

export const DocsInsertTableColumnRequest: v.GenericSchema<unknown, T.DocsInsertTableColumnRequest> = v.looseObject({
  insertRight: v.optional(v.boolean()),
  tableCellLocation: v.optional(v.lazy(() => DocsTableCellLocation)),
})

export const DocsTableCellBorder: v.GenericSchema<unknown, T.DocsTableCellBorder> = v.looseObject({
  dashStyle: v.optional(v.picklist(["DASH_STYLE_UNSPECIFIED", "SOLID", "DOT", "DASH"])),
  width: v.optional(v.lazy(() => DocsDimension)),
  color: v.optional(v.lazy(() => DocsOptionalColor)),
})

export const DocsHeader: v.GenericSchema<unknown, T.DocsHeader> = v.looseObject({
  headerId: v.optional(v.string()),
  content: v.optional(v.array(v.lazy(() => DocsStructuralElement))),
})

export const DocsInsertCommentResponse: v.GenericSchema<unknown, T.DocsInsertCommentResponse> = v.looseObject({
  commentThread: v.optional(v.lazy(() => DocsCommentThread)),
})

export const DocsUpdateDropdownPropertiesRequest: v.GenericSchema<unknown, T.DocsUpdateDropdownPropertiesRequest> =
  v.looseObject({
    tabId: v.optional(v.string()),
    dropdownProperties: v.optional(v.lazy(() => DocsDropdownProperties)),
    fields: v.optional(v.string()),
    dropdownId: v.optional(v.string()),
  })

export const DocsTab: v.GenericSchema<unknown, T.DocsTab> = v.looseObject({
  childTabs: v.optional(v.array(v.lazy(() => DocsTab))),
  tabProperties: v.optional(v.lazy(() => DocsTabProperties)),
  documentTab: v.optional(v.lazy(() => DocsDocumentTab)),
})

export const DocsColor: v.GenericSchema<unknown, T.DocsColor> = v.looseObject({
  rgbColor: v.optional(v.lazy(() => DocsRgbColor)),
})

export const DocsFooter: v.GenericSchema<unknown, T.DocsFooter> = v.looseObject({
  footerId: v.optional(v.string()),
  content: v.optional(v.array(v.lazy(() => DocsStructuralElement))),
})

export const DocsSuggestedDropdownDefinitionProperties: v.GenericSchema<
  unknown,
  T.DocsSuggestedDropdownDefinitionProperties
> = v.looseObject({
  dropdownDefinitionProperties: v.optional(v.lazy(() => DocsDropdownDefinitionProperties)),
  dropdownDefinitionPropertiesSuggestionState: v.optional(
    v.lazy(() => DocsDropdownDefinitionPropertiesSuggestionState),
  ),
})

export const DocsObjectReferences: v.GenericSchema<unknown, T.DocsObjectReferences> = v.looseObject({
  objectIds: v.optional(v.array(v.string())),
})

export const DocsTableOfContents: v.GenericSchema<unknown, T.DocsTableOfContents> = v.looseObject({
  suggestedInsertionIds: v.optional(v.array(v.string())),
  content: v.optional(v.array(v.lazy(() => DocsStructuralElement))),
  suggestedDeletionIds: v.optional(v.array(v.string())),
})

export const DocsListPropertiesSuggestionState: v.GenericSchema<unknown, T.DocsListPropertiesSuggestionState> =
  v.looseObject({
    nestingLevelsSuggestionStates: v.optional(v.array(v.lazy(() => DocsNestingLevelSuggestionState))),
  })

export const DocsStructuralElement: v.GenericSchema<unknown, T.DocsStructuralElement> = v.looseObject({
  startIndex: v.optional(integer()),
  table: v.optional(v.lazy(() => DocsTable)),
  tableOfContents: v.optional(v.lazy(() => DocsTableOfContents)),
  sectionBreak: v.optional(v.lazy(() => DocsSectionBreak)),
  paragraph: v.optional(v.lazy(() => DocsParagraph)),
  endIndex: v.optional(integer()),
})

export const DocsInsertInlineImageRequest: v.GenericSchema<unknown, T.DocsInsertInlineImageRequest> = v.looseObject({
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
  objectSize: v.optional(v.lazy(() => DocsSize)),
  uri: v.optional(v.string()),
  location: v.optional(v.lazy(() => DocsLocation)),
})

export const DocsBody: v.GenericSchema<unknown, T.DocsBody> = v.looseObject({
  content: v.optional(v.array(v.lazy(() => DocsStructuralElement))),
})

export const DocsInsertTableRowRequest: v.GenericSchema<unknown, T.DocsInsertTableRowRequest> = v.looseObject({
  tableCellLocation: v.optional(v.lazy(() => DocsTableCellLocation)),
  insertBelow: v.optional(v.boolean()),
})

export const DocsWriteControl: v.GenericSchema<unknown, T.DocsWriteControl> = v.looseObject({
  writeMode: v.optional(v.picklist(["WRITE_MODE_UNSPECIFIED", "EDIT", "SUGGEST"])),
  requiredRevisionId: v.optional(v.string()),
  targetRevisionId: v.optional(v.string()),
})

export const DocsCreateFooterResponse: v.GenericSchema<unknown, T.DocsCreateFooterResponse> = v.looseObject({
  footerId: v.optional(v.string()),
})

export const DocsDropdownDefinition: v.GenericSchema<unknown, T.DocsDropdownDefinition> = v.looseObject({
  dropdownDefinitionProperties: v.optional(v.lazy(() => DocsDropdownDefinitionProperties)),
  dropdownDefinitionId: v.optional(v.string()),
  suggestedDeletionId: v.optional(v.string()),
  suggestedInsertionId: v.optional(v.string()),
  suggestedDropdownDefinitionPropertiesChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedDropdownDefinitionProperties),
    ),
  ),
})

export const DocsSectionStyle: v.GenericSchema<unknown, T.DocsSectionStyle> = v.looseObject({
  contentDirection: v.optional(v.picklist(["CONTENT_DIRECTION_UNSPECIFIED", "LEFT_TO_RIGHT", "RIGHT_TO_LEFT"])),
  marginHeader: v.optional(v.lazy(() => DocsDimension)),
  marginLeft: v.optional(v.lazy(() => DocsDimension)),
  evenPageHeaderId: v.optional(v.string()),
  marginTop: v.optional(v.lazy(() => DocsDimension)),
  firstPageHeaderId: v.optional(v.string()),
  firstPageFooterId: v.optional(v.string()),
  defaultFooterId: v.optional(v.string()),
  marginFooter: v.optional(v.lazy(() => DocsDimension)),
  pageNumberStart: v.optional(integer()),
  marginBottom: v.optional(v.lazy(() => DocsDimension)),
  flipPageOrientation: v.optional(v.boolean()),
  evenPageFooterId: v.optional(v.string()),
  marginRight: v.optional(v.lazy(() => DocsDimension)),
  columnSeparatorStyle: v.optional(v.picklist(["COLUMN_SEPARATOR_STYLE_UNSPECIFIED", "NONE", "BETWEEN_EACH_COLUMN"])),
  columnProperties: v.optional(v.array(v.lazy(() => DocsSectionColumnProperties))),
  useFirstPageHeaderFooter: v.optional(v.boolean()),
  sectionType: v.optional(v.picklist(["SECTION_TYPE_UNSPECIFIED", "CONTINUOUS", "NEXT_PAGE"])),
  defaultHeaderId: v.optional(v.string()),
})

export const DocsBatchUpdateDocumentRequest: v.GenericSchema<unknown, T.DocsBatchUpdateDocumentRequest> = v.looseObject(
  {
    requests: v.optional(v.array(v.lazy(() => DocsRequest))),
    writeControl: v.optional(v.lazy(() => DocsWriteControl)),
  },
)

export const DocsEmbeddedObjectSuggestionState: v.GenericSchema<unknown, T.DocsEmbeddedObjectSuggestionState> =
  v.looseObject({
    linkedContentReferenceSuggestionState: v.optional(v.lazy(() => DocsLinkedContentReferenceSuggestionState)),
    sizeSuggestionState: v.optional(v.lazy(() => DocsSizeSuggestionState)),
    titleSuggested: v.optional(v.boolean()),
    marginLeftSuggested: v.optional(v.boolean()),
    marginBottomSuggested: v.optional(v.boolean()),
    descriptionSuggested: v.optional(v.boolean()),
    embeddedObjectBorderSuggestionState: v.optional(v.lazy(() => DocsEmbeddedObjectBorderSuggestionState)),
    marginTopSuggested: v.optional(v.boolean()),
    marginRightSuggested: v.optional(v.boolean()),
    imagePropertiesSuggestionState: v.optional(v.lazy(() => DocsImagePropertiesSuggestionState)),
    embeddedDrawingPropertiesSuggestionState: v.optional(v.lazy(() => DocsEmbeddedDrawingPropertiesSuggestionState)),
  })

export const DocsTextRun: v.GenericSchema<unknown, T.DocsTextRun> = v.looseObject({
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  content: v.optional(v.string()),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
})

export const DocsTabStop: v.GenericSchema<unknown, T.DocsTabStop> = v.looseObject({
  alignment: v.optional(v.picklist(["TAB_STOP_ALIGNMENT_UNSPECIFIED", "START", "CENTER", "END"])),
  offset: v.optional(v.lazy(() => DocsDimension)),
})

export const DocsDateElementProperties: v.GenericSchema<unknown, T.DocsDateElementProperties> = v.looseObject({
  displayText: v.optional(v.string()),
  timeFormat: v.optional(
    v.picklist([
      "TIME_FORMAT_UNSPECIFIED",
      "TIME_FORMAT_DISABLED",
      "TIME_FORMAT_HOUR_MINUTE",
      "TIME_FORMAT_HOUR_MINUTE_TIMEZONE",
    ]),
  ),
  timestamp: v.optional(v.string()),
  locale: v.optional(v.string()),
  timeZoneId: v.optional(v.string()),
  dateFormat: v.optional(
    v.picklist([
      "DATE_FORMAT_UNSPECIFIED",
      "DATE_FORMAT_CUSTOM",
      "DATE_FORMAT_MONTH_DAY_ABBREVIATED",
      "DATE_FORMAT_MONTH_DAY_FULL",
      "DATE_FORMAT_MONTH_DAY_YEAR_ABBREVIATED",
      "DATE_FORMAT_ISO8601",
    ]),
  ),
})

export const DocsParagraphStyleSuggestionState: v.GenericSchema<unknown, T.DocsParagraphStyleSuggestionState> =
  v.looseObject({
    indentStartSuggested: v.optional(v.boolean()),
    borderBottomSuggested: v.optional(v.boolean()),
    spacingModeSuggested: v.optional(v.boolean()),
    headingIdSuggested: v.optional(v.boolean()),
    spaceBelowSuggested: v.optional(v.boolean()),
    shadingSuggestionState: v.optional(v.lazy(() => DocsShadingSuggestionState)),
    directionSuggested: v.optional(v.boolean()),
    pageBreakBeforeSuggested: v.optional(v.boolean()),
    avoidWidowAndOrphanSuggested: v.optional(v.boolean()),
    keepLinesTogetherSuggested: v.optional(v.boolean()),
    namedStyleTypeSuggested: v.optional(v.boolean()),
    lineSpacingSuggested: v.optional(v.boolean()),
    borderRightSuggested: v.optional(v.boolean()),
    spaceAboveSuggested: v.optional(v.boolean()),
    alignmentSuggested: v.optional(v.boolean()),
    borderTopSuggested: v.optional(v.boolean()),
    borderBetweenSuggested: v.optional(v.boolean()),
    borderLeftSuggested: v.optional(v.boolean()),
    indentEndSuggested: v.optional(v.boolean()),
    indentFirstLineSuggested: v.optional(v.boolean()),
    keepWithNextSuggested: v.optional(v.boolean()),
  })

export const DocsPersonProperties: v.GenericSchema<unknown, T.DocsPersonProperties> = v.looseObject({
  name: v.optional(v.string()),
  email: v.optional(v.string()),
})

export const DocsSuggestedTableRowStyle: v.GenericSchema<unknown, T.DocsSuggestedTableRowStyle> = v.looseObject({
  tableRowStyle: v.optional(v.lazy(() => DocsTableRowStyle)),
  tableRowStyleSuggestionState: v.optional(v.lazy(() => DocsTableRowStyleSuggestionState)),
})

export const DocsUnmergeTableCellsRequest: v.GenericSchema<unknown, T.DocsUnmergeTableCellsRequest> = v.looseObject({
  tableRange: v.optional(v.lazy(() => DocsTableRange)),
})

export const DocsCommentThread: v.GenericSchema<unknown, T.DocsCommentThread> = v.looseObject({
  commentId: v.optional(v.string()),
  plainTextQuote: v.optional(v.string()),
  replies: v.optional(v.array(v.lazy(() => DocsPost))),
  anchorId: v.optional(v.string()),
  headPost: v.optional(v.lazy(() => DocsPost)),
  status: v.optional(v.picklist(["STATUS_UNSPECIFIED", "OPEN", "RESOLVED"])),
})

export const DocsImageProperties: v.GenericSchema<unknown, T.DocsImageProperties> = v.looseObject({
  brightness: v.optional(number()),
  angle: v.optional(number()),
  sourceUri: v.optional(v.string()),
  contentUri: v.optional(v.string()),
  contrast: v.optional(number()),
  transparency: v.optional(number()),
  cropProperties: v.optional(v.lazy(() => DocsCropProperties)),
})

export const DocsCommentAnchor: v.GenericSchema<unknown, T.DocsCommentAnchor> = v.looseObject({
  anchorId: v.optional(v.string()),
  ranges: v.optional(v.array(v.lazy(() => DocsRange))),
})

export const DocsDeleteNamedRangeRequest: v.GenericSchema<unknown, T.DocsDeleteNamedRangeRequest> = v.looseObject({
  tabsCriteria: v.optional(v.lazy(() => DocsTabsCriteria)),
  name: v.optional(v.string()),
  namedRangeId: v.optional(v.string()),
})

export const DocsEmbeddedDrawingPropertiesSuggestionState: v.GenericSchema<
  unknown,
  T.DocsEmbeddedDrawingPropertiesSuggestionState
> = v.looseObject({})

export const DocsTableColumnProperties: v.GenericSchema<unknown, T.DocsTableColumnProperties> = v.looseObject({
  widthType: v.optional(v.picklist(["WIDTH_TYPE_UNSPECIFIED", "EVENLY_DISTRIBUTED", "FIXED_WIDTH"])),
  width: v.optional(v.lazy(() => DocsDimension)),
})

export const DocsDocument: v.GenericSchema<unknown, T.DocsDocument> = v.looseObject({
  inlineObjects: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsInlineObject),
    ),
  ),
  tabs: v.optional(v.array(v.lazy(() => DocsTab))),
  footers: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsFooter),
    ),
  ),
  suggestions: v.optional(v.array(v.lazy(() => DocsSuggestionThread))),
  documentId: v.optional(v.string()),
  namedStyles: v.optional(v.lazy(() => DocsNamedStyles)),
  documentStyle: v.optional(v.lazy(() => DocsDocumentStyle)),
  suggestedDocumentStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedDocumentStyle),
    ),
  ),
  title: v.optional(v.string()),
  headers: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsHeader),
    ),
  ),
  commentsViewMode: v.optional(
    v.picklist([
      "COMMENTS_VIEW_MODE_UNSPECIFIED",
      "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS",
      "COMMENTS_VIEW_MODE_OMITTED",
      "COMMENTS_VIEW_MODE_INCLUDED",
    ]),
  ),
  positionedObjects: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsPositionedObject),
    ),
  ),
  suggestionsViewMode: v.optional(
    v.picklist([
      "DEFAULT_FOR_CURRENT_ACCESS",
      "SUGGESTIONS_INLINE",
      "PREVIEW_SUGGESTIONS_ACCEPTED",
      "PREVIEW_WITHOUT_SUGGESTIONS",
    ]),
  ),
  revisionId: v.optional(v.string()),
  footnotes: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsFootnote),
    ),
  ),
  suggestedNamedStylesChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedNamedStyles),
    ),
  ),
  lists: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsList),
    ),
  ),
  namedRanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsNamedRanges),
    ),
  ),
  body: v.optional(v.lazy(() => DocsBody)),
  comments: v.optional(v.array(v.lazy(() => DocsCommentThread))),
})

export const DocsInlineObjectProperties: v.GenericSchema<unknown, T.DocsInlineObjectProperties> = v.looseObject({
  embeddedObject: v.optional(v.lazy(() => DocsEmbeddedObject)),
})

export const DocsTabsCriteria: v.GenericSchema<unknown, T.DocsTabsCriteria> = v.looseObject({
  tabIds: v.optional(v.array(v.string())),
})

export const DocsCropPropertiesSuggestionState: v.GenericSchema<unknown, T.DocsCropPropertiesSuggestionState> =
  v.looseObject({
    offsetRightSuggested: v.optional(v.boolean()),
    offsetBottomSuggested: v.optional(v.boolean()),
    angleSuggested: v.optional(v.boolean()),
    offsetLeftSuggested: v.optional(v.boolean()),
    offsetTopSuggested: v.optional(v.boolean()),
  })

export const DocsDropdownDefinitionPropertiesSuggestionState: v.GenericSchema<
  unknown,
  T.DocsDropdownDefinitionPropertiesSuggestionState
> = v.looseObject({
  optionsSuggested: v.optional(v.boolean()),
  titleSuggested: v.optional(v.boolean()),
})

export const DocsBatchUpdateDocumentResponse: v.GenericSchema<unknown, T.DocsBatchUpdateDocumentResponse> =
  v.looseObject({
    replies: v.optional(v.array(v.lazy(() => DocsResponse))),
    commentUpdateState: v.optional(
      v.picklist([
        "COMMENT_UPDATE_STATE_UNSPECIFIED",
        "NO_UPDATES_REQUESTED",
        "ALL_SAVED",
        "ALL_FAILED_UNKNOWN_REASON",
      ]),
    ),
    documentId: v.optional(v.string()),
    suggestionResponses: v.optional(v.array(v.lazy(() => DocsSuggestionResponse))),
    writeControl: v.optional(v.lazy(() => DocsWriteControl)),
  })

export const DocsDeleteTableColumnRequest: v.GenericSchema<unknown, T.DocsDeleteTableColumnRequest> = v.looseObject({
  tableCellLocation: v.optional(v.lazy(() => DocsTableCellLocation)),
})

export const DocsFootnote: v.GenericSchema<unknown, T.DocsFootnote> = v.looseObject({
  content: v.optional(v.array(v.lazy(() => DocsStructuralElement))),
  footnoteId: v.optional(v.string()),
})

export const DocsLinkedContentReferenceSuggestionState: v.GenericSchema<
  unknown,
  T.DocsLinkedContentReferenceSuggestionState
> = v.looseObject({
  sheetsChartReferenceSuggestionState: v.optional(v.lazy(() => DocsSheetsChartReferenceSuggestionState)),
})

export const DocsUpdateCommentPostRequest: v.GenericSchema<unknown, T.DocsUpdateCommentPostRequest> = v.looseObject({
  postId: v.optional(v.string()),
  content: v.optional(v.string()),
  commentId: v.optional(v.string()),
  suggestionId: v.optional(v.string()),
})

export const DocsSuggestedTableCellStyle: v.GenericSchema<unknown, T.DocsSuggestedTableCellStyle> = v.looseObject({
  tableCellStyleSuggestionState: v.optional(v.lazy(() => DocsTableCellStyleSuggestionState)),
  tableCellStyle: v.optional(v.lazy(() => DocsTableCellStyle)),
})

export const DocsColumnBreak: v.GenericSchema<unknown, T.DocsColumnBreak> = v.looseObject({
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
})

export const DocsWeightedFontFamily: v.GenericSchema<unknown, T.DocsWeightedFontFamily> = v.looseObject({
  weight: v.optional(integer()),
  fontFamily: v.optional(v.string()),
})

export const DocsPostAuthor: v.GenericSchema<unknown, T.DocsPostAuthor> = v.looseObject({
  displayName: v.optional(v.string()),
  anonymous: v.optional(v.boolean()),
  user: v.optional(v.string()),
  me: v.optional(v.boolean()),
})

export const DocsDocumentTab: v.GenericSchema<unknown, T.DocsDocumentTab> = v.looseObject({
  body: v.optional(v.lazy(() => DocsBody)),
  suggestedNamedStylesChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedNamedStyles),
    ),
  ),
  namedRanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsNamedRanges),
    ),
  ),
  positionedObjects: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsPositionedObject),
    ),
  ),
  suggestedDocumentStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedDocumentStyle),
    ),
  ),
  documentStyle: v.optional(v.lazy(() => DocsDocumentStyle)),
  headers: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsHeader),
    ),
  ),
  inlineObjects: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsInlineObject),
    ),
  ),
  namedStyles: v.optional(v.lazy(() => DocsNamedStyles)),
  lists: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsList),
    ),
  ),
  footnotes: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsFootnote),
    ),
  ),
  footers: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsFooter),
    ),
  ),
  commentAnchors: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsCommentAnchor),
    ),
  ),
  dropdownDefinitions: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsDropdownDefinition),
    ),
  ),
})

export const DocsInsertCommentRequest: v.GenericSchema<unknown, T.DocsInsertCommentRequest> = v.looseObject({
  range: v.optional(v.lazy(() => DocsRange)),
  assigneeEmailAddress: v.optional(v.string()),
  content: v.optional(v.string()),
})

export const DocsSuggestedParagraphStyle: v.GenericSchema<unknown, T.DocsSuggestedParagraphStyle> = v.looseObject({
  paragraphStyle: v.optional(v.lazy(() => DocsParagraphStyle)),
  paragraphStyleSuggestionState: v.optional(v.lazy(() => DocsParagraphStyleSuggestionState)),
})

export const DocsDeleteCommentRequest: v.GenericSchema<unknown, T.DocsDeleteCommentRequest> = v.looseObject({
  commentId: v.optional(v.string()),
})

export const DocsTableStyle: v.GenericSchema<unknown, T.DocsTableStyle> = v.looseObject({
  tableColumnProperties: v.optional(v.array(v.lazy(() => DocsTableColumnProperties))),
})

export const DocsUpdateDropdownDefinitionPropertiesRequest: v.GenericSchema<
  unknown,
  T.DocsUpdateDropdownDefinitionPropertiesRequest
> = v.looseObject({
  dropdownDefinitionId: v.optional(v.string()),
  tabId: v.optional(v.string()),
  selectedOptionIdReplacements: v.optional(v.record(v.string(), v.string())),
  dropdownDefinitionProperties: v.optional(v.lazy(() => DocsDropdownDefinitionProperties)),
  fields: v.optional(v.string()),
})

export const DocsCreateDropdownDefinitionResponse: v.GenericSchema<unknown, T.DocsCreateDropdownDefinitionResponse> =
  v.looseObject({
    dropdownDefinition: v.optional(v.lazy(() => DocsDropdownDefinition)),
  })

export const DocsDeleteTabRequest: v.GenericSchema<unknown, T.DocsDeleteTabRequest> = v.looseObject({
  tabId: v.optional(v.string()),
})

export const DocsPositionedObjectPropertiesSuggestionState: v.GenericSchema<
  unknown,
  T.DocsPositionedObjectPropertiesSuggestionState
> = v.looseObject({
  positioningSuggestionState: v.optional(v.lazy(() => DocsPositionedObjectPositioningSuggestionState)),
  embeddedObjectSuggestionState: v.optional(v.lazy(() => DocsEmbeddedObjectSuggestionState)),
})

export const DocsTableCellStyleSuggestionState: v.GenericSchema<unknown, T.DocsTableCellStyleSuggestionState> =
  v.looseObject({
    contentAlignmentSuggested: v.optional(v.boolean()),
    columnSpanSuggested: v.optional(v.boolean()),
    borderLeftSuggested: v.optional(v.boolean()),
    paddingTopSuggested: v.optional(v.boolean()),
    paddingBottomSuggested: v.optional(v.boolean()),
    borderBottomSuggested: v.optional(v.boolean()),
    paddingRightSuggested: v.optional(v.boolean()),
    paddingLeftSuggested: v.optional(v.boolean()),
    rowSpanSuggested: v.optional(v.boolean()),
    borderTopSuggested: v.optional(v.boolean()),
    backgroundColorSuggested: v.optional(v.boolean()),
    borderRightSuggested: v.optional(v.boolean()),
  })

export const DocsPositionedObjectPositioning: v.GenericSchema<unknown, T.DocsPositionedObjectPositioning> =
  v.looseObject({
    leftOffset: v.optional(v.lazy(() => DocsDimension)),
    layout: v.optional(
      v.picklist([
        "POSITIONED_OBJECT_LAYOUT_UNSPECIFIED",
        "WRAP_TEXT",
        "BREAK_LEFT",
        "BREAK_RIGHT",
        "BREAK_LEFT_RIGHT",
        "IN_FRONT_OF_TEXT",
        "BEHIND_TEXT",
      ]),
    ),
    topOffset: v.optional(v.lazy(() => DocsDimension)),
  })

export const DocsAddDocumentTabRequest: v.GenericSchema<unknown, T.DocsAddDocumentTabRequest> = v.looseObject({
  tabProperties: v.optional(v.lazy(() => DocsTabProperties)),
})

export const DocsEquation: v.GenericSchema<unknown, T.DocsEquation> = v.looseObject({
  suggestedDeletionIds: v.optional(v.array(v.string())),
  suggestedInsertionIds: v.optional(v.array(v.string())),
})

export const DocsTableRowStyle: v.GenericSchema<unknown, T.DocsTableRowStyle> = v.looseObject({
  tableHeader: v.optional(v.boolean()),
  minRowHeight: v.optional(v.lazy(() => DocsDimension)),
  preventOverflow: v.optional(v.boolean()),
})

export const DocsDocumentFormat: v.GenericSchema<unknown, T.DocsDocumentFormat> = v.looseObject({
  documentMode: v.optional(v.picklist(["DOCUMENT_MODE_UNSPECIFIED", "PAGES", "PAGELESS"])),
})

export const DocsRange: v.GenericSchema<unknown, T.DocsRange> = v.looseObject({
  segmentId: v.optional(v.string()),
  endIndex: v.optional(integer()),
  tabId: v.optional(v.string()),
  startIndex: v.optional(integer()),
})

export const DocsDateElement: v.GenericSchema<unknown, T.DocsDateElement> = v.looseObject({
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  suggestedDateElementPropertiesChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedDateElementProperties),
    ),
  ),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  dateElementProperties: v.optional(v.lazy(() => DocsDateElementProperties)),
  dateId: v.optional(v.string()),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
})

export const DocsSuggestedListProperties: v.GenericSchema<unknown, T.DocsSuggestedListProperties> = v.looseObject({
  listProperties: v.optional(v.lazy(() => DocsListProperties)),
  listPropertiesSuggestionState: v.optional(v.lazy(() => DocsListPropertiesSuggestionState)),
})

export const DocsList: v.GenericSchema<unknown, T.DocsList> = v.looseObject({
  suggestedListPropertiesChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedListProperties),
    ),
  ),
  suggestedInsertionId: v.optional(v.string()),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  listProperties: v.optional(v.lazy(() => DocsListProperties)),
})

export const DocsDropdownOption: v.GenericSchema<unknown, T.DocsDropdownOption> = v.looseObject({
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  optionId: v.optional(v.string()),
  displayValue: v.optional(v.string()),
})

export const DocsCropProperties: v.GenericSchema<unknown, T.DocsCropProperties> = v.looseObject({
  offsetRight: v.optional(number()),
  offsetTop: v.optional(number()),
  offsetLeft: v.optional(number()),
  angle: v.optional(number()),
  offsetBottom: v.optional(number()),
})

export const DocsParagraphBorder: v.GenericSchema<unknown, T.DocsParagraphBorder> = v.looseObject({
  color: v.optional(v.lazy(() => DocsOptionalColor)),
  width: v.optional(v.lazy(() => DocsDimension)),
  padding: v.optional(v.lazy(() => DocsDimension)),
  dashStyle: v.optional(v.picklist(["DASH_STYLE_UNSPECIFIED", "SOLID", "DOT", "DASH"])),
})

export const DocsSuggestedNamedStyles: v.GenericSchema<unknown, T.DocsSuggestedNamedStyles> = v.looseObject({
  namedStyles: v.optional(v.lazy(() => DocsNamedStyles)),
  namedStylesSuggestionState: v.optional(v.lazy(() => DocsNamedStylesSuggestionState)),
})

export const DocsSizeSuggestionState: v.GenericSchema<unknown, T.DocsSizeSuggestionState> = v.looseObject({
  heightSuggested: v.optional(v.boolean()),
  widthSuggested: v.optional(v.boolean()),
})

export const DocsEmbeddedObjectBorderSuggestionState: v.GenericSchema<
  unknown,
  T.DocsEmbeddedObjectBorderSuggestionState
> = v.looseObject({
  widthSuggested: v.optional(v.boolean()),
  dashStyleSuggested: v.optional(v.boolean()),
  colorSuggested: v.optional(v.boolean()),
  propertyStateSuggested: v.optional(v.boolean()),
})

export const DocsParagraphStyle: v.GenericSchema<unknown, T.DocsParagraphStyle> = v.looseObject({
  indentEnd: v.optional(v.lazy(() => DocsDimension)),
  borderBottom: v.optional(v.lazy(() => DocsParagraphBorder)),
  avoidWidowAndOrphan: v.optional(v.boolean()),
  headingId: v.optional(v.string()),
  borderTop: v.optional(v.lazy(() => DocsParagraphBorder)),
  borderBetween: v.optional(v.lazy(() => DocsParagraphBorder)),
  spacingMode: v.optional(v.picklist(["SPACING_MODE_UNSPECIFIED", "NEVER_COLLAPSE", "COLLAPSE_LISTS"])),
  indentFirstLine: v.optional(v.lazy(() => DocsDimension)),
  direction: v.optional(v.picklist(["CONTENT_DIRECTION_UNSPECIFIED", "LEFT_TO_RIGHT", "RIGHT_TO_LEFT"])),
  keepLinesTogether: v.optional(v.boolean()),
  keepWithNext: v.optional(v.boolean()),
  pageBreakBefore: v.optional(v.boolean()),
  lineSpacing: v.optional(number()),
  indentStart: v.optional(v.lazy(() => DocsDimension)),
  spaceBelow: v.optional(v.lazy(() => DocsDimension)),
  tabStops: v.optional(v.array(v.lazy(() => DocsTabStop))),
  spaceAbove: v.optional(v.lazy(() => DocsDimension)),
  borderLeft: v.optional(v.lazy(() => DocsParagraphBorder)),
  borderRight: v.optional(v.lazy(() => DocsParagraphBorder)),
  namedStyleType: v.optional(
    v.picklist([
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
    ]),
  ),
  shading: v.optional(v.lazy(() => DocsShading)),
  alignment: v.optional(v.picklist(["ALIGNMENT_UNSPECIFIED", "START", "CENTER", "END", "JUSTIFIED"])),
})

export const DocsUpdateTableCellStyleRequest: v.GenericSchema<unknown, T.DocsUpdateTableCellStyleRequest> =
  v.looseObject({
    fields: v.optional(v.string()),
    tableCellStyle: v.optional(v.lazy(() => DocsTableCellStyle)),
    tableRange: v.optional(v.lazy(() => DocsTableRange)),
    tableStartLocation: v.optional(v.lazy(() => DocsLocation)),
  })

export const DocsNamedStyleSuggestionState: v.GenericSchema<unknown, T.DocsNamedStyleSuggestionState> = v.looseObject({
  namedStyleType: v.optional(
    v.picklist([
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
    ]),
  ),
  paragraphStyleSuggestionState: v.optional(v.lazy(() => DocsParagraphStyleSuggestionState)),
  textStyleSuggestionState: v.optional(v.lazy(() => DocsTextStyleSuggestionState)),
})

export const DocsDateElementPropertiesSuggestionState: v.GenericSchema<
  unknown,
  T.DocsDateElementPropertiesSuggestionState
> = v.looseObject({
  localeSuggested: v.optional(v.boolean()),
  timeFormatSuggested: v.optional(v.boolean()),
  timeZoneIdSuggested: v.optional(v.boolean()),
  timestampSuggested: v.optional(v.boolean()),
  dateFormatSuggested: v.optional(v.boolean()),
})

export const DocsSuggestedDateElementProperties: v.GenericSchema<unknown, T.DocsSuggestedDateElementProperties> =
  v.looseObject({
    dateElementPropertiesSuggestionState: v.optional(v.lazy(() => DocsDateElementPropertiesSuggestionState)),
    dateElementProperties: v.optional(v.lazy(() => DocsDateElementProperties)),
  })

export const DocsLink: v.GenericSchema<unknown, T.DocsLink> = v.looseObject({
  tabId: v.optional(v.string()),
  url: v.optional(v.string()),
  heading: v.optional(v.lazy(() => DocsHeadingLink)),
  headingId: v.optional(v.string()),
  bookmarkId: v.optional(v.string()),
  bookmark: v.optional(v.lazy(() => DocsBookmarkLink)),
})

export const DocsDeletePositionedObjectRequest: v.GenericSchema<unknown, T.DocsDeletePositionedObjectRequest> =
  v.looseObject({
    objectId: v.optional(v.string()),
    tabId: v.optional(v.string()),
  })

export const DocsDeleteDropdownDefinitionRequest: v.GenericSchema<unknown, T.DocsDeleteDropdownDefinitionRequest> =
  v.looseObject({
    tabId: v.optional(v.string()),
    dropdownDefinitionId: v.optional(v.string()),
  })

export const DocsMergeTableCellsRequest: v.GenericSchema<unknown, T.DocsMergeTableCellsRequest> = v.looseObject({
  tableRange: v.optional(v.lazy(() => DocsTableRange)),
})

export const DocsRichLink: v.GenericSchema<unknown, T.DocsRichLink> = v.looseObject({
  richLinkProperties: v.optional(v.lazy(() => DocsRichLinkProperties)),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  richLinkId: v.optional(v.string()),
  suggestedDeletionIds: v.optional(v.array(v.string())),
})

export const DocsDropdownDefinitionProperties: v.GenericSchema<unknown, T.DocsDropdownDefinitionProperties> =
  v.looseObject({
    title: v.optional(v.string()),
    options: v.optional(v.array(v.lazy(() => DocsDropdownOption))),
  })

export const DocsCreateHeaderResponse: v.GenericSchema<unknown, T.DocsCreateHeaderResponse> = v.looseObject({
  headerId: v.optional(v.string()),
})

export const DocsParagraph: v.GenericSchema<unknown, T.DocsParagraph> = v.looseObject({
  suggestedParagraphStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedParagraphStyle),
    ),
  ),
  suggestedPositionedObjectIds: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsObjectReferences),
    ),
  ),
  paragraphStyle: v.optional(v.lazy(() => DocsParagraphStyle)),
  positionedObjectIds: v.optional(v.array(v.string())),
  bullet: v.optional(v.lazy(() => DocsBullet)),
  suggestedBulletChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedBullet),
    ),
  ),
  elements: v.optional(v.array(v.lazy(() => DocsParagraphElement))),
})

export const DocsCreateNamedRangeResponse: v.GenericSchema<unknown, T.DocsCreateNamedRangeResponse> = v.looseObject({
  namedRangeId: v.optional(v.string()),
})

export const DocsTextStyle: v.GenericSchema<unknown, T.DocsTextStyle> = v.looseObject({
  smallCaps: v.optional(v.boolean()),
  underline: v.optional(v.boolean()),
  fontSize: v.optional(v.lazy(() => DocsDimension)),
  bold: v.optional(v.boolean()),
  baselineOffset: v.optional(v.picklist(["BASELINE_OFFSET_UNSPECIFIED", "NONE", "SUPERSCRIPT", "SUBSCRIPT"])),
  link: v.optional(v.lazy(() => DocsLink)),
  backgroundColor: v.optional(v.lazy(() => DocsOptionalColor)),
  weightedFontFamily: v.optional(v.lazy(() => DocsWeightedFontFamily)),
  italic: v.optional(v.boolean()),
  foregroundColor: v.optional(v.lazy(() => DocsOptionalColor)),
  strikethrough: v.optional(v.boolean()),
})

export const DocsCreateParagraphBulletsRequest: v.GenericSchema<unknown, T.DocsCreateParagraphBulletsRequest> =
  v.looseObject({
    range: v.optional(v.lazy(() => DocsRange)),
    bulletPreset: v.optional(
      v.picklist([
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
      ]),
    ),
  })

export const DocsRejectSuggestionRequest: v.GenericSchema<unknown, T.DocsRejectSuggestionRequest> = v.looseObject({
  suggestionId: v.optional(v.string()),
})

export const DocsCreateFootnoteResponse: v.GenericSchema<unknown, T.DocsCreateFootnoteResponse> = v.looseObject({
  footnoteId: v.optional(v.string()),
})

export const DocsSectionBreak: v.GenericSchema<unknown, T.DocsSectionBreak> = v.looseObject({
  sectionStyle: v.optional(v.lazy(() => DocsSectionStyle)),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  suggestedInsertionIds: v.optional(v.array(v.string())),
})

export const DocsSuggestedDropdownProperties: v.GenericSchema<unknown, T.DocsSuggestedDropdownProperties> =
  v.looseObject({
    dropdownPropertiesSuggestionState: v.optional(v.lazy(() => DocsDropdownPropertiesSuggestionState)),
    dropdownProperties: v.optional(v.lazy(() => DocsDropdownProperties)),
  })

export const DocsBackgroundSuggestionState: v.GenericSchema<unknown, T.DocsBackgroundSuggestionState> = v.looseObject({
  backgroundColorSuggested: v.optional(v.boolean()),
})

export const DocsUpdateParagraphStyleRequest: v.GenericSchema<unknown, T.DocsUpdateParagraphStyleRequest> =
  v.looseObject({
    fields: v.optional(v.string()),
    paragraphStyle: v.optional(v.lazy(() => DocsParagraphStyle)),
    range: v.optional(v.lazy(() => DocsRange)),
  })

export const DocsInlineObjectElement: v.GenericSchema<unknown, T.DocsInlineObjectElement> = v.looseObject({
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  inlineObjectId: v.optional(v.string()),
  suggestedDeletionIds: v.optional(v.array(v.string())),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
  suggestedInsertionIds: v.optional(v.array(v.string())),
})

export const DocsDeleteFooterRequest: v.GenericSchema<unknown, T.DocsDeleteFooterRequest> = v.looseObject({
  tabId: v.optional(v.string()),
  footerId: v.optional(v.string()),
})

export const DocsPinTableHeaderRowsRequest: v.GenericSchema<unknown, T.DocsPinTableHeaderRowsRequest> = v.looseObject({
  tableStartLocation: v.optional(v.lazy(() => DocsLocation)),
  pinnedHeaderRowsCount: v.optional(integer()),
})

export const DocsPositionedObjectPositioningSuggestionState: v.GenericSchema<
  unknown,
  T.DocsPositionedObjectPositioningSuggestionState
> = v.looseObject({
  topOffsetSuggested: v.optional(v.boolean()),
  leftOffsetSuggested: v.optional(v.boolean()),
  layoutSuggested: v.optional(v.boolean()),
})

export const DocsInsertInlineSheetsChartResponse: v.GenericSchema<unknown, T.DocsInsertInlineSheetsChartResponse> =
  v.looseObject({
    objectId: v.optional(v.string()),
  })

export const DocsInsertPersonRequest: v.GenericSchema<unknown, T.DocsInsertPersonRequest> = v.looseObject({
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
  location: v.optional(v.lazy(() => DocsLocation)),
  personProperties: v.optional(v.lazy(() => DocsPersonProperties)),
})

export const DocsInsertRichLinkRequest: v.GenericSchema<unknown, T.DocsInsertRichLinkRequest> = v.looseObject({
  richLinkProperties: v.optional(v.lazy(() => DocsRichLinkProperties)),
  location: v.optional(v.lazy(() => DocsLocation)),
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
})

export const DocsBulletSuggestionState: v.GenericSchema<unknown, T.DocsBulletSuggestionState> = v.looseObject({
  nestingLevelSuggested: v.optional(v.boolean()),
  listIdSuggested: v.optional(v.boolean()),
  textStyleSuggestionState: v.optional(v.lazy(() => DocsTextStyleSuggestionState)),
})

export const DocsUpdateSectionStyleRequest: v.GenericSchema<unknown, T.DocsUpdateSectionStyleRequest> = v.looseObject({
  fields: v.optional(v.string()),
  range: v.optional(v.lazy(() => DocsRange)),
  sectionStyle: v.optional(v.lazy(() => DocsSectionStyle)),
})

export const DocsInsertDropdownRequest: v.GenericSchema<unknown, T.DocsInsertDropdownRequest> = v.looseObject({
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
  dropdownDefinitionId: v.optional(v.string()),
  selectedOptionId: v.optional(v.string()),
  location: v.optional(v.lazy(() => DocsLocation)),
})

export const DocsPerson: v.GenericSchema<unknown, T.DocsPerson> = v.looseObject({
  suggestedDeletionIds: v.optional(v.array(v.string())),
  personId: v.optional(v.string()),
  suggestedTextStyleChanges: v.optional(
    v.record(
      v.string(),
      v.lazy(() => DocsSuggestedTextStyle),
    ),
  ),
  suggestedInsertionIds: v.optional(v.array(v.string())),
  textStyle: v.optional(v.lazy(() => DocsTextStyle)),
  personProperties: v.optional(v.lazy(() => DocsPersonProperties)),
})

export const DocsInsertInlineImageResponse: v.GenericSchema<unknown, T.DocsInsertInlineImageResponse> = v.looseObject({
  objectId: v.optional(v.string()),
})

export const DocsRequest: v.GenericSchema<unknown, T.DocsRequest> = v.looseObject({
  insertSectionBreak: v.optional(v.lazy(() => DocsInsertSectionBreakRequest)),
  insertTableColumn: v.optional(v.lazy(() => DocsInsertTableColumnRequest)),
  updateDropdownDefinitionProperties: v.optional(v.lazy(() => DocsUpdateDropdownDefinitionPropertiesRequest)),
  addDocumentTab: v.optional(v.lazy(() => DocsAddDocumentTabRequest)),
  deleteTab: v.optional(v.lazy(() => DocsDeleteTabRequest)),
  createHeader: v.optional(v.lazy(() => DocsCreateHeaderRequest)),
  insertPageBreak: v.optional(v.lazy(() => DocsInsertPageBreakRequest)),
  deleteDropdownDefinition: v.optional(v.lazy(() => DocsDeleteDropdownDefinitionRequest)),
  deletePositionedObject: v.optional(v.lazy(() => DocsDeletePositionedObjectRequest)),
  createNamedRange: v.optional(v.lazy(() => DocsCreateNamedRangeRequest)),
  unmergeTableCells: v.optional(v.lazy(() => DocsUnmergeTableCellsRequest)),
  deleteCommentReply: v.optional(v.lazy(() => DocsDeleteCommentReplyRequest)),
  insertDropdown: v.optional(v.lazy(() => DocsInsertDropdownRequest)),
  replaceImage: v.optional(v.lazy(() => DocsReplaceImageRequest)),
  insertText: v.optional(v.lazy(() => DocsInsertTextRequest)),
  rejectSuggestion: v.optional(v.lazy(() => DocsRejectSuggestionRequest)),
  replaceAllText: v.optional(v.lazy(() => DocsReplaceAllTextRequest)),
  updateDropdownProperties: v.optional(v.lazy(() => DocsUpdateDropdownPropertiesRequest)),
  deleteFooter: v.optional(v.lazy(() => DocsDeleteFooterRequest)),
  insertComment: v.optional(v.lazy(() => DocsInsertCommentRequest)),
  updateSectionStyle: v.optional(v.lazy(() => DocsUpdateSectionStyleRequest)),
  deleteContentRange: v.optional(v.lazy(() => DocsDeleteContentRangeRequest)),
  updateTableCellStyle: v.optional(v.lazy(() => DocsUpdateTableCellStyleRequest)),
  deleteComment: v.optional(v.lazy(() => DocsDeleteCommentRequest)),
  updateDocumentStyle: v.optional(v.lazy(() => DocsUpdateDocumentStyleRequest)),
  createDropdownDefinition: v.optional(v.lazy(() => DocsCreateDropdownDefinitionRequest)),
  mergeTableCells: v.optional(v.lazy(() => DocsMergeTableCellsRequest)),
  deleteHeader: v.optional(v.lazy(() => DocsDeleteHeaderRequest)),
  updateNamedStyle: v.optional(v.lazy(() => DocsUpdateNamedStyleRequest)),
  updateTableRowStyle: v.optional(v.lazy(() => DocsUpdateTableRowStyleRequest)),
  insertInlineImage: v.optional(v.lazy(() => DocsInsertInlineImageRequest)),
  updateTextStyle: v.optional(v.lazy(() => DocsUpdateTextStyleRequest)),
  pinTableHeaderRows: v.optional(v.lazy(() => DocsPinTableHeaderRowsRequest)),
  acceptSuggestion: v.optional(v.lazy(() => DocsAcceptSuggestionRequest)),
  updateCommentPost: v.optional(v.lazy(() => DocsUpdateCommentPostRequest)),
  replaceNamedRangeContent: v.optional(v.lazy(() => DocsReplaceNamedRangeContentRequest)),
  insertTable: v.optional(v.lazy(() => DocsInsertTableRequest)),
  addCommentReply: v.optional(v.lazy(() => DocsAddCommentReplyRequest)),
  updateParagraphStyle: v.optional(v.lazy(() => DocsUpdateParagraphStyleRequest)),
  deleteTableRow: v.optional(v.lazy(() => DocsDeleteTableRowRequest)),
  deleteSuggestion: v.optional(v.lazy(() => DocsDeleteSuggestionRequest)),
  insertPerson: v.optional(v.lazy(() => DocsInsertPersonRequest)),
  insertRichLink: v.optional(v.lazy(() => DocsInsertRichLinkRequest)),
  deleteParagraphBullets: v.optional(v.lazy(() => DocsDeleteParagraphBulletsRequest)),
  createFooter: v.optional(v.lazy(() => DocsCreateFooterRequest)),
  insertDate: v.optional(v.lazy(() => DocsInsertDateRequest)),
  deleteNamedRange: v.optional(v.lazy(() => DocsDeleteNamedRangeRequest)),
  createParagraphBullets: v.optional(v.lazy(() => DocsCreateParagraphBulletsRequest)),
  insertTableRow: v.optional(v.lazy(() => DocsInsertTableRowRequest)),
  deleteTableColumn: v.optional(v.lazy(() => DocsDeleteTableColumnRequest)),
  updateTableColumnProperties: v.optional(v.lazy(() => DocsUpdateTableColumnPropertiesRequest)),
  createFootnote: v.optional(v.lazy(() => DocsCreateFootnoteRequest)),
  updateDocumentTabProperties: v.optional(v.lazy(() => DocsUpdateDocumentTabPropertiesRequest)),
})

export const DocsInsertPageBreakRequest: v.GenericSchema<unknown, T.DocsInsertPageBreakRequest> = v.looseObject({
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
  location: v.optional(v.lazy(() => DocsLocation)),
})

export const DocsDocumentStyleSuggestionState: v.GenericSchema<unknown, T.DocsDocumentStyleSuggestionState> =
  v.looseObject({
    defaultFooterIdSuggested: v.optional(v.boolean()),
    marginHeaderSuggested: v.optional(v.boolean()),
    useEvenPageHeaderFooterSuggested: v.optional(v.boolean()),
    evenPageHeaderIdSuggested: v.optional(v.boolean()),
    defaultHeaderIdSuggested: v.optional(v.boolean()),
    useFirstPageHeaderFooterSuggested: v.optional(v.boolean()),
    evenPageFooterIdSuggested: v.optional(v.boolean()),
    pageSizeSuggestionState: v.optional(v.lazy(() => DocsSizeSuggestionState)),
    pageNumberStartSuggested: v.optional(v.boolean()),
    marginTopSuggested: v.optional(v.boolean()),
    firstPageFooterIdSuggested: v.optional(v.boolean()),
    useCustomHeaderFooterMarginsSuggested: v.optional(v.boolean()),
    backgroundSuggestionState: v.optional(v.lazy(() => DocsBackgroundSuggestionState)),
    flipPageOrientationSuggested: v.optional(v.boolean()),
    marginLeftSuggested: v.optional(v.boolean()),
    marginRightSuggested: v.optional(v.boolean()),
    firstPageHeaderIdSuggested: v.optional(v.boolean()),
    marginBottomSuggested: v.optional(v.boolean()),
    marginFooterSuggested: v.optional(v.boolean()),
  })

export const DocsShadingSuggestionState: v.GenericSchema<unknown, T.DocsShadingSuggestionState> = v.looseObject({
  backgroundColorSuggested: v.optional(v.boolean()),
})

export const DocsTableRange: v.GenericSchema<unknown, T.DocsTableRange> = v.looseObject({
  columnSpan: v.optional(integer()),
  tableCellLocation: v.optional(v.lazy(() => DocsTableCellLocation)),
  rowSpan: v.optional(integer()),
})

export const DocsCreateDropdownDefinitionRequest: v.GenericSchema<unknown, T.DocsCreateDropdownDefinitionRequest> =
  v.looseObject({
    dropdownDefinition: v.optional(v.lazy(() => DocsDropdownDefinition)),
    tabId: v.optional(v.string()),
  })

export const DocsParagraphElement: v.GenericSchema<unknown, T.DocsParagraphElement> = v.looseObject({
  endIndex: v.optional(integer()),
  richLink: v.optional(v.lazy(() => DocsRichLink)),
  inlineObjectElement: v.optional(v.lazy(() => DocsInlineObjectElement)),
  pageBreak: v.optional(v.lazy(() => DocsPageBreak)),
  equation: v.optional(v.lazy(() => DocsEquation)),
  horizontalRule: v.optional(v.lazy(() => DocsHorizontalRule)),
  dateElement: v.optional(v.lazy(() => DocsDateElement)),
  autoText: v.optional(v.lazy(() => DocsAutoText)),
  footnoteReference: v.optional(v.lazy(() => DocsFootnoteReference)),
  dropdown: v.optional(v.lazy(() => DocsDropdown)),
  person: v.optional(v.lazy(() => DocsPerson)),
  textRun: v.optional(v.lazy(() => DocsTextRun)),
  columnBreak: v.optional(v.lazy(() => DocsColumnBreak)),
  startIndex: v.optional(integer()),
})

export const DocsSuggestedBullet: v.GenericSchema<unknown, T.DocsSuggestedBullet> = v.looseObject({
  bullet: v.optional(v.lazy(() => DocsBullet)),
  bulletSuggestionState: v.optional(v.lazy(() => DocsBulletSuggestionState)),
})

export const DocsPost: v.GenericSchema<unknown, T.DocsPost> = v.looseObject({
  fromCopiedDocument: v.optional(v.boolean()),
  commentAction: v.optional(
    v.picklist(["COMMENT_ACTION_TYPE_UNSPECIFIED", "NO_COMMENT_ACTION_CHANGE", "RESOLVE", "REOPEN"]),
  ),
  content: v.optional(v.string()),
  deleted: v.optional(v.boolean()),
  fromDocumentComparison: v.optional(v.boolean()),
  postId: v.optional(v.string()),
  contentHtml: v.optional(v.string()),
  suggestionAction: v.optional(
    v.picklist(["SUGGESTION_ACTION_TYPE_UNSPECIFIED", "NO_SUGGESTION_ACTION_CHANGE", "ACCEPT", "REJECT"]),
  ),
  assigneeEmail: v.optional(v.string()),
  fromImportedDocument: v.optional(v.boolean()),
  author: v.optional(v.lazy(() => DocsPostAuthor)),
  updateTime: v.optional(v.string()),
  createTime: v.optional(v.string()),
})

export const DocsUpdateTableRowStyleRequest: v.GenericSchema<unknown, T.DocsUpdateTableRowStyleRequest> = v.looseObject(
  {
    tableRowStyle: v.optional(v.lazy(() => DocsTableRowStyle)),
    fields: v.optional(v.string()),
    rowIndices: v.optional(v.array(integer())),
    tableStartLocation: v.optional(v.lazy(() => DocsLocation)),
  },
)

export const DocsInsertSectionBreakRequest: v.GenericSchema<unknown, T.DocsInsertSectionBreakRequest> = v.looseObject({
  sectionType: v.optional(v.picklist(["SECTION_TYPE_UNSPECIFIED", "CONTINUOUS", "NEXT_PAGE"])),
  endOfSegmentLocation: v.optional(v.lazy(() => DocsEndOfSegmentLocation)),
  location: v.optional(v.lazy(() => DocsLocation)),
})

export const DocsReplaceNamedRangeContentRequest: v.GenericSchema<unknown, T.DocsReplaceNamedRangeContentRequest> =
  v.looseObject({
    text: v.optional(v.string()),
    namedRangeName: v.optional(v.string()),
    namedRangeId: v.optional(v.string()),
    tabsCriteria: v.optional(v.lazy(() => DocsTabsCriteria)),
  })

export const DocsLocation: v.GenericSchema<unknown, T.DocsLocation> = v.looseObject({
  segmentId: v.optional(v.string()),
  tabId: v.optional(v.string()),
  index: v.optional(integer()),
})

export const DocsSize: v.GenericSchema<unknown, T.DocsSize> = v.looseObject({
  height: v.optional(v.lazy(() => DocsDimension)),
  width: v.optional(v.lazy(() => DocsDimension)),
})

export const DocsUpdateTableColumnPropertiesRequest: v.GenericSchema<
  unknown,
  T.DocsUpdateTableColumnPropertiesRequest
> = v.looseObject({
  fields: v.optional(v.string()),
  tableColumnProperties: v.optional(v.lazy(() => DocsTableColumnProperties)),
  tableStartLocation: v.optional(v.lazy(() => DocsLocation)),
  columnIndices: v.optional(v.array(integer())),
})

export const DocsAddDocumentTabResponse: v.GenericSchema<unknown, T.DocsAddDocumentTabResponse> = v.looseObject({
  tabProperties: v.optional(v.lazy(() => DocsTabProperties)),
})

export const DocsDimension: v.GenericSchema<unknown, T.DocsDimension> = v.looseObject({
  unit: v.optional(v.picklist(["UNIT_UNSPECIFIED", "PT"])),
  magnitude: v.optional(number()),
})

export const DocsSuggestionThread: v.GenericSchema<unknown, T.DocsSuggestionThread> = v.looseObject({
  status: v.optional(v.picklist(["STATUS_UNSPECIFIED", "OPEN", "ACCEPTED", "REJECTED"])),
  suggestionId: v.optional(v.string()),
  headPost: v.optional(v.lazy(() => DocsPost)),
  summaryHtml: v.optional(v.string()),
  replies: v.optional(v.array(v.lazy(() => DocsPost))),
  summaryText: v.optional(v.string()),
})

export const DocsBookmarkLink: v.GenericSchema<unknown, T.DocsBookmarkLink> = v.looseObject({
  tabId: v.optional(v.string()),
  id: v.optional(v.string()),
})

export const DriveactivityAppliedLabelChange: v.GenericSchema<unknown, T.DriveactivityAppliedLabelChange> =
  v.looseObject({
    changes: v.optional(v.array(v.lazy(() => DriveactivityAppliedLabelChangeDetail))),
  })

export const DriveactivityLegacy: v.GenericSchema<unknown, T.DriveactivityLegacy> = v.looseObject({})

export const DriveactivityDataLeakPreventionChange: v.GenericSchema<unknown, T.DriveactivityDataLeakPreventionChange> =
  v.looseObject({
    type: v.optional(v.picklist(["TYPE_UNSPECIFIED", "FLAGGED", "CLEARED"])),
  })

export const DriveactivitySingleUser: v.GenericSchema<unknown, T.DriveactivitySingleUser> = v.looseObject({
  value: v.optional(v.string()),
})

export const DriveactivityTargetReference: v.GenericSchema<unknown, T.DriveactivityTargetReference> = v.looseObject({
  driveItem: v.optional(v.lazy(() => DriveactivityDriveItemReference)),
  teamDrive: v.optional(v.lazy(() => DriveactivityTeamDriveReference)),
  drive: v.optional(v.lazy(() => DriveactivityDriveReference)),
})

export const DriveactivityPost: v.GenericSchema<unknown, T.DriveactivityPost> = v.looseObject({
  subtype: v.optional(
    v.picklist(["SUBTYPE_UNSPECIFIED", "ADDED", "DELETED", "REPLY_ADDED", "REPLY_DELETED", "RESOLVED", "REOPENED"]),
  ),
})

export const DriveactivityImpersonation: v.GenericSchema<unknown, T.DriveactivityImpersonation> = v.looseObject({
  impersonatedUser: v.optional(v.lazy(() => DriveactivityUser)),
})

export const DriveactivityFieldValueChange: v.GenericSchema<unknown, T.DriveactivityFieldValueChange> = v.looseObject({
  fieldId: v.optional(v.string()),
  oldValue: v.optional(v.lazy(() => DriveactivityFieldValue)),
  newValue: v.optional(v.lazy(() => DriveactivityFieldValue)),
  displayName: v.optional(v.string()),
})

export const DriveactivityAdministrator: v.GenericSchema<unknown, T.DriveactivityAdministrator> = v.looseObject({})

export const DriveactivityDriveReference: v.GenericSchema<unknown, T.DriveactivityDriveReference> = v.looseObject({
  name: v.optional(v.string()),
  title: v.optional(v.string()),
})

export const DriveactivityTimeRange: v.GenericSchema<unknown, T.DriveactivityTimeRange> = v.looseObject({
  startTime: v.optional(v.string()),
  endTime: v.optional(v.string()),
})

export const DriveactivityDriveActivity: v.GenericSchema<unknown, T.DriveactivityDriveActivity> = v.looseObject({
  actors: v.optional(v.array(v.lazy(() => DriveactivityActor))),
  timeRange: v.optional(v.lazy(() => DriveactivityTimeRange)),
  targets: v.optional(v.array(v.lazy(() => DriveactivityTarget))),
  primaryActionDetail: v.optional(v.lazy(() => DriveactivityActionDetail)),
  actions: v.optional(v.array(v.lazy(() => DriveactivityAction))),
  timestamp: v.optional(v.string()),
})

export const DriveactivitySelectionList: v.GenericSchema<unknown, T.DriveactivitySelectionList> = v.looseObject({
  values: v.optional(v.array(v.lazy(() => DriveactivitySelection))),
})

export const DriveactivityFile: v.GenericSchema<unknown, T.DriveactivityFile> = v.looseObject({})

export const DriveactivityDelete: v.GenericSchema<unknown, T.DriveactivityDelete> = v.looseObject({
  type: v.optional(v.picklist(["TYPE_UNSPECIFIED", "TRASH", "PERMANENT_DELETE"])),
})

export const DriveactivityRestrictionChange: v.GenericSchema<unknown, T.DriveactivityRestrictionChange> = v.looseObject(
  {
    feature: v.optional(
      v.picklist([
        "FEATURE_UNSPECIFIED",
        "SHARING_OUTSIDE_DOMAIN",
        "DIRECT_SHARING",
        "ITEM_DUPLICATION",
        "DRIVE_FILE_STREAM",
        "FILE_ORGANIZER_CAN_SHARE_FOLDERS",
        "READERS_CAN_DOWNLOAD",
        "WRITERS_CAN_DOWNLOAD",
      ]),
    ),
    newRestriction: v.optional(v.picklist(["RESTRICTION_UNSPECIFIED", "UNRESTRICTED", "FULLY_RESTRICTED"])),
  },
)

export const DriveactivityNew: v.GenericSchema<unknown, T.DriveactivityNew> = v.looseObject({})

export const DriveactivityInteger: v.GenericSchema<unknown, T.DriveactivityInteger> = v.looseObject({
  value: v.optional(v.pipe(v.string(), v.regex(/^-?\d+$/))),
})

export const DriveactivitySuggestion: v.GenericSchema<unknown, T.DriveactivitySuggestion> = v.looseObject({
  subtype: v.optional(
    v.picklist([
      "SUBTYPE_UNSPECIFIED",
      "ADDED",
      "DELETED",
      "REPLY_ADDED",
      "REPLY_DELETED",
      "ACCEPTED",
      "REJECTED",
      "ACCEPT_DELETED",
      "REJECT_DELETED",
    ]),
  ),
})

export const DriveactivityGroup: v.GenericSchema<unknown, T.DriveactivityGroup> = v.looseObject({
  email: v.optional(v.string()),
  title: v.optional(v.string()),
})

export const DriveactivityQueryDriveActivityResponse: v.GenericSchema<
  unknown,
  T.DriveactivityQueryDriveActivityResponse
> = v.looseObject({
  activities: v.optional(v.array(v.lazy(() => DriveactivityDriveActivity))),
  nextPageToken: v.optional(v.string()),
})

export const DriveactivityActionDetail: v.GenericSchema<unknown, T.DriveactivityActionDetail> = v.looseObject({
  restore: v.optional(v.lazy(() => DriveactivityRestore)),
  permissionChange: v.optional(v.lazy(() => DriveactivityPermissionChange)),
  dlpChange: v.optional(v.lazy(() => DriveactivityDataLeakPreventionChange)),
  edit: v.optional(v.lazy(() => DriveactivityEdit)),
  settingsChange: v.optional(v.lazy(() => DriveactivitySettingsChange)),
  reference: v.optional(v.lazy(() => DriveactivityApplicationReference)),
  create: v.optional(v.lazy(() => DriveactivityCreate)),
  rename: v.optional(v.lazy(() => DriveactivityRename)),
  move: v.optional(v.lazy(() => DriveactivityMove)),
  appliedLabelChange: v.optional(v.lazy(() => DriveactivityAppliedLabelChange)),
  comment: v.optional(v.lazy(() => DriveactivityComment)),
  delete: v.optional(v.lazy(() => DriveactivityDelete)),
})

export const DriveactivityAction: v.GenericSchema<unknown, T.DriveactivityAction> = v.looseObject({
  detail: v.optional(v.lazy(() => DriveactivityActionDetail)),
  timestamp: v.optional(v.string()),
  target: v.optional(v.lazy(() => DriveactivityTarget)),
  timeRange: v.optional(v.lazy(() => DriveactivityTimeRange)),
  actor: v.optional(v.lazy(() => DriveactivityActor)),
})

export const DriveactivityComment: v.GenericSchema<unknown, T.DriveactivityComment> = v.looseObject({
  suggestion: v.optional(v.lazy(() => DriveactivitySuggestion)),
  assignment: v.optional(v.lazy(() => DriveactivityAssignment)),
  post: v.optional(v.lazy(() => DriveactivityPost)),
  mentionedUsers: v.optional(v.array(v.lazy(() => DriveactivityUser))),
})

export const DriveactivityFileComment: v.GenericSchema<unknown, T.DriveactivityFileComment> = v.looseObject({
  legacyCommentId: v.optional(v.string()),
  linkToDiscussion: v.optional(v.string()),
  legacyDiscussionId: v.optional(v.string()),
  parent: v.optional(v.lazy(() => DriveactivityDriveItem)),
})

export const DriveactivityAssignment: v.GenericSchema<unknown, T.DriveactivityAssignment> = v.looseObject({
  subtype: v.optional(
    v.picklist([
      "SUBTYPE_UNSPECIFIED",
      "ADDED",
      "DELETED",
      "REPLY_ADDED",
      "REPLY_DELETED",
      "RESOLVED",
      "REOPENED",
      "REASSIGNED",
    ]),
  ),
  assignedUser: v.optional(v.lazy(() => DriveactivityUser)),
})

export const DriveactivityNoConsolidation: v.GenericSchema<unknown, T.DriveactivityNoConsolidation> = v.looseObject({})

export const DriveactivityDriveFile: v.GenericSchema<unknown, T.DriveactivityDriveFile> = v.looseObject({})

export const DriveactivityText: v.GenericSchema<unknown, T.DriveactivityText> = v.looseObject({
  value: v.optional(v.string()),
})

export const DriveactivityMove: v.GenericSchema<unknown, T.DriveactivityMove> = v.looseObject({
  addedParents: v.optional(v.array(v.lazy(() => DriveactivityTargetReference))),
  removedParents: v.optional(v.array(v.lazy(() => DriveactivityTargetReference))),
})

export const DriveactivityUnknownUser: v.GenericSchema<unknown, T.DriveactivityUnknownUser> = v.looseObject({})

export const DriveactivitySettingsChange: v.GenericSchema<unknown, T.DriveactivitySettingsChange> = v.looseObject({
  restrictionChanges: v.optional(v.array(v.lazy(() => DriveactivityRestrictionChange))),
})

export const DriveactivityApplicationReference: v.GenericSchema<unknown, T.DriveactivityApplicationReference> =
  v.looseObject({
    type: v.optional(v.picklist(["UNSPECIFIED_REFERENCE_TYPE", "LINK", "DISCUSS"])),
  })

export const DriveactivityEdit: v.GenericSchema<unknown, T.DriveactivityEdit> = v.looseObject({})

export const DriveactivityAnyone: v.GenericSchema<unknown, T.DriveactivityAnyone> = v.looseObject({})

export const DriveactivityTeamDrive: v.GenericSchema<unknown, T.DriveactivityTeamDrive> = v.looseObject({
  title: v.optional(v.string()),
  name: v.optional(v.string()),
  root: v.optional(v.lazy(() => DriveactivityDriveItem)),
})

export const DriveactivitySystemEvent: v.GenericSchema<unknown, T.DriveactivitySystemEvent> = v.looseObject({
  type: v.optional(v.picklist(["TYPE_UNSPECIFIED", "USER_DELETION", "TRASH_AUTO_PURGE"])),
})

export const DriveactivityDomain: v.GenericSchema<unknown, T.DriveactivityDomain> = v.looseObject({
  legacyId: v.optional(v.string()),
  name: v.optional(v.string()),
})

export const DriveactivityActor: v.GenericSchema<unknown, T.DriveactivityActor> = v.looseObject({
  anonymous: v.optional(v.lazy(() => DriveactivityAnonymousUser)),
  user: v.optional(v.lazy(() => DriveactivityUser)),
  system: v.optional(v.lazy(() => DriveactivitySystemEvent)),
  administrator: v.optional(v.lazy(() => DriveactivityAdministrator)),
  impersonation: v.optional(v.lazy(() => DriveactivityImpersonation)),
})

export const DriveactivitySelection: v.GenericSchema<unknown, T.DriveactivitySelection> = v.looseObject({
  value: v.optional(v.string()),
  displayName: v.optional(v.string()),
})

export const DriveactivityPermission: v.GenericSchema<unknown, T.DriveactivityPermission> = v.looseObject({
  allowDiscovery: v.optional(v.boolean()),
  role: v.optional(
    v.picklist([
      "ROLE_UNSPECIFIED",
      "OWNER",
      "ORGANIZER",
      "FILE_ORGANIZER",
      "EDITOR",
      "COMMENTER",
      "VIEWER",
      "PUBLISHED_VIEWER",
    ]),
  ),
  domain: v.optional(v.lazy(() => DriveactivityDomain)),
  user: v.optional(v.lazy(() => DriveactivityUser)),
  group: v.optional(v.lazy(() => DriveactivityGroup)),
  anyone: v.optional(v.lazy(() => DriveactivityAnyone)),
})

export const DriveactivityRename: v.GenericSchema<unknown, T.DriveactivityRename> = v.looseObject({
  oldTitle: v.optional(v.string()),
  newTitle: v.optional(v.string()),
})

export const DriveactivityRestore: v.GenericSchema<unknown, T.DriveactivityRestore> = v.looseObject({
  type: v.optional(v.picklist(["TYPE_UNSPECIFIED", "UNTRASH"])),
})

export const DriveactivityKnownUser: v.GenericSchema<unknown, T.DriveactivityKnownUser> = v.looseObject({
  isCurrentUser: v.optional(v.boolean()),
  personName: v.optional(v.string()),
})

export const DriveactivityUserList: v.GenericSchema<unknown, T.DriveactivityUserList> = v.looseObject({
  values: v.optional(v.array(v.lazy(() => DriveactivitySingleUser))),
})

export const DriveactivityQueryDriveActivityRequest: v.GenericSchema<
  unknown,
  T.DriveactivityQueryDriveActivityRequest
> = v.looseObject({
  pageSize: v.optional(integer()),
  ancestorName: v.optional(v.string()),
  filter: v.optional(v.string()),
  consolidationStrategy: v.optional(v.lazy(() => DriveactivityConsolidationStrategy)),
  itemName: v.optional(v.string()),
  pageToken: v.optional(v.string()),
})

export const DriveactivityUpload: v.GenericSchema<unknown, T.DriveactivityUpload> = v.looseObject({})

export const DriveactivityCreate: v.GenericSchema<unknown, T.DriveactivityCreate> = v.looseObject({
  upload: v.optional(v.lazy(() => DriveactivityUpload)),
  copy: v.optional(v.lazy(() => DriveactivityCopy)),
  new: v.optional(v.lazy(() => DriveactivityNew)),
})

export const DriveactivityUser: v.GenericSchema<unknown, T.DriveactivityUser> = v.looseObject({
  knownUser: v.optional(v.lazy(() => DriveactivityKnownUser)),
  deletedUser: v.optional(v.lazy(() => DriveactivityDeletedUser)),
  unknownUser: v.optional(v.lazy(() => DriveactivityUnknownUser)),
})

export const DriveactivityDrive: v.GenericSchema<unknown, T.DriveactivityDrive> = v.looseObject({
  name: v.optional(v.string()),
  root: v.optional(v.lazy(() => DriveactivityDriveItem)),
  title: v.optional(v.string()),
})

export const DriveactivityDriveItemReference: v.GenericSchema<unknown, T.DriveactivityDriveItemReference> =
  v.looseObject({
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    driveFolder: v.optional(v.lazy(() => DriveactivityDriveFolder)),
    folder: v.optional(v.lazy(() => DriveactivityFolder)),
    driveFile: v.optional(v.lazy(() => DriveactivityDriveFile)),
    file: v.optional(v.lazy(() => DriveactivityFile)),
  })

export const DriveactivityAppliedLabelChangeDetail: v.GenericSchema<unknown, T.DriveactivityAppliedLabelChangeDetail> =
  v.looseObject({
    fieldChanges: v.optional(v.array(v.lazy(() => DriveactivityFieldValueChange))),
    label: v.optional(v.string()),
    types: v.optional(
      v.array(
        v.picklist([
          "TYPE_UNSPECIFIED",
          "LABEL_ADDED",
          "LABEL_REMOVED",
          "LABEL_FIELD_VALUE_CHANGED",
          "LABEL_APPLIED_BY_ITEM_CREATE",
        ]),
      ),
    ),
    title: v.optional(v.string()),
  })

export const DriveactivityAnonymousUser: v.GenericSchema<unknown, T.DriveactivityAnonymousUser> = v.looseObject({})

export const DriveactivityFieldValue: v.GenericSchema<unknown, T.DriveactivityFieldValue> = v.looseObject({
  userList: v.optional(v.lazy(() => DriveactivityUserList)),
  date: v.optional(v.lazy(() => DriveactivityDate)),
  integer: v.optional(v.lazy(() => DriveactivityInteger)),
  selectionList: v.optional(v.lazy(() => DriveactivitySelectionList)),
  textList: v.optional(v.lazy(() => DriveactivityTextList)),
  text: v.optional(v.lazy(() => DriveactivityText)),
  user: v.optional(v.lazy(() => DriveactivitySingleUser)),
  selection: v.optional(v.lazy(() => DriveactivitySelection)),
})

export const DriveactivityDeletedUser: v.GenericSchema<unknown, T.DriveactivityDeletedUser> = v.looseObject({})

export const DriveactivityDriveItem: v.GenericSchema<unknown, T.DriveactivityDriveItem> = v.looseObject({
  mimeType: v.optional(v.string()),
  name: v.optional(v.string()),
  driveFolder: v.optional(v.lazy(() => DriveactivityDriveFolder)),
  folder: v.optional(v.lazy(() => DriveactivityFolder)),
  owner: v.optional(v.lazy(() => DriveactivityOwner)),
  driveFile: v.optional(v.lazy(() => DriveactivityDriveFile)),
  file: v.optional(v.lazy(() => DriveactivityFile)),
  title: v.optional(v.string()),
})

export const DriveactivityFolder: v.GenericSchema<unknown, T.DriveactivityFolder> = v.looseObject({
  type: v.optional(v.picklist(["TYPE_UNSPECIFIED", "MY_DRIVE_ROOT", "TEAM_DRIVE_ROOT", "STANDARD_FOLDER"])),
})

export const DriveactivityTextList: v.GenericSchema<unknown, T.DriveactivityTextList> = v.looseObject({
  values: v.optional(v.array(v.lazy(() => DriveactivityText))),
})

export const DriveactivityTarget: v.GenericSchema<unknown, T.DriveactivityTarget> = v.looseObject({
  drive: v.optional(v.lazy(() => DriveactivityDrive)),
  driveItem: v.optional(v.lazy(() => DriveactivityDriveItem)),
  teamDrive: v.optional(v.lazy(() => DriveactivityTeamDrive)),
  fileComment: v.optional(v.lazy(() => DriveactivityFileComment)),
})

export const DriveactivityDriveFolder: v.GenericSchema<unknown, T.DriveactivityDriveFolder> = v.looseObject({
  type: v.optional(v.picklist(["TYPE_UNSPECIFIED", "MY_DRIVE_ROOT", "SHARED_DRIVE_ROOT", "STANDARD_FOLDER"])),
})

export const DriveactivityConsolidationStrategy: v.GenericSchema<unknown, T.DriveactivityConsolidationStrategy> =
  v.looseObject({
    legacy: v.optional(v.lazy(() => DriveactivityLegacy)),
    none: v.optional(v.lazy(() => DriveactivityNoConsolidation)),
  })

export const DriveactivityPermissionChange: v.GenericSchema<unknown, T.DriveactivityPermissionChange> = v.looseObject({
  addedPermissions: v.optional(v.array(v.lazy(() => DriveactivityPermission))),
  removedPermissions: v.optional(v.array(v.lazy(() => DriveactivityPermission))),
})

export const DriveactivityTeamDriveReference: v.GenericSchema<unknown, T.DriveactivityTeamDriveReference> =
  v.looseObject({
    name: v.optional(v.string()),
    title: v.optional(v.string()),
  })

export const DriveactivityCopy: v.GenericSchema<unknown, T.DriveactivityCopy> = v.looseObject({
  originalObject: v.optional(v.lazy(() => DriveactivityTargetReference)),
})

export const DriveactivityDate: v.GenericSchema<unknown, T.DriveactivityDate> = v.looseObject({
  value: v.optional(v.string()),
})

export const DriveactivityOwner: v.GenericSchema<unknown, T.DriveactivityOwner> = v.looseObject({
  domain: v.optional(v.lazy(() => DriveactivityDomain)),
  teamDrive: v.optional(v.lazy(() => DriveactivityTeamDriveReference)),
  user: v.optional(v.lazy(() => DriveactivityUser)),
  drive: v.optional(v.lazy(() => DriveactivityDriveReference)),
})

export const SheetsPost: v.GenericSchema<unknown, T.SheetsPost> = v.looseObject({
  assigneeEmail: v.optional(v.string()),
  updateTime: v.optional(v.string()),
  deleted: v.optional(v.boolean()),
  postId: v.optional(v.string()),
  commentAction: v.optional(
    v.picklist(["COMMENT_ACTION_TYPE_UNSPECIFIED", "NO_COMMENT_ACTION_CHANGE", "RESOLVE", "REOPEN"]),
  ),
  author: v.optional(v.lazy(() => SheetsPostAuthor)),
  fromImportedSpreadsheet: v.optional(v.boolean()),
  fromCopiedSpreadsheet: v.optional(v.boolean()),
  contentHtml: v.optional(v.string()),
  createTime: v.optional(v.string()),
  content: v.optional(v.string()),
})

export const SheetsAddTableRequest: v.GenericSchema<unknown, T.SheetsAddTableRequest> = v.looseObject({
  table: v.optional(v.lazy(() => SheetsTable)),
})

export const SheetsAddSlicerResponse: v.GenericSchema<unknown, T.SheetsAddSlicerResponse> = v.looseObject({
  slicer: v.optional(v.lazy(() => SheetsSlicer)),
})

export const SheetsDeleteDuplicatesResponse: v.GenericSchema<unknown, T.SheetsDeleteDuplicatesResponse> = v.looseObject(
  {
    duplicatesRemovedCount: v.optional(integer()),
  },
)

export const SheetsTrimWhitespaceRequest: v.GenericSchema<unknown, T.SheetsTrimWhitespaceRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsBasicChartDomain: v.GenericSchema<unknown, T.SheetsBasicChartDomain> = v.looseObject({
  reversed: v.optional(v.boolean()),
  domain: v.optional(v.lazy(() => SheetsChartData)),
})

export const SheetsTextPosition: v.GenericSchema<unknown, T.SheetsTextPosition> = v.looseObject({
  horizontalAlignment: v.optional(v.picklist(["HORIZONTAL_ALIGN_UNSPECIFIED", "LEFT", "CENTER", "RIGHT"])),
})

export const SheetsAppendDimensionRequest: v.GenericSchema<unknown, T.SheetsAppendDimensionRequest> = v.looseObject({
  sheetId: v.optional(integer()),
  length: v.optional(integer()),
  dimension: v.optional(v.picklist(["DIMENSION_UNSPECIFIED", "ROWS", "COLUMNS"])),
})

export const SheetsUpdateValuesResponse: v.GenericSchema<unknown, T.SheetsUpdateValuesResponse> = v.looseObject({
  updatedColumns: v.optional(integer()),
  spreadsheetId: v.optional(v.string()),
  updatedCells: v.optional(integer()),
  updatedRange: v.optional(v.string()),
  updatedRows: v.optional(integer()),
  updatedData: v.optional(v.lazy(() => SheetsValueRange)),
})

export const SheetsChartDateTimeRule: v.GenericSchema<unknown, T.SheetsChartDateTimeRule> = v.looseObject({
  type: v.optional(
    v.picklist([
      "CHART_DATE_TIME_RULE_TYPE_UNSPECIFIED",
      "SECOND",
      "MINUTE",
      "HOUR",
      "HOUR_MINUTE",
      "HOUR_MINUTE_AMPM",
      "DAY_OF_WEEK",
      "DAY_OF_YEAR",
      "DAY_OF_MONTH",
      "DAY_MONTH",
      "MONTH",
      "QUARTER",
      "YEAR",
      "YEAR_MONTH",
      "YEAR_QUARTER",
      "YEAR_MONTH_DAY",
    ]),
  ),
})

export const SheetsBooleanRule: v.GenericSchema<unknown, T.SheetsBooleanRule> = v.looseObject({
  format: v.optional(v.lazy(() => SheetsCellFormat)),
  condition: v.optional(v.lazy(() => SheetsBooleanCondition)),
})

export const SheetsMergeCellsRequest: v.GenericSchema<unknown, T.SheetsMergeCellsRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
  mergeType: v.optional(v.picklist(["MERGE_ALL", "MERGE_COLUMNS", "MERGE_ROWS"])),
})

export const SheetsAddDataSourceResponse: v.GenericSchema<unknown, T.SheetsAddDataSourceResponse> = v.looseObject({
  dataExecutionStatus: v.optional(v.lazy(() => SheetsDataExecutionStatus)),
  dataSource: v.optional(v.lazy(() => SheetsDataSource)),
})

export const SheetsTextFormat: v.GenericSchema<unknown, T.SheetsTextFormat> = v.looseObject({
  link: v.optional(v.lazy(() => SheetsLink)),
  fontSize: v.optional(integer()),
  foregroundColor: v.optional(v.lazy(() => SheetsColor)),
  bold: v.optional(v.boolean()),
  fontFamily: v.optional(v.string()),
  italic: v.optional(v.boolean()),
  underline: v.optional(v.boolean()),
  foregroundColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  strikethrough: v.optional(v.boolean()),
})

export const SheetsWaterfallChartSpec: v.GenericSchema<unknown, T.SheetsWaterfallChartSpec> = v.looseObject({
  hideConnectorLines: v.optional(v.boolean()),
  firstValueIsTotal: v.optional(v.boolean()),
  domain: v.optional(v.lazy(() => SheetsWaterfallChartDomain)),
  stackedType: v.optional(v.picklist(["WATERFALL_STACKED_TYPE_UNSPECIFIED", "STACKED", "SEQUENTIAL"])),
  connectorLineStyle: v.optional(v.lazy(() => SheetsLineStyle)),
  totalDataLabel: v.optional(v.lazy(() => SheetsDataLabel)),
  series: v.optional(v.array(v.lazy(() => SheetsWaterfallChartSeries))),
})

export const SheetsAddBandingRequest: v.GenericSchema<unknown, T.SheetsAddBandingRequest> = v.looseObject({
  bandedRange: v.optional(v.lazy(() => SheetsBandedRange)),
})

export const SheetsBorder: v.GenericSchema<unknown, T.SheetsBorder> = v.looseObject({
  colorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  width: v.optional(integer()),
  style: v.optional(
    v.picklist(["STYLE_UNSPECIFIED", "DOTTED", "DASHED", "SOLID", "SOLID_MEDIUM", "SOLID_THICK", "NONE", "DOUBLE"]),
  ),
  color: v.optional(v.lazy(() => SheetsColor)),
})

export const SheetsDeveloperMetadataLocation: v.GenericSchema<unknown, T.SheetsDeveloperMetadataLocation> =
  v.looseObject({
    locationType: v.optional(
      v.picklist(["DEVELOPER_METADATA_LOCATION_TYPE_UNSPECIFIED", "ROW", "COLUMN", "SHEET", "SPREADSHEET"]),
    ),
    sheetId: v.optional(integer()),
    dimensionRange: v.optional(v.lazy(() => SheetsDimensionRange)),
    spreadsheet: v.optional(v.boolean()),
  })

export const SheetsUpdateConditionalFormatRuleRequest: v.GenericSchema<
  unknown,
  T.SheetsUpdateConditionalFormatRuleRequest
> = v.looseObject({
  sheetId: v.optional(integer()),
  rule: v.optional(v.lazy(() => SheetsConditionalFormatRule)),
  newIndex: v.optional(integer()),
  index: v.optional(integer()),
})

export const SheetsOrgChartSpec: v.GenericSchema<unknown, T.SheetsOrgChartSpec> = v.looseObject({
  tooltips: v.optional(v.lazy(() => SheetsChartData)),
  nodeColor: v.optional(v.lazy(() => SheetsColor)),
  labels: v.optional(v.lazy(() => SheetsChartData)),
  nodeSize: v.optional(v.picklist(["ORG_CHART_LABEL_SIZE_UNSPECIFIED", "SMALL", "MEDIUM", "LARGE"])),
  parentLabels: v.optional(v.lazy(() => SheetsChartData)),
  selectedNodeColor: v.optional(v.lazy(() => SheetsColor)),
  nodeColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  selectedNodeColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
})

export const SheetsCopySheetToAnotherSpreadsheetRequest: v.GenericSchema<
  unknown,
  T.SheetsCopySheetToAnotherSpreadsheetRequest
> = v.looseObject({
  destinationSpreadsheetId: v.optional(v.string()),
})

export const SheetsValueRange: v.GenericSchema<unknown, T.SheetsValueRange> = v.looseObject({
  values: v.optional(v.array(v.array(v.unknown()))),
  range: v.optional(v.string()),
  majorDimension: v.optional(v.picklist(["DIMENSION_UNSPECIFIED", "ROWS", "COLUMNS"])),
})

export const SheetsCandlestickData: v.GenericSchema<unknown, T.SheetsCandlestickData> = v.looseObject({
  closeSeries: v.optional(v.lazy(() => SheetsCandlestickSeries)),
  highSeries: v.optional(v.lazy(() => SheetsCandlestickSeries)),
  lowSeries: v.optional(v.lazy(() => SheetsCandlestickSeries)),
  openSeries: v.optional(v.lazy(() => SheetsCandlestickSeries)),
})

export const SheetsDeveloperMetadataLookup: v.GenericSchema<unknown, T.SheetsDeveloperMetadataLookup> = v.looseObject({
  metadataValue: v.optional(v.string()),
  metadataKey: v.optional(v.string()),
  locationType: v.optional(
    v.picklist(["DEVELOPER_METADATA_LOCATION_TYPE_UNSPECIFIED", "ROW", "COLUMN", "SHEET", "SPREADSHEET"]),
  ),
  visibility: v.optional(v.picklist(["DEVELOPER_METADATA_VISIBILITY_UNSPECIFIED", "DOCUMENT", "PROJECT"])),
  metadataId: v.optional(integer()),
  metadataLocation: v.optional(v.lazy(() => SheetsDeveloperMetadataLocation)),
  locationMatchingStrategy: v.optional(
    v.picklist([
      "DEVELOPER_METADATA_LOCATION_MATCHING_STRATEGY_UNSPECIFIED",
      "EXACT_LOCATION",
      "INTERSECTING_LOCATION",
    ]),
  ),
})

export const SheetsLookerDataSourceSpec: v.GenericSchema<unknown, T.SheetsLookerDataSourceSpec> = v.looseObject({
  explore: v.optional(v.string()),
  model: v.optional(v.string()),
  instanceUri: v.optional(v.string()),
})

export const SheetsHistogramRule: v.GenericSchema<unknown, T.SheetsHistogramRule> = v.looseObject({
  start: v.optional(number()),
  end: v.optional(number()),
  interval: v.optional(number()),
})

export const SheetsUnmergeCellsRequest: v.GenericSchema<unknown, T.SheetsUnmergeCellsRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsBatchClearValuesResponse: v.GenericSchema<unknown, T.SheetsBatchClearValuesResponse> = v.looseObject(
  {
    clearedRanges: v.optional(v.array(v.string())),
    spreadsheetId: v.optional(v.string()),
  },
)

export const SheetsCancelDataSourceRefreshResponse: v.GenericSchema<unknown, T.SheetsCancelDataSourceRefreshResponse> =
  v.looseObject({
    statuses: v.optional(v.array(v.lazy(() => SheetsCancelDataSourceRefreshStatus))),
  })

export const SheetsUpdateNamedRangeRequest: v.GenericSchema<unknown, T.SheetsUpdateNamedRangeRequest> = v.looseObject({
  namedRange: v.optional(v.lazy(() => SheetsNamedRange)),
  fields: v.optional(v.string()),
})

export const SheetsUpdateEmbeddedObjectBorderRequest: v.GenericSchema<
  unknown,
  T.SheetsUpdateEmbeddedObjectBorderRequest
> = v.looseObject({
  border: v.optional(v.lazy(() => SheetsEmbeddedObjectBorder)),
  fields: v.optional(v.string()),
  objectId: v.optional(integer()),
})

export const SheetsUpdateDataSourceResponse: v.GenericSchema<unknown, T.SheetsUpdateDataSourceResponse> = v.looseObject(
  {
    dataSource: v.optional(v.lazy(() => SheetsDataSource)),
    dataExecutionStatus: v.optional(v.lazy(() => SheetsDataExecutionStatus)),
  },
)

export const SheetsBasicFilter: v.GenericSchema<unknown, T.SheetsBasicFilter> = v.looseObject({
  filterSpecs: v.optional(v.array(v.lazy(() => SheetsFilterSpec))),
  criteria: v.optional(
    v.record(
      v.string(),
      v.lazy(() => SheetsFilterCriteria),
    ),
  ),
  sortSpecs: v.optional(v.array(v.lazy(() => SheetsSortSpec))),
  tableId: v.optional(v.string()),
  range: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsCellFormat: v.GenericSchema<unknown, T.SheetsCellFormat> = v.looseObject({
  verticalAlignment: v.optional(v.picklist(["VERTICAL_ALIGN_UNSPECIFIED", "TOP", "MIDDLE", "BOTTOM"])),
  textRotation: v.optional(v.lazy(() => SheetsTextRotation)),
  hyperlinkDisplayType: v.optional(v.picklist(["HYPERLINK_DISPLAY_TYPE_UNSPECIFIED", "LINKED", "PLAIN_TEXT"])),
  numberFormat: v.optional(v.lazy(() => SheetsNumberFormat)),
  textFormat: v.optional(v.lazy(() => SheetsTextFormat)),
  backgroundColor: v.optional(v.lazy(() => SheetsColor)),
  wrapStrategy: v.optional(v.picklist(["WRAP_STRATEGY_UNSPECIFIED", "OVERFLOW_CELL", "LEGACY_WRAP", "CLIP", "WRAP"])),
  textDirection: v.optional(v.picklist(["TEXT_DIRECTION_UNSPECIFIED", "LEFT_TO_RIGHT", "RIGHT_TO_LEFT"])),
  backgroundColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  horizontalAlignment: v.optional(v.picklist(["HORIZONTAL_ALIGN_UNSPECIFIED", "LEFT", "CENTER", "RIGHT"])),
  padding: v.optional(v.lazy(() => SheetsPadding)),
  borders: v.optional(v.lazy(() => SheetsBorders)),
})

export const SheetsConditionalFormatRule: v.GenericSchema<unknown, T.SheetsConditionalFormatRule> = v.looseObject({
  gradientRule: v.optional(v.lazy(() => SheetsGradientRule)),
  ranges: v.optional(v.array(v.lazy(() => SheetsGridRange))),
  booleanRule: v.optional(v.lazy(() => SheetsBooleanRule)),
})

export const SheetsClearBasicFilterRequest: v.GenericSchema<unknown, T.SheetsClearBasicFilterRequest> = v.looseObject({
  sheetId: v.optional(integer()),
})

export const SheetsEditors: v.GenericSchema<unknown, T.SheetsEditors> = v.looseObject({
  domainUsersCanEdit: v.optional(v.boolean()),
  groups: v.optional(v.array(v.string())),
  users: v.optional(v.array(v.string())),
})

export const SheetsDataSourceRefreshMonthlySchedule: v.GenericSchema<
  unknown,
  T.SheetsDataSourceRefreshMonthlySchedule
> = v.looseObject({
  startTime: v.optional(v.lazy(() => SheetsTimeOfDay)),
  daysOfMonth: v.optional(v.array(integer())),
})

export const SheetsRepeatCellRequest: v.GenericSchema<unknown, T.SheetsRepeatCellRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
  fields: v.optional(v.string()),
  cell: v.optional(v.lazy(() => SheetsCellData)),
})

export const SheetsWaterfallChartCustomSubtotal: v.GenericSchema<unknown, T.SheetsWaterfallChartCustomSubtotal> =
  v.looseObject({
    label: v.optional(v.string()),
    dataIsSubtotal: v.optional(v.boolean()),
    subtotalIndex: v.optional(integer()),
  })

export const SheetsSortSpec: v.GenericSchema<unknown, T.SheetsSortSpec> = v.looseObject({
  foregroundColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  backgroundColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  dimensionIndex: v.optional(integer()),
  dataSourceColumnReference: v.optional(v.lazy(() => SheetsDataSourceColumnReference)),
  foregroundColor: v.optional(v.lazy(() => SheetsColor)),
  sortOrder: v.optional(v.picklist(["SORT_ORDER_UNSPECIFIED", "ASCENDING", "DESCENDING"])),
  backgroundColor: v.optional(v.lazy(() => SheetsColor)),
})

export const SheetsUpdateFilterViewRequest: v.GenericSchema<unknown, T.SheetsUpdateFilterViewRequest> = v.looseObject({
  filter: v.optional(v.lazy(() => SheetsFilterView)),
  fields: v.optional(v.string()),
})

export const SheetsManualRule: v.GenericSchema<unknown, T.SheetsManualRule> = v.looseObject({
  groups: v.optional(v.array(v.lazy(() => SheetsManualRuleGroup))),
})

export const SheetsChip: v.GenericSchema<unknown, T.SheetsChip> = v.looseObject({
  personProperties: v.optional(v.lazy(() => SheetsPersonProperties)),
  richLinkProperties: v.optional(v.lazy(() => SheetsRichLinkProperties)),
})

export const SheetsDeleteDimensionRequest: v.GenericSchema<unknown, T.SheetsDeleteDimensionRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsDimensionRange)),
})

export const SheetsDeleteDuplicatesRequest: v.GenericSchema<unknown, T.SheetsDeleteDuplicatesRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
  comparisonColumns: v.optional(v.array(v.lazy(() => SheetsDimensionRange))),
})

export const SheetsGridProperties: v.GenericSchema<unknown, T.SheetsGridProperties> = v.looseObject({
  frozenRowCount: v.optional(integer()),
  rowGroupControlAfter: v.optional(v.boolean()),
  frozenColumnCount: v.optional(integer()),
  rowCount: v.optional(integer()),
  columnCount: v.optional(integer()),
  hideGridlines: v.optional(v.boolean()),
  columnGroupControlAfter: v.optional(v.boolean()),
})

export const SheetsRowData: v.GenericSchema<unknown, T.SheetsRowData> = v.looseObject({
  values: v.optional(v.array(v.lazy(() => SheetsCellData))),
})

export const SheetsDeleteDimensionGroupRequest: v.GenericSchema<unknown, T.SheetsDeleteDimensionGroupRequest> =
  v.looseObject({
    range: v.optional(v.lazy(() => SheetsDimensionRange)),
  })

export const SheetsManualRuleGroup: v.GenericSchema<unknown, T.SheetsManualRuleGroup> = v.looseObject({
  groupName: v.optional(v.lazy(() => SheetsExtendedValue)),
  items: v.optional(v.array(v.lazy(() => SheetsExtendedValue))),
})

export const SheetsPivotGroupRule: v.GenericSchema<unknown, T.SheetsPivotGroupRule> = v.looseObject({
  dateTimeRule: v.optional(v.lazy(() => SheetsDateTimeRule)),
  histogramRule: v.optional(v.lazy(() => SheetsHistogramRule)),
  manualRule: v.optional(v.lazy(() => SheetsManualRule)),
})

export const SheetsPivotGroupSortValueBucket: v.GenericSchema<unknown, T.SheetsPivotGroupSortValueBucket> =
  v.looseObject({
    valuesIndex: v.optional(integer()),
    buckets: v.optional(v.array(v.lazy(() => SheetsExtendedValue))),
  })

export const SheetsBubbleChartSpec: v.GenericSchema<unknown, T.SheetsBubbleChartSpec> = v.looseObject({
  bubbleBorderColor: v.optional(v.lazy(() => SheetsColor)),
  bubbleSizes: v.optional(v.lazy(() => SheetsChartData)),
  series: v.optional(v.lazy(() => SheetsChartData)),
  bubbleBorderColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  bubbleOpacity: v.optional(number()),
  bubbleMaxRadiusSize: v.optional(integer()),
  bubbleLabels: v.optional(v.lazy(() => SheetsChartData)),
  domain: v.optional(v.lazy(() => SheetsChartData)),
  legendPosition: v.optional(
    v.picklist([
      "BUBBLE_CHART_LEGEND_POSITION_UNSPECIFIED",
      "BOTTOM_LEGEND",
      "LEFT_LEGEND",
      "RIGHT_LEGEND",
      "TOP_LEGEND",
      "NO_LEGEND",
      "INSIDE_LEGEND",
    ]),
  ),
  groupIds: v.optional(v.lazy(() => SheetsChartData)),
  bubbleTextStyle: v.optional(v.lazy(() => SheetsTextFormat)),
  bubbleMinRadiusSize: v.optional(integer()),
})

export const SheetsPasteDataRequest: v.GenericSchema<unknown, T.SheetsPasteDataRequest> = v.looseObject({
  coordinate: v.optional(v.lazy(() => SheetsGridCoordinate)),
  html: v.optional(v.boolean()),
  delimiter: v.optional(v.string()),
  data: v.optional(v.string()),
  type: v.optional(
    v.picklist([
      "PASTE_NORMAL",
      "PASTE_VALUES",
      "PASTE_FORMAT",
      "PASTE_NO_BORDERS",
      "PASTE_FORMULA",
      "PASTE_DATA_VALIDATION",
      "PASTE_CONDITIONAL_FORMATTING",
    ]),
  ),
})

export const SheetsAddDimensionGroupResponse: v.GenericSchema<unknown, T.SheetsAddDimensionGroupResponse> =
  v.looseObject({
    dimensionGroups: v.optional(v.array(v.lazy(() => SheetsDimensionGroup))),
  })

export const SheetsCandlestickDomain: v.GenericSchema<unknown, T.SheetsCandlestickDomain> = v.looseObject({
  data: v.optional(v.lazy(() => SheetsChartData)),
  reversed: v.optional(v.boolean()),
})

export const SheetsGridData: v.GenericSchema<unknown, T.SheetsGridData> = v.looseObject({
  columnMetadata: v.optional(v.array(v.lazy(() => SheetsDimensionProperties))),
  rowData: v.optional(v.array(v.lazy(() => SheetsRowData))),
  rowMetadata: v.optional(v.array(v.lazy(() => SheetsDimensionProperties))),
  startRow: v.optional(integer()),
  startColumn: v.optional(integer()),
})

export const SheetsUpdateBordersRequest: v.GenericSchema<unknown, T.SheetsUpdateBordersRequest> = v.looseObject({
  bottom: v.optional(v.lazy(() => SheetsBorder)),
  left: v.optional(v.lazy(() => SheetsBorder)),
  top: v.optional(v.lazy(() => SheetsBorder)),
  innerVertical: v.optional(v.lazy(() => SheetsBorder)),
  innerHorizontal: v.optional(v.lazy(() => SheetsBorder)),
  range: v.optional(v.lazy(() => SheetsGridRange)),
  right: v.optional(v.lazy(() => SheetsBorder)),
})

export const SheetsSheet: v.GenericSchema<unknown, T.SheetsSheet> = v.looseObject({
  properties: v.optional(v.lazy(() => SheetsSheetProperties)),
  merges: v.optional(v.array(v.lazy(() => SheetsGridRange))),
  data: v.optional(v.array(v.lazy(() => SheetsGridData))),
  protectedRanges: v.optional(v.array(v.lazy(() => SheetsProtectedRange))),
  commentAnchors: v.optional(v.array(v.lazy(() => SheetsCommentAnchor))),
  charts: v.optional(v.array(v.lazy(() => SheetsEmbeddedChart))),
  bandedRanges: v.optional(v.array(v.lazy(() => SheetsBandedRange))),
  tables: v.optional(v.array(v.lazy(() => SheetsTable))),
  developerMetadata: v.optional(v.array(v.lazy(() => SheetsDeveloperMetadata))),
  basicFilter: v.optional(v.lazy(() => SheetsBasicFilter)),
  slicers: v.optional(v.array(v.lazy(() => SheetsSlicer))),
  conditionalFormats: v.optional(v.array(v.lazy(() => SheetsConditionalFormatRule))),
  rowGroups: v.optional(v.array(v.lazy(() => SheetsDimensionGroup))),
  filterViews: v.optional(v.array(v.lazy(() => SheetsFilterView))),
  columnGroups: v.optional(v.array(v.lazy(() => SheetsDimensionGroup))),
})

export const SheetsBatchGetValuesResponse: v.GenericSchema<unknown, T.SheetsBatchGetValuesResponse> = v.looseObject({
  spreadsheetId: v.optional(v.string()),
  valueRanges: v.optional(v.array(v.lazy(() => SheetsValueRange))),
})

export const SheetsEmbeddedObjectPosition: v.GenericSchema<unknown, T.SheetsEmbeddedObjectPosition> = v.looseObject({
  newSheet: v.optional(v.boolean()),
  sheetId: v.optional(integer()),
  overlayPosition: v.optional(v.lazy(() => SheetsOverlayPosition)),
})

export const SheetsPivotGroupValueMetadata: v.GenericSchema<unknown, T.SheetsPivotGroupValueMetadata> = v.looseObject({
  value: v.optional(v.lazy(() => SheetsExtendedValue)),
  collapsed: v.optional(v.boolean()),
})

export const SheetsCutPasteRequest: v.GenericSchema<unknown, T.SheetsCutPasteRequest> = v.looseObject({
  pasteType: v.optional(
    v.picklist([
      "PASTE_NORMAL",
      "PASTE_VALUES",
      "PASTE_FORMAT",
      "PASTE_NO_BORDERS",
      "PASTE_FORMULA",
      "PASTE_DATA_VALIDATION",
      "PASTE_CONDITIONAL_FORMATTING",
    ]),
  ),
  destination: v.optional(v.lazy(() => SheetsGridCoordinate)),
  source: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsTrimWhitespaceResponse: v.GenericSchema<unknown, T.SheetsTrimWhitespaceResponse> = v.looseObject({
  cellsChangedCount: v.optional(integer()),
})

export const SheetsDuplicateFilterViewResponse: v.GenericSchema<unknown, T.SheetsDuplicateFilterViewResponse> =
  v.looseObject({
    filter: v.optional(v.lazy(() => SheetsFilterView)),
  })

export const SheetsRefreshCancellationStatus: v.GenericSchema<unknown, T.SheetsRefreshCancellationStatus> =
  v.looseObject({
    state: v.optional(v.picklist(["REFRESH_CANCELLATION_STATE_UNSPECIFIED", "CANCEL_SUCCEEDED", "CANCEL_FAILED"])),
    errorCode: v.optional(
      v.picklist([
        "REFRESH_CANCELLATION_ERROR_CODE_UNSPECIFIED",
        "EXECUTION_NOT_FOUND",
        "CANCEL_PERMISSION_DENIED",
        "QUERY_EXECUTION_COMPLETED",
        "CONCURRENT_CANCELLATION",
        "CANCEL_OTHER_ERROR",
      ]),
    ),
  })

export const SheetsBooleanCondition: v.GenericSchema<unknown, T.SheetsBooleanCondition> = v.looseObject({
  values: v.optional(v.array(v.lazy(() => SheetsConditionValue))),
  type: v.optional(
    v.picklist([
      "CONDITION_TYPE_UNSPECIFIED",
      "NUMBER_GREATER",
      "NUMBER_GREATER_THAN_EQ",
      "NUMBER_LESS",
      "NUMBER_LESS_THAN_EQ",
      "NUMBER_EQ",
      "NUMBER_NOT_EQ",
      "NUMBER_BETWEEN",
      "NUMBER_NOT_BETWEEN",
      "TEXT_CONTAINS",
      "TEXT_NOT_CONTAINS",
      "TEXT_STARTS_WITH",
      "TEXT_ENDS_WITH",
      "TEXT_EQ",
      "TEXT_IS_EMAIL",
      "TEXT_IS_URL",
      "DATE_EQ",
      "DATE_BEFORE",
      "DATE_AFTER",
      "DATE_ON_OR_BEFORE",
      "DATE_ON_OR_AFTER",
      "DATE_BETWEEN",
      "DATE_NOT_BETWEEN",
      "DATE_IS_VALID",
      "ONE_OF_RANGE",
      "ONE_OF_LIST",
      "BLANK",
      "NOT_BLANK",
      "CUSTOM_FORMULA",
      "BOOLEAN",
      "TEXT_NOT_EQ",
      "DATE_NOT_EQ",
      "FILTER_EXPRESSION",
    ]),
  ),
})

export const SheetsBatchClearValuesByDataFilterResponse: v.GenericSchema<
  unknown,
  T.SheetsBatchClearValuesByDataFilterResponse
> = v.looseObject({
  spreadsheetId: v.optional(v.string()),
  clearedRanges: v.optional(v.array(v.string())),
})

export const SheetsDataSourceColumnReference: v.GenericSchema<unknown, T.SheetsDataSourceColumnReference> =
  v.looseObject({
    name: v.optional(v.string()),
  })

export const SheetsCellData: v.GenericSchema<unknown, T.SheetsCellData> = v.looseObject({
  hyperlink: v.optional(v.string()),
  formattedValue: v.optional(v.string()),
  userEnteredValue: v.optional(v.lazy(() => SheetsExtendedValue)),
  textFormatRuns: v.optional(v.array(v.lazy(() => SheetsTextFormatRun))),
  pivotTable: v.optional(v.lazy(() => SheetsPivotTable)),
  userEnteredFormat: v.optional(v.lazy(() => SheetsCellFormat)),
  effectiveFormat: v.optional(v.lazy(() => SheetsCellFormat)),
  dataSourceFormula: v.optional(v.lazy(() => SheetsDataSourceFormula)),
  dataSourceTable: v.optional(v.lazy(() => SheetsDataSourceTable)),
  effectiveValue: v.optional(v.lazy(() => SheetsExtendedValue)),
  dataValidation: v.optional(v.lazy(() => SheetsDataValidationRule)),
  chipRuns: v.optional(v.array(v.lazy(() => SheetsChipRun))),
  note: v.optional(v.string()),
})

export const SheetsNumberFormat: v.GenericSchema<unknown, T.SheetsNumberFormat> = v.looseObject({
  type: v.optional(
    v.picklist([
      "NUMBER_FORMAT_TYPE_UNSPECIFIED",
      "TEXT",
      "NUMBER",
      "PERCENT",
      "CURRENCY",
      "DATE",
      "TIME",
      "DATE_TIME",
      "SCIENTIFIC",
    ]),
  ),
  pattern: v.optional(v.string()),
})

export const SheetsPostAuthor: v.GenericSchema<unknown, T.SheetsPostAuthor> = v.looseObject({
  user: v.optional(v.string()),
  displayName: v.optional(v.string()),
  anonymous: v.optional(v.boolean()),
  me: v.optional(v.boolean()),
})

export const SheetsAddDataSourceRequest: v.GenericSchema<unknown, T.SheetsAddDataSourceRequest> = v.looseObject({
  dataSource: v.optional(v.lazy(() => SheetsDataSource)),
})

export const SheetsDeleteCommentRequest: v.GenericSchema<unknown, T.SheetsDeleteCommentRequest> = v.looseObject({
  commentId: v.optional(v.string()),
})

export const SheetsColorStyle: v.GenericSchema<unknown, T.SheetsColorStyle> = v.looseObject({
  rgbColor: v.optional(v.lazy(() => SheetsColor)),
  themeColor: v.optional(
    v.picklist([
      "THEME_COLOR_TYPE_UNSPECIFIED",
      "TEXT",
      "BACKGROUND",
      "ACCENT1",
      "ACCENT2",
      "ACCENT3",
      "ACCENT4",
      "ACCENT5",
      "ACCENT6",
      "LINK",
    ]),
  ),
})

export const SheetsDataSourceRefreshWeeklySchedule: v.GenericSchema<unknown, T.SheetsDataSourceRefreshWeeklySchedule> =
  v.looseObject({
    daysOfWeek: v.optional(
      v.array(
        v.picklist([
          "DAY_OF_WEEK_UNSPECIFIED",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ]),
      ),
    ),
    startTime: v.optional(v.lazy(() => SheetsTimeOfDay)),
  })

export const SheetsFilterSpec: v.GenericSchema<unknown, T.SheetsFilterSpec> = v.looseObject({
  columnIndex: v.optional(integer()),
  filterCriteria: v.optional(v.lazy(() => SheetsFilterCriteria)),
  dataSourceColumnReference: v.optional(v.lazy(() => SheetsDataSourceColumnReference)),
})

export const SheetsUpdateSlicerSpecRequest: v.GenericSchema<unknown, T.SheetsUpdateSlicerSpecRequest> = v.looseObject({
  slicerId: v.optional(integer()),
  spec: v.optional(v.lazy(() => SheetsSlicerSpec)),
  fields: v.optional(v.string()),
})

export const SheetsEmbeddedObjectBorder: v.GenericSchema<unknown, T.SheetsEmbeddedObjectBorder> = v.looseObject({
  color: v.optional(v.lazy(() => SheetsColor)),
  colorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
})

export const SheetsPadding: v.GenericSchema<unknown, T.SheetsPadding> = v.looseObject({
  bottom: v.optional(integer()),
  top: v.optional(integer()),
  left: v.optional(integer()),
  right: v.optional(integer()),
})

export const SheetsGetSpreadsheetByDataFilterRequest: v.GenericSchema<
  unknown,
  T.SheetsGetSpreadsheetByDataFilterRequest
> = v.looseObject({
  dataFilters: v.optional(v.array(v.lazy(() => SheetsDataFilter))),
  excludeTablesInBandedRanges: v.optional(v.boolean()),
  commentsViewMode: v.optional(
    v.picklist([
      "COMMENTS_VIEW_MODE_UNSPECIFIED",
      "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS",
      "COMMENTS_VIEW_MODE_OMITTED",
      "COMMENTS_VIEW_MODE_INCLUDED",
    ]),
  ),
  includeGridData: v.optional(v.boolean()),
})

export const SheetsDeleteDimensionGroupResponse: v.GenericSchema<unknown, T.SheetsDeleteDimensionGroupResponse> =
  v.looseObject({
    dimensionGroups: v.optional(v.array(v.lazy(() => SheetsDimensionGroup))),
  })

export const SheetsTextRotation: v.GenericSchema<unknown, T.SheetsTextRotation> = v.looseObject({
  angle: v.optional(integer()),
  vertical: v.optional(v.boolean()),
})

export const SheetsDeleteSheetRequest: v.GenericSchema<unknown, T.SheetsDeleteSheetRequest> = v.looseObject({
  sheetId: v.optional(integer()),
})

export const SheetsWaterfallChartDomain: v.GenericSchema<unknown, T.SheetsWaterfallChartDomain> = v.looseObject({
  data: v.optional(v.lazy(() => SheetsChartData)),
  reversed: v.optional(v.boolean()),
})

export const SheetsMatchedDeveloperMetadata: v.GenericSchema<unknown, T.SheetsMatchedDeveloperMetadata> = v.looseObject(
  {
    developerMetadata: v.optional(v.lazy(() => SheetsDeveloperMetadata)),
    dataFilters: v.optional(v.array(v.lazy(() => SheetsDataFilter))),
  },
)

export const SheetsBigQueryDataSourceSpec: v.GenericSchema<unknown, T.SheetsBigQueryDataSourceSpec> = v.looseObject({
  querySpec: v.optional(v.lazy(() => SheetsBigQueryQuerySpec)),
  projectId: v.optional(v.string()),
  tableSpec: v.optional(v.lazy(() => SheetsBigQueryTableSpec)),
})

export const SheetsDataExecutionStatus: v.GenericSchema<unknown, T.SheetsDataExecutionStatus> = v.looseObject({
  errorCode: v.optional(
    v.picklist([
      "DATA_EXECUTION_ERROR_CODE_UNSPECIFIED",
      "TIMED_OUT",
      "TOO_MANY_ROWS",
      "TOO_MANY_COLUMNS",
      "TOO_MANY_CELLS",
      "ENGINE",
      "PARAMETER_INVALID",
      "UNSUPPORTED_DATA_TYPE",
      "DUPLICATE_COLUMN_NAMES",
      "INTERRUPTED",
      "CONCURRENT_QUERY",
      "OTHER",
      "TOO_MANY_CHARS_PER_CELL",
      "DATA_NOT_FOUND",
      "PERMISSION_DENIED",
      "MISSING_COLUMN_ALIAS",
      "OBJECT_NOT_FOUND",
      "OBJECT_IN_ERROR_STATE",
      "OBJECT_SPEC_INVALID",
      "DATA_EXECUTION_CANCELLED",
    ]),
  ),
  lastRefreshTime: v.optional(v.string()),
  state: v.optional(
    v.picklist(["DATA_EXECUTION_STATE_UNSPECIFIED", "NOT_STARTED", "RUNNING", "CANCELLING", "SUCCEEDED", "FAILED"]),
  ),
  errorMessage: v.optional(v.string()),
})

export const SheetsAddNamedRangeResponse: v.GenericSchema<unknown, T.SheetsAddNamedRangeResponse> = v.looseObject({
  namedRange: v.optional(v.lazy(() => SheetsNamedRange)),
})

export const SheetsUpdateEmbeddedObjectPositionResponse: v.GenericSchema<
  unknown,
  T.SheetsUpdateEmbeddedObjectPositionResponse
> = v.looseObject({
  position: v.optional(v.lazy(() => SheetsEmbeddedObjectPosition)),
})

export const SheetsGradientRule: v.GenericSchema<unknown, T.SheetsGradientRule> = v.looseObject({
  midpoint: v.optional(v.lazy(() => SheetsInterpolationPoint)),
  minpoint: v.optional(v.lazy(() => SheetsInterpolationPoint)),
  maxpoint: v.optional(v.lazy(() => SheetsInterpolationPoint)),
})

export const SheetsDeleteProtectedRangeRequest: v.GenericSchema<unknown, T.SheetsDeleteProtectedRangeRequest> =
  v.looseObject({
    protectedRangeId: v.optional(integer()),
  })

export const SheetsTableRowsProperties: v.GenericSchema<unknown, T.SheetsTableRowsProperties> = v.looseObject({
  headerColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  footerColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  secondBandColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  firstBandColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
})

export const SheetsBatchUpdateValuesByDataFilterResponse: v.GenericSchema<
  unknown,
  T.SheetsBatchUpdateValuesByDataFilterResponse
> = v.looseObject({
  spreadsheetId: v.optional(v.string()),
  totalUpdatedCells: v.optional(integer()),
  responses: v.optional(v.array(v.lazy(() => SheetsUpdateValuesByDataFilterResponse))),
  totalUpdatedSheets: v.optional(integer()),
  totalUpdatedRows: v.optional(integer()),
  totalUpdatedColumns: v.optional(integer()),
})

export const SheetsWaterfallChartSeries: v.GenericSchema<unknown, T.SheetsWaterfallChartSeries> = v.looseObject({
  positiveColumnsStyle: v.optional(v.lazy(() => SheetsWaterfallChartColumnStyle)),
  negativeColumnsStyle: v.optional(v.lazy(() => SheetsWaterfallChartColumnStyle)),
  dataLabel: v.optional(v.lazy(() => SheetsDataLabel)),
  customSubtotals: v.optional(v.array(v.lazy(() => SheetsWaterfallChartCustomSubtotal))),
  data: v.optional(v.lazy(() => SheetsChartData)),
  hideTrailingSubtotal: v.optional(v.boolean()),
  subtotalColumnsStyle: v.optional(v.lazy(() => SheetsWaterfallChartColumnStyle)),
})

export const SheetsBatchClearValuesRequest: v.GenericSchema<unknown, T.SheetsBatchClearValuesRequest> = v.looseObject({
  ranges: v.optional(v.array(v.string())),
})

export const SheetsDataSourceObjectReferences: v.GenericSchema<unknown, T.SheetsDataSourceObjectReferences> =
  v.looseObject({
    references: v.optional(v.array(v.lazy(() => SheetsDataSourceObjectReference))),
  })

export const SheetsRichLinkProperties: v.GenericSchema<unknown, T.SheetsRichLinkProperties> = v.looseObject({
  uri: v.optional(v.string()),
  mimeType: v.optional(v.string()),
})

export const SheetsCommentThread: v.GenericSchema<unknown, T.SheetsCommentThread> = v.looseObject({
  replies: v.optional(v.array(v.lazy(() => SheetsPost))),
  anchorId: v.optional(v.string()),
  status: v.optional(v.picklist(["STATUS_UNSPECIFIED", "OPEN", "RESOLVED"])),
  commentId: v.optional(v.string()),
  headPost: v.optional(v.lazy(() => SheetsPost)),
  plainTextQuote: v.optional(v.string()),
})

export const SheetsChartGroupRule: v.GenericSchema<unknown, T.SheetsChartGroupRule> = v.looseObject({
  dateTimeRule: v.optional(v.lazy(() => SheetsChartDateTimeRule)),
  histogramRule: v.optional(v.lazy(() => SheetsChartHistogramRule)),
})

export const SheetsIterativeCalculationSettings: v.GenericSchema<unknown, T.SheetsIterativeCalculationSettings> =
  v.looseObject({
    maxIterations: v.optional(integer()),
    convergenceThreshold: v.optional(number()),
  })

export const SheetsInsertRangeRequest: v.GenericSchema<unknown, T.SheetsInsertRangeRequest> = v.looseObject({
  shiftDimension: v.optional(v.picklist(["DIMENSION_UNSPECIFIED", "ROWS", "COLUMNS"])),
  range: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsDeleteCommentReplyRequest: v.GenericSchema<unknown, T.SheetsDeleteCommentReplyRequest> =
  v.looseObject({
    commentId: v.optional(v.string()),
    postId: v.optional(v.string()),
  })

export const SheetsBatchUpdateValuesResponse: v.GenericSchema<unknown, T.SheetsBatchUpdateValuesResponse> =
  v.looseObject({
    totalUpdatedColumns: v.optional(integer()),
    totalUpdatedCells: v.optional(integer()),
    spreadsheetId: v.optional(v.string()),
    totalUpdatedSheets: v.optional(integer()),
    responses: v.optional(v.array(v.lazy(() => SheetsUpdateValuesResponse))),
    totalUpdatedRows: v.optional(integer()),
  })

export const SheetsDataSourceColumn: v.GenericSchema<unknown, T.SheetsDataSourceColumn> = v.looseObject({
  reference: v.optional(v.lazy(() => SheetsDataSourceColumnReference)),
  formula: v.optional(v.string()),
})

export const SheetsBatchUpdateSpreadsheetResponse: v.GenericSchema<unknown, T.SheetsBatchUpdateSpreadsheetResponse> =
  v.looseObject({
    spreadsheetId: v.optional(v.string()),
    updatedSpreadsheet: v.optional(v.lazy(() => SheetsSpreadsheet)),
    replies: v.optional(v.array(v.lazy(() => SheetsResponse))),
    commentUpdateState: v.optional(
      v.picklist([
        "COMMENT_UPDATE_STATE_UNSPECIFIED",
        "NO_UPDATES_REQUESTED",
        "ALL_SAVED",
        "ALL_FAILED_UNKNOWN_REASON",
      ]),
    ),
  })

export const SheetsPivotFilterSpec: v.GenericSchema<unknown, T.SheetsPivotFilterSpec> = v.looseObject({
  filterCriteria: v.optional(v.lazy(() => SheetsPivotFilterCriteria)),
  dataSourceColumnReference: v.optional(v.lazy(() => SheetsDataSourceColumnReference)),
  columnOffsetIndex: v.optional(integer()),
})

export const SheetsAddChartRequest: v.GenericSchema<unknown, T.SheetsAddChartRequest> = v.looseObject({
  chart: v.optional(v.lazy(() => SheetsEmbeddedChart)),
})

export const SheetsFilterView: v.GenericSchema<unknown, T.SheetsFilterView> = v.looseObject({
  criteria: v.optional(
    v.record(
      v.string(),
      v.lazy(() => SheetsFilterCriteria),
    ),
  ),
  sortSpecs: v.optional(v.array(v.lazy(() => SheetsSortSpec))),
  filterSpecs: v.optional(v.array(v.lazy(() => SheetsFilterSpec))),
  range: v.optional(v.lazy(() => SheetsGridRange)),
  filterViewId: v.optional(integer()),
  tableId: v.optional(v.string()),
  title: v.optional(v.string()),
  namedRangeId: v.optional(v.string()),
})

export const SheetsDataFilterValueRange: v.GenericSchema<unknown, T.SheetsDataFilterValueRange> = v.looseObject({
  majorDimension: v.optional(v.picklist(["DIMENSION_UNSPECIFIED", "ROWS", "COLUMNS"])),
  dataFilter: v.optional(v.lazy(() => SheetsDataFilter)),
  values: v.optional(v.array(v.array(v.unknown()))),
})

export const SheetsResponse: v.GenericSchema<unknown, T.SheetsResponse> = v.looseObject({
  deleteDuplicates: v.optional(v.lazy(() => SheetsDeleteDuplicatesResponse)),
  updateDataSource: v.optional(v.lazy(() => SheetsUpdateDataSourceResponse)),
  addNamedRange: v.optional(v.lazy(() => SheetsAddNamedRangeResponse)),
  cancelDataSourceRefresh: v.optional(v.lazy(() => SheetsCancelDataSourceRefreshResponse)),
  trimWhitespace: v.optional(v.lazy(() => SheetsTrimWhitespaceResponse)),
  updateDeveloperMetadata: v.optional(v.lazy(() => SheetsUpdateDeveloperMetadataResponse)),
  addCommentReply: v.optional(v.lazy(() => SheetsAddCommentReplyResponse)),
  addFilterView: v.optional(v.lazy(() => SheetsAddFilterViewResponse)),
  duplicateSheet: v.optional(v.lazy(() => SheetsDuplicateSheetResponse)),
  createDeveloperMetadata: v.optional(v.lazy(() => SheetsCreateDeveloperMetadataResponse)),
  insertComment: v.optional(v.lazy(() => SheetsInsertCommentResponse)),
  deleteDeveloperMetadata: v.optional(v.lazy(() => SheetsDeleteDeveloperMetadataResponse)),
  findReplace: v.optional(v.lazy(() => SheetsFindReplaceResponse)),
  addDimensionGroup: v.optional(v.lazy(() => SheetsAddDimensionGroupResponse)),
  refreshDataSource: v.optional(v.lazy(() => SheetsRefreshDataSourceResponse)),
  deleteDimensionGroup: v.optional(v.lazy(() => SheetsDeleteDimensionGroupResponse)),
  updateConditionalFormatRule: v.optional(v.lazy(() => SheetsUpdateConditionalFormatRuleResponse)),
  addChart: v.optional(v.lazy(() => SheetsAddChartResponse)),
  updateEmbeddedObjectPosition: v.optional(v.lazy(() => SheetsUpdateEmbeddedObjectPositionResponse)),
  deleteConditionalFormatRule: v.optional(v.lazy(() => SheetsDeleteConditionalFormatRuleResponse)),
  addDataSource: v.optional(v.lazy(() => SheetsAddDataSourceResponse)),
  addTable: v.optional(v.lazy(() => SheetsAddTableResponse)),
  addSlicer: v.optional(v.lazy(() => SheetsAddSlicerResponse)),
  addProtectedRange: v.optional(v.lazy(() => SheetsAddProtectedRangeResponse)),
  addBanding: v.optional(v.lazy(() => SheetsAddBandingResponse)),
  duplicateFilterView: v.optional(v.lazy(() => SheetsDuplicateFilterViewResponse)),
  addSheet: v.optional(v.lazy(() => SheetsAddSheetResponse)),
})

export const SheetsAddChartResponse: v.GenericSchema<unknown, T.SheetsAddChartResponse> = v.looseObject({
  chart: v.optional(v.lazy(() => SheetsEmbeddedChart)),
})

export const SheetsDuplicateFilterViewRequest: v.GenericSchema<unknown, T.SheetsDuplicateFilterViewRequest> =
  v.looseObject({
    filterId: v.optional(integer()),
  })

export const SheetsKeyValueFormat: v.GenericSchema<unknown, T.SheetsKeyValueFormat> = v.looseObject({
  position: v.optional(v.lazy(() => SheetsTextPosition)),
  textFormat: v.optional(v.lazy(() => SheetsTextFormat)),
})

export const SheetsPersonProperties: v.GenericSchema<unknown, T.SheetsPersonProperties> = v.looseObject({
  email: v.optional(v.string()),
  displayFormat: v.optional(
    v.picklist(["DISPLAY_FORMAT_UNSPECIFIED", "DEFAULT", "LAST_NAME_COMMA_FIRST_NAME", "EMAIL"]),
  ),
})

export const SheetsUpdateDeveloperMetadataRequest: v.GenericSchema<unknown, T.SheetsUpdateDeveloperMetadataRequest> =
  v.looseObject({
    dataFilters: v.optional(v.array(v.lazy(() => SheetsDataFilter))),
    developerMetadata: v.optional(v.lazy(() => SheetsDeveloperMetadata)),
    fields: v.optional(v.string()),
  })

export const SheetsRefreshDataSourceResponse: v.GenericSchema<unknown, T.SheetsRefreshDataSourceResponse> =
  v.looseObject({
    statuses: v.optional(v.array(v.lazy(() => SheetsRefreshDataSourceObjectExecutionStatus))),
  })

export const SheetsInsertCommentRequest: v.GenericSchema<unknown, T.SheetsInsertCommentRequest> = v.looseObject({
  assigneeEmailAddress: v.optional(v.string()),
  coordinate: v.optional(v.lazy(() => SheetsGridCoordinate)),
  content: v.optional(v.string()),
})

export const SheetsDuplicateSheetResponse: v.GenericSchema<unknown, T.SheetsDuplicateSheetResponse> = v.looseObject({
  properties: v.optional(v.lazy(() => SheetsSheetProperties)),
})

export const SheetsScorecardChartSpec: v.GenericSchema<unknown, T.SheetsScorecardChartSpec> = v.looseObject({
  numberFormatSource: v.optional(v.picklist(["CHART_NUMBER_FORMAT_SOURCE_UNDEFINED", "FROM_DATA", "CUSTOM"])),
  baselineValueFormat: v.optional(v.lazy(() => SheetsBaselineValueFormat)),
  customFormatOptions: v.optional(v.lazy(() => SheetsChartCustomNumberFormatOptions)),
  aggregateType: v.optional(
    v.picklist(["CHART_AGGREGATE_TYPE_UNSPECIFIED", "AVERAGE", "COUNT", "MAX", "MEDIAN", "MIN", "SUM"]),
  ),
  keyValueData: v.optional(v.lazy(() => SheetsChartData)),
  keyValueFormat: v.optional(v.lazy(() => SheetsKeyValueFormat)),
  scaleFactor: v.optional(number()),
  baselineValueData: v.optional(v.lazy(() => SheetsChartData)),
})

export const SheetsDeleteDataSourceRequest: v.GenericSchema<unknown, T.SheetsDeleteDataSourceRequest> = v.looseObject({
  dataSourceId: v.optional(v.string()),
})

export const SheetsInterpolationPoint: v.GenericSchema<unknown, T.SheetsInterpolationPoint> = v.looseObject({
  type: v.optional(
    v.picklist(["INTERPOLATION_POINT_TYPE_UNSPECIFIED", "MIN", "MAX", "NUMBER", "PERCENT", "PERCENTILE"]),
  ),
  colorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  color: v.optional(v.lazy(() => SheetsColor)),
  value: v.optional(v.string()),
})

export const SheetsDeveloperMetadata: v.GenericSchema<unknown, T.SheetsDeveloperMetadata> = v.looseObject({
  metadataKey: v.optional(v.string()),
  metadataId: v.optional(integer()),
  visibility: v.optional(v.picklist(["DEVELOPER_METADATA_VISIBILITY_UNSPECIFIED", "DOCUMENT", "PROJECT"])),
  metadataValue: v.optional(v.string()),
  location: v.optional(v.lazy(() => SheetsDeveloperMetadataLocation)),
})

export const SheetsAddSlicerRequest: v.GenericSchema<unknown, T.SheetsAddSlicerRequest> = v.looseObject({
  slicer: v.optional(v.lazy(() => SheetsSlicer)),
})

export const SheetsAddBandingResponse: v.GenericSchema<unknown, T.SheetsAddBandingResponse> = v.looseObject({
  bandedRange: v.optional(v.lazy(() => SheetsBandedRange)),
})

export const SheetsTableColumnProperties: v.GenericSchema<unknown, T.SheetsTableColumnProperties> = v.looseObject({
  columnName: v.optional(v.string()),
  columnIndex: v.optional(integer()),
  dataValidationRule: v.optional(v.lazy(() => SheetsTableColumnDataValidationRule)),
  columnType: v.optional(
    v.picklist([
      "COLUMN_TYPE_UNSPECIFIED",
      "DOUBLE",
      "CURRENCY",
      "PERCENT",
      "DATE",
      "TIME",
      "DATE_TIME",
      "TEXT",
      "BOOLEAN",
      "DROPDOWN",
      "FILES_CHIP",
      "PEOPLE_CHIP",
      "FINANCE_CHIP",
      "PLACE_CHIP",
      "RATINGS_CHIP",
    ]),
  ),
})

export const SheetsChartSpec: v.GenericSchema<unknown, T.SheetsChartSpec> = v.looseObject({
  dataSourceChartProperties: v.optional(v.lazy(() => SheetsDataSourceChartProperties)),
  candlestickChart: v.optional(v.lazy(() => SheetsCandlestickChartSpec)),
  histogramChart: v.optional(v.lazy(() => SheetsHistogramChartSpec)),
  sortSpecs: v.optional(v.array(v.lazy(() => SheetsSortSpec))),
  bubbleChart: v.optional(v.lazy(() => SheetsBubbleChartSpec)),
  titleTextPosition: v.optional(v.lazy(() => SheetsTextPosition)),
  orgChart: v.optional(v.lazy(() => SheetsOrgChartSpec)),
  basicChart: v.optional(v.lazy(() => SheetsBasicChartSpec)),
  subtitle: v.optional(v.string()),
  maximized: v.optional(v.boolean()),
  pieChart: v.optional(v.lazy(() => SheetsPieChartSpec)),
  waterfallChart: v.optional(v.lazy(() => SheetsWaterfallChartSpec)),
  titleTextFormat: v.optional(v.lazy(() => SheetsTextFormat)),
  subtitleTextPosition: v.optional(v.lazy(() => SheetsTextPosition)),
  title: v.optional(v.string()),
  scorecardChart: v.optional(v.lazy(() => SheetsScorecardChartSpec)),
  backgroundColor: v.optional(v.lazy(() => SheetsColor)),
  filterSpecs: v.optional(v.array(v.lazy(() => SheetsFilterSpec))),
  hiddenDimensionStrategy: v.optional(
    v.picklist([
      "CHART_HIDDEN_DIMENSION_STRATEGY_UNSPECIFIED",
      "SKIP_HIDDEN_ROWS_AND_COLUMNS",
      "SKIP_HIDDEN_ROWS",
      "SKIP_HIDDEN_COLUMNS",
      "SHOW_ALL",
    ]),
  ),
  altText: v.optional(v.string()),
  fontName: v.optional(v.string()),
  backgroundColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  subtitleTextFormat: v.optional(v.lazy(() => SheetsTextFormat)),
  treemapChart: v.optional(v.lazy(() => SheetsTreemapChartSpec)),
})

export const SheetsTextToColumnsRequest: v.GenericSchema<unknown, T.SheetsTextToColumnsRequest> = v.looseObject({
  delimiterType: v.optional(
    v.picklist(["DELIMITER_TYPE_UNSPECIFIED", "COMMA", "SEMICOLON", "PERIOD", "SPACE", "CUSTOM", "AUTODETECT"]),
  ),
  source: v.optional(v.lazy(() => SheetsGridRange)),
  delimiter: v.optional(v.string()),
})

export const SheetsDataSourceFormula: v.GenericSchema<unknown, T.SheetsDataSourceFormula> = v.looseObject({
  dataExecutionStatus: v.optional(v.lazy(() => SheetsDataExecutionStatus)),
  dataSourceId: v.optional(v.string()),
})

export const SheetsTextFormatRun: v.GenericSchema<unknown, T.SheetsTextFormatRun> = v.looseObject({
  format: v.optional(v.lazy(() => SheetsTextFormat)),
  startIndex: v.optional(integer()),
})

export const SheetsBasicChartSeries: v.GenericSchema<unknown, T.SheetsBasicChartSeries> = v.looseObject({
  targetAxis: v.optional(
    v.picklist(["BASIC_CHART_AXIS_POSITION_UNSPECIFIED", "BOTTOM_AXIS", "LEFT_AXIS", "RIGHT_AXIS"]),
  ),
  series: v.optional(v.lazy(() => SheetsChartData)),
  lineStyle: v.optional(v.lazy(() => SheetsLineStyle)),
  colorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  styleOverrides: v.optional(v.array(v.lazy(() => SheetsBasicSeriesDataPointStyleOverride))),
  color: v.optional(v.lazy(() => SheetsColor)),
  dataLabel: v.optional(v.lazy(() => SheetsDataLabel)),
  pointStyle: v.optional(v.lazy(() => SheetsPointStyle)),
  type: v.optional(
    v.picklist(["BASIC_CHART_TYPE_UNSPECIFIED", "BAR", "LINE", "AREA", "COLUMN", "SCATTER", "COMBO", "STEPPED_AREA"]),
  ),
})

export const SheetsSortRangeRequest: v.GenericSchema<unknown, T.SheetsSortRangeRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
  sortSpecs: v.optional(v.array(v.lazy(() => SheetsSortSpec))),
})

export const SheetsPivotTable: v.GenericSchema<unknown, T.SheetsPivotTable> = v.looseObject({
  criteria: v.optional(
    v.record(
      v.string(),
      v.lazy(() => SheetsPivotFilterCriteria),
    ),
  ),
  dataExecutionStatus: v.optional(v.lazy(() => SheetsDataExecutionStatus)),
  source: v.optional(v.lazy(() => SheetsGridRange)),
  values: v.optional(v.array(v.lazy(() => SheetsPivotValue))),
  dataSourceId: v.optional(v.string()),
  rows: v.optional(v.array(v.lazy(() => SheetsPivotGroup))),
  filterSpecs: v.optional(v.array(v.lazy(() => SheetsPivotFilterSpec))),
  valueLayout: v.optional(v.picklist(["HORIZONTAL", "VERTICAL"])),
  columns: v.optional(v.array(v.lazy(() => SheetsPivotGroup))),
})

export const SheetsUpdateCellsRequest: v.GenericSchema<unknown, T.SheetsUpdateCellsRequest> = v.looseObject({
  start: v.optional(v.lazy(() => SheetsGridCoordinate)),
  fields: v.optional(v.string()),
  rows: v.optional(v.array(v.lazy(() => SheetsRowData))),
  range: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsRefreshDataSourceObjectExecutionStatus: v.GenericSchema<
  unknown,
  T.SheetsRefreshDataSourceObjectExecutionStatus
> = v.looseObject({
  dataExecutionStatus: v.optional(v.lazy(() => SheetsDataExecutionStatus)),
  reference: v.optional(v.lazy(() => SheetsDataSourceObjectReference)),
})

export const SheetsSetBasicFilterRequest: v.GenericSchema<unknown, T.SheetsSetBasicFilterRequest> = v.looseObject({
  filter: v.optional(v.lazy(() => SheetsBasicFilter)),
})

export const SheetsBigQueryQuerySpec: v.GenericSchema<unknown, T.SheetsBigQueryQuerySpec> = v.looseObject({
  rawQuery: v.optional(v.string()),
})

export const SheetsDataSourceRefreshSchedule: v.GenericSchema<unknown, T.SheetsDataSourceRefreshSchedule> =
  v.looseObject({
    dailySchedule: v.optional(v.lazy(() => SheetsDataSourceRefreshDailySchedule)),
    weeklySchedule: v.optional(v.lazy(() => SheetsDataSourceRefreshWeeklySchedule)),
    nextRun: v.optional(v.lazy(() => SheetsInterval)),
    enabled: v.optional(v.boolean()),
    refreshScope: v.optional(v.picklist(["DATA_SOURCE_REFRESH_SCOPE_UNSPECIFIED", "ALL_DATA_SOURCES"])),
    monthlySchedule: v.optional(v.lazy(() => SheetsDataSourceRefreshMonthlySchedule)),
  })

export const SheetsLineStyle: v.GenericSchema<unknown, T.SheetsLineStyle> = v.looseObject({
  width: v.optional(integer()),
  type: v.optional(
    v.picklist([
      "LINE_DASH_TYPE_UNSPECIFIED",
      "INVISIBLE",
      "CUSTOM",
      "SOLID",
      "DOTTED",
      "MEDIUM_DASHED",
      "MEDIUM_DASHED_DOTTED",
      "LONG_DASHED",
      "LONG_DASHED_DOTTED",
    ]),
  ),
})

export const SheetsSlicerSpec: v.GenericSchema<unknown, T.SheetsSlicerSpec> = v.looseObject({
  filterCriteria: v.optional(v.lazy(() => SheetsFilterCriteria)),
  title: v.optional(v.string()),
  backgroundColor: v.optional(v.lazy(() => SheetsColor)),
  applyToPivotTables: v.optional(v.boolean()),
  columnIndex: v.optional(integer()),
  textFormat: v.optional(v.lazy(() => SheetsTextFormat)),
  dataRange: v.optional(v.lazy(() => SheetsGridRange)),
  backgroundColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  horizontalAlignment: v.optional(v.picklist(["HORIZONTAL_ALIGN_UNSPECIFIED", "LEFT", "CENTER", "RIGHT"])),
})

export const SheetsAddFilterViewResponse: v.GenericSchema<unknown, T.SheetsAddFilterViewResponse> = v.looseObject({
  filter: v.optional(v.lazy(() => SheetsFilterView)),
})

export const SheetsRequest: v.GenericSchema<unknown, T.SheetsRequest> = v.looseObject({
  duplicateFilterView: v.optional(v.lazy(() => SheetsDuplicateFilterViewRequest)),
  insertDimension: v.optional(v.lazy(() => SheetsInsertDimensionRequest)),
  updateDimensionProperties: v.optional(v.lazy(() => SheetsUpdateDimensionPropertiesRequest)),
  appendCells: v.optional(v.lazy(() => SheetsAppendCellsRequest)),
  cancelDataSourceRefresh: v.optional(v.lazy(() => SheetsCancelDataSourceRefreshRequest)),
  updateDeveloperMetadata: v.optional(v.lazy(() => SheetsUpdateDeveloperMetadataRequest)),
  updateFilterView: v.optional(v.lazy(() => SheetsUpdateFilterViewRequest)),
  deleteDimensionGroup: v.optional(v.lazy(() => SheetsDeleteDimensionGroupRequest)),
  updateEmbeddedObjectPosition: v.optional(v.lazy(() => SheetsUpdateEmbeddedObjectPositionRequest)),
  autoFill: v.optional(v.lazy(() => SheetsAutoFillRequest)),
  autoResizeDimensions: v.optional(v.lazy(() => SheetsAutoResizeDimensionsRequest)),
  addCommentReply: v.optional(v.lazy(() => SheetsAddCommentReplyRequest)),
  deleteDataSource: v.optional(v.lazy(() => SheetsDeleteDataSourceRequest)),
  deleteBanding: v.optional(v.lazy(() => SheetsDeleteBandingRequest)),
  updateCommentPost: v.optional(v.lazy(() => SheetsUpdateCommentPostRequest)),
  addBanding: v.optional(v.lazy(() => SheetsAddBandingRequest)),
  randomizeRange: v.optional(v.lazy(() => SheetsRandomizeRangeRequest)),
  addDimensionGroup: v.optional(v.lazy(() => SheetsAddDimensionGroupRequest)),
  pasteData: v.optional(v.lazy(() => SheetsPasteDataRequest)),
  createDeveloperMetadata: v.optional(v.lazy(() => SheetsCreateDeveloperMetadataRequest)),
  updateTable: v.optional(v.lazy(() => SheetsUpdateTableRequest)),
  setDataValidation: v.optional(v.lazy(() => SheetsSetDataValidationRequest)),
  updateDimensionGroup: v.optional(v.lazy(() => SheetsUpdateDimensionGroupRequest)),
  repeatCell: v.optional(v.lazy(() => SheetsRepeatCellRequest)),
  deleteProtectedRange: v.optional(v.lazy(() => SheetsDeleteProtectedRangeRequest)),
  updateEmbeddedObjectBorder: v.optional(v.lazy(() => SheetsUpdateEmbeddedObjectBorderRequest)),
  updateSpreadsheetProperties: v.optional(v.lazy(() => SheetsUpdateSpreadsheetPropertiesRequest)),
  deleteNamedRange: v.optional(v.lazy(() => SheetsDeleteNamedRangeRequest)),
  insertComment: v.optional(v.lazy(() => SheetsInsertCommentRequest)),
  addFilterView: v.optional(v.lazy(() => SheetsAddFilterViewRequest)),
  duplicateSheet: v.optional(v.lazy(() => SheetsDuplicateSheetRequest)),
  addSheet: v.optional(v.lazy(() => SheetsAddSheetRequest)),
  trimWhitespace: v.optional(v.lazy(() => SheetsTrimWhitespaceRequest)),
  copyPaste: v.optional(v.lazy(() => SheetsCopyPasteRequest)),
  addProtectedRange: v.optional(v.lazy(() => SheetsAddProtectedRangeRequest)),
  clearBasicFilter: v.optional(v.lazy(() => SheetsClearBasicFilterRequest)),
  deleteDimension: v.optional(v.lazy(() => SheetsDeleteDimensionRequest)),
  updateBanding: v.optional(v.lazy(() => SheetsUpdateBandingRequest)),
  updateConditionalFormatRule: v.optional(v.lazy(() => SheetsUpdateConditionalFormatRuleRequest)),
  updateDataSource: v.optional(v.lazy(() => SheetsUpdateDataSourceRequest)),
  addNamedRange: v.optional(v.lazy(() => SheetsAddNamedRangeRequest)),
  setBasicFilter: v.optional(v.lazy(() => SheetsSetBasicFilterRequest)),
  addChart: v.optional(v.lazy(() => SheetsAddChartRequest)),
  deleteSheet: v.optional(v.lazy(() => SheetsDeleteSheetRequest)),
  addConditionalFormatRule: v.optional(v.lazy(() => SheetsAddConditionalFormatRuleRequest)),
  sortRange: v.optional(v.lazy(() => SheetsSortRangeRequest)),
  updateChartSpec: v.optional(v.lazy(() => SheetsUpdateChartSpecRequest)),
  updateCells: v.optional(v.lazy(() => SheetsUpdateCellsRequest)),
  addDataSource: v.optional(v.lazy(() => SheetsAddDataSourceRequest)),
  updateSlicerSpec: v.optional(v.lazy(() => SheetsUpdateSlicerSpecRequest)),
  updateBorders: v.optional(v.lazy(() => SheetsUpdateBordersRequest)),
  refreshDataSource: v.optional(v.lazy(() => SheetsRefreshDataSourceRequest)),
  unmergeCells: v.optional(v.lazy(() => SheetsUnmergeCellsRequest)),
  deleteDeveloperMetadata: v.optional(v.lazy(() => SheetsDeleteDeveloperMetadataRequest)),
  moveDimension: v.optional(v.lazy(() => SheetsMoveDimensionRequest)),
  appendDimension: v.optional(v.lazy(() => SheetsAppendDimensionRequest)),
  insertRange: v.optional(v.lazy(() => SheetsInsertRangeRequest)),
  addTable: v.optional(v.lazy(() => SheetsAddTableRequest)),
  updateSheetProperties: v.optional(v.lazy(() => SheetsUpdateSheetPropertiesRequest)),
  findReplace: v.optional(v.lazy(() => SheetsFindReplaceRequest)),
  textToColumns: v.optional(v.lazy(() => SheetsTextToColumnsRequest)),
  updateNamedRange: v.optional(v.lazy(() => SheetsUpdateNamedRangeRequest)),
  deleteRange: v.optional(v.lazy(() => SheetsDeleteRangeRequest)),
  deleteComment: v.optional(v.lazy(() => SheetsDeleteCommentRequest)),
  mergeCells: v.optional(v.lazy(() => SheetsMergeCellsRequest)),
  deleteFilterView: v.optional(v.lazy(() => SheetsDeleteFilterViewRequest)),
  deleteConditionalFormatRule: v.optional(v.lazy(() => SheetsDeleteConditionalFormatRuleRequest)),
  deleteCommentReply: v.optional(v.lazy(() => SheetsDeleteCommentReplyRequest)),
  updateProtectedRange: v.optional(v.lazy(() => SheetsUpdateProtectedRangeRequest)),
  deleteDuplicates: v.optional(v.lazy(() => SheetsDeleteDuplicatesRequest)),
  deleteEmbeddedObject: v.optional(v.lazy(() => SheetsDeleteEmbeddedObjectRequest)),
  deleteTable: v.optional(v.lazy(() => SheetsDeleteTableRequest)),
  cutPaste: v.optional(v.lazy(() => SheetsCutPasteRequest)),
  addSlicer: v.optional(v.lazy(() => SheetsAddSlicerRequest)),
})

export const SheetsSourceAndDestination: v.GenericSchema<unknown, T.SheetsSourceAndDestination> = v.looseObject({
  fillLength: v.optional(integer()),
  source: v.optional(v.lazy(() => SheetsGridRange)),
  dimension: v.optional(v.picklist(["DIMENSION_UNSPECIFIED", "ROWS", "COLUMNS"])),
})

export const SheetsGridCoordinate: v.GenericSchema<unknown, T.SheetsGridCoordinate> = v.looseObject({
  columnIndex: v.optional(integer()),
  sheetId: v.optional(integer()),
  rowIndex: v.optional(integer()),
})

export const SheetsAddNamedRangeRequest: v.GenericSchema<unknown, T.SheetsAddNamedRangeRequest> = v.looseObject({
  namedRange: v.optional(v.lazy(() => SheetsNamedRange)),
})

export const SheetsDataSourceChartProperties: v.GenericSchema<unknown, T.SheetsDataSourceChartProperties> =
  v.looseObject({
    dataExecutionStatus: v.optional(v.lazy(() => SheetsDataExecutionStatus)),
    dataSourceId: v.optional(v.string()),
  })

export const SheetsBigQueryTableSpec: v.GenericSchema<unknown, T.SheetsBigQueryTableSpec> = v.looseObject({
  datasetId: v.optional(v.string()),
  tableProjectId: v.optional(v.string()),
  tableId: v.optional(v.string()),
})

export const SheetsUpdateChartSpecRequest: v.GenericSchema<unknown, T.SheetsUpdateChartSpecRequest> = v.looseObject({
  spec: v.optional(v.lazy(() => SheetsChartSpec)),
  chartId: v.optional(integer()),
})

export const SheetsAddSheetRequest: v.GenericSchema<unknown, T.SheetsAddSheetRequest> = v.looseObject({
  properties: v.optional(v.lazy(() => SheetsSheetProperties)),
})

export const SheetsDimensionProperties: v.GenericSchema<unknown, T.SheetsDimensionProperties> = v.looseObject({
  developerMetadata: v.optional(v.array(v.lazy(() => SheetsDeveloperMetadata))),
  hiddenByUser: v.optional(v.boolean()),
  pixelSize: v.optional(integer()),
  dataSourceColumnReference: v.optional(v.lazy(() => SheetsDataSourceColumnReference)),
  hiddenByFilter: v.optional(v.boolean()),
})

export const SheetsBasicChartSpec: v.GenericSchema<unknown, T.SheetsBasicChartSpec> = v.looseObject({
  domains: v.optional(v.array(v.lazy(() => SheetsBasicChartDomain))),
  compareMode: v.optional(v.picklist(["BASIC_CHART_COMPARE_MODE_UNSPECIFIED", "DATUM", "CATEGORY"])),
  totalDataLabel: v.optional(v.lazy(() => SheetsDataLabel)),
  axis: v.optional(v.array(v.lazy(() => SheetsBasicChartAxis))),
  chartType: v.optional(
    v.picklist(["BASIC_CHART_TYPE_UNSPECIFIED", "BAR", "LINE", "AREA", "COLUMN", "SCATTER", "COMBO", "STEPPED_AREA"]),
  ),
  headerCount: v.optional(integer()),
  legendPosition: v.optional(
    v.picklist([
      "BASIC_CHART_LEGEND_POSITION_UNSPECIFIED",
      "BOTTOM_LEGEND",
      "LEFT_LEGEND",
      "RIGHT_LEGEND",
      "TOP_LEGEND",
      "NO_LEGEND",
    ]),
  ),
  threeDimensional: v.optional(v.boolean()),
  stackedType: v.optional(
    v.picklist(["BASIC_CHART_STACKED_TYPE_UNSPECIFIED", "NOT_STACKED", "STACKED", "PERCENT_STACKED"]),
  ),
  interpolateNulls: v.optional(v.boolean()),
  lineSmoothing: v.optional(v.boolean()),
  series: v.optional(v.array(v.lazy(() => SheetsBasicChartSeries))),
})

export const SheetsRefreshDataSourceRequest: v.GenericSchema<unknown, T.SheetsRefreshDataSourceRequest> = v.looseObject(
  {
    dataSourceId: v.optional(v.string()),
    references: v.optional(v.lazy(() => SheetsDataSourceObjectReferences)),
    isAll: v.optional(v.boolean()),
    force: v.optional(v.boolean()),
  },
)

export const SheetsChartHistogramRule: v.GenericSchema<unknown, T.SheetsChartHistogramRule> = v.looseObject({
  minValue: v.optional(number()),
  maxValue: v.optional(number()),
  intervalSize: v.optional(number()),
})

export const SheetsUpdateProtectedRangeRequest: v.GenericSchema<unknown, T.SheetsUpdateProtectedRangeRequest> =
  v.looseObject({
    protectedRange: v.optional(v.lazy(() => SheetsProtectedRange)),
    fields: v.optional(v.string()),
  })

export const SheetsErrorValue: v.GenericSchema<unknown, T.SheetsErrorValue> = v.looseObject({
  message: v.optional(v.string()),
  type: v.optional(
    v.picklist([
      "ERROR_TYPE_UNSPECIFIED",
      "ERROR",
      "NULL_VALUE",
      "DIVIDE_BY_ZERO",
      "VALUE",
      "REF",
      "NAME",
      "NUM",
      "N_A",
      "LOADING",
    ]),
  ),
})

export const SheetsAddCommentReplyRequest: v.GenericSchema<unknown, T.SheetsAddCommentReplyRequest> = v.looseObject({
  commentId: v.optional(v.string()),
  post: v.optional(v.lazy(() => SheetsPost)),
})

export const SheetsSlicer: v.GenericSchema<unknown, T.SheetsSlicer> = v.looseObject({
  spec: v.optional(v.lazy(() => SheetsSlicerSpec)),
  slicerId: v.optional(integer()),
  position: v.optional(v.lazy(() => SheetsEmbeddedObjectPosition)),
})

export const SheetsOverlayPosition: v.GenericSchema<unknown, T.SheetsOverlayPosition> = v.looseObject({
  heightPixels: v.optional(integer()),
  anchorCell: v.optional(v.lazy(() => SheetsGridCoordinate)),
  offsetYPixels: v.optional(integer()),
  widthPixels: v.optional(integer()),
  offsetXPixels: v.optional(integer()),
})

export const SheetsSearchDeveloperMetadataResponse: v.GenericSchema<unknown, T.SheetsSearchDeveloperMetadataResponse> =
  v.looseObject({
    matchedDeveloperMetadata: v.optional(v.array(v.lazy(() => SheetsMatchedDeveloperMetadata))),
  })

export const SheetsDeleteDeveloperMetadataRequest: v.GenericSchema<unknown, T.SheetsDeleteDeveloperMetadataRequest> =
  v.looseObject({
    dataFilter: v.optional(v.lazy(() => SheetsDataFilter)),
  })

export const SheetsChartData: v.GenericSchema<unknown, T.SheetsChartData> = v.looseObject({
  sourceRange: v.optional(v.lazy(() => SheetsChartSourceRange)),
  groupRule: v.optional(v.lazy(() => SheetsChartGroupRule)),
  aggregateType: v.optional(
    v.picklist(["CHART_AGGREGATE_TYPE_UNSPECIFIED", "AVERAGE", "COUNT", "MAX", "MEDIAN", "MIN", "SUM"]),
  ),
  columnReference: v.optional(v.lazy(() => SheetsDataSourceColumnReference)),
})

export const SheetsBatchUpdateValuesRequest: v.GenericSchema<unknown, T.SheetsBatchUpdateValuesRequest> = v.looseObject(
  {
    responseDateTimeRenderOption: v.optional(v.picklist(["SERIAL_NUMBER", "FORMATTED_STRING"])),
    valueInputOption: v.optional(v.picklist(["INPUT_VALUE_OPTION_UNSPECIFIED", "RAW", "USER_ENTERED"])),
    data: v.optional(v.array(v.lazy(() => SheetsValueRange))),
    responseValueRenderOption: v.optional(v.picklist(["FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA"])),
    includeValuesInResponse: v.optional(v.boolean()),
  },
)

export const SheetsCopyPasteRequest: v.GenericSchema<unknown, T.SheetsCopyPasteRequest> = v.looseObject({
  destination: v.optional(v.lazy(() => SheetsGridRange)),
  pasteType: v.optional(
    v.picklist([
      "PASTE_NORMAL",
      "PASTE_VALUES",
      "PASTE_FORMAT",
      "PASTE_NO_BORDERS",
      "PASTE_FORMULA",
      "PASTE_DATA_VALIDATION",
      "PASTE_CONDITIONAL_FORMATTING",
    ]),
  ),
  pasteOrientation: v.optional(v.picklist(["NORMAL", "TRANSPOSE"])),
  source: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsProtectedRange: v.GenericSchema<unknown, T.SheetsProtectedRange> = v.looseObject({
  description: v.optional(v.string()),
  namedRangeId: v.optional(v.string()),
  unprotectedRanges: v.optional(v.array(v.lazy(() => SheetsGridRange))),
  editors: v.optional(v.lazy(() => SheetsEditors)),
  range: v.optional(v.lazy(() => SheetsGridRange)),
  warningOnly: v.optional(v.boolean()),
  tableId: v.optional(v.string()),
  requestingUserCanEdit: v.optional(v.boolean()),
  protectedRangeId: v.optional(integer()),
})

export const SheetsHistogramSeries: v.GenericSchema<unknown, T.SheetsHistogramSeries> = v.looseObject({
  barColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  data: v.optional(v.lazy(() => SheetsChartData)),
  barColor: v.optional(v.lazy(() => SheetsColor)),
})

export const SheetsUpdateTableRequest: v.GenericSchema<unknown, T.SheetsUpdateTableRequest> = v.looseObject({
  table: v.optional(v.lazy(() => SheetsTable)),
  fields: v.optional(v.string()),
})

export const SheetsPieChartSpec: v.GenericSchema<unknown, T.SheetsPieChartSpec> = v.looseObject({
  legendPosition: v.optional(
    v.picklist([
      "PIE_CHART_LEGEND_POSITION_UNSPECIFIED",
      "BOTTOM_LEGEND",
      "LEFT_LEGEND",
      "RIGHT_LEGEND",
      "TOP_LEGEND",
      "NO_LEGEND",
      "LABELED_LEGEND",
    ]),
  ),
  threeDimensional: v.optional(v.boolean()),
  series: v.optional(v.lazy(() => SheetsChartData)),
  pieHole: v.optional(number()),
  domain: v.optional(v.lazy(() => SheetsChartData)),
})

export const SheetsCreateDeveloperMetadataResponse: v.GenericSchema<unknown, T.SheetsCreateDeveloperMetadataResponse> =
  v.looseObject({
    developerMetadata: v.optional(v.lazy(() => SheetsDeveloperMetadata)),
  })

export const SheetsSpreadsheetTheme: v.GenericSchema<unknown, T.SheetsSpreadsheetTheme> = v.looseObject({
  primaryFontFamily: v.optional(v.string()),
  themeColors: v.optional(v.array(v.lazy(() => SheetsThemeColorPair))),
})

export const SheetsAddTableResponse: v.GenericSchema<unknown, T.SheetsAddTableResponse> = v.looseObject({
  table: v.optional(v.lazy(() => SheetsTable)),
})

export const SheetsDataSource: v.GenericSchema<unknown, T.SheetsDataSource> = v.looseObject({
  dataSourceId: v.optional(v.string()),
  spec: v.optional(v.lazy(() => SheetsDataSourceSpec)),
  calculatedColumns: v.optional(v.array(v.lazy(() => SheetsDataSourceColumn))),
  sheetId: v.optional(integer()),
})

export const SheetsDimensionRange: v.GenericSchema<unknown, T.SheetsDimensionRange> = v.looseObject({
  dimension: v.optional(v.picklist(["DIMENSION_UNSPECIFIED", "ROWS", "COLUMNS"])),
  sheetId: v.optional(integer()),
  endIndex: v.optional(integer()),
  startIndex: v.optional(integer()),
})

export const SheetsThemeColorPair: v.GenericSchema<unknown, T.SheetsThemeColorPair> = v.looseObject({
  colorType: v.optional(
    v.picklist([
      "THEME_COLOR_TYPE_UNSPECIFIED",
      "TEXT",
      "BACKGROUND",
      "ACCENT1",
      "ACCENT2",
      "ACCENT3",
      "ACCENT4",
      "ACCENT5",
      "ACCENT6",
      "LINK",
    ]),
  ),
  color: v.optional(v.lazy(() => SheetsColorStyle)),
})

export const SheetsDataLabel: v.GenericSchema<unknown, T.SheetsDataLabel> = v.looseObject({
  type: v.optional(v.picklist(["DATA_LABEL_TYPE_UNSPECIFIED", "NONE", "DATA", "CUSTOM"])),
  customLabelData: v.optional(v.lazy(() => SheetsChartData)),
  placement: v.optional(
    v.picklist([
      "DATA_LABEL_PLACEMENT_UNSPECIFIED",
      "CENTER",
      "LEFT",
      "RIGHT",
      "ABOVE",
      "BELOW",
      "INSIDE_END",
      "INSIDE_BASE",
      "OUTSIDE_END",
    ]),
  ),
  textFormat: v.optional(v.lazy(() => SheetsTextFormat)),
})

export const SheetsTimeOfDay: v.GenericSchema<unknown, T.SheetsTimeOfDay> = v.looseObject({
  seconds: v.optional(integer()),
  nanos: v.optional(integer()),
  hours: v.optional(integer()),
  minutes: v.optional(integer()),
})

export const SheetsChartAxisViewWindowOptions: v.GenericSchema<unknown, T.SheetsChartAxisViewWindowOptions> =
  v.looseObject({
    viewWindowMax: v.optional(number()),
    viewWindowMode: v.optional(
      v.picklist(["DEFAULT_VIEW_WINDOW_MODE", "VIEW_WINDOW_MODE_UNSUPPORTED", "EXPLICIT", "PRETTY"]),
    ),
    viewWindowMin: v.optional(number()),
  })

export const SheetsInsertDimensionRequest: v.GenericSchema<unknown, T.SheetsInsertDimensionRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsDimensionRange)),
  inheritFromBefore: v.optional(v.boolean()),
})

export const SheetsSpreadsheet: v.GenericSchema<unknown, T.SheetsSpreadsheet> = v.looseObject({
  properties: v.optional(v.lazy(() => SheetsSpreadsheetProperties)),
  comments: v.optional(v.array(v.lazy(() => SheetsCommentThread))),
  namedRanges: v.optional(v.array(v.lazy(() => SheetsNamedRange))),
  developerMetadata: v.optional(v.array(v.lazy(() => SheetsDeveloperMetadata))),
  dataSources: v.optional(v.array(v.lazy(() => SheetsDataSource))),
  sheets: v.optional(v.array(v.lazy(() => SheetsSheet))),
  spreadsheetUrl: v.optional(v.string()),
  dataSourceSchedules: v.optional(v.array(v.lazy(() => SheetsDataSourceRefreshSchedule))),
  spreadsheetId: v.optional(v.string()),
  commentsViewMode: v.optional(
    v.picklist([
      "COMMENTS_VIEW_MODE_UNSPECIFIED",
      "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS",
      "COMMENTS_VIEW_MODE_OMITTED",
      "COMMENTS_VIEW_MODE_INCLUDED",
    ]),
  ),
})

export const SheetsTreemapChartColorScale: v.GenericSchema<unknown, T.SheetsTreemapChartColorScale> = v.looseObject({
  noDataColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  maxValueColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  midValueColor: v.optional(v.lazy(() => SheetsColor)),
  noDataColor: v.optional(v.lazy(() => SheetsColor)),
  minValueColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  minValueColor: v.optional(v.lazy(() => SheetsColor)),
  midValueColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  maxValueColor: v.optional(v.lazy(() => SheetsColor)),
})

export const SheetsChartSourceRange: v.GenericSchema<unknown, T.SheetsChartSourceRange> = v.looseObject({
  sources: v.optional(v.array(v.lazy(() => SheetsGridRange))),
})

export const SheetsCandlestickSeries: v.GenericSchema<unknown, T.SheetsCandlestickSeries> = v.looseObject({
  data: v.optional(v.lazy(() => SheetsChartData)),
})

export const SheetsDataValidationRule: v.GenericSchema<unknown, T.SheetsDataValidationRule> = v.looseObject({
  condition: v.optional(v.lazy(() => SheetsBooleanCondition)),
  inputMessage: v.optional(v.string()),
  showCustomUi: v.optional(v.boolean()),
  strict: v.optional(v.boolean()),
})

export const SheetsUpdateSpreadsheetPropertiesRequest: v.GenericSchema<
  unknown,
  T.SheetsUpdateSpreadsheetPropertiesRequest
> = v.looseObject({
  properties: v.optional(v.lazy(() => SheetsSpreadsheetProperties)),
  fields: v.optional(v.string()),
})

export const SheetsCandlestickChartSpec: v.GenericSchema<unknown, T.SheetsCandlestickChartSpec> = v.looseObject({
  data: v.optional(v.array(v.lazy(() => SheetsCandlestickData))),
  domain: v.optional(v.lazy(() => SheetsCandlestickDomain)),
})

export const SheetsBatchUpdateSpreadsheetRequest: v.GenericSchema<unknown, T.SheetsBatchUpdateSpreadsheetRequest> =
  v.looseObject({
    requests: v.optional(v.array(v.lazy(() => SheetsRequest))),
    includeSpreadsheetInResponse: v.optional(v.boolean()),
    responseIncludeGridData: v.optional(v.boolean()),
    responseRanges: v.optional(v.array(v.string())),
    commentsViewMode: v.optional(
      v.picklist([
        "COMMENTS_VIEW_MODE_UNSPECIFIED",
        "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS",
        "COMMENTS_VIEW_MODE_OMITTED",
        "COMMENTS_VIEW_MODE_INCLUDED",
      ]),
    ),
  })

export const SheetsAppendValuesResponse: v.GenericSchema<unknown, T.SheetsAppendValuesResponse> = v.looseObject({
  updates: v.optional(v.lazy(() => SheetsUpdateValuesResponse)),
  tableRange: v.optional(v.string()),
  spreadsheetId: v.optional(v.string()),
})

export const SheetsSpreadsheetProperties: v.GenericSchema<unknown, T.SheetsSpreadsheetProperties> = v.looseObject({
  locale: v.optional(v.string()),
  timeZone: v.optional(v.string()),
  title: v.optional(v.string()),
  defaultFormat: v.optional(v.lazy(() => SheetsCellFormat)),
  autoRecalc: v.optional(v.picklist(["RECALCULATION_INTERVAL_UNSPECIFIED", "ON_CHANGE", "MINUTE", "HOUR"])),
  importFunctionsExternalUrlAccessAllowed: v.optional(v.boolean()),
  iterativeCalculationSettings: v.optional(v.lazy(() => SheetsIterativeCalculationSettings)),
  spreadsheetTheme: v.optional(v.lazy(() => SheetsSpreadsheetTheme)),
})

export const SheetsDataSourceTable: v.GenericSchema<unknown, T.SheetsDataSourceTable> = v.looseObject({
  dataExecutionStatus: v.optional(v.lazy(() => SheetsDataExecutionStatus)),
  columnSelectionType: v.optional(
    v.picklist(["DATA_SOURCE_TABLE_COLUMN_SELECTION_TYPE_UNSPECIFIED", "SELECTED", "SYNC_ALL"]),
  ),
  columns: v.optional(v.array(v.lazy(() => SheetsDataSourceColumnReference))),
  filterSpecs: v.optional(v.array(v.lazy(() => SheetsFilterSpec))),
  dataSourceId: v.optional(v.string()),
  sortSpecs: v.optional(v.array(v.lazy(() => SheetsSortSpec))),
  rowLimit: v.optional(integer()),
})

export const SheetsDateTimeRule: v.GenericSchema<unknown, T.SheetsDateTimeRule> = v.looseObject({
  type: v.optional(
    v.picklist([
      "DATE_TIME_RULE_TYPE_UNSPECIFIED",
      "SECOND",
      "MINUTE",
      "HOUR",
      "HOUR_MINUTE",
      "HOUR_MINUTE_AMPM",
      "DAY_OF_WEEK",
      "DAY_OF_YEAR",
      "DAY_OF_MONTH",
      "DAY_MONTH",
      "MONTH",
      "QUARTER",
      "YEAR",
      "YEAR_MONTH",
      "YEAR_QUARTER",
      "YEAR_MONTH_DAY",
    ]),
  ),
})

export const SheetsDataSourceSheetDimensionRange: v.GenericSchema<unknown, T.SheetsDataSourceSheetDimensionRange> =
  v.looseObject({
    sheetId: v.optional(integer()),
    columnReferences: v.optional(v.array(v.lazy(() => SheetsDataSourceColumnReference))),
  })

export const SheetsBatchUpdateValuesByDataFilterRequest: v.GenericSchema<
  unknown,
  T.SheetsBatchUpdateValuesByDataFilterRequest
> = v.looseObject({
  responseDateTimeRenderOption: v.optional(v.picklist(["SERIAL_NUMBER", "FORMATTED_STRING"])),
  valueInputOption: v.optional(v.picklist(["INPUT_VALUE_OPTION_UNSPECIFIED", "RAW", "USER_ENTERED"])),
  data: v.optional(v.array(v.lazy(() => SheetsDataFilterValueRange))),
  includeValuesInResponse: v.optional(v.boolean()),
  responseValueRenderOption: v.optional(v.picklist(["FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA"])),
})

export const SheetsMoveDimensionRequest: v.GenericSchema<unknown, T.SheetsMoveDimensionRequest> = v.looseObject({
  destinationIndex: v.optional(integer()),
  source: v.optional(v.lazy(() => SheetsDimensionRange)),
})

export const SheetsDuplicateSheetRequest: v.GenericSchema<unknown, T.SheetsDuplicateSheetRequest> = v.looseObject({
  newSheetName: v.optional(v.string()),
  insertSheetIndex: v.optional(integer()),
  sourceSheetId: v.optional(integer()),
  newSheetId: v.optional(integer()),
})

export const SheetsTable: v.GenericSchema<unknown, T.SheetsTable> = v.looseObject({
  columnProperties: v.optional(v.array(v.lazy(() => SheetsTableColumnProperties))),
  tableId: v.optional(v.string()),
  rowsProperties: v.optional(v.lazy(() => SheetsTableRowsProperties)),
  range: v.optional(v.lazy(() => SheetsGridRange)),
  name: v.optional(v.string()),
})

export const SheetsPivotGroupLimit: v.GenericSchema<unknown, T.SheetsPivotGroupLimit> = v.looseObject({
  countLimit: v.optional(integer()),
  applyOrder: v.optional(integer()),
})

export const SheetsUpdateDimensionGroupRequest: v.GenericSchema<unknown, T.SheetsUpdateDimensionGroupRequest> =
  v.looseObject({
    fields: v.optional(v.string()),
    dimensionGroup: v.optional(v.lazy(() => SheetsDimensionGroup)),
  })

export const SheetsLink: v.GenericSchema<unknown, T.SheetsLink> = v.looseObject({
  uri: v.optional(v.string()),
})

export const SheetsAddProtectedRangeRequest: v.GenericSchema<unknown, T.SheetsAddProtectedRangeRequest> = v.looseObject(
  {
    protectedRange: v.optional(v.lazy(() => SheetsProtectedRange)),
  },
)

export const SheetsUpdateCommentPostRequest: v.GenericSchema<unknown, T.SheetsUpdateCommentPostRequest> = v.looseObject(
  {
    content: v.optional(v.string()),
    commentId: v.optional(v.string()),
    postId: v.optional(v.string()),
  },
)

export const SheetsAddCommentReplyResponse: v.GenericSchema<unknown, T.SheetsAddCommentReplyResponse> = v.looseObject({
  post: v.optional(v.lazy(() => SheetsPost)),
})

export const SheetsDeleteRangeRequest: v.GenericSchema<unknown, T.SheetsDeleteRangeRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
  shiftDimension: v.optional(v.picklist(["DIMENSION_UNSPECIFIED", "ROWS", "COLUMNS"])),
})

export const SheetsAddConditionalFormatRuleRequest: v.GenericSchema<unknown, T.SheetsAddConditionalFormatRuleRequest> =
  v.looseObject({
    index: v.optional(integer()),
    rule: v.optional(v.lazy(() => SheetsConditionalFormatRule)),
  })

export const SheetsUpdateValuesByDataFilterResponse: v.GenericSchema<
  unknown,
  T.SheetsUpdateValuesByDataFilterResponse
> = v.looseObject({
  dataFilter: v.optional(v.lazy(() => SheetsDataFilter)),
  updatedColumns: v.optional(integer()),
  updatedRange: v.optional(v.string()),
  updatedRows: v.optional(integer()),
  updatedData: v.optional(v.lazy(() => SheetsValueRange)),
  updatedCells: v.optional(integer()),
})

export const SheetsDeleteConditionalFormatRuleRequest: v.GenericSchema<
  unknown,
  T.SheetsDeleteConditionalFormatRuleRequest
> = v.looseObject({
  index: v.optional(integer()),
  sheetId: v.optional(integer()),
})

export const SheetsChipRun: v.GenericSchema<unknown, T.SheetsChipRun> = v.looseObject({
  chip: v.optional(v.lazy(() => SheetsChip)),
  startIndex: v.optional(integer()),
})

export const SheetsConditionValue: v.GenericSchema<unknown, T.SheetsConditionValue> = v.looseObject({
  userEnteredValue: v.optional(v.string()),
  relativeDate: v.optional(
    v.picklist(["RELATIVE_DATE_UNSPECIFIED", "PAST_YEAR", "PAST_MONTH", "PAST_WEEK", "YESTERDAY", "TODAY", "TOMORROW"]),
  ),
})

export const SheetsBatchGetValuesByDataFilterResponse: v.GenericSchema<
  unknown,
  T.SheetsBatchGetValuesByDataFilterResponse
> = v.looseObject({
  spreadsheetId: v.optional(v.string()),
  valueRanges: v.optional(v.array(v.lazy(() => SheetsMatchedValueRange))),
})

export const SheetsPivotFilterCriteria: v.GenericSchema<unknown, T.SheetsPivotFilterCriteria> = v.looseObject({
  visibleValues: v.optional(v.array(v.string())),
  condition: v.optional(v.lazy(() => SheetsBooleanCondition)),
  visibleByDefault: v.optional(v.boolean()),
})

export const SheetsDataSourceParameter: v.GenericSchema<unknown, T.SheetsDataSourceParameter> = v.looseObject({
  namedRangeId: v.optional(v.string()),
  range: v.optional(v.lazy(() => SheetsGridRange)),
  name: v.optional(v.string()),
})

export const SheetsClearValuesRequest: v.GenericSchema<unknown, T.SheetsClearValuesRequest> = v.looseObject({})

export const SheetsTreemapChartSpec: v.GenericSchema<unknown, T.SheetsTreemapChartSpec> = v.looseObject({
  hideTooltips: v.optional(v.boolean()),
  textFormat: v.optional(v.lazy(() => SheetsTextFormat)),
  colorScale: v.optional(v.lazy(() => SheetsTreemapChartColorScale)),
  headerColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  levels: v.optional(integer()),
  parentLabels: v.optional(v.lazy(() => SheetsChartData)),
  labels: v.optional(v.lazy(() => SheetsChartData)),
  minValue: v.optional(number()),
  hintedLevels: v.optional(integer()),
  sizeData: v.optional(v.lazy(() => SheetsChartData)),
  colorData: v.optional(v.lazy(() => SheetsChartData)),
  maxValue: v.optional(number()),
  headerColor: v.optional(v.lazy(() => SheetsColor)),
})

export const SheetsFilterCriteria: v.GenericSchema<unknown, T.SheetsFilterCriteria> = v.looseObject({
  visibleForegroundColor: v.optional(v.lazy(() => SheetsColor)),
  visibleBackgroundColor: v.optional(v.lazy(() => SheetsColor)),
  visibleBackgroundColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  hiddenValues: v.optional(v.array(v.string())),
  visibleForegroundColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  condition: v.optional(v.lazy(() => SheetsBooleanCondition)),
})

export const SheetsEmbeddedChart: v.GenericSchema<unknown, T.SheetsEmbeddedChart> = v.looseObject({
  chartId: v.optional(integer()),
  spec: v.optional(v.lazy(() => SheetsChartSpec)),
  border: v.optional(v.lazy(() => SheetsEmbeddedObjectBorder)),
  position: v.optional(v.lazy(() => SheetsEmbeddedObjectPosition)),
})

export const SheetsColor: v.GenericSchema<unknown, T.SheetsColor> = v.looseObject({
  green: v.optional(number()),
  blue: v.optional(number()),
  alpha: v.optional(number()),
  red: v.optional(number()),
})

export const SheetsCancelDataSourceRefreshRequest: v.GenericSchema<unknown, T.SheetsCancelDataSourceRefreshRequest> =
  v.looseObject({
    references: v.optional(v.lazy(() => SheetsDataSourceObjectReferences)),
    dataSourceId: v.optional(v.string()),
    isAll: v.optional(v.boolean()),
  })

export const SheetsDeleteFilterViewRequest: v.GenericSchema<unknown, T.SheetsDeleteFilterViewRequest> = v.looseObject({
  filterId: v.optional(integer()),
})

export const SheetsDataSourceSheetProperties: v.GenericSchema<unknown, T.SheetsDataSourceSheetProperties> =
  v.looseObject({
    columns: v.optional(v.array(v.lazy(() => SheetsDataSourceColumn))),
    dataSourceId: v.optional(v.string()),
    dataExecutionStatus: v.optional(v.lazy(() => SheetsDataExecutionStatus)),
  })

export const SheetsAddProtectedRangeResponse: v.GenericSchema<unknown, T.SheetsAddProtectedRangeResponse> =
  v.looseObject({
    protectedRange: v.optional(v.lazy(() => SheetsProtectedRange)),
  })

export const SheetsBatchClearValuesByDataFilterRequest: v.GenericSchema<
  unknown,
  T.SheetsBatchClearValuesByDataFilterRequest
> = v.looseObject({
  dataFilters: v.optional(v.array(v.lazy(() => SheetsDataFilter))),
})

export const SheetsBorders: v.GenericSchema<unknown, T.SheetsBorders> = v.looseObject({
  left: v.optional(v.lazy(() => SheetsBorder)),
  right: v.optional(v.lazy(() => SheetsBorder)),
  top: v.optional(v.lazy(() => SheetsBorder)),
  bottom: v.optional(v.lazy(() => SheetsBorder)),
})

export const SheetsSearchDeveloperMetadataRequest: v.GenericSchema<unknown, T.SheetsSearchDeveloperMetadataRequest> =
  v.looseObject({
    dataFilters: v.optional(v.array(v.lazy(() => SheetsDataFilter))),
  })

export const SheetsClearValuesResponse: v.GenericSchema<unknown, T.SheetsClearValuesResponse> = v.looseObject({
  clearedRange: v.optional(v.string()),
  spreadsheetId: v.optional(v.string()),
})

export const SheetsPivotGroup: v.GenericSchema<unknown, T.SheetsPivotGroup> = v.looseObject({
  repeatHeadings: v.optional(v.boolean()),
  groupRule: v.optional(v.lazy(() => SheetsPivotGroupRule)),
  dataSourceColumnReference: v.optional(v.lazy(() => SheetsDataSourceColumnReference)),
  showTotals: v.optional(v.boolean()),
  sourceColumnOffset: v.optional(integer()),
  groupLimit: v.optional(v.lazy(() => SheetsPivotGroupLimit)),
  valueBucket: v.optional(v.lazy(() => SheetsPivotGroupSortValueBucket)),
  label: v.optional(v.string()),
  sortOrder: v.optional(v.picklist(["SORT_ORDER_UNSPECIFIED", "ASCENDING", "DESCENDING"])),
  valueMetadata: v.optional(v.array(v.lazy(() => SheetsPivotGroupValueMetadata))),
})

export const SheetsGridRange: v.GenericSchema<unknown, T.SheetsGridRange> = v.looseObject({
  sheetId: v.optional(integer()),
  endColumnIndex: v.optional(integer()),
  endRowIndex: v.optional(integer()),
  startRowIndex: v.optional(integer()),
  startColumnIndex: v.optional(integer()),
})

export const SheetsInterval: v.GenericSchema<unknown, T.SheetsInterval> = v.looseObject({
  endTime: v.optional(v.string()),
  startTime: v.optional(v.string()),
})

export const SheetsAutoResizeDimensionsRequest: v.GenericSchema<unknown, T.SheetsAutoResizeDimensionsRequest> =
  v.looseObject({
    dimensions: v.optional(v.lazy(() => SheetsDimensionRange)),
    dataSourceSheetDimensions: v.optional(v.lazy(() => SheetsDataSourceSheetDimensionRange)),
  })

export const SheetsDataSourceObjectReference: v.GenericSchema<unknown, T.SheetsDataSourceObjectReference> =
  v.looseObject({
    dataSourceTableAnchorCell: v.optional(v.lazy(() => SheetsGridCoordinate)),
    chartId: v.optional(integer()),
    sheetId: v.optional(v.string()),
    dataSourcePivotTableAnchorCell: v.optional(v.lazy(() => SheetsGridCoordinate)),
    dataSourceFormulaCell: v.optional(v.lazy(() => SheetsGridCoordinate)),
  })

export const SheetsAddSheetResponse: v.GenericSchema<unknown, T.SheetsAddSheetResponse> = v.looseObject({
  properties: v.optional(v.lazy(() => SheetsSheetProperties)),
})

export const SheetsUpdateDimensionPropertiesRequest: v.GenericSchema<
  unknown,
  T.SheetsUpdateDimensionPropertiesRequest
> = v.looseObject({
  properties: v.optional(v.lazy(() => SheetsDimensionProperties)),
  fields: v.optional(v.string()),
  range: v.optional(v.lazy(() => SheetsDimensionRange)),
  dataSourceSheetRange: v.optional(v.lazy(() => SheetsDataSourceSheetDimensionRange)),
})

export const SheetsChartCustomNumberFormatOptions: v.GenericSchema<unknown, T.SheetsChartCustomNumberFormatOptions> =
  v.looseObject({
    prefix: v.optional(v.string()),
    suffix: v.optional(v.string()),
  })

export const SheetsUpdateDeveloperMetadataResponse: v.GenericSchema<unknown, T.SheetsUpdateDeveloperMetadataResponse> =
  v.looseObject({
    developerMetadata: v.optional(v.array(v.lazy(() => SheetsDeveloperMetadata))),
  })

export const SheetsDeleteConditionalFormatRuleResponse: v.GenericSchema<
  unknown,
  T.SheetsDeleteConditionalFormatRuleResponse
> = v.looseObject({
  rule: v.optional(v.lazy(() => SheetsConditionalFormatRule)),
})

export const SheetsUpdateConditionalFormatRuleResponse: v.GenericSchema<
  unknown,
  T.SheetsUpdateConditionalFormatRuleResponse
> = v.looseObject({
  oldIndex: v.optional(integer()),
  newIndex: v.optional(integer()),
  oldRule: v.optional(v.lazy(() => SheetsConditionalFormatRule)),
  newRule: v.optional(v.lazy(() => SheetsConditionalFormatRule)),
})

export const SheetsHistogramChartSpec: v.GenericSchema<unknown, T.SheetsHistogramChartSpec> = v.looseObject({
  outlierPercentile: v.optional(number()),
  series: v.optional(v.array(v.lazy(() => SheetsHistogramSeries))),
  showItemDividers: v.optional(v.boolean()),
  bucketSize: v.optional(number()),
  legendPosition: v.optional(
    v.picklist([
      "HISTOGRAM_CHART_LEGEND_POSITION_UNSPECIFIED",
      "BOTTOM_LEGEND",
      "LEFT_LEGEND",
      "RIGHT_LEGEND",
      "TOP_LEGEND",
      "NO_LEGEND",
      "INSIDE_LEGEND",
    ]),
  ),
})

export const SheetsDeleteEmbeddedObjectRequest: v.GenericSchema<unknown, T.SheetsDeleteEmbeddedObjectRequest> =
  v.looseObject({
    objectId: v.optional(integer()),
  })

export const SheetsDimensionGroup: v.GenericSchema<unknown, T.SheetsDimensionGroup> = v.looseObject({
  collapsed: v.optional(v.boolean()),
  range: v.optional(v.lazy(() => SheetsDimensionRange)),
  depth: v.optional(integer()),
})

export const SheetsFindReplaceResponse: v.GenericSchema<unknown, T.SheetsFindReplaceResponse> = v.looseObject({
  rowsChanged: v.optional(integer()),
  sheetsChanged: v.optional(integer()),
  formulasChanged: v.optional(integer()),
  occurrencesChanged: v.optional(integer()),
  valuesChanged: v.optional(integer()),
})

export const SheetsWaterfallChartColumnStyle: v.GenericSchema<unknown, T.SheetsWaterfallChartColumnStyle> =
  v.looseObject({
    label: v.optional(v.string()),
    color: v.optional(v.lazy(() => SheetsColor)),
    colorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  })

export const SheetsAddDimensionGroupRequest: v.GenericSchema<unknown, T.SheetsAddDimensionGroupRequest> = v.looseObject(
  {
    range: v.optional(v.lazy(() => SheetsDimensionRange)),
  },
)

export const SheetsUpdateBandingRequest: v.GenericSchema<unknown, T.SheetsUpdateBandingRequest> = v.looseObject({
  fields: v.optional(v.string()),
  bandedRange: v.optional(v.lazy(() => SheetsBandedRange)),
})

export const SheetsDataSourceRefreshDailySchedule: v.GenericSchema<unknown, T.SheetsDataSourceRefreshDailySchedule> =
  v.looseObject({
    startTime: v.optional(v.lazy(() => SheetsTimeOfDay)),
  })

export const SheetsPointStyle: v.GenericSchema<unknown, T.SheetsPointStyle> = v.looseObject({
  size: v.optional(number()),
  shape: v.optional(
    v.picklist([
      "POINT_SHAPE_UNSPECIFIED",
      "CIRCLE",
      "DIAMOND",
      "HEXAGON",
      "PENTAGON",
      "SQUARE",
      "STAR",
      "TRIANGLE",
      "X_MARK",
    ]),
  ),
})

export const SheetsDeleteTableRequest: v.GenericSchema<unknown, T.SheetsDeleteTableRequest> = v.looseObject({
  tableId: v.optional(v.string()),
})

export const SheetsDeleteDeveloperMetadataResponse: v.GenericSchema<unknown, T.SheetsDeleteDeveloperMetadataResponse> =
  v.looseObject({
    deletedDeveloperMetadata: v.optional(v.array(v.lazy(() => SheetsDeveloperMetadata))),
  })

export const SheetsDeleteNamedRangeRequest: v.GenericSchema<unknown, T.SheetsDeleteNamedRangeRequest> = v.looseObject({
  namedRangeId: v.optional(v.string()),
})

export const SheetsBaselineValueFormat: v.GenericSchema<unknown, T.SheetsBaselineValueFormat> = v.looseObject({
  comparisonType: v.optional(v.picklist(["COMPARISON_TYPE_UNDEFINED", "ABSOLUTE_DIFFERENCE", "PERCENTAGE_DIFFERENCE"])),
  negativeColor: v.optional(v.lazy(() => SheetsColor)),
  description: v.optional(v.string()),
  position: v.optional(v.lazy(() => SheetsTextPosition)),
  textFormat: v.optional(v.lazy(() => SheetsTextFormat)),
  positiveColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  negativeColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  positiveColor: v.optional(v.lazy(() => SheetsColor)),
})

export const SheetsAutoFillRequest: v.GenericSchema<unknown, T.SheetsAutoFillRequest> = v.looseObject({
  sourceAndDestination: v.optional(v.lazy(() => SheetsSourceAndDestination)),
  useAlternateSeries: v.optional(v.boolean()),
  range: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsSheetProperties: v.GenericSchema<unknown, T.SheetsSheetProperties> = v.looseObject({
  title: v.optional(v.string()),
  rightToLeft: v.optional(v.boolean()),
  hidden: v.optional(v.boolean()),
  sheetId: v.optional(integer()),
  gridProperties: v.optional(v.lazy(() => SheetsGridProperties)),
  dataSourceSheetProperties: v.optional(v.lazy(() => SheetsDataSourceSheetProperties)),
  index: v.optional(integer()),
  tabColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  tabColor: v.optional(v.lazy(() => SheetsColor)),
  sheetType: v.optional(v.picklist(["SHEET_TYPE_UNSPECIFIED", "GRID", "OBJECT", "DATA_SOURCE"])),
})

export const SheetsBandedRange: v.GenericSchema<unknown, T.SheetsBandedRange> = v.looseObject({
  bandedRangeReference: v.optional(v.string()),
  columnProperties: v.optional(v.lazy(() => SheetsBandingProperties)),
  rowProperties: v.optional(v.lazy(() => SheetsBandingProperties)),
  range: v.optional(v.lazy(() => SheetsGridRange)),
  bandedRangeId: v.optional(integer()),
})

export const SheetsNamedRange: v.GenericSchema<unknown, T.SheetsNamedRange> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
  name: v.optional(v.string()),
  namedRangeId: v.optional(v.string()),
})

export const SheetsBasicSeriesDataPointStyleOverride: v.GenericSchema<
  unknown,
  T.SheetsBasicSeriesDataPointStyleOverride
> = v.looseObject({
  index: v.optional(integer()),
  pointStyle: v.optional(v.lazy(() => SheetsPointStyle)),
  colorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  color: v.optional(v.lazy(() => SheetsColor)),
})

export const SheetsRandomizeRangeRequest: v.GenericSchema<unknown, T.SheetsRandomizeRangeRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsAppendCellsRequest: v.GenericSchema<unknown, T.SheetsAppendCellsRequest> = v.looseObject({
  sheetId: v.optional(integer()),
  tableId: v.optional(v.string()),
  rows: v.optional(v.array(v.lazy(() => SheetsRowData))),
  fields: v.optional(v.string()),
})

export const SheetsBandingProperties: v.GenericSchema<unknown, T.SheetsBandingProperties> = v.looseObject({
  footerColor: v.optional(v.lazy(() => SheetsColor)),
  firstBandColor: v.optional(v.lazy(() => SheetsColor)),
  firstBandColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  secondBandColor: v.optional(v.lazy(() => SheetsColor)),
  headerColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  footerColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
  headerColor: v.optional(v.lazy(() => SheetsColor)),
  secondBandColorStyle: v.optional(v.lazy(() => SheetsColorStyle)),
})

export const SheetsDeleteBandingRequest: v.GenericSchema<unknown, T.SheetsDeleteBandingRequest> = v.looseObject({
  bandedRangeId: v.optional(integer()),
})

export const SheetsPivotValue: v.GenericSchema<unknown, T.SheetsPivotValue> = v.looseObject({
  formula: v.optional(v.string()),
  calculatedDisplayType: v.optional(
    v.picklist([
      "PIVOT_VALUE_CALCULATED_DISPLAY_TYPE_UNSPECIFIED",
      "PERCENT_OF_ROW_TOTAL",
      "PERCENT_OF_COLUMN_TOTAL",
      "PERCENT_OF_GRAND_TOTAL",
    ]),
  ),
  dataSourceColumnReference: v.optional(v.lazy(() => SheetsDataSourceColumnReference)),
  summarizeFunction: v.optional(
    v.picklist([
      "PIVOT_STANDARD_VALUE_FUNCTION_UNSPECIFIED",
      "SUM",
      "COUNTA",
      "COUNT",
      "COUNTUNIQUE",
      "AVERAGE",
      "MAX",
      "MIN",
      "MEDIAN",
      "PRODUCT",
      "STDEV",
      "STDEVP",
      "VAR",
      "VARP",
      "CUSTOM",
      "NONE",
    ]),
  ),
  sourceColumnOffset: v.optional(integer()),
  name: v.optional(v.string()),
})

export const SheetsTableColumnDataValidationRule: v.GenericSchema<unknown, T.SheetsTableColumnDataValidationRule> =
  v.looseObject({
    condition: v.optional(v.lazy(() => SheetsBooleanCondition)),
  })

export const SheetsBatchGetValuesByDataFilterRequest: v.GenericSchema<
  unknown,
  T.SheetsBatchGetValuesByDataFilterRequest
> = v.looseObject({
  valueRenderOption: v.optional(v.picklist(["FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA"])),
  dataFilters: v.optional(v.array(v.lazy(() => SheetsDataFilter))),
  majorDimension: v.optional(v.picklist(["DIMENSION_UNSPECIFIED", "ROWS", "COLUMNS"])),
  dateTimeRenderOption: v.optional(v.picklist(["SERIAL_NUMBER", "FORMATTED_STRING"])),
})

export const SheetsExtendedValue: v.GenericSchema<unknown, T.SheetsExtendedValue> = v.looseObject({
  errorValue: v.optional(v.lazy(() => SheetsErrorValue)),
  boolValue: v.optional(v.boolean()),
  stringValue: v.optional(v.string()),
  formulaValue: v.optional(v.string()),
  numberValue: v.optional(number()),
})

export const SheetsUpdateSheetPropertiesRequest: v.GenericSchema<unknown, T.SheetsUpdateSheetPropertiesRequest> =
  v.looseObject({
    properties: v.optional(v.lazy(() => SheetsSheetProperties)),
    fields: v.optional(v.string()),
  })

export const SheetsUpdateEmbeddedObjectPositionRequest: v.GenericSchema<
  unknown,
  T.SheetsUpdateEmbeddedObjectPositionRequest
> = v.looseObject({
  objectId: v.optional(integer()),
  newPosition: v.optional(v.lazy(() => SheetsEmbeddedObjectPosition)),
  fields: v.optional(v.string()),
})

export const SheetsUpdateDataSourceRequest: v.GenericSchema<unknown, T.SheetsUpdateDataSourceRequest> = v.looseObject({
  fields: v.optional(v.string()),
  dataSource: v.optional(v.lazy(() => SheetsDataSource)),
})

export const SheetsFindReplaceRequest: v.GenericSchema<unknown, T.SheetsFindReplaceRequest> = v.looseObject({
  range: v.optional(v.lazy(() => SheetsGridRange)),
  matchCase: v.optional(v.boolean()),
  find: v.optional(v.string()),
  allSheets: v.optional(v.boolean()),
  includeFormulas: v.optional(v.boolean()),
  replacement: v.optional(v.string()),
  searchByRegex: v.optional(v.boolean()),
  sheetId: v.optional(integer()),
  matchEntireCell: v.optional(v.boolean()),
})

export const SheetsDataFilter: v.GenericSchema<unknown, T.SheetsDataFilter> = v.looseObject({
  a1Range: v.optional(v.string()),
  gridRange: v.optional(v.lazy(() => SheetsGridRange)),
  developerMetadataLookup: v.optional(v.lazy(() => SheetsDeveloperMetadataLookup)),
})

export const SheetsSetDataValidationRequest: v.GenericSchema<unknown, T.SheetsSetDataValidationRequest> = v.looseObject(
  {
    range: v.optional(v.lazy(() => SheetsGridRange)),
    rule: v.optional(v.lazy(() => SheetsDataValidationRule)),
    filteredRowsIncluded: v.optional(v.boolean()),
  },
)

export const SheetsCommentAnchor: v.GenericSchema<unknown, T.SheetsCommentAnchor> = v.looseObject({
  anchorId: v.optional(v.string()),
  range: v.optional(v.lazy(() => SheetsGridRange)),
})

export const SheetsBasicChartAxis: v.GenericSchema<unknown, T.SheetsBasicChartAxis> = v.looseObject({
  viewWindowOptions: v.optional(v.lazy(() => SheetsChartAxisViewWindowOptions)),
  title: v.optional(v.string()),
  titleTextPosition: v.optional(v.lazy(() => SheetsTextPosition)),
  format: v.optional(v.lazy(() => SheetsTextFormat)),
  position: v.optional(v.picklist(["BASIC_CHART_AXIS_POSITION_UNSPECIFIED", "BOTTOM_AXIS", "LEFT_AXIS", "RIGHT_AXIS"])),
})

export const SheetsCreateDeveloperMetadataRequest: v.GenericSchema<unknown, T.SheetsCreateDeveloperMetadataRequest> =
  v.looseObject({
    developerMetadata: v.optional(v.lazy(() => SheetsDeveloperMetadata)),
  })

export const SheetsInsertCommentResponse: v.GenericSchema<unknown, T.SheetsInsertCommentResponse> = v.looseObject({
  commentThread: v.optional(v.lazy(() => SheetsCommentThread)),
})

export const SheetsDataSourceSpec: v.GenericSchema<unknown, T.SheetsDataSourceSpec> = v.looseObject({
  parameters: v.optional(v.array(v.lazy(() => SheetsDataSourceParameter))),
  bigQuery: v.optional(v.lazy(() => SheetsBigQueryDataSourceSpec)),
  looker: v.optional(v.lazy(() => SheetsLookerDataSourceSpec)),
})

export const SheetsCancelDataSourceRefreshStatus: v.GenericSchema<unknown, T.SheetsCancelDataSourceRefreshStatus> =
  v.looseObject({
    refreshCancellationStatus: v.optional(v.lazy(() => SheetsRefreshCancellationStatus)),
    reference: v.optional(v.lazy(() => SheetsDataSourceObjectReference)),
  })

export const SheetsMatchedValueRange: v.GenericSchema<unknown, T.SheetsMatchedValueRange> = v.looseObject({
  valueRange: v.optional(v.lazy(() => SheetsValueRange)),
  dataFilters: v.optional(v.array(v.lazy(() => SheetsDataFilter))),
})

export const SheetsAddFilterViewRequest: v.GenericSchema<unknown, T.SheetsAddFilterViewRequest> = v.looseObject({
  filter: v.optional(v.lazy(() => SheetsFilterView)),
})

export const schemas = {
  DriveOperation,
  DrivePermission,
  DriveAddReviewer,
  DriveTeamDrive,
  DriveListAccessProposalsResponse,
  DriveReply,
  DriveComment,
  DriveChange,
  DriveDecryptionMetadata,
  DriveLabelFieldModification,
  DriveApprovalList,
  DriveDriveList,
  DriveStartPageToken,
  DriveCommentApprovalRequest,
  DriveDownloadRestriction,
  DriveTeamDriveList,
  DriveReassignApprovalRequest,
  DriveReplaceReviewer,
  DriveLabelField,
  DriveApproval,
  DriveChangeList,
  DriveDeclineApprovalRequest,
  DriveGeneratedIds,
  DriveClientEncryptionDetails,
  DriveRevisionList,
  DriveLabelModification,
  DriveChannel,
  DriveModifyLabelsResponse,
  DriveReplyList,
  DriveFileList,
  DriveRevision,
  DriveAppIcons,
  DriveAccessProposal,
  DriveDownloadRestrictionsMetadata,
  DriveUser,
  DriveAccessProposalRoleAndView,
  DriveLabelList,
  DriveAppList,
  DriveGenerateCseTokenResponse,
  DriveStatus,
  DrivePermissionList,
  DriveStartApprovalRequest,
  DriveCommentList,
  DriveLabel,
  DriveCancelApprovalRequest,
  DriveReviewerResponse,
  DriveContentRestriction,
  DriveApproveApprovalRequest,
  DriveApp,
  DriveFile,
  DriveAbout,
  DriveDrive,
  DriveModifyLabelsRequest,
  DriveResolveAccessProposalRequest,
  DocsBullet,
  DocsLinkedContentReference,
  DocsPositionedObjectProperties,
  DocsPositionedObject,
  DocsRgbColor,
  DocsTableCell,
  DocsReplaceImageRequest,
  DocsTableRowStyleSuggestionState,
  DocsBackground,
  DocsAutoText,
  DocsDropdown,
  DocsReplaceAllTextResponse,
  DocsUpdateNamedStyleRequest,
  DocsSuggestedTextStyle,
  DocsRichLinkProperties,
  DocsPageBreak,
  DocsDropdownProperties,
  DocsSheetsChartReferenceSuggestionState,
  DocsShading,
  DocsReplaceAllTextRequest,
  DocsSheetsChartReference,
  DocsNestingLevel,
  DocsSuggestionResponse,
  DocsFootnoteReference,
  DocsTextStyleSuggestionState,
  DocsDropdownPropertiesSuggestionState,
  DocsNestingLevelSuggestionState,
  DocsTable,
  DocsTableCellLocation,
  DocsResponse,
  DocsDocumentStyle,
  DocsDeleteTableRowRequest,
  DocsCreateFootnoteRequest,
  DocsCreateHeaderRequest,
  DocsAddCommentReplyRequest,
  DocsDeleteParagraphBulletsRequest,
  DocsNamedStylesSuggestionState,
  DocsTabProperties,
  DocsSuggestedDocumentStyle,
  DocsCreateNamedRangeRequest,
  DocsEmbeddedObject,
  DocsDeleteHeaderRequest,
  DocsInsertTableRequest,
  DocsInsertDropdownResponse,
  DocsInsertDateRequest,
  DocsAddCommentReplyResponse,
  DocsTableRow,
  DocsListProperties,
  DocsImagePropertiesSuggestionState,
  DocsNamedRange,
  DocsNamedStyle,
  DocsEmbeddedDrawingProperties,
  DocsDeleteSuggestionRequest,
  DocsUpdateDocumentTabPropertiesRequest,
  DocsDeleteContentRangeRequest,
  DocsAcceptSuggestionRequest,
  DocsHorizontalRule,
  DocsHeadingLink,
  DocsUpdateTextStyleRequest,
  DocsUpdateDocumentStyleRequest,
  DocsOptionalColor,
  DocsEndOfSegmentLocation,
  DocsSuggestedInlineObjectProperties,
  DocsInsertTextRequest,
  DocsCreateFooterRequest,
  DocsSubstringMatchCriteria,
  DocsNamedStyles,
  DocsTableCellStyle,
  DocsSuggestedPositionedObjectProperties,
  DocsSectionColumnProperties,
  DocsDeleteCommentReplyRequest,
  DocsEmbeddedObjectBorder,
  DocsInlineObjectPropertiesSuggestionState,
  DocsNamedRanges,
  DocsInlineObject,
  DocsInsertTableColumnRequest,
  DocsTableCellBorder,
  DocsHeader,
  DocsInsertCommentResponse,
  DocsUpdateDropdownPropertiesRequest,
  DocsTab,
  DocsColor,
  DocsFooter,
  DocsSuggestedDropdownDefinitionProperties,
  DocsObjectReferences,
  DocsTableOfContents,
  DocsListPropertiesSuggestionState,
  DocsStructuralElement,
  DocsInsertInlineImageRequest,
  DocsBody,
  DocsInsertTableRowRequest,
  DocsWriteControl,
  DocsCreateFooterResponse,
  DocsDropdownDefinition,
  DocsSectionStyle,
  DocsBatchUpdateDocumentRequest,
  DocsEmbeddedObjectSuggestionState,
  DocsTextRun,
  DocsTabStop,
  DocsDateElementProperties,
  DocsParagraphStyleSuggestionState,
  DocsPersonProperties,
  DocsSuggestedTableRowStyle,
  DocsUnmergeTableCellsRequest,
  DocsCommentThread,
  DocsImageProperties,
  DocsCommentAnchor,
  DocsDeleteNamedRangeRequest,
  DocsEmbeddedDrawingPropertiesSuggestionState,
  DocsTableColumnProperties,
  DocsDocument,
  DocsInlineObjectProperties,
  DocsTabsCriteria,
  DocsCropPropertiesSuggestionState,
  DocsDropdownDefinitionPropertiesSuggestionState,
  DocsBatchUpdateDocumentResponse,
  DocsDeleteTableColumnRequest,
  DocsFootnote,
  DocsLinkedContentReferenceSuggestionState,
  DocsUpdateCommentPostRequest,
  DocsSuggestedTableCellStyle,
  DocsColumnBreak,
  DocsWeightedFontFamily,
  DocsPostAuthor,
  DocsDocumentTab,
  DocsInsertCommentRequest,
  DocsSuggestedParagraphStyle,
  DocsDeleteCommentRequest,
  DocsTableStyle,
  DocsUpdateDropdownDefinitionPropertiesRequest,
  DocsCreateDropdownDefinitionResponse,
  DocsDeleteTabRequest,
  DocsPositionedObjectPropertiesSuggestionState,
  DocsTableCellStyleSuggestionState,
  DocsPositionedObjectPositioning,
  DocsAddDocumentTabRequest,
  DocsEquation,
  DocsTableRowStyle,
  DocsDocumentFormat,
  DocsRange,
  DocsDateElement,
  DocsSuggestedListProperties,
  DocsList,
  DocsDropdownOption,
  DocsCropProperties,
  DocsParagraphBorder,
  DocsSuggestedNamedStyles,
  DocsSizeSuggestionState,
  DocsEmbeddedObjectBorderSuggestionState,
  DocsParagraphStyle,
  DocsUpdateTableCellStyleRequest,
  DocsNamedStyleSuggestionState,
  DocsDateElementPropertiesSuggestionState,
  DocsSuggestedDateElementProperties,
  DocsLink,
  DocsDeletePositionedObjectRequest,
  DocsDeleteDropdownDefinitionRequest,
  DocsMergeTableCellsRequest,
  DocsRichLink,
  DocsDropdownDefinitionProperties,
  DocsCreateHeaderResponse,
  DocsParagraph,
  DocsCreateNamedRangeResponse,
  DocsTextStyle,
  DocsCreateParagraphBulletsRequest,
  DocsRejectSuggestionRequest,
  DocsCreateFootnoteResponse,
  DocsSectionBreak,
  DocsSuggestedDropdownProperties,
  DocsBackgroundSuggestionState,
  DocsUpdateParagraphStyleRequest,
  DocsInlineObjectElement,
  DocsDeleteFooterRequest,
  DocsPinTableHeaderRowsRequest,
  DocsPositionedObjectPositioningSuggestionState,
  DocsInsertInlineSheetsChartResponse,
  DocsInsertPersonRequest,
  DocsInsertRichLinkRequest,
  DocsBulletSuggestionState,
  DocsUpdateSectionStyleRequest,
  DocsInsertDropdownRequest,
  DocsPerson,
  DocsInsertInlineImageResponse,
  DocsRequest,
  DocsInsertPageBreakRequest,
  DocsDocumentStyleSuggestionState,
  DocsShadingSuggestionState,
  DocsTableRange,
  DocsCreateDropdownDefinitionRequest,
  DocsParagraphElement,
  DocsSuggestedBullet,
  DocsPost,
  DocsUpdateTableRowStyleRequest,
  DocsInsertSectionBreakRequest,
  DocsReplaceNamedRangeContentRequest,
  DocsLocation,
  DocsSize,
  DocsUpdateTableColumnPropertiesRequest,
  DocsAddDocumentTabResponse,
  DocsDimension,
  DocsSuggestionThread,
  DocsBookmarkLink,
  DriveactivityAppliedLabelChange,
  DriveactivityLegacy,
  DriveactivityDataLeakPreventionChange,
  DriveactivitySingleUser,
  DriveactivityTargetReference,
  DriveactivityPost,
  DriveactivityImpersonation,
  DriveactivityFieldValueChange,
  DriveactivityAdministrator,
  DriveactivityDriveReference,
  DriveactivityTimeRange,
  DriveactivityDriveActivity,
  DriveactivitySelectionList,
  DriveactivityFile,
  DriveactivityDelete,
  DriveactivityRestrictionChange,
  DriveactivityNew,
  DriveactivityInteger,
  DriveactivitySuggestion,
  DriveactivityGroup,
  DriveactivityQueryDriveActivityResponse,
  DriveactivityActionDetail,
  DriveactivityAction,
  DriveactivityComment,
  DriveactivityFileComment,
  DriveactivityAssignment,
  DriveactivityNoConsolidation,
  DriveactivityDriveFile,
  DriveactivityText,
  DriveactivityMove,
  DriveactivityUnknownUser,
  DriveactivitySettingsChange,
  DriveactivityApplicationReference,
  DriveactivityEdit,
  DriveactivityAnyone,
  DriveactivityTeamDrive,
  DriveactivitySystemEvent,
  DriveactivityDomain,
  DriveactivityActor,
  DriveactivitySelection,
  DriveactivityPermission,
  DriveactivityRename,
  DriveactivityRestore,
  DriveactivityKnownUser,
  DriveactivityUserList,
  DriveactivityQueryDriveActivityRequest,
  DriveactivityUpload,
  DriveactivityCreate,
  DriveactivityUser,
  DriveactivityDrive,
  DriveactivityDriveItemReference,
  DriveactivityAppliedLabelChangeDetail,
  DriveactivityAnonymousUser,
  DriveactivityFieldValue,
  DriveactivityDeletedUser,
  DriveactivityDriveItem,
  DriveactivityFolder,
  DriveactivityTextList,
  DriveactivityTarget,
  DriveactivityDriveFolder,
  DriveactivityConsolidationStrategy,
  DriveactivityPermissionChange,
  DriveactivityTeamDriveReference,
  DriveactivityCopy,
  DriveactivityDate,
  DriveactivityOwner,
  SheetsPost,
  SheetsAddTableRequest,
  SheetsAddSlicerResponse,
  SheetsDeleteDuplicatesResponse,
  SheetsTrimWhitespaceRequest,
  SheetsBasicChartDomain,
  SheetsTextPosition,
  SheetsAppendDimensionRequest,
  SheetsUpdateValuesResponse,
  SheetsChartDateTimeRule,
  SheetsBooleanRule,
  SheetsMergeCellsRequest,
  SheetsAddDataSourceResponse,
  SheetsTextFormat,
  SheetsWaterfallChartSpec,
  SheetsAddBandingRequest,
  SheetsBorder,
  SheetsDeveloperMetadataLocation,
  SheetsUpdateConditionalFormatRuleRequest,
  SheetsOrgChartSpec,
  SheetsCopySheetToAnotherSpreadsheetRequest,
  SheetsValueRange,
  SheetsCandlestickData,
  SheetsDeveloperMetadataLookup,
  SheetsLookerDataSourceSpec,
  SheetsHistogramRule,
  SheetsUnmergeCellsRequest,
  SheetsBatchClearValuesResponse,
  SheetsCancelDataSourceRefreshResponse,
  SheetsUpdateNamedRangeRequest,
  SheetsUpdateEmbeddedObjectBorderRequest,
  SheetsUpdateDataSourceResponse,
  SheetsBasicFilter,
  SheetsCellFormat,
  SheetsConditionalFormatRule,
  SheetsClearBasicFilterRequest,
  SheetsEditors,
  SheetsDataSourceRefreshMonthlySchedule,
  SheetsRepeatCellRequest,
  SheetsWaterfallChartCustomSubtotal,
  SheetsSortSpec,
  SheetsUpdateFilterViewRequest,
  SheetsManualRule,
  SheetsChip,
  SheetsDeleteDimensionRequest,
  SheetsDeleteDuplicatesRequest,
  SheetsGridProperties,
  SheetsRowData,
  SheetsDeleteDimensionGroupRequest,
  SheetsManualRuleGroup,
  SheetsPivotGroupRule,
  SheetsPivotGroupSortValueBucket,
  SheetsBubbleChartSpec,
  SheetsPasteDataRequest,
  SheetsAddDimensionGroupResponse,
  SheetsCandlestickDomain,
  SheetsGridData,
  SheetsUpdateBordersRequest,
  SheetsSheet,
  SheetsBatchGetValuesResponse,
  SheetsEmbeddedObjectPosition,
  SheetsPivotGroupValueMetadata,
  SheetsCutPasteRequest,
  SheetsTrimWhitespaceResponse,
  SheetsDuplicateFilterViewResponse,
  SheetsRefreshCancellationStatus,
  SheetsBooleanCondition,
  SheetsBatchClearValuesByDataFilterResponse,
  SheetsDataSourceColumnReference,
  SheetsCellData,
  SheetsNumberFormat,
  SheetsPostAuthor,
  SheetsAddDataSourceRequest,
  SheetsDeleteCommentRequest,
  SheetsColorStyle,
  SheetsDataSourceRefreshWeeklySchedule,
  SheetsFilterSpec,
  SheetsUpdateSlicerSpecRequest,
  SheetsEmbeddedObjectBorder,
  SheetsPadding,
  SheetsGetSpreadsheetByDataFilterRequest,
  SheetsDeleteDimensionGroupResponse,
  SheetsTextRotation,
  SheetsDeleteSheetRequest,
  SheetsWaterfallChartDomain,
  SheetsMatchedDeveloperMetadata,
  SheetsBigQueryDataSourceSpec,
  SheetsDataExecutionStatus,
  SheetsAddNamedRangeResponse,
  SheetsUpdateEmbeddedObjectPositionResponse,
  SheetsGradientRule,
  SheetsDeleteProtectedRangeRequest,
  SheetsTableRowsProperties,
  SheetsBatchUpdateValuesByDataFilterResponse,
  SheetsWaterfallChartSeries,
  SheetsBatchClearValuesRequest,
  SheetsDataSourceObjectReferences,
  SheetsRichLinkProperties,
  SheetsCommentThread,
  SheetsChartGroupRule,
  SheetsIterativeCalculationSettings,
  SheetsInsertRangeRequest,
  SheetsDeleteCommentReplyRequest,
  SheetsBatchUpdateValuesResponse,
  SheetsDataSourceColumn,
  SheetsBatchUpdateSpreadsheetResponse,
  SheetsPivotFilterSpec,
  SheetsAddChartRequest,
  SheetsFilterView,
  SheetsDataFilterValueRange,
  SheetsResponse,
  SheetsAddChartResponse,
  SheetsDuplicateFilterViewRequest,
  SheetsKeyValueFormat,
  SheetsPersonProperties,
  SheetsUpdateDeveloperMetadataRequest,
  SheetsRefreshDataSourceResponse,
  SheetsInsertCommentRequest,
  SheetsDuplicateSheetResponse,
  SheetsScorecardChartSpec,
  SheetsDeleteDataSourceRequest,
  SheetsInterpolationPoint,
  SheetsDeveloperMetadata,
  SheetsAddSlicerRequest,
  SheetsAddBandingResponse,
  SheetsTableColumnProperties,
  SheetsChartSpec,
  SheetsTextToColumnsRequest,
  SheetsDataSourceFormula,
  SheetsTextFormatRun,
  SheetsBasicChartSeries,
  SheetsSortRangeRequest,
  SheetsPivotTable,
  SheetsUpdateCellsRequest,
  SheetsRefreshDataSourceObjectExecutionStatus,
  SheetsSetBasicFilterRequest,
  SheetsBigQueryQuerySpec,
  SheetsDataSourceRefreshSchedule,
  SheetsLineStyle,
  SheetsSlicerSpec,
  SheetsAddFilterViewResponse,
  SheetsRequest,
  SheetsSourceAndDestination,
  SheetsGridCoordinate,
  SheetsAddNamedRangeRequest,
  SheetsDataSourceChartProperties,
  SheetsBigQueryTableSpec,
  SheetsUpdateChartSpecRequest,
  SheetsAddSheetRequest,
  SheetsDimensionProperties,
  SheetsBasicChartSpec,
  SheetsRefreshDataSourceRequest,
  SheetsChartHistogramRule,
  SheetsUpdateProtectedRangeRequest,
  SheetsErrorValue,
  SheetsAddCommentReplyRequest,
  SheetsSlicer,
  SheetsOverlayPosition,
  SheetsSearchDeveloperMetadataResponse,
  SheetsDeleteDeveloperMetadataRequest,
  SheetsChartData,
  SheetsBatchUpdateValuesRequest,
  SheetsCopyPasteRequest,
  SheetsProtectedRange,
  SheetsHistogramSeries,
  SheetsUpdateTableRequest,
  SheetsPieChartSpec,
  SheetsCreateDeveloperMetadataResponse,
  SheetsSpreadsheetTheme,
  SheetsAddTableResponse,
  SheetsDataSource,
  SheetsDimensionRange,
  SheetsThemeColorPair,
  SheetsDataLabel,
  SheetsTimeOfDay,
  SheetsChartAxisViewWindowOptions,
  SheetsInsertDimensionRequest,
  SheetsSpreadsheet,
  SheetsTreemapChartColorScale,
  SheetsChartSourceRange,
  SheetsCandlestickSeries,
  SheetsDataValidationRule,
  SheetsUpdateSpreadsheetPropertiesRequest,
  SheetsCandlestickChartSpec,
  SheetsBatchUpdateSpreadsheetRequest,
  SheetsAppendValuesResponse,
  SheetsSpreadsheetProperties,
  SheetsDataSourceTable,
  SheetsDateTimeRule,
  SheetsDataSourceSheetDimensionRange,
  SheetsBatchUpdateValuesByDataFilterRequest,
  SheetsMoveDimensionRequest,
  SheetsDuplicateSheetRequest,
  SheetsTable,
  SheetsPivotGroupLimit,
  SheetsUpdateDimensionGroupRequest,
  SheetsLink,
  SheetsAddProtectedRangeRequest,
  SheetsUpdateCommentPostRequest,
  SheetsAddCommentReplyResponse,
  SheetsDeleteRangeRequest,
  SheetsAddConditionalFormatRuleRequest,
  SheetsUpdateValuesByDataFilterResponse,
  SheetsDeleteConditionalFormatRuleRequest,
  SheetsChipRun,
  SheetsConditionValue,
  SheetsBatchGetValuesByDataFilterResponse,
  SheetsPivotFilterCriteria,
  SheetsDataSourceParameter,
  SheetsClearValuesRequest,
  SheetsTreemapChartSpec,
  SheetsFilterCriteria,
  SheetsEmbeddedChart,
  SheetsColor,
  SheetsCancelDataSourceRefreshRequest,
  SheetsDeleteFilterViewRequest,
  SheetsDataSourceSheetProperties,
  SheetsAddProtectedRangeResponse,
  SheetsBatchClearValuesByDataFilterRequest,
  SheetsBorders,
  SheetsSearchDeveloperMetadataRequest,
  SheetsClearValuesResponse,
  SheetsPivotGroup,
  SheetsGridRange,
  SheetsInterval,
  SheetsAutoResizeDimensionsRequest,
  SheetsDataSourceObjectReference,
  SheetsAddSheetResponse,
  SheetsUpdateDimensionPropertiesRequest,
  SheetsChartCustomNumberFormatOptions,
  SheetsUpdateDeveloperMetadataResponse,
  SheetsDeleteConditionalFormatRuleResponse,
  SheetsUpdateConditionalFormatRuleResponse,
  SheetsHistogramChartSpec,
  SheetsDeleteEmbeddedObjectRequest,
  SheetsDimensionGroup,
  SheetsFindReplaceResponse,
  SheetsWaterfallChartColumnStyle,
  SheetsAddDimensionGroupRequest,
  SheetsUpdateBandingRequest,
  SheetsDataSourceRefreshDailySchedule,
  SheetsPointStyle,
  SheetsDeleteTableRequest,
  SheetsDeleteDeveloperMetadataResponse,
  SheetsDeleteNamedRangeRequest,
  SheetsBaselineValueFormat,
  SheetsAutoFillRequest,
  SheetsSheetProperties,
  SheetsBandedRange,
  SheetsNamedRange,
  SheetsBasicSeriesDataPointStyleOverride,
  SheetsRandomizeRangeRequest,
  SheetsAppendCellsRequest,
  SheetsBandingProperties,
  SheetsDeleteBandingRequest,
  SheetsPivotValue,
  SheetsTableColumnDataValidationRule,
  SheetsBatchGetValuesByDataFilterRequest,
  SheetsExtendedValue,
  SheetsUpdateSheetPropertiesRequest,
  SheetsUpdateEmbeddedObjectPositionRequest,
  SheetsUpdateDataSourceRequest,
  SheetsFindReplaceRequest,
  SheetsDataFilter,
  SheetsSetDataValidationRequest,
  SheetsCommentAnchor,
  SheetsBasicChartAxis,
  SheetsCreateDeveloperMetadataRequest,
  SheetsInsertCommentResponse,
  SheetsDataSourceSpec,
  SheetsCancelDataSourceRefreshStatus,
  SheetsMatchedValueRange,
  SheetsAddFilterViewRequest,
} as const
