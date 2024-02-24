import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Product, Type } from '../database/models';

class typeController {
    createType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const type = await Type.create({ name });
            return res.json(type);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllTypes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const types = await Type.findAll();
            return res.json(types);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const type = await Type.findOne({
                where: { id },
                include: [{ model: Product, as: 'products' }],
            });
            return res.json(type);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const type = await Type.findOne({ where: { id } });
            if (type) {
                await type.destroy();
                return res.json({ message: 'Type was deleted' });
            } else {
                next(ApiError.badRequest('Type was not found'));
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
export default new typeController();
