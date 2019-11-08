const { Pool } = require('pg');

const config = { max: 5 };

const pool = new Pool(config);

module.exports = pool;
