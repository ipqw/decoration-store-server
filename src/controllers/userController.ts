import { Request, Response } from 'express';
import { Cart, User } from '../database/models';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import streamifier from 'streamifier';
import bcrypt from 'bcryptjs';

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
    createUser = async (req: Request, res: Response) => {
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
                const {
                    email,
                    password,
                    firstName,
                    lastName,
                    displayName,
                    role,
                } = req.body;

                const result: any = await streamUpload(req);
                const hashPassword = await bcrypt.hash(password, 10);
                const user = await User.create({
                    email,
                    password: hashPassword,
                    firstName,
                    lastName,
                    displayName,
                    imageUrl: result.url,
                    role,
                });
                const cart = await Cart.create({ userId: user.id });
                const token = generateJWT(user.id, user.email, user.role);

                return res.json({ token, userId: user.id });
            }
            upload(req);
        } catch (error) {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    };
    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (error) {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    };
    getOneUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id } });
            return res.json(user);
        } catch (error) {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    };
    updateUser = async (req: Request, res: Response) => {
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
                const { id } = req.params;
                const { email, password, firstName, lastName, displayName } =
                    req.body;
                const user = await User.findOne({
                    where: { id },
                });
                let result: any = user?.imageUrl;
                if (req.files?.img) {
                    result = await streamUpload(req);
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
            }
            upload(req);
        } catch (error) {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    };
    deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id } });

            if (user) {
                await user.destroy();
                return res.json('User was deleted');
            } else {
                return res.json('User was not found');
            }
        } catch (error) {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    };
}
export default new userController();
