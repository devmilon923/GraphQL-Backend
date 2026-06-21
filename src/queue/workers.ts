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
    const { email, sessionData } = job.data;
    console.log("Session worker taking the job...");
    await GoogleOAuthServices.updateSessionData(email, sessionData);
    console.log("Session worker completed the job");
  },
  { connection: redisConnectionObj },
);

new Worker(
  "sessionQueue",
  async (job) => {
    const { refreshToken, userId } = job.data;
    console.log("Session logout worker taking the job...");
    await prisma.session.updateMany({
      where: {
        userId: userId,
        refreshToken,
        isValid: true,
        expireAt: {
          gt: new Date(),
        },
      },
      data: { isValid: false, expireAt: new Date() },
    });
    console.log("Session logout worker completed the job");
  },
  { connection: redisConnectionObj },
);
