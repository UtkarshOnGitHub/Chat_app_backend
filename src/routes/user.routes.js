const {Router} = require("express")
const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer");

const bcrypt = require("bcrypt")



const config ={
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'leda17@ethereal.email',
        pass: 'vd4v1cupYW48948DD8'
    }
};

const transporter = nodemailer.createTransport(config);

const user = Router()

user.get("/",async(req,res)=>{
    let data = await UserModel.find({})
    res.send(data)
})


user.post("/signup" , async (req,res)=>{
    const {username,email,password} = req.body;
    const check = await UserModel.findOne({email})
    if(check){
        res.send("Cannot Create two User With same Email ");
        return
    }else{
        try {
            bcrypt.hash(password,10,async(err,hash)=>{
                if(err){
                    throw new Error("Something Went Wrong")
                }
                const user = new UserModel({username:username,email:email,password:hash});
                await user.save()
                res.status(200).send("User Created Successfully")
            })
        } catch (error) {
            console.log(error)
        } 
    }

})




user.post("/login" , async(req,res)=>{
    const {email , password} = req.body;
    const user = await UserModel.findOne({email})
    if(!user){
        return res.send("Sorry We Couldnt Find Any Regeistered Email")
    }
    if(email){
        bcrypt.compare(password,user.password,(err,result)=>{
            if(err){
                throw new Error("Something Went Wrong")
            }
            if(result==true){
                const token = jwt.sign({id:user._id ,email:user.email}, "HASHIRA" , {
                    expiresIn:"48 hours"
                })
                res.send({message:"Token Generated",token:token}).status(200)
            }else{
                res.send("Invalid Credentials")
            }
        })
    }

})

user.post("/forgetPassword", async (req,res)=>{
    const {email} = req.body;

    const check = await UserModel.find({email:email});

    if(check.length==0){
        return res.send("Sorry We Couldn't Find this email in our database.")
    }
    const otp = Math.floor(Math.random()*100000);
    var mailOptions = {
            from: 'ChatSmash',
            to: email,
            subject: 'Reset Your Password',
            text: `Here Is your one time password OTP for your request to password change. ${otp}`
    };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.status(400).send("Email Not Sent")
          }else {
            res.send({message:"Email Sent Successfully",otp:otp}).status(200)
          }
        })
})


user.get("/:userId",async(req,res)=>{
    const data = await UserModel.findById(req.params.userId)
    res.send(data)
})


user.post("/byToken",async(req,res)=>{
    const data = jwt.verify(req.body.token , "HASHIRA");
    const user = await UserModel.findById(data.id)
    res.send(user)
})


module.exports = user