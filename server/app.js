import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { connectDB } from './config/dbConfig.js'
import auth from './routes/user.js'
import connection from './routes/connection.js'

dotenv.config()

const app=express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/auth',auth)
app.use('/api/connect',connection)

const serverPort=process.env.port || 8001

function startServer(){

    connectDB()

    app.listen(serverPort,()=>{
        console.log("Server is Listening on the port",serverPort)
    })


}

startServer()