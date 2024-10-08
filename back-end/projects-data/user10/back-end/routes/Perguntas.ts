

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/perguntas/create', async (req, res) => {
    const db = await open({ filename: '../back-end/database.db', driver: sqlite3.Database });
    const _username: string = (req['user'] as { username: string }).username;
    const { pergunta } = req.body;
    const dataHoraCadastro = new Date();

    await db.run('INSERT INTO tb_perguntas (username, pergunta, dataHoraCadastro) VALUES (?, ?, ?)', [_username, pergunta, dataHoraCadastro]);

    res.status(200).json({ message: 'Pergunta criada com sucesso!' });
});

router.get('/api/perguntas/', async (req, res) => {
    const db = await open({ filename: '../back-end/database.db', driver: sqlite3.Database });
    const _username: string = (req['user'] as { username: string }).username;

    const perguntas = await db.all('SELECT * FROM tb_perguntas WHERE username = ?', [_username]);

    res.status(200).json(perguntas);
});

router.delete('/api/perguntas/:id', async (req, res) => {
    const db = await open({ filename: '../back-end/database.db', driver: sqlite3.Database });
    const { id } = req.params;

    await db.run('DELETE FROM tb_perguntas WHERE id = ?', [id]);

    res.status(200).json({ message: 'Pergunta excluída com sucesso!' });
});

export default router;

