// auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  userId: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret') as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedToken; // Adiciona a propriedade user ao tipo Request do Express
  }
}

export default auth;
