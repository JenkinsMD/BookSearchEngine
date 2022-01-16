import { gql } from '@apollo/client';
//Query to get the users personal info and saved books
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
