import { Request, Response } from "express";
import GoogleOAuthServices, { createUserPayload } from "./services";
import { Profile } from "passport";
import QueueServices from "../queue/services";
import { JwtPayload } from "jsonwebtoken";
type JWTPayload = {
  id: number;
  email: string;
} & JwtPayload;
class OAuthController {
  public static async handleAuth(req: Request, res: Response) {
    const profile = req.user as Profile;
    const payload: createUserPayload = {
      oauthid: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0]?.value as string,
      profile: profile.photos?.[0]?.value,
      provider: profile.provider as "google" | "facebook",
    };

    try {
      await GoogleOAuthServices.createUser(payload);
      QueueServices.addSession(payload.email, req);
      res.redirect(process.env.FRONTEND as string);
    } catch (error) {
      console.log(error);
      throw new Error("Oauth login handler failed");
    }
  }
  public static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies("refreshToken");
    const user = req.user as JWTPayload;
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    QueueServices.logoutSession(refreshToken, user.id);
    res.send({ status: true, message: "logout success" });
  }
}
export default OAuthController;
