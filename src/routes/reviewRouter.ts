import express from 'express';
import reviewController from '../controllers/reviewController';

export const reviewRouter = express();

reviewRouter.get('/', reviewController.getAllReviews);
reviewRouter.get('/:id', reviewController.getOneReview);
reviewRouter.post('/', reviewController.createReview);
reviewRouter.put('/:id', reviewController.updateReview);
reviewRouter.delete('/:id', reviewController.deleteReview);
