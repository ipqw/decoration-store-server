import express from 'express';
import { userRouter } from './userRouter';
import { addressRouter } from './addressRouter';
import { orderRouter } from './orderRouter';
import { orderProductRouter } from './orderProductRouter';
import { productRouter } from './productRouter';
import { cartRouter } from './cartRouter';
import { cartProductRouter } from './cartProductRouter';

export const router = express();

router.use('/user', userRouter);
router.use('/address', addressRouter);
router.use('/order', orderRouter);
router.use('/orderproduct', orderProductRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/cartproduct', cartProductRouter);
