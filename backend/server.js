// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/auth.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

/* ---------- CORS (Vercel previews + prod + localhost) ---------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://notes-app-iota-ochre.vercel.app",
  /\.vercel\.app$/, // allow ALL Vercel preview/prod domains
];

const corsOptionsDelegate = (req, cb) => {
  const origin = req.header("Origin");
  let allow = false;

  if (!origin) {
    // curl/Postman/server-to-server
    allow = true;
  } else {
    allow = allowedOrigins.some((rule) =>
      typeof rule === "string" ? rule === origin : rule.test(origin)
    );
  }

  cb(null, {
    origin: allow,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials not needed for Bearer tokens (leave false)
    credentials: false,
  });
};

app.use(cors(corsOptionsDelegate));
app.options("*", cors(corsOptionsDelegate)); // preflight

/* ---------- Parsers ---------- */
app.use(express.json());

/* ---------- Health / Root ---------- */
app.get("/", (_, res) => res.send("Notes API ✅"));
app.get("/api/health", (_, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/notes", protect, noteRoutes);

/* ---------- Errors ---------- */
app.use(notFound);
app.use(errorHandler);

/* ---------- DB + Server ---------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI environment variable");
  process.exit(1);
}

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
