import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import noteRoutes from "./routes/noteRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { protect } from "./middleware/auth.js";
import authRoutes from './routes/authRoutes.js'
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// --- CORS (single source of truth) ---
const ALLOWED = new Set([
  'https://place-sharing-128o.vercel.app', // prod frontend
  'http://localhost:3000',                 // dev
]);

app.use(cors({
  origin: (origin, cb) => {
    // allow no-origin (Postman/cURL) and whitelisted origins
    if (!origin || ALLOWED.has(origin) || /\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error(`CORS: ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Fast exit for preflight
app.options('*', cors());


// routes
app.get("/", (_, res) => res.send("Notes API ✅"));
//app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", protect, noteRoutes); // protect all note endpoints

// error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
