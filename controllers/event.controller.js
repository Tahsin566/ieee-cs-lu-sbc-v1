
import { deleteFile, uploadFile } from "../config/cloudinary.js"
import { Banner } from "../models/banner.model.js"
import { Event } from "../models/event.model.js"
import { User } from "../models/user.model.js"
import fs from 'fs'


export const getAllEvent = async (req, res, next) => {
    try {
        const allEvent = await Event.find({}, {}, { sort: { createdAt: -1 } })
        const getallTypes = await Event.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: {
                        $sum: 1
                    }
                }
            },

        ])

        res.status(200).json({ success: true, event: allEvent, types: getallTypes })

    } catch (error) {
        next(error)
    }
}


export const getEventsByDate = async (req, res, next) => {

    const { startDate } = req.body
    if (!startDate) {
        return res.status(400).json({ success: false, message: 'start date is required' })
    }
    const endDate = new Date(startDate)
    endDate.setDate(endDate?.getDate() + 7);
    const enddate = `${endDate?.getFullYear()}-${endDate?.getMonth() + 1}-${endDate?.getDate()}`

    try {

        const events = await Event.find({
            startdate: {
                $gte: new Date(startDate)?.setHours(0, 0, 0, 0),
                $lte: new Date(enddate)?.setHours(23, 59, 59, 999)
            },



        })
        res.status(200).json({ success: true, event: events })

    } catch (error) {
        next(error)
    }
}



export const getUpcomingEventDetailsImageAndCountDown = async (req, res, next) => {
    try {
        const events = await Event.find({ status: { $ne: 'completed' } }, {}, { sort: { createdAt: -1 } })

        const updatedEvents = events.map(async(event) => {
            const timeString = event.time;
            const [hours, minutes] = timeString ? timeString?.split(':')?.map(Number) : [0, 0]
            const extraTime = (hours * 3600000) + (minutes * 60000);

            const milliseconds = new Date(event?.startdate).getTime() - new Date()?.getTime() + extraTime

            if (milliseconds <= 0) {
                event.status = 'completed'
            }
            
            await event.save()

            return event
        })


        res.status(200).json({ success: true, events: events })
    } catch (error) {
        next(error)
    }
}

export const getFeaturedEvents = async (req, res, next) => {
    try {
        const featuredEvents = await Event.find({ isFeatured: true }, {}, { sort: { createdAt: -1 } }).limit(1)
        res.status(200).json({ success: true, event: featuredEvents[0] })
    } catch (error) {
        next(error)
    }
}

export const getEventByCategory = async (req, res, next) => {
    try {
        const { category } = req.params
        const events = await Event.find({ type: category })
        res.status(200).json({ success: true, event: events })
    } catch (error) {
        next(error)
    }
}

export const getsingleEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
        res.status(200).json({ success: true, event })
    } catch (error) {
        next(error)
    }
}


export const addEvent = async (req, res, next) => {


    const {
        name,
        description,
        startdate,
        time,
        location,
        isFeatured,
        status,
        type,
        registrationLink
    } = req.body

    //event already exists
    const existingEvent = await Event.findOne({ name: name })

    if (existingEvent) {

        return res.status(409).json({ success: false, message: 'event already exists' })

    }

    if (!(name && description && time && location)) {
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }


    try {

        const eventImage = await uploadFile(req?.file?.path)

        const newEvent = new Event({
            name,
            description,
            startdate,
            time,
            location,
            isFeatured,
            status,
            image: eventImage,
            type,
            registrationLink
        })

        const newBanner = new Banner({
            title: name,
            bannerType: 'Event',
            description,
            image: eventImage
        })
        newEvent.banner = newBanner._id
        await newEvent.save()
        await newBanner.save()

        res.status(201).json({ success: true, message: 'Event added' })
    } catch (error) {
        next(error)

    }
}



export const updateEvent = async (req, res, next) => {


    const { id, name, description, startdate, time, location, isFeatured, status, type, registrationLink } = req.body
    if (!id) {
        return res.status(400).json({ success: false, message: 'event id is required' })
    }
    if (!(id && name && description && time && location && isFeatured && status && type && registrationLink)) {
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }
    try {
        const existingEvent = await Event.findById(id)
        if (!existingEvent) {
            return res.status(404).json({ success: false, message: 'event not found' })
        }
        name ? existingEvent.name = name : null
        description ? existingEvent.description = description : null
        startdate ? existingEvent.startdate = startdate : null
        time ? existingEvent.time = time : null
        location ? existingEvent.location = location : null
        isFeatured ? existingEvent.isFeatured = isFeatured : null
        status ? existingEvent.status = status : null
        type ? existingEvent.type = type : null
        registrationLink ? existingEvent.registrationLink = registrationLink : null

        const existingBanner = await Banner.findById(existingEvent?.banner)
        if (existingBanner) {
            name ? existingBanner.title = name : null
            description ? existingBanner.description = description : null
        }

        if (req.file) {
            await deleteFile(existingEvent?.image)
            existingEvent.image = await uploadFile(req?.file?.path)
            existingBanner.image = existingEvent.image || ''
        }

        await existingEvent?.save()
        await existingBanner?.save()

        res.status(200).json({ success: true, event: existingEvent })
    } catch (error) {
        next(error)
    }
}

export const deleteEvent = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'event id is required' })
    }
    try {
        const existingEvent = await Event.findOne({ _id: id })
        if (!existingEvent) return res.status(404).json({ success: false, message: 'event not found' })

        existingEvent.image ? await deleteFile(existingEvent?.image) : null
        await Event.deleteOne({ _id: id })
        await Banner.deleteOne({ _id: existingEvent?.banner })
        return res.status(200).json({ deleted: true })
    } catch (error) {
        next(error)
    }
}



