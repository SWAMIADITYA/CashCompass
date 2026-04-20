const mysql = require('mysql2/promise');
require('dotenv').config();

const MYSQL_URL = `mysql://root:omWWFexYrCQYlyEKoAWdTYJaHzlcyZmw@mysql.railway.internal:3306/railway`
const pool = mysql.createPool(process.env.MYSQL_URL);

module.exports = pool;




