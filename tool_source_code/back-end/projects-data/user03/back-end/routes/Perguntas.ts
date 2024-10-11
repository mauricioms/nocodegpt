

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/perguntas/', async (req, res) => {
    const db = await open({ filename: '../back-end/database.db', driver: sqlite3.Database });
    const _username: string = (req['user'] as { username: string }).username;

    const perguntas = await db.all('SELECT * FROM tb_perguntas WHERE username = ?', [_username]);

    res.json(perguntas);
});

router.post('/api/perguntas/', async (req, res) => {
    const db = await open({ filename: '../back-end/database.db', driver: sqlite3.Database });
    const _username: string = (req['user'] as { username: string }).username;
    const { title, question } = req.body;

    const sql = 'INSERT INTO tb_perguntas (username, title, question) VALUES (?,?,?)';
    const params = [_username, title, question];

    try {
        const result = await db.run(sql, params);
        res.status(200).json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/perguntas/:id', async (req, res) => {
    const db = await open({ filename: '../back-end/database.db', driver: sqlite3.Database });
    const _username: string = (req['user'] as { username: string }).username;
    const id = req.params.id;

    const sql = 'DELETE FROM tb_perguntas WHERE id = ? AND username = ?';
    const params = [id, _username];

    try {
        await db.run(sql, params);
        res.status(200).json({ message: 'Pergunta excluída com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

