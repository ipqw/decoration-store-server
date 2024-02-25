import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Product, WishlistProduct } from '../database/models';

class cartWishlistController {
    createWishlistProduct = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { productId, wishlistId } = req.body;
            const existedWishlistProduct = await WishlistProduct.findOne({
                where: { wishlistId, productId },
            });
            if (existedWishlistProduct) {
                next(
                    ApiError.badRequest(
                        'Product already added to the wishlist',
                    ),
                );
            }
            const wishlistProduct = await WishlistProduct.create({
                productId,
                wishlistId,
            });
            return res.json(wishlistProduct);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllWishlistProducts = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const wishlistProduct = await WishlistProduct.findAll();
            return res.json(wishlistProduct);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneWishlistProduct = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const wishlistProduct = await WishlistProduct.findOne({
                where: { id },
                include: [{ model: Product, as: 'product' }],
            });
            return res.json(wishlistProduct);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteWishlistProduct = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const wishlistProduct = await WishlistProduct.findOne({
                where: { id },
            });
            if (wishlistProduct) {
                await wishlistProduct.destroy();
                return res.json({ message: 'WishlistProduct was deleted' });
            } else {
                next(ApiError.badRequest('WishlistProduct was not found'));
            }
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
}
export default new cartWishlistController();
