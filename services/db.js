//database connection

//import mongoose 
const { use } = require('express/lib/application')
const mongoose = require('mongoose')


//connection string to connect db with server
mongoose.connect('mongodb://localhost:27017/bankServer'),{
    useNewUrlParser:true
}

//create model 
const User = mongoose.model('User', {
    acno: Number,
    uname: String,
    password: String,
    balance: Number,
    transaction: []
})


//export
module.exports={
    User,
    
}