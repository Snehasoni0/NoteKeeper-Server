import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import connectToMongoDb from "./db/db.js";
import Authrouter from "./routes/User.js";
import NoteRouter from "./routes/Note.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'https://note-keeper-frontend-alpha.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

app.use("/api/auth", Authrouter);
app.use("/api/note", NoteRouter);

app.get('/', (req, res) => {
  res.send("API running..!");
})

const PORT = process.env.PORT || 8000;

connectToMongoDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
