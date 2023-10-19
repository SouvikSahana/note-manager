const {getUserProfile}=require("./database")

async function authChecker(req,res,next){
    try{
        const token=req.headers.authorization
        const User=await getUserProfile(token)
        const isTokenPresent= User.tokens.some((arr)=> arr.token ===token)
        if(isTokenPresent && User){
            next()
        }else{
            res.send({
                message:"Please authinticate first"
            })
        }
    }catch(error){
        res.send({
            message:"Internal error. Please try after some time"
        })
    }
}

module.exports=authChecker