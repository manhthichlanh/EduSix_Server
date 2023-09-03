import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
  app: process.env.APP || 'dev',
  port: process.env.PORT || '5000',
  host: process.env.HOST || 'http://localhost',
  db_dialect: process.env.DB_DIALECT || 'mysql',
  db_host: process.env.DB_HOST || 'localhost',
  db_port: process.env.DB_PORT || '3306',
  db_name: process.env.DB_NAME || 'web_udemy',
  db_user: process.env.DB_USER || 'root',
  db_password: process.env.DB_PASSWORD || 'haid5122003',
  timezone: process.env.TIMEZONE || '+07:00',
};

export default CONFIG;
