const express=require("express")
const router=require("./routes")

const app=express()
app.use(express.json())

const PORT= process.env.PORT || 5000

app.use("/login",express.static("./public/login"))
app.use("/signup",express.static("./public/signup"))
app.use("/",express.static("./public/task"))
app.use("/profile",express.static("./public/profile"))
app.use(router)

app.listen(PORT, ()=>{
    console.log("Listening to port "+ PORT);
})