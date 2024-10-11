

DROP TABLE IF EXISTS tb_perguntas;

CREATE TABLE tb_perguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    date DATETIME NOT NULL,
    FOREIGN KEY(username) REFERENCES tb_user(username)
);

