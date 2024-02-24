import express from 'express';
import typeController from '../controllers/typeController';

export const typeRouter = express();

typeRouter.get('/', typeController.getAllTypes);
typeRouter.get('/:id', typeController.getOneType);
typeRouter.post('/', typeController.createType);
typeRouter.delete('/:id', typeController.deleteType);
