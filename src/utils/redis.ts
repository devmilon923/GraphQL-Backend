import Redis from "ioredis";

export const redisCon = new Redis(process.env.REDIS as string);
