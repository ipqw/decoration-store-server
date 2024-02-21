import { NextFunction, Request, Response } from 'express';
import { Address } from '../database/models';
import ApiError from '../error/apiError';

class addressController {
    createAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                name,
                recipientName,
                phoneNumber,
                country,
                city,
                zipcode,
                street,
                houseNumber,
                userId,
            } = req.body;
            if (!userId) {
                next(ApiError.badRequest('userId is required'));
            }
            const address = await Address.create({
                name,
                recipientName,
                phoneNumber,
                country,
                city,
                zipcode,
                street,
                houseNumber,
                userId,
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
            const {
                name,
                recipientName,
                phoneNumber,
                country,
                city,
                zipcode,
                street,
                houseNumber,
            } = req.body;
            const address = await Address.findOne({ where: { id } });
            address?.set({
                name: name ? name : address.name,
                recipientName: recipientName ? recipientName : address.name,
                phoneNumber: phoneNumber ? phoneNumber : address.phoneNumber,
                country: country ? country : address.country,
                city: city ? city : address.city,
                zipcode: zipcode ? zipcode : address.zipcode,
                street: street ? street : address.street,
                houseNumber: houseNumber ? houseNumber : address.houseNumber,
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
