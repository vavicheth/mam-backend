import asyncHandler from 'express-async-handler'
import {Staff} from "../models/staff.model.js";
import mongoose from "mongoose";

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

// Get students by array of IDs
export const getStudentsByIds = async (req, res) => {
    try {
        // Get student IDs from request body
        const { ids } = req.body;

        // Validate input
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of staff IDs'
            });
        }

        // Validate that all IDs are valid MongoDB ObjectIds
        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid staff IDs provided'
            });
        }

        // Find students with IDs in the array
        const staffs = await Staff.find({
            _id: { $in: validIds }
        });

        // Check if students found
        if (staffs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No students found with provided IDs'
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            count: staffs.length,
            data: staffs
        });

    } catch (error) {
        console.error('Error fetching staff:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

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
