import express from 'express';
import {createSuperAdmin, createAdmin} from '../controllers/admin'
const router = express.Router()

router.post('/create-super-admin', createSuperAdmin);
router.post('/create-admin', createAdmin)

export default router;