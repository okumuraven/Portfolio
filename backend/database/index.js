const pgp = require('pg-promise')();
const config = require('../config/env');

const db = pgp(config.DATABASE_URL);

module.exports = db;