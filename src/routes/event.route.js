import express from 'express';
import {
    createEvent,
    deleteEventById,
    getAllEvent,
    getEventById, updateEventById
} from "../controllers/eventController.js";
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

export default eventRoute;