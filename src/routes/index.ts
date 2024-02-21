import express from 'express';
import { userRouter } from './userRouter';
import { addressRouter } from './addressRouter';

export const router = express();

router.use('/user', userRouter);
router.use('/address', addressRouter);
