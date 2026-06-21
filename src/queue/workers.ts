import { Worker } from "bullmq";
import GoogleOAuthServices from "../strategies/services";
import { redisConnectionObj } from "./producers";
console.log(
  "All background workers are active now. Please keep this window open....",
);
export const sessionWorker = new Worker(
  "sessionQueue",
  async (job) => {
    const { email, sessionData } = job.data;
    console.log("Session worker taking the job....");
    await GoogleOAuthServices.updateSessionData(email, sessionData);
    console.log("Session worker completed the job");
  },
  { connection: redisConnectionObj },
);
