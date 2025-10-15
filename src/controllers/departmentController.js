import asyncHandler from 'express-async-handler'
import {Department} from "../models/department.model.js";

export const getAllDepartment = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const search = req.query.search || ''
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder || 'desc'

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const options = {
        page,
        limit,
        sort
    };

    // Build search filter
    const filter = {};
    if (search) {
        filter.$or = [
            { name_kh: { $regex: search, $options: 'i' } },
            { name_en: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    let filterDepartments = await Department.paginate(filter, options)
    return res.status(200).json(filterDepartments)
})

export const getDepartmentById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const department = await Department.findById(id)
    if (!department) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(department)
})

export const deleteDepartmentById = asyncHandler(async (req, res) => {
    const departmentId = req.params.id
    const result = await Department.deleteOne({ _id: departmentId })
    return res.json({ message: result })
})

export const updateDepartmentById = asyncHandler(async (req, res) => {
    const departmentId = req.params.id
    const result = await Department.updateOne({ _id: departmentId }, req.body)
    return res.status(200).json({ message: 'updated', data: result })
})

export const createDepartment = asyncHandler(async (req, res) => {
    const department = new Department(req.body)
    await department.save()
    return res.status(201).json(department)
})
