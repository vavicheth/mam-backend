import express from 'express';
import {
    createStaff,
    deleteStaffById,
    getAllStaff,
    getStaffById,
    getStudentsByIds,
    updateStaffById
} from "../controllers/staffController.js";

const staffRoute = express.Router();

staffRoute.get('/', getAllStaff)
staffRoute.get('/:id', getStaffById)
staffRoute.delete('/:id', deleteStaffById)
staffRoute.post('/staffs', getStudentsByIds)
staffRoute.post('/',
    // createUserValidator,
    // handleValxidation,
    createStaff
)
staffRoute.patch('/:id', updateStaffById)

export default staffRoute;