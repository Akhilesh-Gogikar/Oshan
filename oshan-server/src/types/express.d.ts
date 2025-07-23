import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string; // Or the correct type for your userId
  }
}

declare module 'jsonwebtoken' {
  interface CustomJwtPayload extends JwtPayload {
    userId: string;
  }
}