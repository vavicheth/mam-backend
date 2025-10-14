import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const departmentSchema = new mongoose.Schema({
    name_kh: {
        type: String,
        required: true
    },
    name_en: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    },
    staffs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "staff",
    }]

}, {
    timestamps: true
})
departmentSchema.plugin(mongoosePaginate)

export const Department = mongoose.model('Department', departmentSchema);
