import { Request } from "express";
import jwt from "jsonwebtoken";
export async function contextHandler({ req }: { req: Request }) {
  const token = req.cookies.act || null;
  if (!token) return { user: null };
  const payload = jwt.verify(token, process.env.HASH_SEC as string);
  if (!payload) return { user: null };
  return { user: payload };
}
