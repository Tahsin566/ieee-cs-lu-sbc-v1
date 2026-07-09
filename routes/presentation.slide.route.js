
import { Router } from 'express';
import { PresentationSlide } from '../models/presentation.slide.model.js';
import { uploadFile, uploadImage } from '../config/cloudinary.js';
import { upload } from '../config/multer.js';
import { addPresentation, getAllPresentation } from '../controllers/presentation.controller.js';

const router = Router();

router.get('/', getAllPresentation);

router.post('/add',upload.single("image"), addPresentation)

export default router;