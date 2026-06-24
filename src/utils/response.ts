import { Response } from "express";
const successCode = [200, 201, 301];
export function sendResponse(
  res: Response,
  {
    code,
    message,
    data,
    cursor = null,
  }: {
    code: number;
    message: string;
    data?: object | null;
    cursor?: any;
  },
) {
  res.statusCode = code;
  res.json({
    success: successCode.includes(code) ? true : false,
    message,
    data,
    cursor,
  });
}
