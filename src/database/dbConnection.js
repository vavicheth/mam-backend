import mongoose from "mongoose";

const dbName = (process.env.DB_NAME || "mam");
const mongoURI = (process.env.MONGODB_URI || 'mongodb://localhost:27017');

export async function dbConnect() {
    mongoose.connection.on('connected', () => {
        console.log('Connected: ', dbName);
    })
    await mongoose.connect(mongoURI, {
        dbName
    })
}