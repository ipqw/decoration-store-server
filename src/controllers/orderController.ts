import { NextFunction, Request, Response } from 'express';
import { Order } from '../database/models';
import ApiError from '../error/apiError';

class orderController {
    createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { status, price, addressId, paymentMethod, userId } =
                req.body;
            if (!addressId) {
                next(ApiError.badRequest('addressId is required'));
            }
            if (!userId) {
                next(ApiError.badRequest('userId is required'));
            }
            const order = await Order.create({
                status,
                price,
                addressId,
                userId,
                paymentMethod,
            });
            return res.json(order);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orders = await Order.findAll();
            return res.json(orders);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const order = await Order.findOne({ where: { id } });
            return res.json(order);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    updateOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status, price, addressId, paymentMethod } = req.body;
            const order = await Order.findOne({ where: { id } });
            order?.set({
                status: status ? status : order.status,
                price: price ? price : order.price,
                addressId: addressId ? addressId : order.addressId,
                paymentMethod: paymentMethod
                    ? paymentMethod
                    : order.paymentMethod,
            });
            return res.json(order);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const order = await Order.findOne({ where: { id } });
            if (order) {
                await order.destroy();
                return res.json({ message: 'Order was deleted' });
            } else {
                next(ApiError.badRequest('Order was not found'));
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
export default new orderController();
