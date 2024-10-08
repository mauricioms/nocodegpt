
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/perguntas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { question } = req.body;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const result = await db.run('INSERT INTO tb_perguntas (username, question) VALUES (?, ?)', [_username, question]);

        res.status(200).json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/api/perguntas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const rows = await db.all('SELECT * FROM tb_perguntas WHERE username = ?', [_username]);

        res.status(200).json(rows);
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

        await db.run('DELETE FROM tb_perguntas WHERE id = ? AND username = ?', [id, _username]);

        res.status(200).json({ message: 'Question deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
