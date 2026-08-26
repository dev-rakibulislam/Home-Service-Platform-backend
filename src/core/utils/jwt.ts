import jwt, {  SignOptions } from "jsonwebtoken";
import { TJwtData, TJwtPayload } from "../../types/jwt";

export const generateToken = async (payload: TJwtPayload, data: TJwtData) => {
  return jwt.sign(payload, data.secret, {
    expiresIn: data.expiresIn as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as TJwtPayload;
};
