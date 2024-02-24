import express from 'express';
import wishlistProductController from '../controllers/wishlistProductController';

export const wishlistProductRouter = express();

wishlistProductRouter.get(
    '/',
    wishlistProductController.getAllWishlistProducts,
);
wishlistProductRouter.get(
    '/:id',
    wishlistProductController.getOneWishlistProduct,
);
wishlistProductRouter.post(
    '/',
    wishlistProductController.createWishlistProduct,
);
wishlistProductRouter.delete(
    '/:id',
    wishlistProductController.deleteWishlistProduct,
);
