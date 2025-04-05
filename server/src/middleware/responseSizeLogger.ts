import { NextFunction, Request, Response } from "express";

const responseSizeLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const oldWrite = res.write;
  const oldEnd = res.end;
  let responseSize = 0;

  res.write = function (chunk: any, encoding?: any, callback?: any): boolean {
    if (chunk) responseSize += Buffer.byteLength(chunk);
    return oldWrite.call(res, chunk, encoding, callback);
  };

  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    if (chunk) responseSize += Buffer.byteLength(chunk);
    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseSize} bytes`,
    );
    return oldEnd.call(res, chunk, encoding, callback);
  };

  next();
};

export default responseSizeLogger;
