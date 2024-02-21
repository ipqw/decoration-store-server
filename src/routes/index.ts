import express from 'express';
import { userRouter } from './userRouter';
import { addressRouter } from './addressRouter';
import { orderRouter } from './orderRouter';

export const router = express();

router.use('/user', userRouter);
router.use('/address', addressRouter);
router.use('/order', orderRouter);
