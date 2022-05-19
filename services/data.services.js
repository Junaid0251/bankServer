//import jwt
const jwt = require('jsonwebtoken')

const db = require('./db')

//database 
database = {
  1000: { acno: 1000, uname: "sura", password: 1000, balance: 20,transaction:[] },
  1001: { acno: 1000, uname: "sura", password: 1000, balance: 20,transaction:[] },
  1002: { acno: 1002, uname: "sasi", password: 1002, balance: 0,transaction:[] },

}

//register -
const register = (uname, acno, password) => {

  return db.User.findOne({ acno })
    .then(user => {
      console.log(user);

      if (user) {
        //already exist 
        return {
          statuscode: 401,
          status: false,
          message: "account already exist...."
        }
      }
      else {
        const newUser = new db.User({
          uname,
          acno,
          password,
          balance: 0,
            transaction: []

  
        })
         newUser.save()

      return {
        statuscode: 200,
        status: true,
        message: "successfully registered.... please login"
      }
    }
      })
    }

//login
const login = (acno, pswd) => {
  // user acno n pswd
 return db.User.findOne({acno,password:pswd})
 .then(user=>{
   console.log(user);
   if(user){
    currentUser = user.uname
    currentAcno = acno
    //token generate
    const token = jwt.sign({
      currentAcno: acno
    }, 'secret')

    return {
      statuscode: 200,
      status: true,
      message: "Login successfull.... ",
      token,
      currentAcno,
      currentUser,
      token
    }

   }else{
    return {
      statuscode: 401,
      status: false,
      message: "invalid creditials!!"
    }     
   }
 })
}

//deposit 
const deposit = (
  acno, pswd, amt) => {

  var amount = parseInt(amt)

  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    
    if(user){
      user.balance += amount
     user.transaction.push({
        type: "CREDITED",
        amount: amount
      })
      user.save()
      return {
        statuscode: 200,
        status: true,
        message: amount + "..deposited successfully.... And new balace is:" + user.balance
      }
    }else{
      return {
        statuscode: 401,
        status: false,
        message: "invalid creditials!!"
      }     
    }
  })
}


//withdraw
const withdraw = (req, acno, pswd, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if (req.currentAcno != acno) {
      return {
        statuscode: 422,
        status: false,
        message: "operation denied"
      }
    }

    if(user){

      if (user.balance >= amount) {
        user.balance -= amount
        user.transaction.push({
          type: "DEBITED",
          amount: amount
        })
        user.save()
        return {
          statuscode: 200,
          status: true,
          message: amount + "withdrawed successfully.. And new balance is:" + user.balance
        }

    }else{
      return {
        statuscode: 401,
        status: false,
        message: "insufficient balance!!"
      }     
    }
  }else{
    return {
      statuscode: 401,
      status: false,
      message: "invalid creditials!!"
    }     
  }
  })
}


//transaction
const transaction = (acno) => {
 return db.User.findOne({acno})
 .then(user=>{
   if(user){
    return {
      statuscode: 200,
      status: true,
      transaction: user.transaction
    }
   }else{
    return {
      statuscode: 401,
      status: false,
      message: "user doesnot exist!!"
    }     
  }
 })
}


//delete account

const onDelete=(acno)=>{
  console.log(acno);
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user){
      return{
        statuscode:401,
        status:false,
        message:"operation failed"
      }
    }
    else{
      return{
        statuscode:200,
        status:true,
        message:"Account number "+acno+" deleted successfully"
      }
    }
  })
  
}


//export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  transaction,
  onDelete
}