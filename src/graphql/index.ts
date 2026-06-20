import { ApolloServer } from "@apollo/server";
import { User } from "./user";

export async function useGraphqlServer() {
  const gServer = new ApolloServer({
    typeDefs: /* GraphQL */ `
      ${User.schema}
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });
  await gServer.start();
  return gServer;
}
