
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


app.post('/api/registro', async (req, res) => {
    const { nombre, email, contraseña, rol } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO public.usuarios(nombre, email, "contraseña", rol)
             VALUES ($1, $2, $3, $4) RETURNING id_usuario`,
            [nombre, email, contraseña, rol]
        );
        res.status(201).json({ id_usuario: result.rows[0].id_usuario });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});


app.post('/api/login', async (req, res) => {
    const { email, contraseña } = req.body;
    try {
        const result = await pool.query(
            `SELECT * FROM public.usuarios WHERE email = $1 AND "contraseña" = $2`,
            [email, contraseña]
        );
        if (result.rows.length > 0) {
            // Se puede usar un token aquí si es necesario
            res.json({ mensaje: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});


app.get('/api/paseos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM paseos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los paseos:', error);
        res.status(500).json({ error: 'Error al obtener los paseos' });
    }
});


app.get('/api/paseos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM paseos WHERE id_paseo = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Paseo no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el paseo:', error);
        res.status(500).json({ error: 'Error al obtener el paseo' });
    }
});


app.post('/api/paseos/:id/reservas', async (req, res) => {
    const { id } = req.params;
    const { id_usuario, cantidad_personas, total } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO public.reservas(id_usuario, id_paseo, cantidad_personas, total)
             VALUES ($1, $2, $3, $4) RETURNING id_reserva`,
            [id_usuario, id, cantidad_personas, total]
        );
        res.status(201).json({ id_reserva: result.rows[0].id_reserva });
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
});


app.post('/api/paseos/propuesta', async (req, res) => {

    const { nombre, descripcion, ubicacion, duracion, precio, estado, id_categoria } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO public.paseos(nombre, descripcion, ubicacion, duracion, precio, estado, id_categoria)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_paseo`,
            [nombre, descripcion, ubicacion, duracion, precio, estado, id_categoria]
        );
        res.status(201).json({ id_paseo: result.rows[0].id_paseo });
    } catch (error) {
        console.error('Error al crear paseo de propuesta:', error);
        res.status(500).json({ error: 'Error al crear paseo de propuesta' });
    }
});


app.get('/api/admin/paseos', async (req, res) => {

    try {
        const result = await pool.query('SELECT * FROM paseos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los paseos para administrador:', error);
        res.status(500).json({ error: 'Error al obtener los paseos' });
    }
});


app.post('/api/admin/paseos/nuevo', async (req, res) => {
    const { nombre, descripcion, ubicacion, duracion, precio, estado, id_categoria } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO public.paseos(nombre, descripcion, ubicacion, duracion, precio, estado, id_categoria)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_paseo`,
            [nombre, descripcion, ubicacion, duracion, precio, estado, id_categoria]
        );
        res.status(201).json({ id_paseo: result.rows[0].id_paseo });
    } catch (error) {
        console.error('Error al crear nuevo paseo:', error);
        res.status(500).json({ error: 'Error al crear paseo' });
    }
});

// Editar paseo (solo para admin)
app.put('/api/admin/paseos/:id/editar', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, ubicacion, duracion, precio, estado, id_categoria } = req.body;
    try {
        const result = await pool.query(
            `UPDATE public.paseos SET nombre = $1, descripcion = $2, ubicacion = $3, duracion = $4, precio = $5, estado = $6, id_categoria = $7
             WHERE id_paseo = $8 RETURNING id_paseo`,
            [nombre, descripcion, ubicacion, duracion, precio, estado, id_categoria, id]
        );
        if (result.rows.length > 0) {
            res.json({ mensaje: 'Paseo actualizado' });
        } else {
            res.status(404).json({ error: 'Paseo no encontrado' });
        }
    } catch (error) {
        console.error('Error al editar paseo:', error);
        res.status(500).json({ error: 'Error al editar paseo' });
    }
});


app.delete('/api/admin/paseos/:id/eliminar', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM public.paseos WHERE id_paseo = $1', [id]);
        if (result.rowCount > 0) {
            res.json({ mensaje: 'Paseo eliminado' });
        } else {
            res.status(404).json({ error: 'Paseo no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar paseo:', error);
        res.status(500).json({ error: 'Error al eliminar paseo' });
    }
});


app.get('/api/admin/paseos/categorias', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categorias');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// Crear nueva categoría (solo para admin)
app.post('/api/admin/paseos/categorias/nuevo', async (req, res) => {
    const { nombre_categoria } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO public.categorias(nombre_categoria)
             VALUES ($1) RETURNING id_categoria`,
            [nombre_categoria]
        );
        res.status(201).json({ id_categoria: result.rows[0].id_categoria });
    } catch (error) {
        console.error('Error al crear nueva categoría:', error);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
});

// Editar categoría (solo para admin)
app.put('/api/admin/paseos/categorias/:id/editar', async (req, res) => {
    const { id } = req.params;
    const { nombre_categoria } = req.body;
    try {
        const result = await pool.query(
            `UPDATE public.categorias SET nombre_categoria = $1 WHERE id_categoria = $2 RETURNING id_categoria`,
            [nombre_categoria, id]
        );
        if (result.rows.length > 0) {
            res.json({ mensaje: 'Categoría actualizada' });
        } else {
            res.status(404).json({ error: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error('Error al editar categoría:', error);
        res.status(500).json({ error: 'Error al editar categoría' });
    }
});

// Eliminar categoría (solo para admin)
app.delete('/api/admin/paseos/categorias/:id/eliminar', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM public.categorias WHERE id_categoria = $1', [id]);
        if (result.rowCount > 0) {
            res.json({ mensaje: 'Categoría eliminada' });
        } else {
            res.status(404).json({ error: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
