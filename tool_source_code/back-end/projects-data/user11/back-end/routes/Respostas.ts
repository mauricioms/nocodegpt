

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const router = express.Router();

let db: sqlite3.Database;

(async () => {
  db = await open({
    filename: '../back-end/database.db',
    driver: sqlite3.Database
  });
})();

router.post('/api/respostas/:id', async (req, res) => {
  const _username: string = (req['user'] as { username: string }).username;
  const { id } = req.params;
  const { answer } = req.body;
  const sql = 'INSERT INTO tb_respostas (username, question_id, answer, date) VALUES (?, ?, ?, datetime(\'now\'))';
  const params = [_username, id, answer];
  const result = await db.run(sql, params);
  res.json(result);
});

export default router;

