import express from 'express';
import { loginUser,registerUser,adminLogin, saveAddress, getSavedAddresses } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/save-address', authUser, saveAddress);
userRouter.get('/saved-addresses', authUser, getSavedAddresses);

export default userRouter;