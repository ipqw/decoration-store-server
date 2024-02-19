import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes';
import sequelize from './db';
import fileUpload from 'express-fileupload';
import { Response } from 'express';
import errorHandler from './middleware/errorHandlerMiddleware';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload({}));
app.use('/api', router);
app.use(errorHandler);

app.get('/', (req, res: Response) => {
    res.status(200).json({ message: 'WORKING' });
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
