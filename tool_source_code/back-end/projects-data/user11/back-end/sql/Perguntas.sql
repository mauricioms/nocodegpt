
DROP TABLE IF EXISTS tb_perguntas;

CREATE TABLE tb_perguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    titulo TEXT NOT NULL,
    texto TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES tb_user (username)
);
