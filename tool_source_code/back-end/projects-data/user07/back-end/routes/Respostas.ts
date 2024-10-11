
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/respostas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const { id } = req.params;

    const rows = await db.all('SELECT * FROM tb_respostas WHERE pergunta_id = ?', [id]);

    res.json(rows);
});

router.post('/api/respostas/', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const _username: string = (req['user'] as { username: string }).username;
    const { pergunta_id, resposta } = req.body;

    const stmt = await db.prepare('INSERT INTO tb_respostas (username, pergunta_id, resposta) VALUES (?, ?, ?)');
    const result = await stmt.run(_username, pergunta_id, resposta);

    res.json(result);
});

router.delete('/api/respostas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const _username: string = (req['user'] as { username: string }).username;
    const { id } = req.params;

    await db.run('DELETE FROM tb_respostas WHERE id = ? AND username = ?', [id, _username]);

    res.json({ message: 'Resposta excluída com sucesso!' });
});

export default router;
