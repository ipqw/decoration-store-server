import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Like, ProductGroup, Review } from '../database/models';

class reviewController {
    createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { rate, text, userId, productGroupId } = req.body;
            const existedReview = await Review.findOne({
                where: { userId, productGroupId },
            });
            if (!existedReview) {
                const review = await Review.create({
                    rate,
                    text,
                    userId,
                    productGroupId,
                });
                const productGroup = await ProductGroup.findOne({
                    where: { id: productGroupId },
                    include: { model: Review, as: 'reviews' },
                });
                let sum = 0;
                productGroup?.reviews?.forEach((el) => {
                    sum += el.rate;
                });
                productGroup?.set({
                    averageRate: productGroup?.reviews
                        ? sum / productGroup?.reviews?.length
                        : 0,
                });
                await productGroup?.save();
                return res.json(review);
            } else {
                next(
                    ApiError.badRequest(
                        'Review with this userId and productGroupId already exists',
                    ),
                );
            }
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
            const { productGroupId, limit = 5, userId } = req.query;
            // get review by userID and ProducGroupId
            if (userId && productGroupId) {
                const userReview = await Review.findOne({
                    where: {
                        userId: Number(userId),
                        productGroupId: Number(productGroupId),
                    },
                    include: { model: Like, as: 'likes' },
                });
                return res.json(userReview);
            }
            // default
            if (productGroupId && Number(productGroupId) !== 0) {
                const amount = await Review.count({
                    where: { productGroupId: Number(productGroupId) },
                });
                const reviews = await Review.findAll({
                    include: { model: Like, as: 'likes' },
                    where: { productGroupId: Number(productGroupId) },
                    limit: Number(limit),
                });
                return res.json({ reviews, amount });
            }
            const amount = await Review.count();
            const reviews = await Review.findAll({
                include: { model: Like, as: 'likes' },
                limit: Number(limit),
            });
            return res.json({ reviews, amount });
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
                include: [
                    {
                        model: Like,
                        as: 'likes',
                    },
                ],
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
            const productGroup = await ProductGroup.findOne({
                where: { id: review ? review.productGroupId : 0 },
                include: { model: Review, as: 'reviews' },
            });
            let sum = 0;
            productGroup?.reviews?.forEach((el) => {
                sum += el.rate;
            });
            productGroup?.set({
                averageRate: productGroup?.reviews
                    ? sum / productGroup?.reviews?.length
                    : 0,
            });
            await productGroup?.save();
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
                const productGroup = await ProductGroup.findOne({
                    where: { id: review.productGroupId },
                    include: { model: Review, as: 'reviews' },
                });
                let sum = 0;
                productGroup?.reviews?.forEach((el) => {
                    sum += el.rate;
                });
                productGroup?.set({
                    averageRate: productGroup?.reviews
                        ? sum / productGroup?.reviews?.length
                        : 0,
                });
                await productGroup?.save();
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
