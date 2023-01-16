"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const router = express_1.default.Router();
router.post('/create-super-admin', admin_1.createSuperAdmin);
router.post('/create-admin', admin_1.createAdmin);
exports.default = router;
//# sourceMappingURL=admin.js.map