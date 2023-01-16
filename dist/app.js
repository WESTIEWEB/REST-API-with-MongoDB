"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const admin_1 = __importDefault(require("./routes/admin"));
const users_1 = __importDefault(require("./routes/users"));
const product_1 = __importDefault(require("./routes/product"));
// import { DB_URI } from './config'; './config'
dotenv_1.default.config();
const DB_URI = process.env.DB_URI;
console.log(DB_URI);
const port = process.env.PORT;
const app = (0, express_1.default)();
try {
    (0, db_1.connectDB)(DB_URI);
}
catch (err) {
    console.log("Failed to establish connection with MongoDB");
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.get('/', (req, res, next) => {
    res.send('i am connected');
    next();
});
app.use('/api/admins', admin_1.default);
app.use('/api/users', users_1.default);
app.use('/api/products', product_1.default);
app.listen(port, () => {
    console.log(`app is listenning on 127.0.0.1:${port}`);
});
//# sourceMappingURL=app.js.map