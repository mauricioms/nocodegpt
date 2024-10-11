

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.get('/api/perguntas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const query = `SELECT * FROM tb_perguntas WHERE username = ?`;
        const perguntas = await db.all(query, [_username]);

        res.status(200).json(perguntas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/perguntas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { titulo, texto } = req.body;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const query = `INSERT INTO tb_perguntas (username, titulo, texto, data_hora) VALUES (?, ?, ?, datetime('now'))`;
        const result = await db.run(query, [_username, titulo, texto]);

        res.status(200).json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/perguntas/:id', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { id } = req.params;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const query = `DELETE FROM tb_perguntas WHERE id = ? AND username = ?`;
        const result = await db.run(query, [id, _username]);

        res.status(200).json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

