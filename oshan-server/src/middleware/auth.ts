import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CustomJwtPayload } from 'jsonwebtoken'; // Import the extended JwtPayload

const SECRET_KEY = process.env.SECRET_KEY || 'supersecretjwtkey'; // Fallback for development

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ error: 'Authorization header is missing.' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
