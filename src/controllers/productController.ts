import { NextFunction, Request, Response } from 'express';
import { Discount, Product, Rating } from '../database/models';
import ApiError from '../error/apiError';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

class productController {
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
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
                    const { name, price, typeId } = req.body;
                    const product = await Product.create({
                        name,
                        price,
                        typeId,
                        averageRate: 0,
                    });
                    if (req.files) {
                        const result: any = await streamUpload(req).catch(
                            (err) => next(ApiError.internal(err)),
                        );
                        product.set({ imageUrl: result.url });
                        await product.save();
                    }
                    return res.json(product);
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
    getAllProducts = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const products = await Product.findAll();
            return res.json(products);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    getOneProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const product = await Product.findOne({
                where: { id },
                include: [
                    { model: Discount, as: 'discounts' },
                    { model: Rating, as: 'ratings' },
                ],
            });
            return res.json(product);
        } catch (error) {
            if (error instanceof Error) {
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.internal('Something went wrong'));
            }
        }
    };
    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
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
                    const { name, price } = req.body;

                    const product = await Product.findOne({
                        where: { id },
                    });
                    product?.set({ name, price });
                    await product?.save();
                    if (req.files) {
                        const result: any = await streamUpload(req).catch(
                            (err) => next(ApiError.internal(err)),
                        );
                        product?.set({ imageUrl: result.url });
                        product?.save();
                    }

                    return res.json(product);
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
    deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const product = await Product.findOne({ where: { id } });
            if (product) {
                await product?.destroy();
                return res.json({ message: 'Product was deleted' });
            } else {
                next(ApiError.badRequest('Product was not found'));
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
export default new productController();