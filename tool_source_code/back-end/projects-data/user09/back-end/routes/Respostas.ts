

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/respostas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const _username: string = (req['user'] as { username: string }).username;
    const { texto_resposta } = req.body;

    const result = await db.run(
        `INSERT INTO tb_respostas (texto_resposta, autor, pergunta_id) VALUES (?, ?, ?)`,
        [texto_resposta, _username, req.params.id]
    );

    res.json(result);
});

router.get('/api/respostas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const result = await db.all(`SELECT * FROM tb_respostas WHERE pergunta_id = ?`, [req.params.id]);

    res.json(result);
});

export default router;

