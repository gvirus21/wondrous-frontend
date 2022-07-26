import React from 'react';
import { Box } from '@mui/system';
import { SmallAvatarWrapper, SmallAvatarContainer, AvatarListWrapper } from './styles';
import { AVATAR_LIST_OVERFLOW_MAX } from 'utils/constants';
import Tooltip from 'components/Tooltip';
import { SafeImage } from '../Image';
import { useRouter } from 'next/router';

export const SmallAvatar = (props) => {
  const { avatar = {}, id, username, goTo, initials = '', style = {} } = props;

  //TODO: create this as a service
  const randomColor = '#363636';

  return (
    <SmallAvatarContainer
      key={id}
      onClick={() => {
        goTo(username);
      }}
      style={{ ...style, zIndex: 6 - (style.zIndex || 0) }}
    >
      {avatar.url ? (
        <Box
          sx={{
            display: 'flex',
            alignSelf: 'flex-start',
            flexFlow: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SafeImage
            width={29}
            height={29}
            src={avatar.url}
            objectFit="cover"
            style={{
              borderRadius: '29px',
            }}
          />
        </Box>
      ) : (
        <SmallAvatarWrapper
          randomColor={avatar?.color || randomColor}
          isOwnerOfPod={avatar?.isOwnerOfPod}
          avatarURL={avatar?.url}
        >
          {avatar.url ? '' : <span>{initials}</span>}
        </SmallAvatarWrapper>
      )}
    </SmallAvatarContainer>
  );
};

export const SmallAvatarOverflow = (props) => {
  const { index = 0, overflow = 0 } = props;

  return (
    <SmallAvatarContainer key={index} style={{ zIndex: AVATAR_LIST_OVERFLOW_MAX + 1 }}>
      <SmallAvatarWrapper avatarURL="/images/avatar-overflow.png">+{overflow}</SmallAvatarWrapper>
    </SmallAvatarContainer>
  );
};

export const AvatarList = (props) => {
  const { id = '', users = [], align = '', style = {} } = props;
  const router = useRouter();

  // Siege User List to max of AVATAR_LIST_OVERFLOW_MAX
  let usersSieged = users.slice(0, AVATAR_LIST_OVERFLOW_MAX);
  let overflow = users.length - usersSieged.length;

  const goToUser = (username) => {
    window.location.href = `/profile/${username}/about`;
  };

  return (
    <AvatarListWrapper key={id + '-list'} align={align} style={style}>
      {usersSieged.map((user, index) => (
        <Tooltip key={'user-tooltip-' + user.id} title={user.name || user.initials} placement="top">
          <div>
            <SmallAvatar
              id={user.id}
              username={user.username || user?.name}
              key={'avatar-' + user.id}
              avatar={user.avatar}
              initials={user.initials}
              style={{ zIndex: index }}
              goTo={goToUser}
            />
          </div>
        </Tooltip>
      ))}
      {overflow > 0 && users.length > AVATAR_LIST_OVERFLOW_MAX ? (
        <SmallAvatarOverflow id={'avatar-overflow-' + id} overflow={overflow} />
      ) : (
        ''
      )}
    </AvatarListWrapper>
  );
};
