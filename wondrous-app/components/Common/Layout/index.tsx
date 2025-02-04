import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS, GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GlobalContext, SideBarContext } from 'utils/contexts';
import { LIMIT } from 'services/board';
import { PAGES_WITH_NO_SIDEBAR, SIDEBAR_WIDTH } from 'utils/constants';
import SideBarComponent from 'components/Common/SidebarMain';
import HeaderComponent from 'components/Header';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import { toggleHtmlOverflow } from 'utils/helpers';
import { useIsMobile } from 'utils/hooks';
import { useMe, withAuth } from 'components/Auth/withAuth';

import { HOTKEYS } from 'utils/hotkeyHelper';
import { SectionWrapper } from './styles';

const getOrgsList = (userOrgs, router) => {
  if (!userOrgs?.getUserOrgs) return [];
  const { getUserOrgs } = userOrgs;
  return getUserOrgs.map((item) => ({
    ...item,
    isActive: router.pathname.includes('/organization/[username]') && router.query?.username === item.username,
  }));
};

export default function SidebarLayout({ children }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  useHotkeys(HOTKEYS.OPEN_DASHBOARD, () => {
    // should this be here?
    router.push(`/dashboard`);
  });

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const {
    data: notifications,
    refetch,
    fetchMore: fetchMoreNotifications,
    loading: notificationsLoading,
  } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      offset: 0,
      limit: LIMIT,
    },
  });
  const [minimized, setMinimized] = useState(false);
  const { data: userOrgs } = useQuery(GET_USER_ORGS, {
    skip: isMobile || PAGES_WITH_NO_SIDEBAR.includes(router.pathname),
    variables: {
      excludeSharedOrgs: true,
    },
  });

  const [createFormModal, setCreateFormModal] = useState(false);

  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };

  const orgsList = getOrgsList(userOrgs, router);
  const width = minimized || isMobile ? '0px' : SIDEBAR_WIDTH;
  const sidebarValue = useMemo(
    () => ({
      minimized,
      setMinimized,
      orgsList,
    }),
    [minimized, orgsList]
  );

  if (PAGES_WITH_NO_SIDEBAR.includes(router.pathname)) {
    return children;
  }
  return (
    <SideBarContext.Provider value={sidebarValue}>
      <SideBarComponent userOrgs={userOrgs} />
      <GlobalContext.Provider
        value={{
          isCreateEntityModalOpen: createFormModal,
          toggleCreateFormModal,
          userOrgs,
          userPermissionsContext: userPermissionsContext?.getUserPermissionContext
            ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
            : null,
          notifications: notifications?.getNotifications,
          refetchNotifications: refetch,
          fetchMoreNotifications,
          notificationsLoading,
        }}
      >
        <HeaderComponent />
        <SectionWrapper style={{ width: `calc(100% - ${width})`, marginLeft: `${width}` }}>{children}</SectionWrapper>
      </GlobalContext.Provider>
    </SideBarContext.Provider>
  );
}
