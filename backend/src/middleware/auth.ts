import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role?: string;
      };
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7); // remove 'Bearer ' prefix
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    
    const payload = JWTUtils.verify(token, secret);
    
    if (!payload) {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'Invalid token' 
      });
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      role: 'user' // Default role for all authenticated users
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      error: 'Access denied',
      message: 'Invalid token' 
    });
  }
};
