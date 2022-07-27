import { NextRouter } from 'next/router';
import { useContext, useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import apollo from 'services/apollo';

import {
  ColumnsContext,
  IsMobileContext,
  OrgBoardContext,
  PodBoardContext,
  SettingsBoardContext,
  SideBarContext,
  TextInputContext,
  UserBoardContext,
  ApprovedSubmissionContext,
  PaymentModalContext,
  SelectMembershipContext,
  EditTokenGatingConditionContext,
  UserProfileContext,
  CreateEntityContext,
} from './contexts';
import {
  GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD,
  GET_TOKEN_GATING_CONDITIONS_FOR_ORG,
  GET_POD_BY_ID,
  GET_ORG_FROM_USERNAME,
} from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';

export const useIsMobile = () => useContext(IsMobileContext);

export const useSideBar = () => useContext(SideBarContext);
// Hook
export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // Add event listener
      window?.addEventListener('resize', handleResize);

      // Call handler right away so state gets updated with initial window size
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};

export const useTextInput = () => useContext(TextInputContext);

export const useOrgBoard = () => useContext(OrgBoardContext);

export const usePodBoard = () => useContext(PodBoardContext);

export const useUserBoard = () => useContext(UserBoardContext);

export const useBoards = () => {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  return { orgBoard, podBoard, userBoard, board };
};

export const useUserProfile = () => {
  return useContext(UserProfileContext);
  // if (!context) {
  //   console.log('useUserProfile must be used within a UserProfileContext Provider');
  // }
  // return context;
};

export const useSettings = () => useContext(SettingsBoardContext);

export const useColumns = () => {
  const context = useContext(ColumnsContext);
  // if (!context) {
  //   console.log('useColumns must be used within a ColumnsContext Provider');
  // }
  return context;
};

export const useApprovedSubmission = () => useContext(ApprovedSubmissionContext); // for payment, i think it's hacky

export const usePaymentModal = () => useContext(PaymentModalContext);

export const useSelectMembership = () => useContext(SelectMembershipContext);

export const useEditTokenGatingCondition = () => useContext(EditTokenGatingConditionContext);
/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useOutsideAlerter = (ref, callback) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref?.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}
export default usePrevious;

export const useRouterQuery = ({
  router,
  query,
  defaultValue = [],
}: {
  router: NextRouter;
  query: string;
  defaultValue?: string[];
}): [string[], Dispatch<SetStateAction<string[]>>] => {
  const [state, setState] = useState(defaultValue);
  const routerQuery = router?.query?.[query];
  useEffect(() => {
    if (routerQuery) {
      setState(routerQuery?.toString().split(','));
    }
  }, [routerQuery]);
  return [state, setState];
};

export const useTokenGating = (orgId) => {
  const [getTokenGatingConditionsForOrg, { data, loading }] = useLazyQuery(GET_TOKEN_GATING_CONDITIONS_FOR_ORG, {
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (orgId) {
      getTokenGatingConditionsForOrg({
        variables: {
          orgId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);
  return [data, loading];
};

export const useFilterQuery = (query, variables = {}, shouldFetch = true) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const getData = async () => {
    const { data } = await apollo.query({
      query,
      variables,
    });
    setData(Object.values(data).flat());
    setIsLoading(false);
  };
  useEffect(() => {
    if (query && shouldFetch) {
      setIsLoading(true);
      getData();
    }
  }, [query, variables, shouldFetch]);
  return { isLoading, data };
};

export const useGetPerStatusTaskCountForUserBoard = (userId) => {
  const [getPerStatusTaskCountForUserBoard, { data }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD);

  useEffect(() => {
    if (userId) {
      getPerStatusTaskCountForUserBoard({
        variables: {
          userId: userId,
        },
      });
    }
  }, [userId, getPerStatusTaskCountForUserBoard]);

  return { data };
};

export const useGetPodById = (podId) => {
  const [getPodById, { data }] = useLazyQuery(GET_POD_BY_ID);
  useEffect(() => {
    if (!data && podId) {
      getPodById({
        variables: {
          podId,
        },
      });
    }
  }, [podId, data, getPodById]);
  return data?.getPodById;
};

export const useGetOrgFromUsername = (username) => {
  const [getOrgFromUsername, { data }] = useLazyQuery(GET_ORG_FROM_USERNAME);
  useEffect(() => {
    if (!data && username) {
      getOrgFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [username, data, getOrgFromUsername]);
  return data?.getOrgFromUsername;
};

export const useCreateEntityContext = () => useContext(CreateEntityContext);
