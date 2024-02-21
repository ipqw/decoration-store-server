import express from 'express';
import productController from '../controllers/productController';

export const productRouter = express();

productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getOneProduct);
productRouter.post('/', productController.createProduct);
productRouter.put('/:id', productController.updateProduct);
productRouter.delete('/:id', productController.deleteProduct);
