const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
require('dotenv').config();
const jwt=require("jsonwebtoken")

const url="mongodb://127.0.0.1:27017/MyDatabase?retryWrites=true&w=majority"

mongoose.set("strictQuery",false)
mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true})

const userSchema=new mongoose.Schema({
    name:{
        type:"String",
        required: true
    },
    email:{
        type:"String",
        unique: true,
        required: true
    },
    password:{
        type:"String",
        required: true
    },
    tokens:[{
        token:{
            type: "String",
            required: true
        }
    }]
})

const taskSchema=new mongoose.Schema({
    title:{
        type:"String",
        required: true
    },
    description:{
        type:"String"
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})



userSchema.statics.findByCredentials=async(email, password)=>{
    const User = await user.findOne({ email })
    if (!User) {
        throw new Error('Email not registered')
    }
    const isMatch = await bcrypt.compare(password, User.password)
    if (!isMatch) {
        throw new Error('Password incorrect')
    }
    const token=await User.generateAuthToken()
    return token
}
userSchema.statics.getUserProfile=async(token)=>{
    try{
        const id=jwt.verify(token,process.env.token_key)
        const User=await user.findById(id._id)
        return User
    }catch(error){
        throw new Error("Internal error")
    }
}
taskSchema.statics.getTasks=async (token)=>{
    try{
        const id=jwt.verify(token,process.env.token_key)
        const Task=await tasks.find({owner:id._id})
        const updatedTaskArray= Task.map((arr)=>{ return {title:arr.title,description: arr.description, _id:arr._id}})
        return updatedTaskArray
    }catch(error){
        throw new Error(error.message)
    }
}
userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id},process.env.token_key)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.tokenRemover=async function(token){
    const user=this
    const updatedTokens=user.tokens.filter((arr)=> arr.token !==token)
    user.tokens=updatedTokens
    await user.save()

}
userSchema.pre("save",async function (next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})
const user=new mongoose.model('login',userSchema)
const tasks=new mongoose.model('task',taskSchema)

async function addUser(name,email, password){
    const person=user({name, email, password})

    try{
        const response=await person.save()
        const token= await response.generateAuthToken()
        return  token
    }catch(error){
        if(error.code ===11000 && error.keyPattern.email===1){
            throw new Error("Email already exists")
        }else{
            throw new Error("Internal server error")
        }
    }
}
async function addTask(title, description,token){
    const id=jwt.verify(token,process.env.token_key)
    const task=tasks({title, description, owner: id._id})
    try{
        const data=task.save()
        return data
    }catch(error){
        return "Error happen to add note"
    }
}
async function logout(token){
    try{
        const User=await user.getUserProfile(token)
        await User.tokenRemover(token)
    }catch(error){
        throw new Error(error.message)
    }
}
const userLogin=user.findByCredentials
const getUserProfile=user.getUserProfile
const getTasks=tasks.getTasks

module.exports={addUser,userLogin, addTask,getUserProfile,logout,getTasks}