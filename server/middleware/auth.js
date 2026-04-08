import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.redirect('/api/auth/signin')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log(
        "Error while validate token",error.message
    );
    res.redirect('/api/auth/signin')
  }
};