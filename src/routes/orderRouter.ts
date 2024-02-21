import express from 'express';
import orderController from '../controllers/orderController';
export const orderRouter = express();

orderRouter.get('/', orderController.getAllOrders);
orderRouter.get('/:id', orderController.getOneOrder);
orderRouter.post('/', orderController.createOrder);
orderRouter.put('/:id', orderController.updateOrder);
orderRouter.delete('/:id', orderController.deleteOrder);
