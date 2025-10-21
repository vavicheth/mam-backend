import express from 'express';
import authRoute from "./routes/auth.route.js";
import cors from "cors";
import dotenv from 'dotenv';
import {dbConnect} from "./database/dbConnection.js";
import bodyParser from "body-parser";
import userRoute from "./routes/user.route.js";
import {authenticate} from "./middlewares/authMiddleware.js";
import departmentRoute from "./routes/department.route.js";
import staffRoute from "./routes/staff.route.js";
import eventRoute from "./routes/event.route.js";

dotenv.config();

const app = express();
const port = (process.env.PORT || 3000) ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

await dbConnect().catch((err) => {
    console.log(err)
})

app.get('/', (req, res) => {
    res.status(200).json({ status: 'Server is running! 🚀', timestamp: new Date().toISOString() });
});

// Auth
app.use('/api/auth',
    // limiter(60 * 60 * 1000, 3), // 1 hour, 3 requests
    authRoute);

app.use('/api/users',
    // limiter(60 * 1000, 30), // 1 minute, 30 requests
    authenticate,
    userRoute);

app.use('/api/departments',
    // limiter(60 * 1000, 30), // 1 minute, 30 requests
    authenticate,
    departmentRoute);

app.use('/api/staff',
    // limiter(60 * 1000, 30), // 1 minute, 30 requests
    authenticate,
    staffRoute);

app.use('/api/events',
    // limiter(60 * 1000, 30), // 1 minute, 30 requests
    authenticate,
    eventRoute);


app.listen(port, () => {
    console.log(`Listening start on port ${port}`);
})

