import express from "express"
import cookieParser from "cookie-parser"
const app= express()
app.use(cors({
    origin:process.env.FRONTEND_SERVER
    
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb"}))
app.use(express.({limit:"16kb"}))
app.use(express.static("/public"))
app.use(cookieParser())