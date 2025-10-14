import { User } from "../models/user.model.js"
import asyncHandler from 'express-async-handler'

export const getAllUser = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const options = {
        page,
        limit,
    };
    let filterUsers = await User.paginate({}, options)
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
