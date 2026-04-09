import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/dbConfig.js'
import auth from './routes/user.js'
import connection from './routes/connection.js'
import webhookapi from './routes/webhook.js'

dotenv.config()

const app=express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:5173",
  "http://amzn-s3-external-portal.s3-website-us-east-1.amazonaws.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); //
  }
  next();
});

app.use('/api/auth',auth)
app.use('/api/connect',connection)
app.use('/api',webhookapi)

const serverPort=process.env.port || 8000

function startServer(){
  try {
    connectDB()
    app.listen(serverPort,()=>{
        console.log("Server is Listening on the port",serverPort)
    })
  } catch (error) {
    console.error("Error while starting server",error.message)
  }
    
}

startServer()