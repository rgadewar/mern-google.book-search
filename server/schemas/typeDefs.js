const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    _id: ID
    authors: [String]
    description: String!
    # saved book id from GoogleBooks
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    # set savedBooks to be an array of data that adheres to the bookSchema
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getSingleUser(id: ID!, username: String!): User
    users:[User]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(id: ID!, authors: [String], bookId: String!, description: String!, image: String, link: String, title: String!): User
    deleteBook(id: ID!, bookId: String!): User
    login(username: String!, email: String!, password: String!): Auth
  } 
`;

module.exports = typeDefs;
