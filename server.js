const app=require("./app");
const dotenv=require("dotenv");
PORT=4000;
dotenv.config({path:"backend/config/config.env"});
const connectdatabase=require("./config/database");
connectdatabase();
app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost: ${PORT}`);
  });