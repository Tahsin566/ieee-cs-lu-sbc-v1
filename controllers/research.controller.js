
import { deleteFile, uploadFile } from "../config/cloudinary.js"
import { Research } from "../models/research.model.js"
import fs from 'fs'
import { researchValidator } from "../validator/research.validator.js"
import { transporter } from "../config/mailconfig.js"
import { text } from "stream/consumers"
import { hostname } from "os"

export const addResearch = async (req, res, next) => {


    if (req.files?.length === 0) {
        return res.status(400).json({ success: false, message: 'paper file is required' })
    }

    const {


        title,
        author,
        abstract,
        department,
        category,
        publicationDate,
        keywords,
        methodology,
        status,
        fundingInfo,
        paperfileslug,
        email,
        phonenumber,
        instituteAddress



    } = req.body

    if (!(title && author && abstract && department && category && keywords && methodology && status && fundingInfo && email && phonenumber && instituteAddress)) {
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }

    const isValid = researchValidator(title, author, abstract, department, category, keywords, methodology, status, fundingInfo, email, phonenumber, instituteAddress)

    if (!isValid) {
        return res.json({ success: false, message: isValid.message })
    }


    const existingTitle = await Research.findOne({ title })

    if (existingTitle) {
        return res.status(409).json({ success: false, message: 'research paper already exists' })
    }


    try {

        const paperfile = await uploadFile(req?.files[0]?.path) || ''
        const supportingDocImage = req?.files[1]?.path ? await uploadFile(req?.files[1]?.path) : ''

        const newResearch = new Research({

            title,
            author,
            abstract,
            department,
            category,
            publicationDate,
            keywords,
            methodology,
            status,
            fundingInfo,
            paperFile: paperfile || '',
            paperfileslug,
            supportingDocImage: supportingDocImage || '',
            email,
            phonenumber,
            instituteAddress

        })

        await newResearch?.save()


        res.status(201).json({ success: true, message: 'Research paper added' })
    } catch (error) {

        next(error)
    }
}

export const updateResearch = async (req, res, next) => {

    const { id,
        title,
        author,
        abstract,
        department,
        category,
        publicationDate,
        keywords,
        methodology,
        status,
        fundingInfo,
        email,
        phonenumber,
        instituteAddress
    } = req.body

    if (!id) {
        return res.status(400).json({ success: false, message: 'research paper id is required' })
    }

    if (!(id && title && author && abstract && department && category && keywords && methodology && status && fundingInfo && email && phonenumber && instituteAddress)) {

        return res.status(400).json({ success: false, message: 'all fields are required' })
    }

    try {
        const existingResearch = await Research.findById(id)
        if (!existingResearch) {
            return res.status(404).json({ success: false, message: 'research paper not found' })
        }




        title ? existingResearch.title = title : null
        author ? existingResearch.author = author : null
        abstract ? existingResearch.abstract = abstract : null
        department ? existingResearch.department = department : null
        category ? existingResearch.category = category : null
        publicationDate ? existingResearch.publicationDate = publicationDate : null
        keywords ? existingResearch.keywords = keywords : null
        methodology ? existingResearch.methodology = methodology : null
        status ? existingResearch.status = status : null
        fundingInfo ? existingResearch.fundingInfo = fundingInfo : null
        email ? existingResearch.email = email : null
        phonenumber ? existingResearch.phonenumber = phonenumber : null
        instituteAddress ? existingResearch.instituteAddress = instituteAddress : null

        if (req.files[0] && req.files[1]) {

            await deleteFile(existingResearch?.paperFile)
            await deleteFile(existingResearch?.supportingDocImage)
            existingResearch.paperFile = await uploadFile(req?.files[0]?.path) || ''
            existingResearch.supportingDocImage = await uploadFile(req?.files[1]?.path) || ''

        }


        if (req.files[0] && req?.files[1] === undefined && req.files[0]?.mimetype === "application/pdf") {
            await deleteFile(existingResearch?.paperFile)
            existingResearch.paperFile = await uploadFile(req?.files[0]?.path) || ''
        }

        if (req.files[0] && req.files[1] === undefined && req.files[0]?.mimetype === "image/jpeg" || req.files[0]?.mimetype === "image/png") {
            await deleteFile(existingResearch?.supportingDocImage)
            existingResearch.supportingDocImage = await uploadFile(req?.files[0]?.path) || ''
        }

        await existingResearch?.save()
        res.status(200).json({ success: true, research: existingResearch })

    } catch (error) {
        next(error)
    }
}

export const deleteResearch = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'research paper id is required' })
    }
    try {
        const existingResearch = await Research.findOne({ _id: id })
        if (!existingResearch) return res.status(404).json({ success: false, message: 'research paper not found' })

        existingResearch.paperFile ? await deleteFile(existingResearch?.paperFile) : null
        existingResearch.supportingDocImage ? await deleteFile(existingResearch?.supportingDocImage) : null
        await deleteFile(existingResearch?.supportingDocImage)
        await Research?.deleteOne({ _id: id })
        return res.status(200).json({ deleted: true })
    } catch (error) {
        next(error)
    }
}

export const getResearch = async (req, res, next) => {
    try {
        const allResearch = await Research.find({}, {}, { sort: { createdAt: -1 } })

        res.status(200).json({ success: true, research: allResearch })
    } catch (error) {
        next(error)
    }
}
export const getApprovedResearch = async (req, res, next) => {
    try {
        // const allResearch = await Research.find({isApproved: true},{},{ sort: { createdAt: -1 } })

        // const totalAuthor = await Research.aggregate([
        //     {
        //         $group: {
        //             _id: "$author",
        //             count: {
        //                 $sum: 1
        //             }
        //         }

        //     }
        // ])

        // const topAuthor = await Research.aggregate([
        //     {
        //         $match:{
        //             isApproved: true
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$author",
        //             count: {
        //                 $sum: 1
        //             }
        //         }
        //     },
        //     {
        //         $sort: {
        //             count: -1
        //         }
        //     },
        //     {
        //         $limit: 2
        //     },

        // ])

        // const topcategory = await Research.aggregate([
        //     {
        //         $match:{
        //             isApproved: true
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$category",
        //             count: {
        //                 $sum: 1
        //             }
        //         }
        //     },
        //     {
        //         $sort: {
        //             count: -1,
        //         }
        //     },
        //     {
        //         $limit: 3
        //     },

        // ])

        const [allResearch, totalAuthor, topAuthor, topcategory] = await Promise.allSettled([


            Research.find({ isApproved: true }, { paperFile: 0, authorId: 0, supportingDocImage: 0, email: 0, phonenumber: 0, instituteAddress: 0, paperfileslug: 0 }, { sort: { createdAt: -1 } }).lean(),

            Research.aggregate([
                {
                    $group: {
                        _id: "$author",
                        count: {
                            $sum: 1
                        }
                    }

                }
            ]),

            Research.aggregate([
                {
                    $match: {
                        isApproved: true
                    }
                },
                {
                    $group: {
                        _id: "$author",
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                },
                {
                    $limit: 2
                },

            ]),


            Research.aggregate([
                {
                    $match: {
                        isApproved: true
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        count: -1,
                    }
                },
                {
                    $limit: 3
                },

            ]),


        ])


        res.status(200).json({ success: true, research: allResearch.value, topAuthor: topAuthor.value, topcategory: topcategory.value, length: allResearch?.value?.length, totalAuthor: totalAuthor?.value?.length })

    } catch (error) {
        next(error)
    }
}

export const getsingleResearch = async (req, res, next) => {
    try {
        const research = await Research.findById(req.params.id)
        res.status(200).json({ success: true, research })
    } catch (error) {
        next(error)
    }
}

export const getResearchByDate = async (req, res, next) => {

    const { order } = req.params

    try {

        if (order === "Oldest") {

            const Allresearch = await Research.find({ isApproved: true }, {}, { sort: { createdAt: 1 } })
            return res.status(200).json({ success: true, research: Allresearch })
        }

        const Allresearch = await Research.find({ isApproved: true }, {}, { sort: { createdAt: -1 } })
        return res.status(200).json({ success: true, research: Allresearch })

    } catch (error) {
        next(error)
    }
}

export const getResearchByCategory = async (req, res, next) => {

    const { category } = req.params

    if (!category) {
        return res.status(400).json({ success: false, message: 'category is required' })
    }

    try {
        const research = await Research.find({ category: category, isApproved: true })
        res.status(200).json({ success: true, research })
    } catch (error) {
        next(error)
    }
}

export const approveResearch = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'research paper id is required' })
    }
    try {
        const existingResearch = await Research.findById(id)
        if (!existingResearch) {
            return res.status(404).json({ success: false, message: 'research paper not found' })
        }
        if (existingResearch.isApproved === false) {
            existingResearch.isApproved = true

            const mailOptions = {
                "sender":{
                    "name":"IEEE CS LU SB Chapter",
                    "email":"nazmulhassantahsin544@gmail.com"
                },
                "to":[
                    {
                        "email":"nazmulhassan44456@gmail.com"
                    }
                ],
                "subject":"Confirmation of approval of research paper",
                "htmlContent":"<p>Hello Tahsin.Your paper has been approved by the IEEE CS LU SB Chapter.You can visit the website to view your work.Please contact IEEE CS LU SB Chapter for more information.</p>"
            }
    
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.API_KEY
                },
                body: JSON.stringify(mailOptions)
            })
    
            if(!response.ok){
                throw new Error('Failed to send email')
            }
    
    
        }
        else {
            existingResearch.isApproved = false
            const mailOptions = {
                "sender":{
                    "name":"IEEE CS LU SB Chapter",
                    "email":"nazmulhassantahsin544@gmail.com"
                },
                "to":[
                    {
                        "email":"nazmulhassan44456@gmail.com"
                    }
                ],
                "subject":"Confirmation of rejection of research paper",
                "htmlContent":"<p>Hello Tahsin.Your paper has been rejected by the IEEE CS LU SB Chapter..Please contact IEEE CS LU SB Chapter for more information.</p>"
            }
    
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.API_KEY
                },
                body: JSON.stringify(mailOptions)
            })

            if(!response.ok){
                throw new Error('Failed to send email')
            }
        }
        let message = existingResearch.isApproved === true ? 'research paper approved' : 'research paper rejected'
        await existingResearch?.save()
        return res.status(200).json({ success: true, message: message })
    } catch (error) {
        next(error)
    }
}