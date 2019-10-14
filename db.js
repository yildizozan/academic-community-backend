const { Pool } = require('pg');

const config = { max: 10 };

const pool = new Pool(config);

module.exports = pool;
