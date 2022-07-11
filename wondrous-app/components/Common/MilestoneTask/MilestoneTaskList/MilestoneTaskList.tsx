import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SmartLink from 'components/Common/SmartLink';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import * as Constants from 'utils/constants';
import { TASK_ICONS_LABELS } from '../MilestoneTasks';
import {
  MilestoneTaskCommentCount,
  MilestoneTaskCommentCountText,
  MilestoneTaskCommentIcon,
  MilestoneTaskDueDateIcon,
  MilestoneTaskDueDateText,
  MilestoneTaskDueDateWrapper,
  MilestoneTaskImageSafeImage,
  MilestoneTaskImageWrapper,
  MilestoneTaskInfo,
  MilestoneTaskItem,
  MilestoneTaskListWrapper,
  MilestoneTaskPrivacyAndStatus,
  MilestoneTaskPrivacyIcon,
  MilestoneTaskRewardAmount,
  MilestoneTaskRewardIcon,
  MilestoneTaskRewardWrapper,
  MilestoneTaskStatus,
  MilestoneTaskStatusLabel,
  MilestoneTaskTitle,
  MilestoneTaskTitleAndInfo,
} from './styles';

const MilestoneUserImage = ({ assignee }) => {
  const hasProfileImage = assignee && assignee.profilePicture;
  return (
    <MilestoneTaskImageWrapper>
      {hasProfileImage ? <MilestoneTaskImageSafeImage src={hasProfileImage} /> : <DefaultUserImage />}
    </MilestoneTaskImageWrapper>
  );
};

const MilestoneTaskDuDate = ({ dueDate }) => {
  if (!dueDate) return null;
  return (
    <MilestoneTaskDueDateWrapper>
      <MilestoneTaskDueDateIcon />
      <MilestoneTaskDueDateText>{format(new Date(dueDate), 'MMM dd')}</MilestoneTaskDueDateText>
    </MilestoneTaskDueDateWrapper>
  );
};

const MilestoneTaskReward = ({ rewards }) => {
  if (isEmpty(rewards)) return null;
  return (
    <>
      {rewards.map((reward, index) => {
        const { rewardAmount, icon } = reward;
        return (
          <MilestoneTaskRewardWrapper key={index}>
            <MilestoneTaskRewardIcon src={icon} />
            <MilestoneTaskRewardAmount>{rewardAmount}</MilestoneTaskRewardAmount>
          </MilestoneTaskRewardWrapper>
        );
      })}
    </>
  );
};

export const MilestoneTaskList = ({ data }) => {
  if (isEmpty(data)) return null;
  return (
    <MilestoneTaskListWrapper>
      {data?.map((task) => {
        const { id, title, status, assignee, orgUsername, org, privacyLevel, dueDate, rewards, commentCount } = task;
        const { Icon, label } = TASK_ICONS_LABELS[status];
        const isPrivate = privacyLevel !== Constants.PRIVACY_LEVEL.public;
        const viewUrl = `/organization/${orgUsername || org?.username}/boards?task=${id}`;
        return (
          <SmartLink href={viewUrl} key={id} asLink={true}>
            <MilestoneTaskItem>
              <MilestoneUserImage assignee={assignee} />
              <MilestoneTaskTitleAndInfo>
                <MilestoneTaskTitle>{title}</MilestoneTaskTitle>
                <MilestoneTaskInfo>
                  <MilestoneTaskDuDate dueDate={dueDate} />
                  <MilestoneTaskReward rewards={rewards} />
                  <MilestoneTaskCommentCount>
                    <MilestoneTaskCommentIcon />
                    <MilestoneTaskCommentCountText>{commentCount}</MilestoneTaskCommentCountText>
                  </MilestoneTaskCommentCount>
                </MilestoneTaskInfo>
              </MilestoneTaskTitleAndInfo>
              <MilestoneTaskPrivacyAndStatus>
                <MilestoneTaskPrivacyIcon isPrivate={isPrivate} tooltipTitle={isPrivate ? 'Members only' : 'Public'} />
                <MilestoneTaskStatus>
                  <Icon />
                  <MilestoneTaskStatusLabel>{label}</MilestoneTaskStatusLabel>
                </MilestoneTaskStatus>
              </MilestoneTaskPrivacyAndStatus>
            </MilestoneTaskItem>
          </SmartLink>
        );
      })}
    </MilestoneTaskListWrapper>
  );
};
