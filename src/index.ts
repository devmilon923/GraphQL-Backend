import { expressMiddleware } from "@as-integrations/express5";
import dotenv from "dotenv";
dotenv.config();
import "./strategies/google";
import express, { Application } from "express";
import { createServer } from "http";
import { socketServerInstance } from "./utils/socket";
import { useGraphqlServer } from "./graphql";
import passport from "passport";

async function runServer() {
  const app: Application = express();
  const PORT = process.env.PORT || 3000;
  const httpServer = createServer(app);
  app.use(express.json());
  await socketServerInstance(httpServer);
  app.get("/", (req, res) => {
    res.send(`
    <a href="/login/federated/google">
      <button>Login with Google</button>
    </a>
  `);
  });
  app.get(
    "/auth/google/cb",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
    }),
    function (req, res) {
      console.log(req.user);
      // Successful authentication, redirect home.
      res.redirect("/");
    },
  );

  app.use(passport.initialize());
  app.get(
    "/login/federated/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    }),
  );
  app.use("/gq", expressMiddleware(await useGraphqlServer()));
  httpServer.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`),
  );
}
runServer();
