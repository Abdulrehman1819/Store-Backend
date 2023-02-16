const express=require("express");
const cookieParser=require("cookie-parser");
// const errorMiddleware=require("./middleware/error")
var cors = require('cors')
const app=express();
app.use(express.json());
app.use(cors())
app.use(cookieParser());
//Routes
const product = require("./routes/productroute");
const user=require("./routes/userRoute")
const order=require("./routes/orderRoute")

app.use("/api/v1", product);
app.use("/api/v1",user);
app.use("/api/v1",order);

//Eror Middleware
// app.use(errorMiddleware)
module.exports=app;