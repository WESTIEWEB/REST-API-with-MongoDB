"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const authorization_1 = require("../middleware/authorization");
const router = express_1.default.Router();
router.post('/register', users_1.Register);
router.post('/login', users_1.Login);
router.post('/verify-user/:signature', users_1.verifyUser),
    router.get('/resend-otp', users_1.resendOTP);
router.get('/get-user', authorization_1.auth, users_1.getUser);
router.get('/get-users', authorization_1.auth, users_1.getAllUser);
router.patch('/update-user', authorization_1.auth, users_1.updateUserProfile);
router.delete('/delete-user', authorization_1.auth, users_1.deleteProfile);
exports.default = router;
//# sourceMappingURL=users.js.map