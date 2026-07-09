import { Banner } from "../models/banner.model.js"


export const getAllBanner = async (req, res, next) => {

    try {
        const banner = await Banner.find({}, {}, { sort: { createdAt: -1 } })
        res.status(200).json({ success: true, banner })
    } catch (error) {
        next(error)
    }
}

export const addBanner = async (req, res, next) => {

    try {
        const newBanner = new Banner({
            title: req.body.title || '',
            bannerType: req.body.type || '',
            description: req.body.description || '',
            image: await uploadImage(req.file?.path) || '',
        })
        await newBanner.save()
        return res.status(200).json({ success: true, message: "Banner added successfully" })
    }
    catch (error) {
        next(error)
    }
}


export const updateBanner = async (req, res, next) => {

    try {
        const banner = await Banner.findById(req.params.id)
        // banner.image ? await deleteFile(banner?.image) : null
        // banner.image = await uploadImage(req.file?.path)
        await banner.save()
        return res.status(200).json({ success: true, message: "Banner updated successfully" })
    }
    catch (error) {
        next(error)
    }
}

export const deleteBanner = async (req, res, next) => {
    try {
        const banner = await Banner.findById(req.params.id)
        banner.image ? await deleteFile(banner?.image) : null

        const bannerDeleted = await Banner.findByIdAndDelete(req.params.id)

        return res.status(404).json({ success: true, message: "Banner deleted" })
    } catch (error) {
        next(error)
    }
}