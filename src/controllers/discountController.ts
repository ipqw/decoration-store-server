import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Discount, Product } from '../database/models';

class discountController {
    createDiscount = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { percent, startsIn, expiresIn, productId } = req.body;
            if (Date.now() > expiresIn) {
                next(ApiError.badRequest('expiresIn is incorrect'));
            }
            const product = await Product.findOne({
                where: { id: productId },
                include: [{ model: Discount, as: 'discount' }],
            });
            if (product?.discount) {
                await product.discount.destroy();
                product.set({ discountPrice: null });
            }
            const discount = await Discount.create({
                startsIn,
                expiresIn,
                percent,
                productId,
            });
            if (startsIn <= Date.now() && expiresIn > Date.now()) {
                product?.set({
                    discountPrice: Math.ceil(
                        product.price - (product.price / 100) * percent,
                    ),
                });
                await product?.save();
            }
            return res.json(discount);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllDiscounts = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const discounts = await Discount.findAll();
            discounts.forEach(async (el) => {
                if (Date.now() > el.expiresIn) {
                    await el.destroy();
                }
            });
            return res.json(discounts);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneDiscount = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const discount = await Discount.findOne({
                where: { id },
            });
            if (discount?.expiresIn && Date.now() > discount?.expiresIn) {
                const product = await Product.findOne({
                    where: { id: discount.productId },
                });
                product?.set({ discountPrice: null });
                await discount.destroy();
                await product?.save();
                next(ApiError.badRequest('Discount has expired'));
            }
            return res.json(discount);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteDiscount = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const discount = await Discount.findOne({
                where: { id },
            });
            if (discount) {
                const product = await Product.findOne({
                    where: { id: discount.productId },
                });
                product?.set({ discountPrice: null });
                await discount.destroy();
                await product?.save();
                return res.json({ message: 'Discount was deleted' });
            } else {
                next(ApiError.badRequest('Discount was not found'));
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
export default new discountController();
