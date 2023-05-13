const express = require("express")
const conversationModel = require("../models/conversation.model")

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



module.exports = conversationRoute