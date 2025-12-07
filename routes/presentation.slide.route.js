
import { Router } from 'express';
import { PresentationSlide } from '../models/presentation.slide.model.js';
import { uploadFile, uploadImage } from '../config/cloudinary.js';
import { upload } from '../config/multer.js';

const router = Router();

router.get('/', async (req, res, next) => {
    res.send('Presentation Slide Route');
});

router.post('/add',upload.single("image"), async (req, res, next) => {

    try {

        const body = req.body
        console.log(req.file.path)

        const newPresentationSlide = new PresentationSlide({
            title: body.title,
            description: body.description,
            drivelink: body.drivelink,
            date: body.date,
            time: body.time,
            category: body.category,
            slideType: body.type,
            speakerName: body.speakerName,
            speakerDesignation: body.speakerDesignation,
            speakerOrg : body.speakerOrganization,
            location : body.location,
            thumbnail : await uploadFile(req.file?.path) || '',

        })
        newPresentationSlide.save()

        res.json({msg:'Presentation Slide Route'});

    } catch (error) {
        
    }
})

export default router;