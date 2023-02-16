const User=require("../models/userModel");
const jwt  = require('jsonwebtoken');
  const sendEmail=require('../utils/sendEmail')
const bcrypt=require("bcrypt");
const crypto=require("crypto")
exports.registerUser=async(req,res)=>{
    try{
const{name,email,password}=req.body;
let user=await User.findOne({email});
if(user) return res.status(400).json({success:false,message:"User Already Exists"});
user=await User.create({name,email,password,
avatar:{public_id:"smaple_id",url:"sample_url   "}
}); 
  // Create token
  
  const registertoken = jwt.sign(
    { user_id: user._id, email },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

res.status(201).json({success:true,user,token:registertoken});
    }
    catch(e){
      console.log("e")
res.status(500).json({
    success:false,
    message:e.message
})
    }
}
exports.login=async(req,res)=>{
  try{
//         const{email,password}=req.body;
//         const user=User.findOne({email}).select('+password');
//         if(!user){
//             return res.status(400).json({success:false,message:"User Not Found"});
//         }
//         var users=new User();//Error a raha tha so have to create new user object to use schema methods
//         const isMatch= users.matchPassword(password);

//         if(!isMatch){
//             console.log("User Not Match");
//             return res.status(400).json({success:false,message:"Password Incorrect"});
          
//         }
     
//         // const token=await users.generatetoken(_id); 
//          // Create token
//   const token = jwt.sign(
//     { user_id: user._id, email },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "2h",
//     }
//   );
//         res.status(200).cookie("token",token).json({
//             success:true,
//             user
//         })  
const { email, password } = req.body;

// Validate user input
if (!(email && password)) {
res.status(400).send("All input is required");
}
// Validate if user exist in our database
const user = await User.findOne({ email }).select("+password");
// console.log(password);
// console.log(user.password);
if (user && (await bcrypt.compare(password, user.password))) {
// Create token

const token = jwt.sign(
  { user_id: user._id, email },
  process.env.JWT_SECRET,
  {
    expiresIn: "2h",
  }
);

// save user token
// user.token = token;

// // user
// res.status(200).json(user);
res.status(200).cookie("token",token).json({
               success:true,
               user,
               token
         })  
}
else if(!await bcrypt.compare(password, user.password)){
return res.status(400).json({success:false,message:"Password Incorrect"});
}
// res.status(400).send("Invalid Credentials");
  } 
  catch(e){
    
   return   res.status(500).json({success:false,message:e.message})
  }

}
exports.logout=async(req,res)=>{
  try{
  res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true }).json({
    success:true,
    message:"Logged Out",
  })
  }
  catch(e){
  return res.status(500).json({
    success:false,
    message:e.message
  })
  }
  }
  exports.forgetPassword=async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User Not Found"
      })
    }
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl=`http://localhost/api/v1/password/reset/${resetToken}`
    const message=`Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this email than just ignore it`
    try{
     
await sendEmail({
email:user.email,
subject:"Password Recovery",
message
})
res.status(200).json({
  success:true,
  message:  `Email sent to ${user.email} successfully`
})
    }
    catch(e){
user.resetPasswordToken=undefined;
user.resetPasswordExpire=undefined;
await user.save({validateBeforeSave:false});
return res.status(500).json({
  success:false,
  message:e.message
})
    }
  }
  exports.resetPassword=async(req,res,next)=>{
   
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user=await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User Not Found"
      })
    }
    if(req.body.password!==req.body.confirmPassword){
      return res.status(404).json({
        success:false,
        message:"Password and Confirm Password does not Match"
      })
    }
    user.password=req.body.password;
    console.log(req.body.password);
    console.log(req.body.confirmPassword);
    const token = jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    await user.save();
    res.status(200).cookie("token",token).json({
      success:true,
      user,
      token
})  

  }
  //User Detail
   exports.getUserDetails=async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
      success:true,
      user
    })

   }
   //update user password
   exports.updatePassword=async(req,res,next)=>{
const user =await User.findById(req.user.id).select("+password");
console.log(req.body.oldPassword);
const isPasswordMatched=await bcrypt.compare(req.body.oldPassword,user.password);
if(!isPasswordMatched){
  return res.status(401).json({
    success:false,
    message:"Old Password incorrect"
  })
}
if(req.body.newPassword!==req.body.confirmPassword){
  return res.status(401).json({
    success:false,
    message:"Confirm Password Does Not Match"
  })
}
user.password=req.body.newPassword;
const token = jwt.sign(
  { user_id: user._id },
  process.env.JWT_SECRET,
  {
    expiresIn: "2h",
  }
);
await user.save();
res.status(200).cookie("token",token).json({
  success:true,
  user,
  token
})  
   }


   exports.updateProfile=async(req,res,next)=>{
//    const newUserData={
//     name:req.body.name,
//     email:req.body.email
//    }
// const user=await User.findByIdAndDelete(req.user.id,newUserData,{
//   new:true,
//   runValidators:true,
//   useFindAndModify:false
// });  
//     const token = jwt.sign(
//       { user_id: user._id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "2h",
//       }
//     );
//     await user.save();
//      res.status(200).cookie("token",token).json({
//       success:true,
//       user,
//       token
//     })  
const newUserData = {
  name: req.body.name,
  email: req.body.email,
};

// if (req.body.avatar !== "") {
//   const user = await User.findById(req.user.id);

//   const imageId = user.avatar.public_id;

//   await cloudinary.v2.uploader.destroy(imageId);

//   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//     folder: "avatars",
//     width: 150,
//     crop: "scale",
//   });

//   newUserData.avatar = {
//     public_id: myCloud.public_id,
//     url: myCloud.secure_url,
//   };
// }

const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
  new: true,
  runValidators: true,
  useFindAndModify: false,
});

res.status(200).json({
  success: true,
});
       }
       //Get Single User
       exports.getSingleUser=async(req,res,next)=>{
        try{
const user=await User.findById(req.params.id);
if(!user){
  return res.status(500).json({
    success:false,
    message:`User With ${req.params.id} Not Found`
  })
}
return res.status(200).json({
  success:true,
   user
})
        }
        catch(e){
return res.status(500).json({
  success:false,
  message:e.message
})
        }
       }
       exports.getAllUsers=async(req,res,next)=>{
        try{
const user=await User.find();
if(!user){
  return res.status(500).json({
    success:false,
    message:`User With ${req.params.id} Not Found`
  })
}
return res.status(200).json({
  success:true,
  user,
})
        }
        catch(e){
return res.status(500).json({
  success:false,
  message:e.message
})
        }

      }

//Update Role
exports.updateRole=async(req,res)=>{
  const newUserData={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  };
  const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })
  res.status(200).json({
    success:true,
    user
  })
}

       //Delete User
       exports.deleteUser=async(req,res)=>{
        try{
          const user=await User.findById(req.params.id);
          if(!user){
            return res.status(500).json({
              success:false,
              message:"User With this id Not Found"
            })
          }
          await user.remove();
                    return res.status(200).json({
success:true
          })
        }
        catch{}
       }