import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { 
  ApolloProvider,
  ApolloClient, 
  HttpLink, 
  InMemoryCache } from "@apollo/client";

// Realm
import * as Realm from "realm-web";
export const APP_ID = "triviaflexible-zuyoo";
export const app = new Realm.App({ id: APP_ID });

async function connectMongoDB() {
  const mongo = app.currentUser.mongoClient("mongodb-atlas");
  const collection = mongo.db("trivia_flexible").collection("Questions"); 
  const questions = await collection.findOne();
  console.log("venusFlytrap", questions);
}

// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
  // Guarantee that there's a logged in user with a valid access token
  if (!app.currentUser) {
    // If no user is logged in, log in an anonymous user. Tnodehe logged in user will have a valid
    // access token.
    return "";
  } else {
    // An already logged in user's access token might be stale. To guarantee that the token is
    // valid, we refresh the user's custom data which also refreshes their access token.
    await app.currentUser.refreshCustomData();
  }
  await connectMongoDB();
  return app.currentUser.accessToken
}

// Construct a new Apollo HttpLink that connects to your app's GraphQL endpoint
const graphql_url = `https://eu-west-1.aws.realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`;

// Configure the ApolloClient to connect to your app's GraphQL endpoint
export const client = new ApolloClient({
  link: new HttpLink({
    uri: graphql_url,
    // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
    // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
    // access token before sending the request.
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();
      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache()
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);