
import express from 'express'
import { Committee } from '../models/committee.model.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminRoute } from '../middlewares/admin.middleware.js'
import { upload } from '../config/multer.js'
import { deleteFile, uploadFile } from '../config/cloudinary.js'
import { Experience } from '../models/experience.model.js'

const router = express.Router()


router.post('/add-committee', protectedRoute, adminRoute, upload.single("image"), async (req, res, next) => {

    const { name, designation, facebookLink, linkedinLink, id, type } = req.body
    if (!(name && designation && id)) {
        // fs.unlinkSync(req.file?.path)
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }

    const existingMember = await Committee.findOne({ IEEEID: id })

    if (existingMember) {
        name ? existingMember.name = name : null
        designation ? existingMember.designation = designation : null
        id ? existingMember.IEEEID = id : null
        designation ? existingMember.designation = designation : null
        facebookLink ? existingMember.facebook = facebookLink : null
        linkedinLink ? existingMember.linkedin = linkedinLink : null
        type ? existingMember.CommitteeMemType = type : null


        if (req.file) {
            // fs.unlinkSync(existingMember?.hosted_image)
            existingMember?.hosted_image ? await deleteFile(existingMember?.hosted_image) : null
            existingMember.hosted_image = await uploadFile(req?.file?.path) || ''
        }
        await existingMember.save()

        return res.status(200).json({ success: true, message: 'Updated successfully' })
    }

    try {

        const MemberImage = await uploadFile(req?.file?.path) || ''

        const committee = new Committee({ name, designation, facebook: facebookLink, linkedin: linkedinLink, hosted_image: MemberImage, CommitteeMemType: type, IEEEID: id })
        await committee.save()

        return res.status(201).json({ success: true, message: 'Added successfully' })

    } catch (error) {
        next(error)
    }
})

router.get('/', async (req, res, next) => {


    try {

        const allmembers = await Committee.find({ CommitteeMemType: 'Member' }, { user: 0, updatedAt: 0, department: 0 }, { sort: { rank: 1 } })

        const programCoordinator = allmembers.filter((member) => member.designation === 'Program Coordinator')
        const acmCoordinator = allmembers.filter((member) => member.designation === 'ACM Coordinator')
        const pulicationsNewsletter = allmembers.filter((member) => member.designation === 'Publications & Newsletter Coordinator')
        const memberDev = allmembers.filter((member) => member.designation === 'Membership Development Coordinator')
        const publicity = allmembers.filter((member) => member.designation === 'Publicity Coordinator')
        const webmaster = allmembers.filter((member) => member.designation === 'Webmaster')
        const chiefReporting = allmembers.filter((member) => member.designation === 'Chief Reporting Executive')
        const graphicDesigner = allmembers.filter((member) => member.designation === 'Graphics Design Executive')
        const photoandVideoExec = allmembers.filter((member) => member.designation === 'Photography and Video Content Executive')
        const logistics = allmembers.filter((member) => member.designation === 'Logistic Executive')
        const youthSupport = allmembers.filter((member) => member.designation === 'Youth Support Executive')

        res.status(200).json({
            success: true,
            programCoordinator,
            acmCoordinator,
            pulicationsNewsletter,
            memberDev,
            publicity,
            webmaster,
            chiefReporting,
            graphicDesigner,
            photoandVideoExec,
            logistics,
            youthSupport,
        })

    } catch (error) {
        next(error)
    }
})


router.get('/all', async (req, res, next) => {
    try {

        //i need to get members that do not have designation as volunteer and member type as Advisory panel

        const allmembers = await Committee.aggregate([
            {$match:{designation:{$ne:'Volunteer'}}},
            {$match:{CommitteeMemType:{$ne:'Advisory Panel'}}},
            {$match:{designation:{$ne:'Youth Support Executive'}}},
            {$sort:{rank:1}}
        ])
        res.status(200).json({ success: true, allmembers })
    } catch (error) {
        next(error)
    }
})

router.get('/advisor', async (req, res, next) => {
    try {
        const advisor = await Committee.find({ CommitteeMemType: 'Advisory Panel' })
        res.status(200).json({ success: true, advisor })
    } catch (error) {
        next(error)
    }
})

router.get('/excom', async (req, res, next) => {
    try {
        const excom = await Committee.find({ CommitteeMemType: 'ExCom' }, {}, { sort: { rank: 1 } })
        res.status(200).json({ success: true, excom })
    } catch (error) {
        next(error)
    }
})

router.get('/prevExcom', async (req, res, next) => {
    try {
        const prevExcom = await Committee.find({ CommitteeMemType: 'Ex ExCom' }, {}, { sort: { rank: 1 } })
        res.status(200).json({ success: true, prevExcom })
    }
    catch (error) {
        next(error)
    }
})


router.get('/volunteer', async (req, res, next) => {
    try {
        const volunteer = await Committee.find({ designation: 'Volunteer' })
        res.status(200).json({ success: true, volunteer })
    } catch (error) {
        next(error)
    }
})



router.post('/', protectedRoute, adminRoute, async (req, res, next) => {

    try {
        const committee = await Committee.insertMany(req.body.members)

        res.status(201).json({ success: true, message: 'Committee added' })

    } catch (error) {
        next(error)
    }
})

router.delete('/:id', protectedRoute, adminRoute, async (req, res, next) => {
    try {

        const existingMember = await Committee.findById(req.params.id)
        
        await Experience.updateOne({title:existingMember.designation},{
            title:`Former ${existingMember.designation}`
        })
        
        await Committee.deleteOne({_id:req.params.id})

        res.status(200).json({ success: true, message: 'Committee deleted' })
    } catch (error) {
        next(error)
    }
})

export default router