
import express from 'express'
import { Faq } from '../models/faq.model.js'
import { addNewFaq, getAllFaq } from '../controllers/faq.controller.js'

const router = express.Router()

router.get('/',getAllFaq)

router.post('/',addNewFaq)


export default router