export const schema = /* GraphQL */ `
  type User {
    id: ID!
    name: String
    email: String
  }
  type Query {
    user: User
  }
  type Mutation {
    createUser: String
  }
`;
