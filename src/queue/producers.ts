import { Queue } from "bullmq";

export const redisConnectionObj = {
  host: "localhost",
  port: 6379,
};

export const sessionQueue = new Queue("sessionQueue", {
  connection: redisConnectionObj,
  defaultJobOptions: {
    removeOnComplete: true,
  },
});
