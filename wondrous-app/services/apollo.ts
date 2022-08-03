import { ApolloClient, InMemoryCache, HttpLink, split, defaultDataIdFromObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition, offsetLimitPagination } from '@apollo/client/utilities';
import { getAuthHeader, getWaitlistAuthHeader } from 'components/Auth/withAuth';

// Staging is http://34.135.9.199/graphql
const graphqlUri = !process.env.NEXT_PUBLIC_STAGING
  ? process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL
  : 'https://apistaging.wonderapp.co/graphql';

const httpLink = new HttpLink({
  uri: graphqlUri,
  credentials: 'include',
});

const getAuth = () => {
  const token = getAuthHeader();
  return token ? `Bearer ${token}` : '';
};

const getWaitlistAuth = () => {
  const token = getWaitlistAuthHeader();
  return token ? `Bearer ${token}` : '';
};

const authLink = setContext((_, { headers }) => {
  let auth = getAuth() || getWaitlistAuth();

  return {
    headers: {
      ...headers,
      Authorization: auth,
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        whoami(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: 'User', ...args });
        },
        users(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: 'User', ...args });
        },
        waitlistUsers(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: 'WaitlistUser', ...args });
        },
        getOrgFeed: offsetLimitPagination(), // NOTE: https://www.apollographql.com/docs/react/pagination/core-api/#non-paginated-read-functions
        getPodFeed: offsetLimitPagination(),
        getOrgMembershipRequest: offsetLimitPagination(),
        getPodMembershipRequest: offsetLimitPagination(),
        getTasksForMilestone: offsetLimitPagination(['milestoneId', 'status']),
        getProposalsUserCanReview: offsetLimitPagination(),
        getSubmissionsUserCanReview: offsetLimitPagination(),
        getSubtasksForTask: offsetLimitPagination(['taskId', 'status']),
      },
    },
  },
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
