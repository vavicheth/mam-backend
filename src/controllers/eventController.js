import asyncHandler from 'express-async-handler'
import {Event} from "../models/event.model.js";

export const getAllEvent = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const options = {
        page,
        limit,
    };
    let filterEvents = await Event.paginate({}, options)
    return res.status(200).json(filterEvents)
})

export const getEventById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const event = await Event.findById(id)
    if (!event) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(event)
})

export const deleteEventById = asyncHandler(async (req, res) => {
    const eventId = req.params.id
    const result = await Event.deleteOne({ _id: eventId })
    return res.json({ message: result })
})

export const updateEventById = asyncHandler(async (req, res) => {
    const eventId = req.params.id
    const result = await Event.updateOne({ _id: eventId }, req.body)
    return res.status(200).json({ message: 'updated', data: result })
})

export const createEvent = asyncHandler(async (req, res) => {
    const event = new Event(req.body)
    await event.save()
    return res.status(201).json(event)
})
