
DROP TABLE IF EXISTS tb_respostas;

CREATE TABLE tb_respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    resposta TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES tb_user (username)
);
