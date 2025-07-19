import { Request, Response } from 'express';
import { UserModel } from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Basic authorization check - only authenticated users can view the list
    if (!req.user || req.user.role !== 'user') {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Insufficient permissions' 
      });
    }

    const users = await UserModel.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
}; 