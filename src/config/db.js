const mongoose = require('mongoose');
require('dotenv').config();


const dbConnect = ()=>{
    mongoose.set('strictQuery', true);
    return mongoose.connect(process.env.DB_URL).then((res)=>{
        console.log("Database Connected Successfully!")
    }).catch((err)=>{
        console.log(err)
    });
}
module.exports = dbConnect;
