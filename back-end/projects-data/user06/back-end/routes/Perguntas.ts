
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/perguntas/', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const perguntas = await db.all('SELECT * FROM tb_perguntas');
    res.json(perguntas);
});

router.get('/api/perguntas/:id/respostas', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    const respostas = await db.all('SELECT * FROM tb_respostas WHERE pergunta_id = ?', [req.params.id]);
    res.json(respostas);
});

router.post('/api/perguntas/', async (req, res) => {
    const _username: string = (req['user'] as { username: string }).username;
    const { title, question } = req.body;

    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    await db.run('INSERT INTO tb_perguntas (username, title, question) VALUES (?, ?, ?)', [_username, title, question]);
    res.json({ message: 'Pergunta criada com sucesso!' });
});

router.delete('/api/perguntas/:id', async (req, res) => {
    const db = await open({
        filename: '../back-end/database.db',
        driver: sqlite3.Database
    });

    await db.run('DELETE FROM tb_perguntas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Pergunta excluída com sucesso!' });
});

export default router;
