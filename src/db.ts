import { Sequelize } from 'sequelize';
import pg from 'pg';

const sequelize = new Sequelize(
    'postgres://kjlihpgg:2wXXw6H9oSxc5pcdJwJRLf7pYv9-PRwC@mel.db.elephantsql.com/kjlihpgg',
    {
        dialect: 'postgres',
        dialectModule: pg,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
    },
);
export default sequelize;
