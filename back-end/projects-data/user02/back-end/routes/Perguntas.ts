

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = express.Router();

router.post('/api/perguntas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { title, question } = req.body;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const sql = 'INSERT INTO tb_perguntas (title, question, username) VALUES (?, ?, ?)';
        const params = [title, question, _username];

        await db.run(sql, params);

        res.status(200).json({ message: 'Pergunta adicionada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/perguntas/', async (req, res) => {
    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const sql = 'SELECT * FROM tb_perguntas';
        const perguntas = await db.all(sql);

        res.status(200).json(perguntas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api/perguntas/:id', async (req, res) => {
    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const sql = 'DELETE FROM tb_perguntas WHERE id = ?';
        const params = [req.params.id];

        await db.run(sql, params);

        res.status(200).json({ message: 'Pergunta excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

