
const express = require('express')
const dbConnect = require('./config/db')
const cors = require('cors');
const user = require('./routes/user.routes');
const conversationRoute = require('./routes/conversation.routes');
const messageRoute = require('./routes/messages.routes');
const PORT = process.env.PORT || 8080
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json());
const corsOptions ={
    origin:'https://chat-app-nu-tawny.vercel.app/', 
    credentials:true,    
    optionSuccessStatus:200
}


app.use(cors())

const io = require("socket.io")(8900, {
    cors: {
      origin: "https://chat-app-nu-tawny.vercel.app/",
    },
});


let users = [];


const addUser = (userId, socketId) => {
    if(userId){
        !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
    }

};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};



io.on("connection", (socket)=>{
    console.log("a user connected.");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            conversationId,
            senderId,
            text,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
})





app.get('/', (req, res) => res.send('Welcome To Chat-app-Backend'))
app.use("/user" , user)
app.use("/conversation" , conversationRoute)
app.use("/message" , messageRoute)





app.listen(PORT, async() => {
    await dbConnect();
    console.log('server started on port http://localhost:8080')}
)