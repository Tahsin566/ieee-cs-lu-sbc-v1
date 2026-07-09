
import express from 'express'
import { Committee } from '../models/committee.model.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminRoute } from '../middlewares/admin.middleware.js'
import { upload } from '../config/multer.js'
import { deleteFile, uploadFile } from '../config/cloudinary.js'
import { Experience } from '../models/experience.model.js'
import { addCommitee, addCommitteeMembers, getAdvisor, getCommittee, getExCom, getExtendedCommittee, getPrevExCom, getVolunteer, removeFromCommittee } from '../controllers/committee.controller.js'

const router = express.Router()


router.post('/add-committee', protectedRoute, adminRoute, upload.single("image"), addCommitee)

router.get('/', getExtendedCommittee)

router.get('/all', getCommittee)

router.get('/advisor', getAdvisor)

router.get('/excom', getExCom)

router.get('/prevExcom', getPrevExCom)

router.get('/volunteer', getVolunteer)

router.post('/', protectedRoute, adminRoute, addCommitteeMembers)

router.delete('/:id', protectedRoute, adminRoute, removeFromCommittee)


export default router