import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Rating } from '../database/models';

class ratingController {
    createRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { rate, text, userId, productId } = req.body;
            const rating = await Rating.create({
                rate,
                text,
                userId,
                productId,
            });
            return res.json(rating);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllRatings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ratings = await Rating.findAll();
            return res.json(ratings);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const rating = await Rating.findOne({
                where: { id },
            });
            return res.json(rating);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    updateRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { rate, text } = req.body;
            const rating = await Rating.findOne({
                where: { id },
            });
            rating?.set({
                rate,
                text,
            });
            await rating?.save();
            return res.json(rating);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const rating = await Rating.findOne({ where: { id } });
            if (rating) {
                await rating.destroy();
                return res.json({ message: 'Rating was deleted' });
            } else {
                next(ApiError.badRequest('Rating was not found'));
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
export default new ratingController();
