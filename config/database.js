const mongoose=require('mongoose');
const connectdatabse=()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/E-store",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('Connection is successful');
}).catch((e)=>{
    console.log(e);
    console.log("Connection is not successful")
})

}
module.exports=connectdatabse;
