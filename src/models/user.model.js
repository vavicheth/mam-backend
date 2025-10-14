import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
       type: String, required: true
    },
    avatar: {
        type: String,
        required: true
    },
    staff:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    }

}, {
    timestamps: true
})
userSchema.plugin(mongoosePaginate)

export const User = mongoose.model('Users', userSchema)
