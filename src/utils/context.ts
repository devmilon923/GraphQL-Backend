import { Request } from "express";

export async function contextHandler({ req }: { req: Request }) {
  return { user: req.user };
}
