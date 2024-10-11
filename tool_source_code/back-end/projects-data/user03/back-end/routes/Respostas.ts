

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/respostas/:id', async (req, res) => {
    const db = await open({ filename: '../back-end/database.db', driver: sqlite3.Database });
    const _username: string = (req['user'] as { username: string }).username;
    const id = req.params.id;

    const respostas = await db.all('SELECT * FROM tb_respostas WHERE pergunta_id = ?', [id]);

    res.json(respostas);
});

router.post('/api/respostas/', async (req, res) => {
    const db = await open({ filename: '../back-end/database.db', driver: sqlite3.Database });
    const _username: string = (req['user'] as { username: string }).username;
    const { pergunta_id, resposta } = req.body;

    const result = await db.run('INSERT INTO tb_respostas (username, pergunta_id, resposta) VALUES (?, ?, ?)', [_username, pergunta_id, resposta]);

    res.json(result);
});

router.delete('/api/respostas/:id', async (req, res) => {
    const db = await open({ filename: '../back-end/database.db', driver: sqlite3.Database });
    const _username: string = (req['user'] as { username: string }).username;
    const id = req.params.id;

    const sql = 'DELETE FROM tb_respostas WHERE id = ? AND username = ?';
    const params = [id, _username];

    try {
        await db.run(sql, params);
        res.status(200).json({ message: 'Resposta excluída com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

