import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const staffSchema = new mongoose.Schema({
    name_kh: {
        type: String,
        required: true
    },
    name_en: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    },
    department:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "department",
    }

}, {
    timestamps: true
})
staffSchema.plugin(mongoosePaginate)

export const Staff = mongoose.model('Staff', staffSchema)
