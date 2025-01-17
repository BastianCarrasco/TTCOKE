// db.js
require('dotenv').config();
const { Pool } = require('pg');

// Configuración de la conexión a la base de datos usando las variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;
