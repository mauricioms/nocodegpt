

DROP TABLE IF EXISTS tb_perguntas;

CREATE TABLE tb_perguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    pergunta TEXT NOT NULL,
    dataHoraCadastro DATETIME NOT NULL,
    resposta TEXT,
    FOREIGN KEY(username) REFERENCES tb_user(username)
);

