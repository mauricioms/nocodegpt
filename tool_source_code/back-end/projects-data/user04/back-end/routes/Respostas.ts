

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/respostas/', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const _username: string = (req['user'] as { username: string }).username;
    const { pergunta_id, resposta } = req.body;

    const sql = `INSERT INTO tb_respostas (pergunta_id, username, resposta, data_hora) VALUES (?, ?, ?, datetime('now'))`;
    const result = await db.run(sql, [pergunta_id, _username, resposta]);

    res.status(200).json({ id: result.lastID });
});

router.get('/api/respostas/:pergunta_id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const _username: string = (req['user'] as { username: string }).username;
    const { pergunta_id } = req.params;

    const sql = `SELECT * FROM tb_respostas WHERE pergunta_id = ? AND username = ?`;
    const rows = await db.all(sql, [pergunta_id, _username]);

    res.status(200).json(rows);
});

router.delete('/api/respostas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const _username: string = (req['user'] as { username: string }).username;
    const { id } = req.params;

    const sql = `DELETE FROM tb_respostas WHERE id = ? AND username = ?`;
    await db.run(sql, [id, _username]);

    res.status(200).json({ message: 'Resposta excluída com sucesso.' });
});

export default router;

