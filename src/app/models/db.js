'use strict';
import CONFIG from '../configs/db.config.js';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const basename = path.basename(__filename);
// const db = {};
console.log('CONFIG---', CONFIG);

const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
    host: CONFIG.db_host,
    dialect: CONFIG.db_dialect,
    port: CONFIG.db_port,
    operatorsAliases: false,
    dialectOptions: {
        // useUTC: false, //for reading from the database
        dateStrings: true,
        typeCast: true,
        timezone: '+07:00'
    },
    timezone: '+07:00', //for writing to the database
    logging: false
});

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

export default sequelize;
