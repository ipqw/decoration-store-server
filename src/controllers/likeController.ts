import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';
import { Like } from '../database/models';

class likeController {
    createLike = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, reviewId } = req.body;
            const like = await Like.create({
                userId,
                reviewId,
            });
            return res.json(like);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllLikes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, reviewId } = req.query;
            if (userId && reviewId) {
                const like = await Like.findOne({
                    where: {
                        userId: Number(userId),
                        reviewId: Number(reviewId),
                    },
                });
                return res.json(like);
            }
            const likes = await Like.findAll();
            return res.json(likes);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneLike = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const like = await Like.findOne({
                where: { id },
            });
            return res.json(like);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteLike = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const like = await Like.findOne({ where: { id } });
            if (like) {
                await like.destroy();
                return res.json({ message: 'Like was removed' });
            } else {
                next(ApiError.badRequest('Like was not found'));
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
export default new likeController();
