
import nodemailer from 'nodemailer';


export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure:true,
  auth:{
    user:'nazmulhassantahsin544@gmail.com',
    pass:process.env.SMTP_PASSWORD
  }

});

