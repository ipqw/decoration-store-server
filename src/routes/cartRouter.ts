import express from 'express';
import cartController from '../controllers/cartController';

export const cartRouter = express();

cartRouter.get('/', cartController.getAllCarts);
cartRouter.get('/:id', cartController.getOneCart);
