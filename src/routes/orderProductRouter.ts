import express from 'express';
import orderProductController from '../controllers/orderProductController';
export const orderProductRouter = express();

orderProductRouter.get('/', orderProductController.getAllOrderProducts);
orderProductRouter.get('/:id', orderProductController.getOneOrderProduct);
orderProductRouter.post('/', orderProductController.createOrderProduct);
orderProductRouter.delete('/:id', orderProductController.deleteOrderProduct);
