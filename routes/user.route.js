
import express from 'express'
import { getProfile,verifyOtp, signUp,signIn, signOut, getAllUsers, uploadProfilePicture,getUserProfile, addSocialLinks, resetPassword, ChangePassByAdmin, sendVerificationEmail, ChangeUserPassword} from '../controllers/auth.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { upload } from '../config/multer.js'
import { adminRoute } from '../middlewares/admin.middleware.js'

const router = express.Router()


router.get('/user',getAllUsers)
router.get('/',protectedRoute,getProfile)
router.get('/signout',signOut)
router.post('/',signUp)
router.post('/signin',signIn)
router.post('/link',protectedRoute,addSocialLinks)
router.post('/change-pass',protectedRoute,adminRoute,ChangePassByAdmin)
router.post('/user/change-pass',ChangeUserPassword)
router.post('/reset',protectedRoute,resetPassword)
router.post('/verify',sendVerificationEmail)
router.post('/verify/otp',verifyOtp)
router.post('/upload-image',protectedRoute,upload.single("image"),uploadProfilePicture)
router.get('/:id',getUserProfile)




export default router