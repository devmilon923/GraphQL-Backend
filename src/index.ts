import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
async function runServer() {
  const app: Application = express();
  const PORT = process.env.PORT || 3000;
  app.use(express.json());
  const gServer = new ApolloServer({
    typeDefs: `
    type Query {
        hello:String
    }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello World",
      },
    },
  });
  await gServer.start();
  app.use("/gg", expressMiddleware(gServer));
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}
runServer();
