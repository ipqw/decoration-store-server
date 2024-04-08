import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Product, ProductColorsGroup } from '../database/models';

class productGroupController {
    getAllProductGroups = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const productGroups = await ProductColorsGroup.findAll();
            return res.json(productGroups);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneProductGroup = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const productGroup = await ProductColorsGroup.findOne({
                where: { id },
                include: [{ model: Product, as: 'products' }],
            });
            return res.json(productGroup);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
}
export default new productGroupController();
