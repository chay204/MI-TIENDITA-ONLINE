import { Sequelize } from '@sequelize/core';
import { MsSqlDialect } from '@sequelize/mssql';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  dialect: MsSqlDialect,
  server: 'localhost',
  port: 1433,
  database: process.env.DATABASE,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.USER,
      password: process.env.PASSWORD,
    },
  },
  encrypt: false,
  trustServerCertificate: true,
});

// probando la conexión
const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión con SQL Server establecida con éxito.');
  } catch (error) {
    console.error('Error al conectar con SQL Server:', error);
  }
};

export default sequelize;
export { dbConnect };