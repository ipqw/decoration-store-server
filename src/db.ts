import { Sequelize } from 'sequelize';
import pg from 'pg';

const sequelize = new Sequelize(
    'postgres://xfzzcrmk:HauEv86-WpMNlqTn80w8WHlEEdXdA9fE@mel.db.elephantsql.com/xfzzcrmk',
    {
        dialect: 'postgres',
        dialectModule: pg,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
    },
);
export default sequelize;
