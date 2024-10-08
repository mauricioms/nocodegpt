
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/respostas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { resposta, perguntaId } = req.body;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const query = `INSERT INTO tb_respostas (resposta, username, perguntaId, data_hora) VALUES (?, ?, ?, datetime('now'))`;
        const result = await db.run(query, [resposta, _username, perguntaId]);

        res.status(200).json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/api/respostas/:id', async (req, res) => {
    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const query = `SELECT * FROM tb_respostas WHERE perguntaId = ?`;
        const respostas = await db.all(query, [req.params.id]);

        res.status(200).json(respostas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/respostas/:id', async (req, res) => {
    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        await db.run('DELETE FROM tb_respostas WHERE id = ?', [req.params.id]);
        res.json({ message: 'Resposta excluída com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
