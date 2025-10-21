import asyncHandler from 'express-async-handler'
import {Event} from "../models/event.model.js";
import mongoose from 'mongoose';

const getLinkEventStaff = (event_id, event_staff_id) => {
    let host= (process.env.HOST_SERVER || "http://localhost");
    let port= (process.env.PORT || 3000);
    let event=(event_id || "");
    let event_staff=(event_staff_id || "");

    return `${host}:${port}/${event}/event_staff/${event_staff}`;
}

export const getAllEvent = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const search = req.query.search || ''
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder || 'desc'
    const populate = req.query.populate || ''

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;


    const options = {
        page,
        limit,
        sort,
        populate,
    };
    // Build search filter
    const filter = {};
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { event_link: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    let filterEvents = await Event.paginate(filter, options)
    return res.status(200).json(filterEvents)
})

export const getEventById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const event = await Event.findById(id).populate({
        path: 'event_staff.staff',
        select: 'name_en name_kh gender position'
    })
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

// export const updateEventStaff = asyncHandler(async (req, res) => {
//     const eventId = req.params.id
//     // return res.status(200).json(req.body)
//     const { event_staff } = req.body
//
//     if (!event_staff || !Array.isArray(event_staff)) {
//         return res.status(400).json({ message: 'event_staff array is required' })
//     }
//
//     const result = await Event.findByIdAndUpdate(
//         eventId,
//         { $set: { event_staff } },
//         { new: true, runValidators: true }
//     )
//
//     if (!result) {
//         return res.status(404).json({ message: 'Event not found' })
//     }
//
//     return res.status(200).json({ message: 'Event staff updated!', data: result })
// })

// export const updateEventStaff = asyncHandler(async (req, res) => {
//     const eventId = req.params.id
//     const { event_staff } = req.body
//
//     if (!event_staff || !Array.isArray(event_staff)) {
//         return res.status(400).json({ message: 'event_staff array is required' })
//     }
//
//     // Find the existing event
//     const event = await Event.findById(eventId)
//     if (!event) {
//         return res.status(404).json({ message: 'Event not found' })
//     }
//
//     // Synchronize event_staff array while preserving existing _id
//     const updatedStaff = event_staff.map(newStaffEntry => {
//         // Find if this staff already exists in the event
//         const existingEntry = event.event_staff.find(
//             existing => existing.staff.toString() === newStaffEntry.staff.toString()
//         )
//
//         // If exists, preserve the _id and update other fields
//         if (existingEntry) {
//             return {
//                 _id: existingEntry._id,
//                 staff: newStaffEntry.staff,
//                 is_joined: newStaffEntry.is_joined !== undefined ? newStaffEntry.is_joined : existingEntry.is_joined
//             }
//         }
//
//         // If new, return without _id (MongoDB will generate it)
//         return {
//             staff: newStaffEntry.staff,
//             is_joined: newStaffEntry.is_joined || false
//         }
//     })
//
//     // Update the event with synchronized staff array
//     event.event_staff = updatedStaff
//     await event.save()
//
//     return res.status(200).json({ message: 'Event staff updated!', data: event })
// })

export const updateEventStaff = asyncHandler(async (req, res) => {
    const eventId = req.params.id
    const { event_staff } = req.body

    if (!event_staff || !Array.isArray(event_staff)) {
        return res.status(400).json({ message: 'event_staff array is required' })
    }

    // Find the existing event
    const event = await Event.findById(eventId)
    if (!event) {
        return res.status(404).json({ message: 'Event not found' })
    }

    // Add only new staff members that don't already exist
    event_staff.forEach(newStaffEntry => {
        // Check if this staff already exists in the event
        const existingEntry = event.event_staff.find(
            existing => existing.staff.toString() === newStaffEntry.staff.toString()
        )

        // If doesn't exist, append it to the array
        if (!existingEntry) {
            event.event_staff.push({
                staff: newStaffEntry.staff,
                is_joined: newStaffEntry.is_joined || false
            })
        }
    })

    // Save the updated event
    await event.save()

    return res.status(200).json({ message: 'Event staff updated!', data: event })
})

export const updateEventStaffJoin = asyncHandler(async (req, res) => {
    const eventId = req.params.id
    const event_staff_id = req.params.es_id

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid event ID format!" });
    }

    if (!mongoose.Types.ObjectId.isValid(event_staff_id)) {
        return res.status(400).json({ message: "Invalid event staff ID format!" });
    }

    const event = await Event.findById(eventId)
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    // Find the event_staff entry by _id
    const existingEntry = event.event_staff.find(
        (staff) => staff._id.toString() === event_staff_id
    );

    if (!existingEntry) {
        return res.status(404).json({ message: 'You are not in this event!' })
    }

    // Check if already joined
    if (existingEntry.is_joined === true) {
        return res.status(200).json({ message: 'You have already joined this event!', data: existingEntry })
    }

    // Update is_joined field
    existingEntry.is_joined = true

    // Save the updated event
    await event.save()

    return res.status(200).json({ message: 'Event joined successfully!', data: existingEntry })
})

export const toggleEventStaffJoin = asyncHandler(async (req, res) => {
    const eventId = req.params.id
    const event_staff_id = req.params.es_id

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid event ID format!" });
    }

    if (!mongoose.Types.ObjectId.isValid(event_staff_id)) {
        return res.status(400).json({ message: "Invalid event staff ID format!" });
    }

    const event = await Event.findById(eventId)
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    // Find the event_staff entry by _id
    const existingEntry = event.event_staff.find(
        (staff) => staff._id.toString() === event_staff_id
    );

    if (!existingEntry) {
        return res.status(404).json({ message: 'You are not in this event!' })
    }

    // Check if already joined
    if (existingEntry.is_joined === true) {
        existingEntry.is_joined = false
    }else {
        existingEntry.is_joined = true
    }

    // Save the updated event
    await event.save()

    return res.status(200).json({ message: 'Event joined has been changed!', data: existingEntry })
})

export const deleteEventStaff = asyncHandler(async (req, res) => {
    const eventId = req.params.id
    const event_staff_id = req.params.es_id

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid event ID format!" });
    }

    if (!mongoose.Types.ObjectId.isValid(event_staff_id)) {
        return res.status(400).json({ message: "Invalid event staff ID format!" });
    }

    const event = await Event.findById(eventId)
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    // Find the index of the event_staff entry
    const staffIndex = event.event_staff.findIndex(
        (staff) => staff._id.toString() === event_staff_id
    );

    if (staffIndex === -1) {
        return res.status(404).json({ message: 'Staff member not found in this event!' })
    }

    // Remove the staff member from the array
    event.event_staff.splice(staffIndex, 1)

    // Save the updated event
    await event.save()

    // Populate staff details before returning
    const updatedEvent = await Event.findById(eventId).populate({
        path: 'event_staff.staff',
        select: 'name_en name_kh gender position'
    })

    return res.status(200).json({ message: 'Staff member removed from event successfully!', data: updatedEvent })
})


