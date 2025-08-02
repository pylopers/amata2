import express from 'express';
import { loginUser,registerUser,adminLogin, saveAddress, getSavedAddresses,  resetPassword, sendOtp, verifyOtp } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import passport from '../middleware/passport.js';
import { googleFrontEndLogin} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/save-address', authUser, saveAddress);
userRouter.get('/saved-addresses', authUser, getSavedAddresses);
userRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' })
);
userRouter.post("/google", googleFrontEndLogin);
userRouter.post('/forgot-password', sendOtp);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/reset-password', resetPassword);

export default userRouter;