import express from 'express';
import {
    createDepartment,
    deleteDepartmentById,
    getAllDepartment,
    getDepartmentById, updateDepartmentById
} from "../controllers/departmentController.js";
// import {deleteUserById} from "../controllers/userController.js";
// import { createUser, deleteUserById, getAllUser, getUserById, updateUesrById } from '../controllers/userController.js';
// import { handleValidation } from '../middlewares/index.js';
// import { createUserValidator } from '../validators/user.validator.js';
const departmentRoute = express.Router();

departmentRoute.get('/', getAllDepartment)
departmentRoute.get('/:id', getDepartmentById)
departmentRoute.delete('/:id', deleteDepartmentById)
departmentRoute.post('/',
    // createUserValidator,
    // handleValxidation,
    createDepartment
)
departmentRoute.patch('/:id', updateDepartmentById)

export default departmentRoute;