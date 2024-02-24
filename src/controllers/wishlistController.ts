import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Wishlist, WishlistProduct } from '../database/models';

class wishlistController {
    getAllWishlists = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const wishlists = await Wishlist.findAll();
            return res.json(wishlists);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneWishlist = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const wishlist = await Wishlist.findOne({
                where: { id },
                include: [{ model: WishlistProduct, as: 'wishlist_products' }],
            });
            return res.json(wishlist);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
}
export default new wishlistController();
