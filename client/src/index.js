import React from 'react';
import ReactDOM from 'react-dom';
import { resolvers, typeDefs } from './schema';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import Routes from './router'
import "./index.css"


const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  headers: {
    authorization: localStorage.getItem('token'),
  }
});

const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token')
  },
});


ReactDOM.render(
    <ApolloProvider client={client}>
 <Routes/>
    </ApolloProvider>, document.getElementById('root')
  );
