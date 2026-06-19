import { Router } from "express";
import passport, { Profile } from "passport";
import GoogleOAuth, { createUserPayload } from "./controller";

const router = Router();

router.get("/", (req, res) => {
  res.send(`
    <a href="${process.env.BACKEND}/google/auth">
      <button>Login with Google</button>
    </a>
  `);
});

router.get(
  "/auth/cb",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async function (req, res) {
    const profile = req.user as Profile;
    const payload: createUserPayload = {
      oauthid: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0]?.value as string,
      profile: profile.photos?.[0]?.value,
      provider: profile.provider as "google" | "facebook",
    };

    const result = await GoogleOAuth.createUser(payload);
    console.log(result);
    res.redirect(process.env.FRONTEND as string);
  },
);
router.get(
  "/auth",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

export const googleAuth = router;
