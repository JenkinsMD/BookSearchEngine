const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes'); //NEED?
const { ApolloServer } = require('apollo-server-express'); //MJ ADD
const { typeDefs, resolvers } = require('./schemas'); // MJ ADD
const {authMiddleware } = require('./utils/auth')

const app = express();
const PORT = process.env.PORT || 3001;
//---MJ ADD
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });
//---

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//in production serves client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//MJ ADD
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

//MJ REMOVE
// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
