

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/respostas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { pergunta_id, resposta } = req.body;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const query = `INSERT INTO tb_respostas (username, pergunta_id, resposta) VALUES (?, ?, ?)`;
        const result = await db.run(query, [_username, pergunta_id, resposta]);

        res.status(200).json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/respostas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    await db.run('DELETE FROM tb_respostas WHERE id = ?', [req.params.id]);

    res.json({ message: 'Resposta excluída com sucesso' });
});

router.get('/api/respostas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const respostas = await db.all('SELECT * FROM tb_respostas WHERE pergunta_id = ?', [req.params.id]);

    res.json(respostas);
});

export default router;

