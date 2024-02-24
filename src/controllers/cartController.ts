import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Cart, CartProduct } from '../database/models';

class cartController {
    getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const carts = await Cart.findAll();
            return res.json(carts);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const cart = await Cart.findOne({
                where: { id },
                include: [{ model: CartProduct, as: 'cart_products' }],
            });
            return res.json(cart);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
}
export default new cartController();
