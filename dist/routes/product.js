"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = require("../controllers/products");
const authorization_1 = require("../middleware/authorization");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.post('/create-product', authorization_1.auth, multer_1.upload.single("image"), products_1.createProduct);
router.get('/get-products', products_1.getAllProducts);
router.get('/get-product/:productId', authorization_1.auth, products_1.getProduct);
router.patch('/update-product/:id', authorization_1.auth, products_1.updateProduct);
router.delete('/delete-product/:id', authorization_1.auth, products_1.deleteProduct);
router.post('/rate-product/:id', authorization_1.auth, products_1.rateProduct);
exports.default = router;
//# sourceMappingURL=product.js.map