export const schema = /* GraphQL */ `
  scalar Date
  type User {
    id: ID!
    name: String
    email: String
    role: String
    profile: String
    oauthid: String
    provider: String
    createdAt: Date!
  }
  type Query {
    user: User
  }
  type Mutation {
    createUser: String
  }
`;
