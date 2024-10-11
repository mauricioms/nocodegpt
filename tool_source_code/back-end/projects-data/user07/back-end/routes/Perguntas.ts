

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/perguntas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { titulo, pergunta } = req.body;
    const dataHora = new Date();

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        await db.run(`INSERT INTO tb_perguntas (username, titulo, pergunta, dataHora) VALUES (?, ?, ?, ?)`, [_username, titulo, pergunta, dataHora]);

        res.status(200).json({ message: 'Pergunta cadastrada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/perguntas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;

    try {
        const db = await open({
            filename: '../back-end/database.db',
            driver: sqlite3.Database
        });

        const perguntas = await db.all(`SELECT * FROM tb_perguntas WHERE username = ? ORDER BY dataHora DESC`, [_username]);

        res.status(200).json(perguntas);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        await db.run(`DELETE FROM tb_perguntas WHERE id = ? AND username = ?`, [id, _username]);

        res.status(200).json({ message: 'Pergunta excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

