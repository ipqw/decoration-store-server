import { NextFunction, Request, Response } from 'express';
import {
    CartProduct,
    Discount,
    Like,
    OrderProduct,
    Product,
    ProductGroup,
    ProductInfo,
    Review,
    Type,
    WishlistProduct,
} from '../database/models';
import ApiError from '../error/apiError';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';
import { UploadedFile } from 'express-fileupload';
import { ProductInfoModel } from '../types/sequelizeTypes';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const streamUpload = async (img: UploadedFile) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        streamifier.createReadStream(img?.data).pipe(stream);
    });
};

class productController {
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            async function upload(req: Request) {
                try {
                    const { name, price, typeId, info, productGroupId } =
                        req.body;
                    const productGroup = productGroupId
                        ? await ProductGroup.findOne({
                              where: { id: productGroupId },
                          })
                        : await ProductGroup.create();
                    const product = await Product.create({
                        name,
                        price,
                        typeId,
                        productGroupId: productGroup?.id,
                    });
                    JSON.parse(info)?.forEach(async (el: ProductInfoModel) => {
                        await ProductInfo.create({
                            name: el.name,
                            text: el.text,
                            productId: product.id,
                        });
                    });
                    if (req.files) {
                        const img = req.files?.img;
                        const images: string[] = [];
                        if (Array.isArray(img)) {
                            for (const file of img) {
                                const result: any = await streamUpload(
                                    file,
                                ).catch((err) => next(ApiError.internal(err)));
                                images.push(result.url);
                            }
                        } else {
                            const result: any = await streamUpload(img).catch(
                                (err) => next(ApiError.internal(err)),
                            );
                            images.push(result.url);
                        }
                        product?.set({ images });
                        await product?.save();
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
            const { limit } = req.query;
            const products = await Product.findAll({
                limit: Number(limit) || 40,
                include: [
                    { model: Discount, as: 'discount' },
                    { model: ProductGroup, as: 'product_group' },
                    { model: ProductInfo, as: 'product_infos' },
                    { model: Type, as: 'type' },
                ],
            });
            products.forEach(async (product) => {
                if (
                    product.discount &&
                    product.discount.startsIn <= Date.now() &&
                    product.discount.expiresIn > Date.now()
                ) {
                    product?.set({
                        discountPrice: Math.ceil(
                            product.price -
                                (product.price / 100) *
                                    product.discount.percent,
                        ),
                    });
                    await product?.save();
                }
                if (
                    product.discount?.expiresIn &&
                    Date.now() > product.discount?.expiresIn
                ) {
                    await product.discount.destroy();
                    product?.set({
                        discountPrice: null,
                    });
                    await product?.save();
                }
            });
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
                    { model: Type, as: 'type' },
                    { model: Discount, as: 'discount' },
                    { model: CartProduct, as: 'cart_products' },
                    { model: WishlistProduct, as: 'wishlist_products' },
                    { model: OrderProduct, as: 'order_products' },
                    { model: ProductInfo, as: 'product_infos' },
                    {
                        model: ProductGroup,
                        as: 'product_group',
                        include: [
                            { model: Product, as: 'products' },
                            { model: Review, as: 'reviews' },
                        ],
                    },
                ],
            });
            if (
                product?.discount &&
                product.discount.startsIn <= Date.now() &&
                product.discount.expiresIn > Date.now()
            ) {
                product?.set({
                    discountPrice: Math.ceil(
                        product.price -
                            (product.price / 100) * product.discount.percent,
                    ),
                });
                await product?.save();
            }
            if (
                product?.discount?.expiresIn &&
                Date.now() > product.discount?.expiresIn
            ) {
                await product.discount.destroy();
                product?.set({
                    discountPrice: null,
                });
                await product?.save();
            }
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
            async function upload(req: Request) {
                try {
                    const { id } = req.params;
                    const { name, price } = req.body;

                    const product = await Product.findOne({
                        where: { id },
                    });
                    if (req.files) {
                        const img = req.files?.img;
                        const images: string[] = [];
                        if (Array.isArray(img)) {
                            for (const file of img) {
                                const result: any = await streamUpload(
                                    file,
                                ).catch((err) => next(ApiError.internal(err)));
                                images.push(result.url);
                            }
                        } else {
                            const result: any = await streamUpload(img).catch(
                                (err) => next(ApiError.internal(err)),
                            );
                            images.push(result.url);
                        }
                        product?.set({ images });
                    }
                    product?.set({
                        name: name || product.name,
                        price: price || product.price,
                    });
                    await product?.save();
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
