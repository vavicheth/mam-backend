import asyncHandler from 'express-async-handler'
import {Department} from "../models/department.model.js";

export const getAllDepartment = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const options = {
        page,
        limit,
    };
    let filterDepartments = await Department.paginate({}, options)
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
