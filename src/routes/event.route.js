import express from 'express';
import {
    createEvent,
    deleteEventById,
    getAllEvent,
    getEventById, updateEventById, updateEventStaff, updateEventStaffJoin, deleteEventStaff, toggleEventStaffJoin
} from "../controllers/eventController.js";
import {generateQRCode, generateQRCodeImage} from "../controllers/qrcodeController.js";
// import {deleteUserById} from "../controllers/userController.js";
// import { createUser, deleteUserById, getAllUser, getUserById, updateUesrById } from '../controllers/userController.js';
// import { handleValidation } from '../middlewares/index.js';
// import { createUserValidator } from '../validators/user.validator.js';
const eventRoute = express.Router();

eventRoute.get('/', getAllEvent)
eventRoute.get('/:id', getEventById)
eventRoute.delete('/:id', deleteEventById)
eventRoute.post('/',
    // createUserValidator,
    // handleValxidation,
    createEvent
)
eventRoute.patch('/:id', updateEventById)
eventRoute.patch('/staff/:id', updateEventStaff)
eventRoute.get('/:id/event_staff/:es_id', updateEventStaffJoin)
eventRoute.get('/:id/event_staff/:es_id/toggle', toggleEventStaffJoin)
eventRoute.delete('/:id/event_staff/:es_id', deleteEventStaff)

eventRoute.post('/get_qrcode', generateQRCodeImage)

export default eventRoute;