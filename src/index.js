
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


app.use(cors(corsOptions))



app.get('/', (req, res) => res.send('Welcome To Chat-app-Backend'))
app.use("/user" , user)
app.use("/conversation" , conversationRoute)
app.use("/message" , messageRoute)





app.listen(PORT, async() => {
    await dbConnect();
    console.log('server started on port http://localhost:8080')}
)