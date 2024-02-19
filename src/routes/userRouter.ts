import express from 'express';
import userController from '../controllers/userController';

export const userRouter = express();

userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.getOne);
userRouter.post('/', userController.create);
userRouter.put('/:id', userController.update);
