import GoogleOAuthServices from "../strategies/services";
import { Request } from "express";
import { sessionQueue } from "./producers";

class QueueServices {
  public static async addSession(email: string, req: Request, rftoken: string) {
    try {
      const sessionData = await GoogleOAuthServices.generateSessionData(req);
      await sessionQueue.add("updateSessionData", {
        email,
        sessionData,
        rftoken,
      });
    } catch (error) {
      console.log(error);
      console.error("Failed to add session on queue");
    }
  }
  public static async logoutSession(refreshToken: string) {
    try {
      await sessionQueue.add("logoutSession", { refreshToken });
      console.log("Session logout action added on queue");
    } catch (error) {
      console.log(error);
      console.error("Failed to add session logout on queue");
    }
  }
}

export default QueueServices;
