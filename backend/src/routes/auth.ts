import express from "express";
import { body } from "express-validator";
import { register, login, getProfile } from "../controllers/authController";
import { validateRequest } from "../middleware/validation";
import { auth } from "../middleware/auth";
import { validatePasswordStrength } from "../middleware/security";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    body("first_name").notEmpty().withMessage("First name required"),
    body("last_name").notEmpty().withMessage("Last name required"),
    validateRequest,
    validatePasswordStrength,
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
    validateRequest,
  ],
  login
);

router.get("/profile", auth, getProfile);

export default router;
