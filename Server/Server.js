const mongoose=require('mongoose')
const express=require('express')
const app=express();
const db=mongoose.connection;
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json())

const requireRole=require('../Users/authentication');
const userPer=requireRole('user');
const adminPer=requireRole('admin');

const PORT=process.env.PORT || 3200;
const URL=process.env.DB_URL;

app.use(
    session({
      secret:process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );

//create db connection 
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const NormalRoutes=require('../Routes/routes');
app.use('/normalroutes',userPer,NormalRoutes);


const Roleusers=require('../Users/allusers');
app.use('/RoleUsers',Roleusers);


db.on('error',(err)=>{
    console.error(`Mongodb connection error ${err}`)
})

db.once('open',()=>{
    console.log("db connection successs")
})


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})