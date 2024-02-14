import { Request, Response } from 'express';
import { User } from '../database/models';

class userController {
    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (error) {}
    };
}
export default new userController();
