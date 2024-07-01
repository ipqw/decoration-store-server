import { Sequelize } from 'sequelize';
import pg from 'pg';

const sequelize = new Sequelize(
    'postgres://default:qJCcZX76KeyS@ep-curly-fire-a2ngpwjn.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require',
    {
        dialect: 'postgres',
        dialectModule: pg,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        pool: {
            min: 0,
            max: 1,
            idle: 10000,
        },
    },
);
export default sequelize;
