import express from 'express';
import productGroupController from '../controllers/productGroupController';

export const productGroupRouter = express();

productGroupRouter.get('/', productGroupController.getAllProductGroups);
productGroupRouter.get('/:id', productGroupController.getOneProductGroup);
