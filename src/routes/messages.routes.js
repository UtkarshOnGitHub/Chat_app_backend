const express = require("express");
const messageModel = require("../models/messages,model");
const crypto = require("crypto-js")

const messageRoute = express.Router();

const secret = "whf8sdghsgdpskdhg"

messageRoute.post("/" , async(req,res)=>{
    let string = JSON.stringify(req.body.text)
    let encrypted = crypto.AES.encrypt(string,secret).toString()
    const newMessage = new messageModel({conversationId:req.body.conversationId,senderId:req.body.senderId,text:encrypted})
    try {
        let message = await newMessage.save();
        res.status(200).send(message)
    } catch (error) {
        res.status(500).json(error)
    }
})


messageRoute.get("/:conversationId" , async(req,res)=>{
    try {
        const message = await messageModel.find({conversationId:req.params.conversationId})
        message.forEach((e)=>{
            let bytes = crypto.AES.decrypt(e.text,secret)
            let data = bytes.toString(crypto.enc.Utf8)
            e.text = data.slice(1,data.length-1)
        })
        res.status(200).send(message)
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports = messageRoute;