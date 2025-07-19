import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { JWTUtils } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ 
          message: "User with this email already exists",
          code: "user_exists",
          type: "registration_error"
        });
    }

    const user = await UserModel.create({
      email,
      password,
      first_name,
      last_name,
    });

    const token = JWTUtils.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback-secret"
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ 
      message: "Failed to register user",
      code: "registration_failed",
      type: "server_error"
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ 
        message: "Incorrect email address or password",
        code: "invalid_credentials",
        type: "authentication_error"
      });
    }

    const isValidPassword = await UserModel.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: "Incorrect email address or password",
        code: "invalid_credentials", 
        type: "authentication_error"
      });
    }

    const token = JWTUtils.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback-secret"
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Failed to login",
      code: "login_failed",
      type: "server_error"
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error("Profile retrieval failed:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
