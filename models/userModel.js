const mongoose=require("mongoose");
const bcrypt=require("bcrypt")
const crypto=require("crypto")
const validator=require("validator");
    const userSchema=new mongoose.Schema({
        name:{
            type:String,
            required:[true,"Please Enter Your Name"],
            maxLength:[30,"Name cannot exceed 30 characters"],
            minLength:[4,"Name should be more than 4 characters"]
        },
        email:{
            type:String,
            required:[true,"Please Enter Your Email"],
            unique:true,
            validate:[validator.isEmail,"Please Enter Valid Eamil"]
        },
        password:{
            type:String,
            required:[true,"Please Enter Your Password"],
            minLength:[8,"Password should be greater than 8 characters"],
            select:false,
        },
        avatar:
            {
                 public_id:{
                type:String, 
                required:true
            },
            url:{
                type:String,
                required:true
            }
        },
        role:{
            type:String,
            default:"user"
        },
        resetPasswordToken:String,
        resetPasswordExpire:Date,
        
    })
    userSchema.pre("save",async function(next){
        console.log(this.password);
        if(this.password && this.isModified("password")){
            console.log("User Schema",this.password);
        this.password=await bcrypt.hash(this.password,10);
    
        }
        
        next();
    })
    userSchema.methods.getResetPasswordToken=function(){
const resetToken=crypto.randomBytes(20).toString("hex");
//Hashing
this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
this.resetPasswordExpire=Date.now()+15*60*1000;
return resetToken
    };
    module.exports=mongoose.model("User",userSchema)