import { NextFunction, Request, Response } from 'express';
import { OrderProduct } from '../database/models';
import ApiError from '../error/apiError';

class orderProductController {
    createOrderProduct = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { productId } = req.body;
            if (!productId) {
                next(ApiError.badRequest('productId is required'));
            }
            const orderProduct = await OrderProduct.create({
                productId,
            });
            return res.json(orderProduct);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllOrderProducts = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const orderProducts = await OrderProduct.findAll();
            return res.json(orderProducts);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneOrderProduct = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const orderProduct = await OrderProduct.findOne({ where: { id } });
            return res.json(orderProduct);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteOrderProduct = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const orderProduct = await OrderProduct.findOne({ where: { id } });
            if (orderProduct) {
                await orderProduct.destroy();
                return res.json({ message: 'Order`s product was deleted' });
            } else {
                next(ApiError.badRequest('Order`s product was not found'));
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
export default new orderProductController();
