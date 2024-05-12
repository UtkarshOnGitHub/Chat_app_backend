const mongoose = require('mongoose');



const dbConnect = (URL)=>{
    mongoose.set('strictQuery', true);
    return mongoose.connect(URL).then((res)=>{
        console.log("Database Connected Successfully!")
    }).catch((err)=>{
        console.log(err)
    });
}
module.exports = dbConnect;
