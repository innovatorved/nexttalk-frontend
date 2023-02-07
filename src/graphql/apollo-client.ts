import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

import { BACKEND_ENDPOINT } from "../constants/index";

const httpLink = new HttpLink({
  uri: BACKEND_ENDPOINT,
  credentials: "include",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
