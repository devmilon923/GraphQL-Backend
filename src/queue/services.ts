import GoogleOAuthServices from "../strategies/services";
import { Request } from "express";
import { sessionQueue } from "./producers";

class QueueServices {
  public static async addSession(email: string, req: Request, rftoken: string) {
    try {
      const sessionData = await GoogleOAuthServices.generateSessionData(req);
      console.log("Session adding on queue....");
      await sessionQueue.add("updateSessionData", {
        email,
        sessionData,
        rftoken,
      });
      console.log("Session added on queue");
    } catch (error) {
      console.log(error);
      console.error("Failed to add session on queue");
    }
  }
  public static async logoutSession(refreshToken: string, userId: number) {
    try {
      await sessionQueue.add("logoutSession", { refreshToken, userId });
      console.log("Session logout action added on queue");
    } catch (error) {
      console.log(error);
      console.error("Failed to add session logout on queue");
    }
  }
}

export default QueueServices;
