import { Router } from "express";
import passport from "passport";
import OAuthController from "./controller";

const router = Router();

router.get(
  "/auth/cb",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  OAuthController.handleAuth,
);
router.get(
  "/auth",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

export const googleAuth = router;
