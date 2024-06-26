import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Product, ProductInfo, WishlistProduct } from '../database/models';

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
            } else {
                const wishlistProduct = await WishlistProduct.create({
                    productId,
                    wishlistId,
                });
                return res.json(wishlistProduct);
            }
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
            const { wishlistId } = req.query;
            if (wishlistId) {
                const wishlistProducts = await WishlistProduct.findAll({
                    where: {
                        wishlistId: Number(wishlistId),
                    },
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            include: [
                                { model: ProductInfo, as: 'product_infos' },
                            ],
                        },
                    ],
                });
                return res.json(wishlistProducts);
            }
            const wishlistProducts = await WishlistProduct.findAll();
            return res.json(wishlistProducts);
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
            const { productId, wishlistId } = req.body;
            const wishlistProduct = await WishlistProduct.findOne({
                where: { productId, wishlistId },
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

    deleteWishlistProductById = async (
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
