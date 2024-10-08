
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
    const { question_id, answer } = req.body;

    const sql = `INSERT INTO tb_respostas (username, question_id, answer) VALUES (?, ?, ?)`;
    await db.run(sql, [_username, question_id, answer]);

    res.status(200).json({ message: 'Answer saved successfully.' });
});

router.delete('/api/respostas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const sql = `DELETE FROM tb_respostas WHERE id = ?`;
    await db.run(sql, [req.params.id]);

    res.status(200).json({ message: 'Answer deleted successfully.' });
});

export default router;
