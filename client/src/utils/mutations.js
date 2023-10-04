import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        password
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation SaveBook($id: ID!, $authors: [String], $bookId: String!, $description: String!, $image: String, $link: String, $title: String!) {
    saveBook(id: $id, authors: $authors, bookId: $bookId, description: $description, image: $image, link: $link, title:  $title) {
      _id
      username
      savedBooks {
        _id
        description
        bookId
        title
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($username: String!, $email: String!, $password: String!) {
    login(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!, $bookId: String!) {
    deleteBook(id: $id, bookId: $bookId) {
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
