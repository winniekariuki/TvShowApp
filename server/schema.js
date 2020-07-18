const { gql } = require('apollo-server');

const typeDefs = gql`
type Query {
    tvshows(after: String , pageSize:Int): TVShowConnection!
    tvshow(id: ID!): TVShow
    users: [User] 
    # Queries for the current user
    me: User
    getWatchSchedule(email: String): WatchScheduleConnection
    getSingleWatchSchedule( id: String ): WatchSchedule
    getTvShowComment(watchScheduleId: String!): TVShowComment
    searchTvShowByName(name: String!): TVShowConnection 

}
type TVShowConnection {
  cursor: String!
  hasMore: Boolean!
  tvshows: [TVShow]
}
type TVShow {
  name: String
  season: String
  episode: String
  airDate: String
  language: String
  genre: String
  crew: String
  cast: String
  duration: String
  rating: String
  aka: String
  status: String
  premiered: String
  summary: String
  url: String
  id: String
  image: String

}
type WatchScheduleConnection {
  message: String
  status: String
  getWatchSchedule: [WatchSchedule]
}
type User {
  id: ID!
  username: String!
  email: String!
  password: String!
  tvshows: [TVShow]
}
type WatchSchedule {
  message: String
  url: String
  name: String
  image: String
  summary: String
  rating: String
  status: String
  _id: String
  favorite: String
}
type TVShowComment {
  message: String
  status: String
  getTvShowComment: [WatchScheduleTVShowComment]
}
type WatchScheduleTVShowComment {
  comment: String
  watchScheduleId: String
  status: String
  message: String
  createdAt: String  updatedAt: String
}
type Mutation {
  saveRecord(recordId: ID!): RecordUpdateResponse!
  deleteRecord(recordId: ID!): RecordUpdateResponse!
  login(email: String, password: String): Auth
  createUSer(email: String, password: String, username: String): Auth
  favoriteTvShow(id: String!): FavoriteTvShow
  createWatchSchedule(url: String!, email: String, name: String, image: String, summary: String, rating: String): FavoriteTvShow
  createTVShowComment(watchScheduleId: ID!, comment: String): WatchScheduleTVShowComment
}
type RecordUpdateResponse {
     success: Boolean!
     message: String
     tvshow: [TVShow]
}
type Auth {
  message: String
  token: String
  status: String
}
type FavoriteTvShow {
  message: String
  url: String
  name: String
  image: String
  summary: String
  rating: String
  status: String
  email: String
}
`;

module.exports = typeDefs;
