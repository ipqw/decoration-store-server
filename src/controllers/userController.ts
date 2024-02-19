import { Request, Response } from 'express';
import { User } from '../database/models';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

class userController {
    create = async (req: Request, res: Response) => {
        try {
            const streamUpload = (req: Request) => {
                const img = req.files?.img;
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
                    // @ts-ignore
                    streamifier.createReadStream(img?.data).pipe(stream);
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
                const user = await User.create({
                    email,
                    password,
                    firstName,
                    lastName,
                    displayName,
                    imageUrl: result.url,
                    role,
                });
                return res.json(user);
            }
            upload(req);
        } catch (error) {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    };
    getAll = async (req: Request, res: Response) => {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (error) {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    };
    getOne = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id } });
            return res.json(user);
        } catch (error) {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    };
    update = async (req: Request, res: Response) => {
        try {
        } catch (error) {}
    };
}
export default new userController();
