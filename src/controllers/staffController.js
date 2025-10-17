import asyncHandler from 'express-async-handler'
import {Staff} from "../models/staff.model.js";

export const getAllStaff = asyncHandler(async (req, res) => {
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
            { name_kh: { $regex: search, $options: 'i' } },
            { name_en: { $regex: search, $options: 'i' } },
            { gender: { $regex: search, $options: 'i' } },
            { position: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    let filterStaff = await Staff.paginate(filter, options)
    return res.status(200).json(filterStaff)
})

export const getStaffById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const staff = await Staff.findById(id)
    if (!staff) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(staff)
})

export const deleteStaffById = asyncHandler(async (req, res) => {
    const staffId = req.params.id
    const result = await Staff.deleteOne({ _id: staffId })
    return res.json({ message: result })
})

export const updateStaffById = asyncHandler(async (req, res) => {
    const staffId = req.params.id
    const result = await Staff.updateOne({ _id: staffId }, req.body)
    return res.status(200).json({ message: 'updated', data: result })
})

export const createStaff = asyncHandler(async (req, res) => {
    const staff = new Staff(req.body)
    await staff.save()
    return res.status(201).json(staff)
})
