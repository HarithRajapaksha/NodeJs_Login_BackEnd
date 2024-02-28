
const UserRoles={
    admin:[],
    user:['login']
};

const requireRole=(role)=>{
    return(req,res,next)=>{

        //cheak user is in current session and get user current role
        const currentRole =req.session.user ? req.session.user.role : null;

        if(currentRole && role.includes(currentRole)){
            
            //get current page
            const requestPage=req.params.page;
            
            const permittedPage=UserRoles[currentRole]
            
            if(permittedPage.includes(requestPage)){

            next()
        } else{
            console.log("cannot access This page to you")
            res.json({error:'Access denied'})
        }

    }
    else{
        console.log("You did not have current role")
        res.json({error:'Access denied'})
    }
  }
}

module.exports =requireRole;
