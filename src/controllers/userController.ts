import { NextFunction, Request, Response } from 'express';
import { Cart, User } from '../database/models';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import streamifier from 'streamifier';
import bcrypt from 'bcryptjs';
import ApiError from '../error/apiError';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const generateJWT = (id: number, email: string, role: string) => {
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY || '', {
        expiresIn: '12h',
    });
};

class userController {
    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const streamUpload = (req: Request) => {
                const img = req.files?.img || { data: '' };
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        },
                    );
                    streamifier
                        .createReadStream(
                            Array.isArray(img) ? img[0]?.data : img?.data,
                        )
                        .pipe(stream);
                });
            };

            async function upload(req: Request) {
                try {
                    const {
                        email,
                        password,
                        firstName,
                        lastName,
                        displayName,
                        role,
                    } = req.body;

                    const hashPassword = await bcrypt.hash(password, 10);
                    const user = await User.create({
                        email,
                        password: hashPassword,
                        firstName,
                        lastName,
                        displayName,
                        role,
                    });
                    const cart = await Cart.create({ userId: user.id });
                    if (req.files) {
                        const result: any = await streamUpload(req).catch(
                            (err) => next(ApiError.internal(err)),
                        );
                        user.set({ imageUrl: result.url });
                        user.save();
                    }
                    const token = generateJWT(user.id, user.email, user.role);

                    return res.json({ token, userId: user.id });
                } catch (error) {
                    if (error instanceof Error) {
                        next(ApiError.badRequest(error.message));
                    } else {
                        next(ApiError.internal('Something went wrong'));
                    }
                }
            }
            upload(req);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id } });
            return res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const streamUpload = (req: Request) => {
                const img = req.files?.img || { data: '' };
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        },
                    );
                    streamifier
                        .createReadStream(
                            Array.isArray(img) ? img[0]?.data : img?.data,
                        )
                        .pipe(stream);
                });
            };

            async function upload(req: Request) {
                try {
                    const { id } = req.params;
                    const {
                        email,
                        password,
                        firstName,
                        lastName,
                        displayName,
                    } = req.body;
                    const user = await User.findOne({
                        where: { id },
                    });
                    let result: any = user?.imageUrl;
                    if (req.files?.img) {
                        result = await streamUpload(req).catch((err) =>
                            next(ApiError.internal(err)),
                        );
                    }
                    const hashPassword = password
                        ? await bcrypt.hash(password, 10)
                        : user?.password;
                    user?.set({
                        email: email || user.email,
                        password: hashPassword,
                        firstName: firstName || user.firstName,
                        lastName: lastName || user.lastName,
                        displayName: displayName || user.displayName,
                        imageUrl: result.url,
                    });
                    await user?.save();
                    return res.json(user);
                } catch (error) {
                    if (error instanceof Error) {
                        next(ApiError.badRequest(error.message));
                    } else {
                        next(ApiError.internal('Something went wrong'));
                    }
                }
            }
            upload(req);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id } });

            if (user) {
                await user.destroy();
                return res.json({ message: 'User was deleted' });
            } else {
                next(ApiError.badRequest('User was not found'));
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
export default new userController();
