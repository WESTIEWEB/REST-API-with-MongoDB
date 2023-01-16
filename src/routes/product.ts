import express from 'express';
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, rateProduct } from '../controllers/products';
import {auth} from '../middleware/authorization';
import { upload } from '../utils/multer'

const router = express.Router()

router.post('/create-product',auth, upload.single("image"), createProduct);
router.get('/get-products', getAllProducts);
router.get('/get-product/:productId',auth, getProduct);
router.patch('/update-product/:id', auth, updateProduct);
router.delete('/delete-product/:id', auth, deleteProduct);
router.post('/rate-product/:id', auth, rateProduct);

export default router;