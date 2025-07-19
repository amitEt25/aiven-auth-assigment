import { Request, Response } from "express";
import { UserModel } from "../models/User";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Access denied",
        message: "Authentication required",
      });
    }

    const users = await UserModel.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
};
