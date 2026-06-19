import { prisma } from "../utils/prisma";
export interface createUserPayload {
  name: string;
  email: string;
  profile?: string;
  provider?: "google" | "facebook";
  oauthid: string;
}

class GoogleOAuth {
  public static async createUser(payload: createUserPayload) {
    try {
      await prisma.user.create({
        data: {
          ...payload,
        },
      });
      return {
        isNew: true,
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
}
export default GoogleOAuth;
