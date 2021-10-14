import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($username:String!, $email:String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
      jwt
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($identifier:String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
    }
  }
`;