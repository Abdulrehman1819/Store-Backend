const nodeMailer=require("nodemailer");
const sendEmail=async(options)=>{
const transporter=nodeMailer.createTransport({
    service:"gmail",
    auth:{
        user:"l191150@lhr.nu.edu.pk",
        pass:"@bgreat123"
    }
})
const mailOptions={
    from:"l191150@lhr.nu.edu.pk",
    to:options.email,
    subject:options.subject,
    text:options.message,
}
await transporter.sendMail(mailOptions)
}
module.exports=sendEmail    