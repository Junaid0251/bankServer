//impoting express
const express =  require('express')
const { status } = require('express/lib/response')
const dataService = require('./services/data.services')
const jwt = require('jsonwebtoken')
const cors = require('cors')

//create server app using express
const app = express()

//use cors

app.use(cors({
    origin: 'http://localhost:4200'
}))

//to parse json data 
app.use(express.json())

//resolving api call 

//GET - to read data
app.get('/',(req,res)=>{
    res.send('GET REQUEST')
})

//post - to create data
app.post('/',(req,res)=>{
    res.send('POST REQUEST')
})

//put - to modify/update entire data
app.put('/',(req,res)=>{
    res.send('PUT REQUEST')
})

//patch - to modify partial data
app.patch('/',(req,res)=>{
    res.send('PATCH REQUEST')
})

//delete - to delete data
app.delete('/',(req,res)=>{
    res.send('DELETE REQUEST')
})

//bank server 
//jwtMiddleware - created a middleware to verify token -  router specific middlewre

const jwtMiddleware=(req,res,next)=>{
    try {
        const token = req.headers["x-access-token"]
        const data = jwt.verify(token,'secret')
        req.currentAcno = data.currentAcno
        next()
    }

    catch{
        res.status(401).json({
            status:false,
            message:"please log in!!!!"
        })
    }

}

//resolving register api
app.post('/register',(req,res)=>{
   dataService.register(req.body.uname,req.body.acno,req.body.password)
   .then(result=>{
    res.status(result.statuscode).json(result)
   })
   
})

//resolving login api
app.post('/login',(req,res)=>{
dataService.login(req.body.acno,req.body.pswd)
.then(result=>{
    res.status(result.statuscode).json(result)
   })
 })

//resolving deposit api
app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
        res.status(result.statuscode).json(result)
       })
     })

 //resolving withdraw api
app.post('/withdraw',jwtMiddleware,(req,res)=>{
     dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
     .then(result=>{
        res.status(result.statuscode).json(result)
       })
     })

  //resolving transaction api
app.post('/transaction',jwtMiddleware,(req,res)=>{
     dataService.transaction(req.body.acno)
     .then(result=>{
        res.status(result.statuscode).json(result)

     })
 })

 //resolving delete api

 app.delete('/onDelete/:acno',jwtMiddleware,(req,res)=>{
     dataService.onDelete(req.params.acno)
     .then(result=>{
         res.status(result.statuscode).json(result)
     })
 })





//set port number
app.listen(3000,jwtMiddleware,(req,res)=>{
    console.log('server started at 3000');
})