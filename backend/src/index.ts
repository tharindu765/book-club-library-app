import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { connectDB } from './data_base/mongo'
import rootRouter from './routes'
import { errorHandleer } from './middlewares/errorHandle'

dotenv.config()
const app = express()

const PORT = process.env.PORT
app.use(express.json())
app.use("/api",rootRouter)
app.use(errorHandleer)

app.get("/",(req:Request, res:Response) => {
    res.send("hello world")
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on http://localhost:${PORT}`)
    })
})