

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/respostas/', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const respostas = await db.all('SELECT * FROM tb_respostas');
    res.json(respostas);
});

router.post('/api/respostas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { resposta } = req.body;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const result = await db.run('INSERT INTO tb_respostas (username, resposta) VALUES (?, ?)', [_username, resposta]);

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
    res.json({ message: 'Resposta excluída com sucesso!' });
});

export default router;

