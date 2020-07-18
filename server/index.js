const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require("jsonwebtoken")
const { createStore } = require("./utils")

const TvShowAPI = require('./dataSources/tvshowsfetch');
const UserAPI = require("./dataSources/users")

const store = createStore()
const connectDB = require('./config/db')

//connect Database
connectDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        TvShowAPI: new TvShowAPI(),
        userAPI: new UserAPI({ store })
    }) 

});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});