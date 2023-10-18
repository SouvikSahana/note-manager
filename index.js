const express=require("express")
const authChecker=require("./middleware")
const {addUser,userLogin,addTask,getUserProfile,logout}=require("./database")

const app=express()
app.use(express.json())

const PORT= process.env.PORT || 5000

app.use("/login",express.static("./public/login"))
app.use("/signup",express.static("./public/signup"))
app.use("/",express.static("./public/task"))
app.use("/profile",express.static("./public/profile"))

app.post("/signup",async (req,res)=>{
    try{
        const token=await addUser(req.body.name,req.body.email,req.body.password)
        res.json(token)
    }catch(error){
        if(error.message){
            res.json({
                message: error.message
            })
        }  
    }  
})
app.post("/login",async (req,res)=>{
    try{
        const token=await userLogin(req.body.email,req.body.password)
        res.json(token)
    }catch(error){
        if(error.message){
            res.json({
                message: error.message
            })
        }
    }
})
app.post("/addnote",authChecker,async (req,res)=>{
    const data=req.body
    const response=await addTask(data.title,data.description)
    res.send({response})
})
app.post("/getprofile",authChecker,async(req,res)=>{
    try{
        const userProfle=await getUserProfile(req.headers.authorization)
        res.json({
            name:userProfle.name,
            email: userProfle.email
        })
    }catch(error){
        res.json({
            message:"Internal Error"
        })
    }
})
app.post("/logout",async (req,res)=>{
    try{
        await logout(req.headers.authorization)
    }catch(error){
        res.send({
            message: error.message
        })
    }
    res.send({success: "200"})
})

app.listen(PORT, ()=>{
    console.log("Listening to port "+ PORT);
})