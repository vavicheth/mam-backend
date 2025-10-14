import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
    },
    allow_guest: {
        type: Boolean,
        default: false
    },
    event_link: {
        type: String,
        required: true
    },
    qr_code: {
        type: String,
        required: true
    },
    event_staff:[{
        staff:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
        },
        is_joined:{
            type: Boolean,
            default: false
        }
    }],

}, {
    timestamps: true
})
eventSchema.plugin(mongoosePaginate)

export const Event = mongoose.model('Event', eventSchema)
