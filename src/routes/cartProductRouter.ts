import express from 'express';
import cartProductController from '../controllers/cartProductController';

export const cartProductRouter = express();

cartProductRouter.get('/', cartProductController.getAllCartProducts);
cartProductRouter.get('/:id', cartProductController.getOneCartProduct);
cartProductRouter.post('/', cartProductController.createCartProduct);
cartProductRouter.delete('/:id', cartProductController.deleteCartProduct);
