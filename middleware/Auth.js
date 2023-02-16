const User=require("../models/userModel")
const jwt=require("jsonwebtoken")

exports.isAuthenticated=async (req,res,next)=>{
try{
    const {token}=req.cookies;
    if(!token){
        return res.status(401).json({
            message:"Please Log In First"
        });
    }
    const decoded=await jwt.verify(token,process.env.JWT_SECRET);
   
    req.user=await User.findById(decoded.user_id);
    
    next(); 
}
catch(e){
   
   
    res.status(500).json({
        success:false,
        message:e.message
    })}
}
exports.authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:`Role : ${req.user.role} is not allowed to acess this service`
            })
        }
        next();
    }
}