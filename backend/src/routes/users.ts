import express from "express";
import { getAllUsers } from "../controllers/userController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/", auth, getAllUsers);

export default router;
