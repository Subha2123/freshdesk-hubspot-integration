import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('DB connection error:', err))
    return {
      mongoose
    };
  } catch (err) {
    console.error('DB connection error:', err);
  }
}

export { connectDB }

