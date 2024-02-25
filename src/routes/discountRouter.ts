import express from 'express';
import discountController from '../controllers/discountController';

export const discountRouter = express();

discountRouter.get('/', discountController.getAllDiscounts);
discountRouter.get('/:id', discountController.getOneDiscount);
discountRouter.post('/', discountController.createDiscount);
discountRouter.delete('/:id', discountController.deleteDiscount);
