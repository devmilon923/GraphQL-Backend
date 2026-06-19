import { expressMiddleware } from "@as-integrations/express5";
import dotenv from "dotenv";
dotenv.config();
import "./strategies/google";
import express, { Application } from "express";
import { createServer } from "http";
import { socketServerInstance } from "./utils/socket";
import { useGraphqlServer } from "./graphql";
import passport from "passport";
import { googleAuth } from "./strategies/route";

async function runServer() {
  const app: Application = express();
  const PORT = process.env.PORT || 3000;
  const httpServer = createServer(app);
  app.use(express.json());
  await socketServerInstance(httpServer);

  app.get("/", (req, res) => {
    res.send(`Server is working well...`);
  });

  app.use(passport.initialize());
  app.use("/google", googleAuth);
  app.use("/gq", expressMiddleware(await useGraphqlServer()));
  httpServer.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`),
  );
}
runServer();
