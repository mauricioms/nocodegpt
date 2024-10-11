

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = express.Router();

router.post('/api/respostas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { answer, questionId } = req.body;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const sql = 'INSERT INTO tb_respostas (answer, question_id, username) VALUES (?, ?, ?)';
        const params = [answer, questionId, _username];

        await db.run(sql, params);

        res.status(200).json({ message: 'Resposta adicionada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/respostas/:questionId', async (req, res) => {
    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const sql = 'SELECT * FROM tb_respostas WHERE question_id = ?';
        const params = [req.params.questionId];
        const respostas = await db.all(sql, params);

        res.status(200).json(respostas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api/respostas/:id', async (req, res) => {
    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const sql = 'DELETE FROM tb_respostas WHERE id = ?';
        const params = [req.params.id];

        await db.run(sql, params);

        res.status(200).json({ message: 'Resposta excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

