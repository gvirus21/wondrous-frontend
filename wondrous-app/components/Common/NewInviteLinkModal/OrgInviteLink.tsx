import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import {
  StyledModal,
  StyledBox,
  TextHeading,
  CloseButton,
  PersonAddIconWrapper,
  TextHeadingWrapper,
  HeadingWrapper,
  IconTextWrapper,
  InviteButton,
  InviteThruLinkLabel,
  InviteThruLinkTextField,
  InviteThruLinkButtonLabel,
  InviteThruLinkInputWrapper,
  StyledDivider,
  InviteThruEmailLabel,
  InviteThruEmailTextFieldButtonWrapper,
  InviteThruEmailTextField,
  InviteThruLinkSelect,
  InviteThruLinkMenuItem,
  InviteThruLinkFormControlSelect,
  InviteThruEmailTextFieldSelectWrapper,
  InviteThruEmailButtonLabel,
  InviteThruLinkButtonSuccessLabel,
  LinkSwitch,
  TextSubheading,
} from './styles';
import PersonAddIcon from 'components/Icons/personAdd';
import { CopyIcon, CopySuccessIcon } from 'components/Icons/copy';
import { putDefaultRoleOnTop } from 'components/Common/InviteLinkModal/OrgInviteLink';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_ORG_INVITE_LINK } from 'graphql/mutations/org';
import { GET_ORG_ROLES } from 'graphql/queries/org';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { LINK, ONE_TIME_USE_INVITE_LINK, PUBLIC_INVITE_LINK } from 'utils/constants';

export const NewOrgInviteLinkModal = (props) => {
  const { orgOrPodName, orgId, open, onClose } = props;
  const [copy, setCopy] = useState(false);
  const [role, setRole] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [linkOneTimeUse, setLinkOneTimeUse] = useState(false);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const userPermissionsContext = board?.userPermissionsContext;
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
      Sentry.captureException(e);
    },
  });
  const [getOrgRoles, { data: orgRoles }] = useLazyQuery(GET_ORG_ROLES, {
    onCompleted: (data) => {
      data?.getOrgRoles &&
        data?.getOrgRoles?.forEach((role) => {
          if (role?.default) {
            setRole(role?.id);
          }
        });
    },
    onError: (e) => {
      console.error(e);
      Sentry.captureException(e);
    },
    fetchPolicy: 'cache-and-network',
  });

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
          orgId: orgId,
        },
      });
    }
    if (open) {
      createOrgInviteLink({
        variables: {
          input: {
            invitorId: '',
            type: linkOneTimeUse ? ONE_TIME_USE_INVITE_LINK : PUBLIC_INVITE_LINK,
            orgId: orgId,
            orgRoleId: role,
          },
        },
      });
    }
    setCopy(false);
  }, [role, createOrgInviteLink, linkOneTimeUse, orgId, orgRoles, open, getOrgRoles]);
  const roles = putDefaultRoleOnTop(orgRoles?.getOrgRoles, permissions);

  return (
    <StyledModal open={open} onClose={handleOnClose}>
      <StyledBox>
        <HeadingWrapper>
          <IconTextWrapper>
            <PersonAddIconWrapper>
              <PersonAddIcon />
            </PersonAddIconWrapper>
            <TextHeadingWrapper>
              <TextHeading>Invite new members to</TextHeading>
              <TextSubheading>{orgOrPodName}</TextSubheading>
            </TextHeadingWrapper>
          </IconTextWrapper>
          <CloseButton circle={true} onClick={handleOnClose} />
        </HeadingWrapper>
        <InviteThruLinkLabel>Invite through universal link</InviteThruLinkLabel>
        <InviteThruLinkInputWrapper>
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
          <InviteThruLinkTextField variant="outlined" value={`${inviteLink}`} disabled />
          <InviteButton rightPadding={true} onClick={handleOnCopy}>
            {copy ? (
              <>
                <InviteThruLinkButtonSuccessLabel>Link copied!</InviteThruLinkButtonSuccessLabel> <CopySuccessIcon />
              </>
            ) : (
              <>
                <InviteThruLinkButtonLabel>Copy link</InviteThruLinkButtonLabel> <CopyIcon color="#7427FF" />
              </>
            )}
          </InviteButton>
        </InviteThruLinkInputWrapper>

        <StyledDivider />
        {/* <InviteThruEmailLabel>Invite through email</InviteThruEmailLabel>
        <InviteThruEmailTextFieldButtonWrapper>
          <InviteThruEmailTextFieldSelectWrapper>
            <InviteThruEmailTextField placeholder="Enter email address" />
          </InviteThruEmailTextFieldSelectWrapper>
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
          <InviteButton justifyCenter={true}>
            <InviteThruEmailButtonLabel>Send invite</InviteThruEmailButtonLabel>
          </InviteButton>
        </InviteThruEmailTextFieldButtonWrapper>
        <StyledDivider /> */}
        <LinkSwitch label="One time use" checked={linkOneTimeUse} onClick={handleLinkOneTimeUseChange} />
      </StyledBox>
    </StyledModal>
  );
};
