import { NextFunction, Request, Response } from 'express';
import { Address, Order } from '../database/models';
import ApiError from '../error/apiError';

class addressController {
    getAllAddresses = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const addresses = await Address.findAll();
            return res.json(addresses);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const address = await Address.findOne({
                where: { id: Number(id) },
                include: [{ model: Order, as: 'orders' }],
            });
            return res.json(address);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    updateAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { name, country, city, zipcode, street, state } = req.body;
            const address = await Address.findOne({ where: { id } });
            address?.set({
                name: name ? name : address.name,
                country: country ? country : address.country,
                city: city ? city : address.city,
                zipcode: zipcode ? zipcode : address.zipcode,
                streetAddress: street ? street : address.streetAddress,
                state: state ? state : address.state,
            });
            address?.save();
            return res.json(address);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const address = await Address.findOne({ where: { id } });
            if (address) {
                await address.destroy();
                return res.json({ message: 'Address was deleted' });
            } else {
                next(ApiError.badRequest('Address was not found'));
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
export default new addressController();
