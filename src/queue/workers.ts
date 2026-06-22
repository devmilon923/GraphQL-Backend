import { Worker } from "bullmq";
import GoogleOAuthServices from "../strategies/services";
import { redisConnectionObj } from "./producers";
import { prisma } from "../utils/prisma";
console.log(
  "All background workers are active now. Please keep this window open....",
);
new Worker(
  "sessionQueue",
  async (job) => {
    switch (job.name) {
      case "updateSessionData":
        await GoogleOAuthServices.updateSessionData(
          job.data.email,
          job.data.sessionData,
          job.data.rftoken,
        );
        break;

      case "logoutSession":
        await prisma.session.update({
          where: {
            uniqueSession: {
              userId: job.data.userId,
              refreshToken: job.data.refreshToken,
              expireAt: { gt: new Date() },
            },
          },
          data: { expireAt: new Date() },
        });
        break;
    }
  },
  { connection: redisConnectionObj },
);
