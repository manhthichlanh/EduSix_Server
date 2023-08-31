require('dotenv').config();
let CONFIG = {}; //Make this global to use all over the application
CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '5000';
CONFIG.host = process.env.HOST || 'http://localhost';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'web_udemy';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || 'haid5122003';
CONFIG.timezone = process.env.TIMEZONE || '+07:00';

module.exports = CONFIG;
