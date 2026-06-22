import { Request } from "express";
import { prisma } from "../utils/prisma";
import { addDays } from "date-fns";
import { UAParser } from "ua-parser-js";
import axios from "axios";
import { JWTPayload } from "./controller";
import jwt from "jsonwebtoken";
export interface createUserPayload {
  name: string;
  email: string;
  profile?: string;
  provider?: "google" | "facebook";
  oauthid: string;
}
export interface SessionDataPayload {
  os: string | null;
  browser: string | null;
  ipAddress: string | null;
  country: string | null;
  capital: string;
  city: string | null;
  refreshToken: string;
  expireAt: Date;
}
interface TokenGeneratePayload {
  data: JWTPayload;
  type: "access" | "refresh";
}
class GoogleOAuthServices {
  public static async createUser(payload: createUserPayload) {
    try {
      const result = await prisma.user.create({
        data: {
          ...payload,
        },
        select: { role: true, id: true },
      });
      return {
        isNew: true,
        role: result.role,
      };
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          isNew: false,
          role: "user",
        };
      } else {
        throw error;
      }
    }
  }
  public static async generateSessionData<SessionDataPayload>(req: Request) {
    const parser = new UAParser(req.headers["user-agent"]);
    const usInfo = parser.getResult();
    const ip = req.ip == "::1" ? "103.83.233.92" : null;
    const expireAt = addDays(new Date(), 7);
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);

    const details = {
      ipAddress: ip || null,
      country: response.data.country_name || null,
      city: response.data.city || null,
      capital: response.data.country_capital,
      os: usInfo.os.name as string,
      browser: usInfo.browser.name as string,
      refreshToken: "s",
      expireAt,
    };
    return details;
  }
  public static async updateSessionData(
    payload: SessionDataPayload,
    rftoken: string,
  ) {
    try {
      const jwtpayload = jwt.decode(rftoken) as JWTPayload;
      const user = await prisma.user.findUnique({
        where: {
          uniqueUser: {
            email: jwtpayload.email,
            oauthid: jwtpayload.oauthid,
          },
        },
      });
      if (!user) {
        throw new Error("This user is not valid user");
      }
      const expireAt = addDays(new Date(), 7);
      const result = await prisma.session.create({
        data: {
          ...payload,
          user: { connect: { id: user.id } },
          refreshToken: rftoken,
          expireAt,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Session creation failed");
    }
  }
  public static async genarateToken(payload: TokenGeneratePayload) {
    let token;
    if (payload.type === "access") {
      token = jwt.sign(payload.data, process.env.HASH_SEC as string, {
        expiresIn: 60 * 2 * 1000, // 2 minute
      });
    } else if (payload.type === "refresh") {
      token = jwt.sign(payload.data, process.env.HASH_SEC as string, {
        expiresIn: "7 days",
      });
    } else {
      throw new Error("Invalid token request");
    }

    return token;
  }
}
export default GoogleOAuthServices;
