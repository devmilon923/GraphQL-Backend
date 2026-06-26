export const schema = /* GraphQL */ `
  type User {
    id: ID!
    name: String
    email: String
    role: String
    profile: String
    oauthid: String
    provider: String
    createdAt: String
  }
  type Query {
    user: User
  }
  type Mutation {
    createUser: String
  }
`;
