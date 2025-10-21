import { User } from "../models/user.model.js"
import asyncHandler from 'express-async-handler'

export const getAllUser = asyncHandler(async (req, res) => {
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
            { name: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    let filterUsers = await User.paginate(filter, options)
    return res.status(200).json(filterUsers)
})

export const getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id)
    if (!user) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(user)
})

export const deleteUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id
    const result = await User.deleteOne({ _id: userId })
    return res.json({ message: result })
})

export const updateUesrById = asyncHandler(async (req, res) => {
    const userId = req.params.id
    const result = await User.updateOne({ _id: userId }, req.body)
    return res.status(200).json({ message: 'updated', data: result })
})

export const createUser = asyncHandler(async (req, res) => {
    const user = new User(req.body)
    await user.save()
    return res.status(201).json(user)
})
