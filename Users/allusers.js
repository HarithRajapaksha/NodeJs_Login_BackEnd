const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const express=require('express');
const router=express.Router();

const app=express();
require('dotenv').config();
app.use(cookieParser());

const UserActivation = require('../Model/Users_model');

//Authorized User

const AuthorizedUser=(req,res,next)=>{

     //get the corresponding token
       const token=req.cookies.token;
    
       if(!token){
        return res.json({error: 'User unauthorized'});
       }
        try{
            const decode=jwt.verify(token,process.env.JWT_KEY);
            req.user=decode
            next();
        }catch(e){
            return res.json({error: 'Unauthorized'});
        }
       

}


router.post('/signin',async(req, res)=>{

    const name=req.body.name
    const password=req.body.password
    //const role=req.body.role

    //check username and pass with database data

    const user=await UserActivation.findOne({name});

    if (!user || password !== user.password) {
        return res.json({ error: "Invalid credentials" });
      }
    

    //Create JWT Token 
    const jwt_key=process.env.JWT_KEY;

    const token=jwt.sign({name:user.name,role:user.role}, jwt_key,{expiresIn:'1h'});

    //set token as a cookie
    res.cookie('token',token,{httpOnly:true,secure:false});

    req.session.user={username: user.name, role: user.role };

    res.json({ message: 'Login successful' });
    console.log({message: 'Login successful'});

})


//sign out route
router.post('/signout',AuthorizedUser,(req,res) =>{

    //kill the session
    req.session.destroy();

    //Clear the jwt token by expiring the cookie
    res.cookie('token','',{expires:new Date(),httpOnly:true,secure:false});

    res.json({message:"logout successfull"});
    console.log("logout Success");
})

module.exports = router;

