import { Request, Response, NextFunction } from "express";

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  next();
};

export const authRateLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const key = `auth:${clientIP}`;

  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxAttempts = 60;

  if (!req.app.locals.rateLimit) {
    req.app.locals.rateLimit = new Map();
  }

  const attempts = req.app.locals.rateLimit.get(key) || [];
  const validAttempts = attempts.filter(
    (timestamp: number) => now - timestamp < windowMs
  );

  if (validAttempts.length >= maxAttempts) {
    return res.status(429).json({
      error: "Too many authentication attempts",
      message: "Please try again later",
    });
  }

  validAttempts.push(now);
  req.app.locals.rateLimit.set(key, validAttempts);

  next();
};

export const validatePasswordStrength = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: "Password is required",
      message: "Please provide a password",
    });
  }

  const minLength = 6;
  if (password.length < minLength) {
    return res.status(400).json({
      error: "Password too short",
      message: `Password must be at least ${minLength} characters long`,
    });
  }

  next();
};
