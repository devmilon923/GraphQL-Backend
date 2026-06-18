import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import { createServer } from "http";
import { socketServerInstance } from "./utils/socket";
import { prisma } from "./utils/prisma";

async function runServer() {
  const app: Application = express();
  const PORT = process.env.PORT || 3000;
  const httpServer = createServer(app);
  app.use(express.json());
  await socketServerInstance(httpServer);
  const gServer = new ApolloServer({
    typeDefs: /* GraphQL */ `
      type User {
        id: ID!
        name: String
        email: String
      }
      type Query {
        users: [User]
      }
    `,
    resolvers: {
      Query: {
        users: async () => {
          try {
            const result = await prisma.user.findMany();
            return result;
          } catch (error) {
            console.error("Database fetch failed:", error);
            throw new Error("Could not fetch users from the database.");
          }
        },
      },
    },
  });
  await gServer.start();
  app.use("/gg", expressMiddleware(gServer));
  httpServer.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`),
  );
}
runServer();
