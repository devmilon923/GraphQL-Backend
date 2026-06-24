import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export async function authValidation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.act || null;
  if (!token) {
    req.user = undefined;
    return next();
  }
  const payload = jwt.verify(token, process.env.HASH_SEC as string);
  if (!payload) {
    req.user = undefined;
    return next();
  }
  req.user = payload;
  return next();
}
