
DROP TABLE IF EXISTS tb_respostas;

CREATE TABLE tb_respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resposta TEXT NOT NULL,
    username VARCHAR(100) NOT NULL,
    perguntaId INTEGER NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(username) REFERENCES tb_user(username),
    FOREIGN KEY(perguntaId) REFERENCES tb_perguntas(id)
);
