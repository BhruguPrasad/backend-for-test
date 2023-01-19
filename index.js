const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/User.model")
const notesRouter = require("./routes/notes.routes")
const connection = require("./configs/db")

const app = express();
app.use(express.json());
require("dotenv").config()
const PORT = process.env.PORT || 3000

app.post("/signup",async(req,res) =>{
    const {email,password} = req.body;
    await bcrypt.hash(password,6,function(err,hash){
        if(err){
            return res.send("signup failure")
        }
        const user = new UserModel({email,password:hash})
        user.save()
        return res.send("signup success")
    })
})
app.post("/login",async(req,res) =>{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email})
    if(!user){
        return res.send("invalid credentials")
    }
    const haspassword = user.password
    await bcrypt.compare(password,haspassword,(err,result) =>{
        if(err) {
            return res.send("error")
        }
        if(result==true){
            const token = jwt.sign({email:user.email,_id:user._id},process.env.jwt_secret_key)
            return res.send({message:"login success",token:token,userId:user._id})
        }
        else{
            return res.send("Error")
        }
    })
})
const authenticate = (req,res,next) =>{
    if(!req.headers.authorization){
        return res.send("Login First");
    }
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token,process.env.jwt_secret_key,(err,decode) =>{
        if(err){
            return res.send("Login Please");
        }
        next()
    })
}
app.use(authenticate)
app.use("/notes",notesRouter)
app.listen(PORT,async () =>{
    try{
        await connection
        console.log("connect success")
    }
    catch(err){
        console.log("connect failure")
    }
})