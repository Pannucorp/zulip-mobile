import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  HttpLink,
  split,
} from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { getMainDefinition } from '@apollo/client/utilities';
import { InMemoryCache } from '@apollo/client/cache';
import { WebSocketLink } from '@apollo/client/link/ws';
import fetch from 'isomorphic-unfetch';

const ssrMode = !process.browser;
const API_URL = '10.0.2.2:1337';
const ssl = process.env.NODE_ENV === 'production' ? 's' : '';
const wsUrl = `ws${ssl}://${API_URL}/subscriptions`;
const httpUrl = `http${ssl}://${API_URL}/graphql`;

if (!httpUrl) {
  throw new Error(
    'either url or httpUrl must be provided to make an apollo connection'
  );
}

const httpLink = new HttpLink({
  uri: httpUrl,
  credentials: 'same-origin',
  fetch,
});

let splitLink = httpLink;

if (!ssrMode) {
  // const wsLink: WebSocketLink = new WebSocketLink({
  //   uri: wsUrl,
  //   options: {
  //     reconnect: true,
  //   },
  //   webSocketImpl: WebSocket,
  // });
  splitLink = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === 'OperationDefinition' && def.operation === 'subscription'
      );
    },
    // wsLink,
    httpLink
  );
}

export function getStrapiURL(path = '') {
    return `http${ssl}://${API_URL}${path}`;
}

export const createApolloClient = () => new ApolloClient({
    link: httpLink,
    ssrMode,
    connectToDevTools: !ssrMode,
    cache: new InMemoryCache(),
  });

export async function fetchAPI(path) {
    const requestUrl = getStrapiURL(path);
    const response = await fetch(requestUrl);
    const data = await response.json();
    return data;
}

export function getStrapiMedia(media) {
  const imageUrl = media.url.startsWith('/')
    ? getStrapiURL(media.url)
    : media.url;
  return imageUrl;
}
