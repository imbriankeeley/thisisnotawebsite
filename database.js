const { Pool } = require('pg');
const pool = new Pool({
	host: 'database',
	port: 5432,
	user: 'postgres',
	password: 'password',
	database: 'db',
});

module.exports = pool;