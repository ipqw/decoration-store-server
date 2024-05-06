import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { ProductInfo } from '../database/models';

class productInfoController {
    createProductInfo = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { productId, name, text } = req.body;
            const productInfo = await ProductInfo.create({
                productId,
                name,
                text,
            });
            return res.json(productInfo);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    updateProductInfo = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const { name, text } = req.body;
            const productInfo = await ProductInfo.findOne({
                where: { id },
            });
            productInfo?.set({ name, text });
            await productInfo?.save();
            return res.json(productInfo);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteProductInfo = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const productInfo = await ProductInfo.findOne({
                where: { id },
            });
            if (productInfo) {
                await productInfo.destroy();
                return res.json({ message: 'ProductInfo was deleted' });
            } else {
                next(ApiError.badRequest('ProductInfo was not found'));
            }
            return res.json(productInfo);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
}
export default new productInfoController();
