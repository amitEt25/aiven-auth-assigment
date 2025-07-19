import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import { securityHeaders, authRateLimit } from "./middleware/security";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Security headers - applies to all routes
app.use(securityHeaders);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes - auth has rate limiting, users route is protected by JWT middleware
app.use("/api/auth", authRateLimit, authRoutes);
app.use("/api/users", userRoutes);

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("API available at http://localhost:3001/api");
});
