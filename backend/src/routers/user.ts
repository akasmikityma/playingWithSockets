import express from 'express'
import { getme, getRoom, getRooms, getUsers, logIn, signUp } from '../controllers/user';
const userRouter=express.Router();

userRouter.post('/signup',signUp);
userRouter.post('/login',logIn);
userRouter.get('/',getUsers)
userRouter.get('/getme',getme)
userRouter.get('/getRooms',getRooms)
userRouter.get('/room/:id',getRoom);
export default userRouter