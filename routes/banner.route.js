
import express from 'express';
import { Banner } from '../models/banner.model.js';
import { adminRoute } from '../middlewares/admin.middleware.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.js';
import fs from 'fs';
import path from 'path';
import { deleteFile, uploadFile, uploadImage } from '../config/cloudinary.js';
import { addBanner, deleteBanner, getAllBanner, updateBanner } from '../controllers/banner.controller.js';

const router = express.Router();

router.get('/',getAllBanner)

router.post('/add-banner', protectedRoute, adminRoute, upload.single("image"), addBanner)

router.post('/update/:id', protectedRoute, adminRoute, upload.single("image"), updateBanner)

router.delete('/:id', protectedRoute, adminRoute, deleteBanner)

export default router;