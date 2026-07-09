
import { Contact } from "../models/contact.model.js"
import { validateMessage } from "../validator/message.validator.js"


export const addContact = async(req,res,next)=>{


    const {name,subject,email,message} = req.body

    const isValidMessage = validateMessage(name,subject,email,message)

    if(!isValidMessage){
        return res.status(400).json({success:false,message:'invalid message'})
    }

    if(!(name && subject && email && message)){
        return res.status(400).json({success:false,message:'all fields are required'})
    }
    try {
        const newContact = new Contact({name,subject,email,message})
        await newContact.save()


          const mailOptions = {
            "sender":{
                "name":"IEEE CS LU SB Chapter",
                "email":email
            },
            "to":[
                {
                    "email":"ieeecs@lus.ac.bd"
                }
            ],
            "subject":subject,
            "htmlContent":`<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify(mailOptions)
        })

        console.log(response.statusText)

        if(!response.ok){
            throw new Error('Failed to send email '+ response.statusText)
        }

        res.status(201).json({success:true,message:'Contact added'})
    } catch (error) {
        next(error)
    }
}

export const replyToMessage = async(req,res,next)=>{
    const {name,email,subject,message} = req.body


    if(!(email && subject && message)){
        return res.status(400).json({success:false,message:'all fields are required'})
    }

    try {
        const mailOptions = {
            "sender":{
                "name":"IEEE CS LU SB Chapter",
                "email":"ieeecs@lus.ac.bd"
            },
            "to":[
                {
                    "email":email,
                }
            ],
            "subject":subject?.toString(),
            "htmlContent":name ? `<p>Hi ${name}</p><p>Message: ${message}</p>` :`<p>Message: ${message}</p>`
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify(mailOptions)
        })

        if(!response.ok){
            throw new Error('Failed to send email')
        }

        return res.status(200).json({success:true,message:'Reply sent'})
    }
    catch (error) {
        next(error)
    }
}

export const addQueryFromUser = async(req,res,next)=>{

    const {email,question} = req.body
    if(!(email && question)){
        return res.status(400).json({success:false,message:'all fields are required'})
    }

    const existingFaq = await FaqQuery.findOne({email,question})
    if(existingFaq){
        return res.status(409).json({success:false,message:'faq query already exists'})
    }
    
    try {
        const newFaq = new FaqQuery({email,question})
        await newFaq.save()
        res.status(201).json({success:true,message:'Faq query added'})
    } catch (error) {
        next(error)
    }

}

export const toggleReadStatus = async(req,res,next)=>{
    try {
        const contact = await Contact.findById(req.params.id)
        contact.isRead === true ? contact.isRead = false : contact.isRead = true
        const message = contact.isRead === true ? 'Read' : 'Unread'
        await contact.save()
        res.status(200).json({success:true,message:message})
    }
    catch (error) {
        next(error)
    }
}

export const getAllContacts = async(req,res,next)=>{
    try {
        const contact = await Contact.find({},{createdAt:0,updatedAt:0})
        res.status(200).json({success:true,contact})
    } catch (error) {
        next(error)
    }
}

export const deleteContact = async(req,res,next)=>{
    try {
        const contact = await Contact.findById(req.params.id)
        if(!contact){
            return res.status(404).json({success:true,message:'Contact does not exists'})
        }
        await contact.deleteOne()
        return res.status(200).json({success:true,message:'Contact deleted'})
    } catch (error) {
        next(error)
    }
}