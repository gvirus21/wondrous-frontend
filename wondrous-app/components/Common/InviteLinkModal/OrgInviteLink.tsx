import { useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_ORG_INVITE_LINK } from 'graphql/mutations/org';
import { GET_ORG_ROLES, GET_ORG_USERS } from 'graphql/queries/org';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { LINK, PERMISSIONS, validateEmail } from 'utils/constants';
import Checkbox from '@mui/material/Checkbox';
import ArrowFillIcon from 'components/Icons/arrowfill';
import DeleteBasketIcon from 'components/Icons/DeleteBasketIcon';
import LinkIcon from 'components/RichText/icons/LinkIcon';
import { Button } from 'components/Button';
import palette from 'theme/palette';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SearchIcon from 'components/Icons/search';
import {
  BottomBox,
  CancelButton,
  CloseButton,
  CopyLinkBox,
  DashedLine,
  DefaultProfilePicture,
  DeleteBox,
  DisplaySearchedUser,
  DisplaySearchedUserContainer,
  EmptySearch,
  HeadingWrapper,
  IconTextWrapper,
  IndividualRoleBox,
  IndividualUserBox,
  InvitedText,
  LinkFlex,
  LinkIconBox,
  LinkSwitch,
  NameContainer,
  RoleContainer,
  RoleDeleteContainer,
  RoleText,
  SearchUserBox,
  SearchUserContainer,
  SelectRoleBox,
  SelectRoleContainer,
  SelectUserContainer,
  StyledBox,
  StyledModal,
  TextHeading,
  TextHeadingWrapper,
  TopDivider,
  UniversalBox,
  UniversalLinkButton,
  UserBox,
  UserProfilePicture,
  UsersDetailsBox,
} from './styles';

export const putDefaultRoleOnTop = (roles, permissions) => {
  if (!roles) return [];
  roles = [...roles];
  let defaultRole;
  let defaultRoleIndex;
  roles.forEach((role, index) => {
    if (role?.default) {
      defaultRole = { ...role };
      defaultRoleIndex = index;
    }
  });
  roles.filter((role) => {
    if (role?.permissions?.includes(PERMISSIONS.FULL_ACCESS) && !permissions.includes(PERMISSIONS.FULL_ACCESS)) {
      return false;
    }
    return true;
  });

  if (defaultRole && defaultRoleIndex) {
    roles?.splice(defaultRoleIndex, 1);
    roles?.unshift(defaultRole);
  }
  return roles;
};

export function OrgInviteLinkModal(props) {
  const roleContainerRef = useRef<HTMLDivElement>(null);
  const { orgId, open, onClose } = props;
  const [copy, setCopy] = useState(false);
  const [role, setRole] = useState('');
  const [linkOneTimeUse, setLinkOneTimeUse] = useState(false);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const userPermissionsContext = board?.userPermissionsContext;
  const [userList, setUserList] = useState([]);
  const [activeRole, setActiveRole] = useState<any>({});
  const [inviteLink, setInviteLink] = useState('');
  const [dropRoleBox, setDropRoleBox] = useState(false);
  const [isUniversal, setIsUniversal] = useState(false);
  const [userSearchValue, setUserSearchValue] = useState<string>('');
  const [userSearchList, setUserSearchList] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  // final list to be displayed and sent to BE
  const [selectedUsersList, setSelectedUsersList] = useState([]);

  const [getOrgUsers] = useLazyQuery(GET_ORG_USERS, {
    onCompleted: (data) => {
      const userData = data.getOrgUsers;
      const filteredData = userData?.map((userRole) => userRole.user);
      setUserList(filteredData || []);
      setListLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });

  const [createOrgInviteLink] = useMutation(CREATE_ORG_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${LINK}/invite/${data?.createOrgInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
    },
  });
  const [getOrgRoles, { data: orgRoles }] = useLazyQuery(GET_ORG_ROLES, {
    onCompleted: (data) => {
      data?.getOrgRoles &&
        data?.getOrgRoles?.forEach((role) => {
          if (role?.default) {
            setRole(role?.id);
            setActiveRole(role);
          }
        });
    },
    onError: (e) => {
      console.error(e);
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleRemoveFromUsersList = (item) => {
    const holdingList = selectedUsersList.filter(
      (user) => item.username !== user.username || item.email !== user.email
    );
    setSelectedUsersList(holdingList);
  };

  const handleAddUserToList = (item, type) => {
    const itemIndex = selectedUsersList.findIndex((user) => {
      if (type === 'name') {
        return item.username === user.username;
      }
      return item === user.email;
    });
    if (itemIndex >= 0) {
    } else {
      if (type === 'email') {
        setSelectedUsersList((prev) => [...prev, { email: item, role: activeRole.name, type: 'email' }]);
      } else {
        setSelectedUsersList((prev) => [...prev, { ...item, role: activeRole.name, type }]);
      }
      setUserSearchValue('');
    }
  };

  const handleOnClose = () => {
    onClose();
    setCopy(false);
    setLinkOneTimeUse(false);
    setInviteLink('');
  };

  const handleOnCopy = () => {
    navigator.clipboard.writeText(`${inviteLink}`);
    setCopy(true);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleLinkOneTimeUseChange = () => {
    setLinkOneTimeUse(!linkOneTimeUse);
  };

  useEffect(() => {
    if (!role && open) {
      getOrgRoles({
        variables: {
          orgId,
        },
      });
    }
    if (open) {
      createOrgInviteLink({
        variables: {
          input: {
            invitorId: '',
            type: linkOneTimeUse ? 'one_time' : 'public',
            orgId,
            orgRoleId: activeRole.id,
          },
        },
      });
    }
    setCopy(false);
  }, [role, createOrgInviteLink, activeRole.id, linkOneTimeUse, orgId, orgRoles, open, getOrgRoles]);
  const roles = putDefaultRoleOnTop(orgRoles?.getOrgRoles, permissions);

  useEffect(() => {
    if (userSearchValue) {
      const filteredList =
        userList &&
        userList.filter(
          (item) => item.username && item.username.toLocaleLowerCase().includes(userSearchValue.toLocaleLowerCase())
        );

      setUserSearchList(filteredList);
    } else {
      setUserSearchList(userList);
    }
  }, [userSearchValue]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (dropRoleBox && roleContainerRef?.current && !roleContainerRef?.current.contains(e.target)) {
        setDropRoleBox(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [dropRoleBox]);

  useEffect(() => {
    if (orgId) {
      getOrgUsers({
        variables: {
          orgId,
          limit: 1000, // TODO: paginate
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  return (
    <StyledModal open={open} onClose={handleOnClose}>
      <StyledBox isUniversal={isUniversal}>
        <TopDivider>
          <HeadingWrapper>
            <IconTextWrapper>
              {/* <PersonAddIconWrapper>
              <PersonAddIcon />
            </PersonAddIconWrapper> */}
              <TextHeadingWrapper>
                <TextHeading>{!isUniversal ? 'Invite' : 'Share with people and groups'}</TextHeading>
              </TextHeadingWrapper>
            </IconTextWrapper>
            <CloseButton onClick={handleOnClose} />
          </HeadingWrapper>
          <DashedLine />

          <SelectUserContainer isUniversal={isUniversal}>
            <SearchUserBox>
              <SearchUserContainer>
                <input
                  onChange={(e) => {
                    setUserSearchValue(e.target.value);
                  }}
                  readOnly={isUniversal}
                  type="text"
                  value={isUniversal ? inviteLink : userSearchValue}
                  placeholder="Search for usernames or email..."
                />
                {!isUniversal && <SearchIcon />}
              </SearchUserContainer>
              {userSearchValue ? (
                validateEmail(userSearchValue) ? (
                  <DisplaySearchedUserContainer>
                    <DisplaySearchedUser
                      type="email"
                      onClick={() => {
                        handleAddUserToList(userSearchValue, 'email');
                      }}
                    >
                      <p>{userSearchValue}</p>
                    </DisplaySearchedUser>
                  </DisplaySearchedUserContainer>
                ) : (
                  <DisplaySearchedUserContainer>
                    {userSearchList.length ? (
                      userSearchList.map((item, i) => (
                        <DisplaySearchedUser
                          key={i}
                          onClick={() => {
                            handleAddUserToList(item, 'name');
                          }}
                        >
                          {item?.profilePicture ? (
                            <UserProfilePicture src={item?.thumbnailPicture || item?.profilePicture} />
                          ) : (
                            <DefaultProfilePicture />
                          )}
                          <p>{item.username}</p>
                        </DisplaySearchedUser>
                      ))
                    ) : (
                      <EmptySearch>Empty Search</EmptySearch>
                    )}
                  </DisplaySearchedUserContainer>
                )
              ) : (
                ''
              )}
            </SearchUserBox>
            <RoleContainer ref={roleContainerRef}>
              <SelectRoleContainer
                onClick={() => {
                  setDropRoleBox(!dropRoleBox);
                }}
                dropActive={dropRoleBox}
              >
                <RoleText role_type={activeRole.name}>{activeRole.name}</RoleText>
                <ArrowFillIcon />
              </SelectRoleContainer>
              <SelectRoleBox show={dropRoleBox}>
                {roles &&
                  roles.map((item, i) => (
                    <IndividualRoleBox
                      onClick={() => {
                        setActiveRole(item);
                        setDropRoleBox(false);
                      }}
                      key={i}
                      active={item.id === activeRole?.id}
                    >
                      <RoleText role_type={item.name}>{item.name}</RoleText>
                      <Checkbox
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleOutlineIcon />}
                        checked={item.id === activeRole?.id}
                      />
                    </IndividualRoleBox>
                  ))}
              </SelectRoleBox>
            </RoleContainer>
          </SelectUserContainer>
          {!isUniversal && (
            <UserBox>
              <InvitedText>Invite {selectedUsersList.length} user(s)</InvitedText>
              <UsersDetailsBox>
                {selectedUsersList.map((item, i) => (
                  <IndividualUserBox key={i}>
                    <NameContainer>
                      {item.type === 'email' ? (
                        ''
                      ) : item?.profilePicture ? (
                        <UserProfilePicture src={item?.thumbnailPicture || item?.profilePicture} />
                      ) : (
                        <DefaultProfilePicture />
                      )}
                      <p>{item.type === 'email' ? item.email : item.username}</p>
                    </NameContainer>
                    <RoleDeleteContainer>
                      <RoleText role_type={item.role}>{item.role}</RoleText>
                      <DeleteBox onClick={() => handleRemoveFromUsersList(item)}>
                        <DeleteBasketIcon />
                      </DeleteBox>
                    </RoleDeleteContainer>
                  </IndividualUserBox>
                ))}{' '}
              </UsersDetailsBox>
            </UserBox>
          )}
        </TopDivider>

        <BottomBox isUniversal={isUniversal}>
          {isUniversal && (
            <CopyLinkBox>
              <LinkSwitch label="One time use" checked={linkOneTimeUse} onClick={handleLinkOneTimeUseChange} />{' '}
              <LinkFlex>
                <CancelButton
                  onClick={() => {
                    setIsUniversal(!isUniversal);
                  }}
                >
                  Cancel
                </CancelButton>
                <Button
                  onClick={handleOnCopy}
                  style={{
                    textDecoration: 'none',
                    color: palette.white,
                  }}
                >
                  {copy ? 'Copied' : 'Copy Link'}
                </Button>
              </LinkFlex>
            </CopyLinkBox>
          )}
          {!isUniversal && (
            <UniversalBox>
              <UniversalLinkButton
                onClick={() => {
                  setIsUniversal(!isUniversal);
                }}
              >
                <LinkIconBox>
                  <LinkIcon />
                </LinkIconBox>
                Universal link
              </UniversalLinkButton>
              <LinkFlex>
                <Button
                  style={{
                    textDecoration: 'none',
                    color: palette.white,
                  }}
                >
                  Send Invite
                </Button>
              </LinkFlex>
            </UniversalBox>
          )}
        </BottomBox>

        {/* <InviteThruLinkLabel>Invite through universal link</InviteThruLinkLabel> */}
        {/* <InviteThruLinkInputWrapper>
          <InviteThruLinkTextField variant="outlined" value={`${inviteLink}`} disabled />
          <InviteThruLinkFormControlSelect>
            <InviteThruLinkSelect value={role} onChange={handleRoleChange}>
              {roles &&
                roles.map((role) => (
                  <InviteThruLinkMenuItem key={role.id} value={role.id}>
                    {role.name}
                  </InviteThruLinkMenuItem>
                ))}
            </InviteThruLinkSelect>
          </InviteThruLinkFormControlSelect>
          <InviteThruLinkButton onClick={handleOnCopy}>
            {copy ? (
              <>
                <InviteThruLinkButtonSuccessLabel>Link copied!</InviteThruLinkButtonSuccessLabel> <CopySuccessIcon />
              </>
            ) : (
              <>
                <InviteThruLinkButtonLabel>Copy link</InviteThruLinkButtonLabel> <CopyIcon />
              </>
            )}
          </InviteThruLinkButton>
        </InviteThruLinkInputWrapper> */}
        {/* <LinkSwitch
          label="Link expires after one-time use"
          checked={linkOneTimeUse}
          onClick={handleLinkOneTimeUseChange}
        /> */}
        {/* <StyledDivider /> */}
        {/* <InviteThruEmailLabel>
                    Invite through email
                </InviteThruEmailLabel> */}
        {/* <InviteThruEmailTextFieldButtonWrapper>
                    <InviteThruEmailTextFieldSelectWrapper>
                        <InviteThruEmailTextField />
                        <InviteThruEmailFormControlSelect>
                            <InviteThruEmailSelect value={selectRole} onChange={(e) => setSelectRole(e.target.value)}>
                                <InviteThruEmailMenuItem value="contributor">contributor</InviteThruEmailMenuItem>
                                <InviteThruEmailMenuItem value="admin">admin</InviteThruEmailMenuItem>
                                <InviteThruEmailMenuItem value="core team">core team</InviteThruEmailMenuItem>
                            </InviteThruEmailSelect>
                        </InviteThruEmailFormControlSelect>
                    </InviteThruEmailTextFieldSelectWrapper>
                    <InviteThruEmailButton>
                        <InviteThruEmailButtonLabel>Send invite</InviteThruEmailButtonLabel>
                    </InviteThruEmailButton>
                </InviteThruEmailTextFieldButtonWrapper> */}
      </StyledBox>
    </StyledModal>
  );
}
