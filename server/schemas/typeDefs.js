const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Query {
    me: User
  }

  type User {
    _id: ID
    username: String! 
    email: String!
    bookCount: Int
    password: String!
    savedBooks: [Book]
  }

  type Book { 
    _id: ID
    authors: [String]
    description: String
    bookId: String!
    link: String
    image: String
    title: String!
  }

  input savedBooks {
    description: String
    title: String
    bookId: String
    image: String
    link: String
    authors: [String]
  
  }


  type Mutation {
    login(email: String!, password: String!):Auth
    addUser(username: String, email:String, password: String): Auth
    saveBook(input: savedBooks! ):User
    removeBook(bookId: ID!): User
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
