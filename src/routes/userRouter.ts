import express from 'express';
import userController from '../controllers/userController';

export const userRouter = express();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/auth', userController.check);
userRouter.get('/:id', userController.getOneUser);
userRouter.post('/', userController.createUser);
userRouter.post('/login', userController.login);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);
