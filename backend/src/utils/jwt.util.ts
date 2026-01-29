import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JWTPayload {
  userId: number;
  email: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload;
}
