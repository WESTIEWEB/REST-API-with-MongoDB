import express, {Request, Response, NextFunction} from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import {connectDB} from './db'
import adminRouter from './routes/admin';
import userRouter from './routes/users';
import productRouter from './routes/product'
// import { DB_URI } from './config'; './config'

dotenv.config();

const DB_URI = process.env.DB_URI as string

console.log(DB_URI)
const port = process.env.PORT!;
const app = express();

try{
    connectDB(DB_URI)

}catch(err){
    console.log("Failed to establish connection with MongoDB");
}

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(logger('dev'));

app.get('/', (req:Request,res:Response, next:NextFunction)=> {
    res.send('i am connected');
    next();
})

app.use('/api/admins',adminRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter)


app.listen(port ,()=> {
    console.log(`app is listenning on 127.0.0.1:${port}`)
})