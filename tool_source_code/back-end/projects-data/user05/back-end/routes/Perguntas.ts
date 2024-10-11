

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = express.Router();

router.post('/api/perguntas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { title, question } = req.body;

    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const result = await db.run('INSERT INTO tb_perguntas (username, title, question, date) VALUES (?, ?, ?, ?)', [_username, title, question, new Date()]);

    res.json({ id: result.lastID });
});

router.get('/api/perguntas/', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const perguntas = await db.all('SELECT * FROM tb_perguntas');

    res.json(perguntas);
});

router.delete('/api/perguntas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    await db.run('DELETE FROM tb_perguntas WHERE id = ?', [req.params.id]);

    res.json({ message: 'Pergunta excluída com sucesso' });
});

export default router;

