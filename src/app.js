import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app= express()
app.use(cors({
    origin:process.env.FRONTEND_SERVER
    
}))

app.use(express.json({limit:"16kb"}))// this line tell that the app is taking json data(when user submit form)
app.use(express.urlencoded({limit:"16kb"})) // this line tell that the user is taking url dat(when user search )
app.use(express.static("./public"))
app.use(cookieParser()) // this allow to store cookies in the browser of user

//Routes
import userRouter from "./routes/User.routes.js"

//route declaration
app.use("/api/v1/users",userRouter)
app.get("/check",(req,res)=>{res.send("hey")})

app.listen(process.env.PORT,()=>{console.log(`the port is running ${process.env.PORT}`)})

export default app;