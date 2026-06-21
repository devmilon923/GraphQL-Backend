import GoogleOAuthServices from "../strategies/services";
import { Request } from "express";
import { sessionQueue } from "./producers";

class QueueServices {
  public static async addSession(email: string, req: Request) {
    const sessionData = await GoogleOAuthServices.generateSessionData(req);
    console.log("Session adding on queue....");
    await sessionQueue.add("updateSessionData", {
      email,
      sessionData,
    });
    console.log("Session added on queue");
  }
}

export default QueueServices;
