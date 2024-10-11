

DROP TABLE IF EXISTS tb_perguntas;

CREATE TABLE tb_perguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES tb_user (username)
);

