import express from 'express';
import productInfoController from '../controllers/productInfoController';

export const productInfoRouter = express();

productInfoRouter.post('/', productInfoController.createProductInfo);
productInfoRouter.put('/:id', productInfoController.updateProductInfo);
productInfoRouter.delete('/:id', productInfoController.deleteProductInfo);
