import express from 'express';
import ratingController from '../controllers/ratingController';

export const ratingRouter = express();

ratingRouter.get('/', ratingController.getAllRatings);
ratingRouter.get('/:id', ratingController.getOneRating);
ratingRouter.post('/', ratingController.createRating);
ratingRouter.put('/:id', ratingController.updateRating);
ratingRouter.delete('/:id', ratingController.deleteRating);
