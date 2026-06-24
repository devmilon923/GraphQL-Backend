import { Request, Response } from "express";
import GoogleOAuthServices, { createUserPayload } from "./services";
import { Profile } from "passport";
import QueueServices from "../queue/services";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response";
export type JWTPayload = {
  oauthid: string;
  email: string;
  role: "admin" | "user";
  type: "access" | "refresh";
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
      const user = await GoogleOAuthServices.createUser(payload);

      const actoken = await GoogleOAuthServices.genarateToken({
        data: {
          email: payload.email,
          oauthid: payload.oauthid,
          role: user.role as "admin" | "user",
          type: "access",
        },
        type: "access",
      });
      const rftoken = await GoogleOAuthServices.genarateToken({
        data: {
          email: payload.email,
          oauthid: payload.oauthid,
          role: user.role as "admin" | "user",
          type: "refresh",
        },
        type: "refresh",
      });
      res.cookie("act", actoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 60 * 2 * 1000, // 2 minute
      });
      res.cookie("rft", rftoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days
      });
      QueueServices.addSession(payload.email, req, rftoken);
      return res.redirect(process.env.FRONTEND as string);
    } catch (error) {
      console.log(error);
      return sendResponse(res, {
        code: 404,
        message: "Oauth login handler failed",
      });
    }
  }

  public static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.rft;

    res.clearCookie("rft");
    res.clearCookie("act");
    if (refreshToken) {
      QueueServices.logoutSession(refreshToken);
    }
    return sendResponse(res, {
      code: 200,
      message: "Logout success",
    });
  }

  public static async renewToken(req: Request, res: Response) {
    const refreshToken = req.cookies.rft;
    console.log(refreshToken);
    if (!refreshToken) throw new Error("No found any valid token");
    const payload = jwt.verify(
      refreshToken,
      process.env.HASH_SEC as string,
    ) as JWTPayload;
    if (payload.type !== "refresh") throw new Error("Valid token required");
    const actoken = await GoogleOAuthServices.genarateToken({
      data: {
        email: payload.email,
        oauthid: payload.oauthid,
        role: payload.role,
        type: "access",
      },
      type: "access",
    });
    const rftoken = await GoogleOAuthServices.genarateToken({
      data: {
        email: payload.email,
        oauthid: payload.oauthid,
        role: payload.role,
        type: "refresh",
      },
      type: "refresh",
    });
    res.cookie("act", actoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 60 * 2 * 1000, // 2 minute
    });
    res.cookie("rft", rftoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days
    });
    QueueServices.addSession(payload.email, req, rftoken);
    return sendResponse(res, {
      code: 200,
      message: "Token renew success",
    });
  }
}
export default OAuthController;
