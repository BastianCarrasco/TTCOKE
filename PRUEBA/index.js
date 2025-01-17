// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Importa la configuración de la base de datos

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());          // Permite solicitudes de diferentes dominios
app.use(express.json());  // Para analizar cuerpos JSON en las solicitudes


// Obtener todas las categorías de la tabla 'categorias'
app.get('/categorias', async (req, res) => {
    try {
        // Realiza la consulta a la tabla 'categorias'
        const result = await pool.query('SELECT * FROM categorias'); // Reemplaza 'categorias' por el nombre correcto de tu tabla
        res.json(result.rows); // Devuelve los resultados en formato JSON
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
