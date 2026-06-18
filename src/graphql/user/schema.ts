export const schema = /* GraphQL */ `
  type User {
    id: ID!
    name: String
    email: String
  }
  type Query {
    users: [User]
  }
  type Mutation {
    createUser: String
  }
`;
