import express from "express";
import {Register, Login, verifyUser, resendOTP, getUser, getAllUser, updateUserProfile, deleteProfile} from '../controllers/users';
import { auth } from '../middleware/authorization'

const router = express.Router()

router.post('/register', Register);
router.post('/login', Login);
router.post('/verify-user/:signature', verifyUser),
router.get('/resend-otp', resendOTP);
router.get('/get-user', auth,getUser);
router.get('/get-users', auth, getAllUser);
router.patch('/update-user', auth, updateUserProfile);
router.delete('/delete-user', auth, deleteProfile);

export default router;