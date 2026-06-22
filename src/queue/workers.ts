import { Worker } from "bullmq";
import GoogleOAuthServices from "../strategies/services";
import { redisConnectionObj } from "./producers";
import { prisma } from "../utils/prisma";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../strategies/controller";
console.log(
  "All background workers are active now. Please keep this window open....",
);
new Worker(
  "sessionQueue",
  async (job) => {
    switch (job.name) {
      case "updateSessionData":
        const { sessionData, rftoken } = job.data;
        await GoogleOAuthServices.updateSessionData(sessionData, rftoken);
        break;

      case "logoutSession":
        const { refreshToken } = job.data;
        const payload = jwt.decode(refreshToken) as JWTPayload;

        const user: any = await prisma.user.findUnique({
          where: {
            uniqueUser: { oauthid: payload.oauthid, email: payload.email },
          },
          select: {
            id: true,
          },
        });
        if (!user) break;

        await prisma.session.delete({
          where: {
            uniqueSession: {
              userId: user.id,
              refreshToken: refreshToken,
            },
          },
        });
        break;
    }
  },
  { connection: redisConnectionObj },
);
