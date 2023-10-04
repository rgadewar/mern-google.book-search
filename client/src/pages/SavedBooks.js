import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// Import the `useMutation()` and `useLazyQuery` hook from Apollo Client
import { useLazyQuery, useMutation } from '@apollo/client';
// Import QUERY_ME query and DELETE_BOOK mutation
import { QUERY_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  // Invoke `useMutation()` hook for DELETE_BOOK mutation
  const [deleteBook]= useMutation( DELETE_BOOK );
  // // Invoke `useQuery()` hook for QUERY_ME mutation
  const [getSingleUser] = useLazyQuery( QUERY_ME );
  
  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;
  
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        // get userData through token
        const authResponse = Auth.getProfile(token);
        const user = authResponse.data;

        if (!user) {
          return false;
        }

        // get current user's saved books
        const {data} = await getSingleUser( 
          {
            variables: {
              id: user._id,
              username: user.username
            }
          }
        );

        setUserData(data.getSingleUser);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
 
    // get userData through token
    const authResponse = Auth.getProfile(token);
    const user = authResponse.data;

    if (!user) {
      return false;
    }

    try {
      // deletes saved book from user's information
      const { data } = await deleteBook({
        variables: {
          id: user._id,
          bookId: bookId
        }
      });

      setUserData(data.deleteBook);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
