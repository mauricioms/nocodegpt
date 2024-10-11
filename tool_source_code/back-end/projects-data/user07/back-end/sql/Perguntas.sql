
DROP TABLE IF EXISTS tb_perguntas;

CREATE TABLE tb_perguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    pergunta TEXT NOT NULL,
    dataHora DATETIME NOT NULL,
    FOREIGN KEY(username) REFERENCES tb_user(username)
);
