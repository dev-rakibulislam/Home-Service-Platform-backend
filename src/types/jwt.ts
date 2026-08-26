import { JwtPayload } from "jsonwebtoken";

export type TJwtPayload = JwtPayload & {
  userId: string;
  email: string;
  role: string;
  status: string;
};

export type TJwtData = {
  secret: string;
  expiresIn: string;
};
