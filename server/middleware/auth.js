import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({
        message:"Invalid Token"
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log(
        "Error while validate token",error.message
    );
    res.status(500).json({
      message:error.message || "Error while validate token"
    })
  }
};