import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken'

export const login = asyncHandler(async (req, res) => {
    // return res.status(200).send({});
    // const { username, password } = req.body
    // const user = await User.findOne({ username: username })

    const { identifier, password } = req.body;

    console.log("I am logged in");
    console.log(identifier);

    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });
    if (!user) {
        return res.json({ message: "User not found!" })
    }
    const isMatched = bcrypt.compare(password, user.password)
    if (!isMatched) {
        return res.json({ message: "Username or Password Incorrect!" })
    }
    // JWT
    const payload = {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
    }
    const token = jwt.sign(
        payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    })


    return res.json({ token: token, user: payload })

    // return res.status(400).json({ message: 'Invalid credential' })
})

export const signUp = asyncHandler(async (req, res) => {
    const { name, username, role, age, email, password } = req.body
    const encrypedPassword = bcrypt.hashSync(password, 10)
    const user = new User({
        name,
        username,
        age,
        role,
        email,
        password: encrypedPassword
    })
    await user.save()
    return res.json(user)
})