import { Request } from "express";
import { prisma } from "../utils/prisma";
import { addDays } from "date-fns";
import { UAParser } from "ua-parser-js";
import axios from "axios";
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
  accessToken: string;
  isValid: boolean;
  expireAt: Date;
}
class GoogleOAuthServices {
  public static async createUser(payload: createUserPayload) {
    try {
      const result = await prisma.user.create({
        data: {
          ...payload,
        },
      });
      return {
        isNew: true,
        userId: result.id,
      };
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          isNew: false,
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
      accessToken: "s",
      expireAt,
      isValid: true,
    };
    return details;
  }
  public static async updateSessionData(
    email: string,
    payload: SessionDataPayload,
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new Error("This user is not valid user");
      }
      const result = await prisma.session.create({
        data: {
          ...payload,
          user: { connect: { id: user.id } },
          isValid: true,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Session creation failed");
    }
  }
}
export default GoogleOAuthServices;
