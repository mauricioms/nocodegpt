
DROP TABLE IF EXISTS tb_perguntas;

CREATE TABLE tb_perguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    FOREIGN KEY (author) REFERENCES tb_user(username)
);
