import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Review } from '../database/models';

class reviewController {
    createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { rate, text, userId, productId } = req.body;
            const review = await Review.create({
                rate,
                text,
                userId,
                productId,
            });
            return res.json(review);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reviews = await Review.findAll();
            return res.json(reviews);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const review = await Review.findOne({
                where: { id },
            });
            return res.json(review);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    updateReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { rate, text } = req.body;
            const review = await Review.findOne({
                where: { id },
            });
            review?.set({
                rate,
                text,
            });
            await review?.save();
            return res.json(review);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const review = await Review.findOne({ where: { id } });
            if (review) {
                await review.destroy();
                return res.json({ message: 'Review was deleted' });
            } else {
                next(ApiError.badRequest('Review was not found'));
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
export default new reviewController();
