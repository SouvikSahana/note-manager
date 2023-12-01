const express=require("express")
const authChecker=require("./middleware")
const {addUser,userLogin,addTask,getUserProfile,logout, getTasks}=require("./database")

const router=express.Router()


router.post("/signup",async (req,res)=>{
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
router.post("/login",async (req,res)=>{
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
router.post("/addnote",authChecker,async (req,res)=>{
    const data=req.body
    const token=req.headers.authorization
    const response=await addTask(data.title,data.description,token)
    res.send(response)
})
router.post("/gettasks",async (req,res)=>{
    const token=req.headers.authorization
    try{
        const tasks=await getTasks(token)
        res.json(tasks)
    }catch(error){
        res.json({
            message: error.message
        })
    }
})

router.post("/getprofile",authChecker,async(req,res)=>{
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
router.post("/logout",async (req,res)=>{
    try{
        await logout(req.headers.authorization)
    }catch(error){
        res.send({
            message: error.message
        })
    }
    res.send({success: "200"})
})

module.exports= router