

DROP TABLE IF EXISTS tb_respostas;

CREATE TABLE tb_respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    question_id INTEGER NOT NULL,
    answer TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(username) REFERENCES tb_user(username),
    FOREIGN KEY(question_id) REFERENCES tb_perguntas(id)
);

