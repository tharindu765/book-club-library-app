import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { connectDB } from './data_base/mongo'
import rootRouter from './routes'
import { errorHandleer } from './middlewares/errorHandle'
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config()
const app = express()

// handle cors
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeader: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))

const PORT = process.env.PORT
app.use(express.json())
app.use(cookieParser());
app.use("/api",rootRouter)
app.use(errorHandleer)

app.get("/",(req:Request, res:Response) => {
    res.send("hello world from kalpa")
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on http://localhost:${PORT}`)
    })
})