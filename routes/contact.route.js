import express from 'express'
import { Contact,FaqQuery} from '../models/contact.model.js'
import { validateMessage } from '../validator/message.validator.js'
import { transporter } from '../config/mailconfig.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import dotenv from 'dotenv'
import { adminRoute } from '../middlewares/admin.middleware.js'
import { addContact, addQueryFromUser, deleteContact, getAllContacts, replyToMessage, toggleReadStatus } from '../controllers/contact.controller.js'

dotenv.config()

const router = express.Router()

router.post('/',addContact)

router.post('/reply',replyToMessage)

router.post('/faq-query',addQueryFromUser)

router.patch('/:id',protectedRoute,adminRoute,toggleReadStatus)

router.get('/',getAllContacts)

router.delete('/:id',protectedRoute,adminRoute,deleteContact)

export default router