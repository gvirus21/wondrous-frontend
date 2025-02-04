import { gql } from '@apollo/client';
import { MediaFragment } from './media';

export const TaskFragment = gql`
  fragment TaskFragment on Task {
    id
    title
    createdAt
    createdBy
    completedAt
    description
    milestoneId
    parentTaskId
    orgId
    podId
    type
    priority
    blockerTaskIds
    dueDate
    status
    paymentStatus
    observers {
      id
      username
      profilePicture
      firstName
      lastName
    }
    labels {
      id
      name
      color
    }
    links {
      url
      displayName
      type
    }
    assigneeId
    userMentions
    media {
      ...MediaFragment
    }
    assignee {
      username
      profilePicture
    }
    creator {
      username
      profilePicture
    }
    org {
      profilePicture
      name
      username
      privacyLevel
    }
    pod {
      name
      color
      privacyLevel
    }
    milestone {
      title
    }
    orgOrder
    podOrder
    assigneeOrder
    reactionCount
    commentCount
    privacyLevel
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
      chain
    }
    recurringSchema {
      daily
      weekly
      monthly
      periodic
    }
    maxSubmissionCount
    points
    githubIssue {
      id
      url
    }
    githubPullRequest {
      id
      url
      title
    }
    taskApplicationPermissions {
      canClaim
      canApply
      hasUserApplied
    }
    claimPolicy
    claimPolicyRoles
    shouldUnclaimOnDueDateExpiry
    hideSubmissions
    categories {
      name
    }
  }

  ${MediaFragment}
`;

export const TaskCardFragment = gql`
  # emits reviewerIds, userMentions
  fragment TaskCardFragment on TaskCard {
    id
    createdAt
    createdBy
    type
    orgId
    orgProfilePicture
    orgName
    orgUsername
    podId
    podProfilePicture
    podName
    podColor
    title
    description
    assigneeId
    assigneeUsername
    assigneeProfilePicture
    priority
    dueDate
    status
    completedAt
    reactionCount
    commentCount
    orgOrder
    podOrder
    assigneeOrder
    paymentStatus
    privacyLevel
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    links {
      url
      displayName
      type
    }
    media {
      ...MediaFragment
    }
    parentTaskId
    totalSubtaskCount
    totalSubmissionsCount
    approvedSubmissionsCount
    waitingForReviewSubmissionsCount
    points
    taskApplicationPermissions {
      canClaim
      canApply
      hasUserApplied
    }
    hideSubmissions
    categories {
      name
    }
  }
  ${MediaFragment}
`;
// Omitting reactionCount, commentCount, share Count
export const TaskProposalCardFragment = gql`
  fragment TaskProposalCardFragment on TaskProposalCard {
    id
    createdAt
    type
    createdBy
    creatorUsername
    creatorProfilePicture
    orgId
    orgProfilePicture
    orgName
    orgUsername
    podId
    podProfilePicture
    podName
    podColor
    title
    description
    approvedAt
    closedAt
    lastReviewedBy
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    links {
      url
      displayName
      type
    }
    media {
      ...MediaFragment
    }
  }
  ${MediaFragment}
`;

export const TaskSubmissionCardFragment = gql`
  fragment TaskSubmissionCardFragment on TaskSubmissionCard {
    id
    createdAt
    createdBy
    creatorUsername
    creatorProfilePicture
    taskId
    orgId
    orgProfilePicture
    orgName
    podId
    podProfilePicture
    podName
    podColor
    title
    description
    approvedAt
    changeRequestedAt
    rejectedAt
    lastReviewedBy
    paymentStatus
    commentCount
    links {
      url
      displayName
      type
    }
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
      chain
    }
    taskDueDate
    media {
      ...MediaFragment
    }
    taskStatus
  }
  ${MediaFragment}
`;

export const TaskSubmissionFragment = gql`
  fragment TaskSubmissionFragment on TaskSubmission {
    id
    createdAt
    createdBy
    description
    orgId
    podId
    taskId
    links {
      url
      displayName
      type
    }
    approvedAt
    rejectedAt
    changeRequestedAt
    lastReviewedBy
    paymentStatus
    commentCount
    org {
      profilePicture
      name
      username
    }
    pod {
      name
      username
      color
    }
    creator {
      username
      profilePicture
      checkIsGr15Contributor {
        isGr15Contributor
      }
    }
    media {
      ...MediaFragment
    }
  }
  ${MediaFragment}
`;
export const TaskProposalFragment = gql`
  fragment TaskProposalFragment on TaskProposal {
    id
    title
    createdAt
    createdBy
    description
    milestoneId
    orgId
    podId
    priority
    dueDate
    labels {
      id
      name
      color
    }
    links {
      url
      displayName
      type
    }
    userMentions
    approvedAt
    closedAt
    lastReviewedBy
    associatedTaskId
    creator {
      username
      profilePicture
      checkIsGr15Contributor {
        isGr15Contributor
      }
    }
    media {
      ...MediaFragment
    }
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    commentCount
    org {
      profilePicture
      name
      username
      privacyLevel
    }
    pod {
      name
      color
      privacyLevel
    }
    snapshotId
    votes {
      counts {
        approve
        reject
      }
      userVote
    }
    categories {
      name
    }
  }
  ${MediaFragment}
`;

export const BountyFragment = gql`
  fragment BountyFragment on Bounty {
    id
    title
    createdAt
    createdBy
    description
    milestoneId
    orgId
    podId
    type
    priority
    blockerTaskIds
    dueDate
    status
    links {
      url
      displayName
      type
    }
    assigneeId
    userMentions
    media {
      ...MediaFragment
    }
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
    }
    org {
      profilePicture
      name
      username
    }
    pod {
      name
      color
    }
    milestone {
      title
    }
    reviewers {
      username
    }
    reactionCount
    commentCount
    orgOrder
    podOrder
    assigneeOrder
    paymentStatus
    parentTaskId
    privacyLevel
    maxSubmissionCount
    categories {
      name
    }
  }
  ${MediaFragment}
`;

export const MilestoneFragment = gql`
  fragment MilestoneFragment on Milestone {
    id
    title
    createdAt
    createdBy
    description
    orgId
    podId
    type
    priority
    dueDate
    status
    links {
      url
      displayName
      type
    }
    userMentions
    creator {
      username
      profilePicture
    }
    org {
      profilePicture
      name
      username
    }
    pod {
      name
      color
    }
    orgOrder
    podOrder
    assigneeOrder
    reactionCount
    commentCount
    privacyLevel
  }
`;

export const TaskTemplateFragment = gql`
  fragment TaskTemplateFragment on TaskTemplate {
    id
    title
    createdAt
    createdBy
    name
    orgId
    podId
    description
    assignee {
      username
      profilePicture
    }
    creator {
      username
      profilePicture
    }
    rewards {
      rewardAmount
      paymentMethodId
      symbol
      icon
      tokenName
      chain
    }
    points
  }
`;
