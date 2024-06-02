import { NextFunction, Request, Response } from 'express';
import { Order, OrderProduct, OrderRecipient } from '../database/models';
import ApiError from '../error/apiError';
import { OrderProductModel } from '../types/sequelizeTypes';

class orderController {
    createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                status,
                price,
                addressId,
                paymentMethod,
                userId,
                products,
                firstName,
                lastName,
                phoneNumber,
                email,
            } = req.body;
            if (
                status &&
                price &&
                addressId &&
                paymentMethod &&
                userId &&
                products &&
                firstName &&
                lastName &&
                phoneNumber &&
                email
            ) {
                const order = await Order.create({
                    status,
                    price,
                    addressId,
                    userId,
                    paymentMethod,
                });

                const orderRecipient = await OrderRecipient.create({
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    orderId: order.id,
                });

                const parsedProducts = JSON.parse(products);
                await parsedProducts.forEach(async (e: OrderProductModel) => {
                    try {
                        await OrderProduct.create({
                            orderId: order.id,
                            productId: e.productId,
                        });
                    } catch (error) {
                        order.order_products?.forEach(async (el) => {
                            await el.destroy();
                        });
                        await order.destroy();
                        if (error instanceof Error) {
                            next(ApiError.badRequest(error.message));
                        } else {
                            next(ApiError.internal('Something went wrong'));
                        }
                    }
                });
                return res.json(order);
            } else {
                return res.json('Fields aren`t filled');
            }
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
            const order = await Order.findOne({
                where: { id },
                include: [
                    { model: OrderProduct, as: 'order_products' },
                    { model: OrderRecipient, as: 'order_recipient' },
                ],
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
            await order?.save();
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
            const order = await Order.findOne({
                where: { id },
                include: [{ model: OrderProduct, as: 'order_products' }],
            });
            if (order) {
                order.order_products?.forEach(async (el) => {
                    await el.destroy();
                });
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
