import express from 'express';
import wishlistController from '../controllers/wishlistController';

export const wishlistRouter = express();

wishlistRouter.get('/', wishlistController.getAllWishlists);
wishlistRouter.get('/:id', wishlistController.getOneWishlist);
