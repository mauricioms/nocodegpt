

DROP TABLE IF EXISTS tb_respostas;

CREATE TABLE tb_respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    pergunta_id INTEGER NOT NULL,
    resposta TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(username) REFERENCES tb_user(username),
    FOREIGN KEY(pergunta_id) REFERENCES tb_perguntas(id)
);

