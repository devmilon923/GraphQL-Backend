import { Request, Response } from "express";
import GoogleOAuthServices, { createUserPayload } from "./services";
import { Profile } from "passport";

class OAuthController {
  public static async handleAuth(req: Request, res: Response) {
    const sessionData = await GoogleOAuthServices.generateSessionData(req);
    const profile = req.user as Profile;

    const payload: createUserPayload = {
      oauthid: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0]?.value as string,
      profile: profile.photos?.[0]?.value,
      provider: profile.provider as "google" | "facebook",
    };

    await GoogleOAuthServices.createUser(payload);
    await GoogleOAuthServices.updateSessionData(payload.email, sessionData);
    res.redirect(process.env.FRONTEND as string);
  }
}
export default OAuthController;
