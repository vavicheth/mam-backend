import asyncHandler from "express-async-handler";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const authenticate = asyncHandler(async (req, res, next) => {
    // Verify JWT
    // Bearer TOKEN
    if (!req.headers.authorization) {
        return res.status(400).json({ message: "No token provided" })
    }
    const token = req.headers.authorization.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload._id)
    req.user = user
    next()
})