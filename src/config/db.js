const mongoose = require('mongoose');

const dbConnect = ()=>{
    mongoose.set('strictQuery', true);
    return mongoose.connect('mongodb+srv://kira:Wd0ASQIbVbH3aly9@cluster0.vtcz0fs.mongodb.net/?retryWrites=true&w=majority');
}
module.exports = dbConnect;
