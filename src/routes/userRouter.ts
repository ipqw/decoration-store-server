import express from 'express';
import userController from '../controllers/userController';

export const userRouter = express();

userRouter.get('/', userController.getAllUsers);
