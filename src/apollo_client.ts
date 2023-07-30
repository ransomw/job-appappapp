
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { root_url } from './env';

export const client = new ApolloClient({
    uri: root_url + '/graphql',
    cache: new InMemoryCache(),
});
  
  
  