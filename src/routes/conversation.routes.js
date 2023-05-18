const express = require("express")
const conversationModel = require("../models/conversation.model");
const UserModel = require("../models/user.model");

const conversationRoute = express.Router();

conversationRoute.post("/" , async(req,res)=>{
    const newConvo = new conversationModel({members:[req.body.senderId , req.body.recieverId]})

    try {
        const savedConvo = await newConvo.save() 
        res.status(200).json(savedConvo)
    } catch (error) {
        res.status(500).json(error)
    }
})


conversationRoute.get("/:userId" , async(req,res)=>{
    try {
        const convo = await conversationModel.find({members:{$in:[req.params.userId]}})
        res.status(200).json(convo)     
    } catch (error) {
        res.status(500).json(error)
    }

})

conversationRoute.post("/getFriends",async(req,res)=>{
    let id = req.body.id;
    let convo = await conversationModel.find({});
    let users = await UserModel.find({})
    let result = [];
    for(let i=0;i<convo.length;i++){
        if(convo[i]?.members.includes(id)){
            result.push(convo[i])
        }
    }
    let responseArray = []
    for(let i=0;i<result.length;i++){
        for(let j=0;j<result[i].members.length;j++){
            if(result[i].members[j]!==id){
                responseArray.push(result[i].members[j])
            }
        }
    }
    let output = []
    for(let i=0;i<users.length;i++){
        for(let j=0;j<responseArray.length;j++){
            if(users[i]._id != responseArray[j]){
                if(!output.includes(users[i])){
                    output.push(users[i])
                }
            }
        }
    }
    res.status(200).json(output)  
})




module.exports = conversationRoute