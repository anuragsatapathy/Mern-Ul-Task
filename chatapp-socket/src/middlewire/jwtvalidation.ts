import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import responses from "../utility/response";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: CustomJwtPayload;
  }
}

const jwtValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      responses.authFailureResponse(res, "No token provided");
      return;
    }

    const parsedToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(
      parsedToken,
      process.env.JWT_SECRET as string
    ) as CustomJwtPayload;

    req.user = decoded;

    next();
  } catch (err) {
    responses.authFailureResponse(res, "Invalid token");
  }
};

export default jwtValidation;
