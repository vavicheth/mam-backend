import express from 'express';
import { login, signUp } from '../controllers/authController.js';

const authRoute = express.Router();

authRoute.post('/login', login)
authRoute.post('/sign-up', signUp)

export default authRoute;