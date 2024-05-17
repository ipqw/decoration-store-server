import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { CartProduct, Product } from '../database/models';
import { CartProductModel } from '../types/sequelizeTypes';

class cartProductController {
    createCartProduct = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { productId, cartId, amount } = req.body;
            if (amount) {
                const cartProducts: CartProductModel[] = [];
                for (let i = 0; i < amount; i++) {
                    const cartProduct = await CartProduct.create({
                        productId,
                        cartId,
                    });
                    cartProducts.push(cartProduct);
                }
                return res.json(cartProducts);
            } else {
                const cartProduct = await CartProduct.create({
                    productId,
                    cartId,
                });
                return res.json(cartProduct);
            }
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllCartProducts = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { cartId } = req.query;
            if (cartId) {
                const cartProducts = await CartProduct.findAll({
                    where: {
                        cartId: Number(cartId),
                    },
                });
                return res.json(cartProducts);
            }
            const cartProducts = await CartProduct.findAll();
            return res.json(cartProducts);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneCartProduct = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const cartProduct = await CartProduct.findOne({
                where: { id },
                include: [{ model: Product, as: 'product' }],
            });
            return res.json(cartProduct);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteCartProduct = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { productId, cartId } = req.body;
            const cartProduct = await CartProduct.findOne({
                where: { productId, cartId },
            });
            if (cartProduct) {
                await cartProduct.destroy();
                return res.json({ message: 'CartProduct was deleted' });
            } else {
                next(ApiError.badRequest('CartProduct was not found'));
            }
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteCartProductById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const cartProduct = await CartProduct.findOne({ where: { id } });
            if (cartProduct) {
                await cartProduct.destroy();
                return res.json({ message: 'CartProduct was deleted' });
            } else {
                next(ApiError.badRequest('CartProduct was not found'));
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
export default new cartProductController();
