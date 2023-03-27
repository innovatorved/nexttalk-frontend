import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { getSession } from 'next-auth/react';

import { BACKEND_ENDPOINT, WS_ENDPOINT } from '../constants/index';

const httpLink = new HttpLink({
  uri: BACKEND_ENDPOINT,
  credentials: 'include'
});

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: WS_ENDPOINT,
          connectionParams: async () => ({
            session: await getSession()
          })
        })
      )
    : null;

const link =
  typeof window !== 'undefined' && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});
