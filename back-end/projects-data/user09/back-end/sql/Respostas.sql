

DROP TABLE IF EXISTS tb_respostas;

CREATE TABLE tb_respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto_resposta TEXT NOT NULL,
    autor VARCHAR(100) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    pergunta_id INTEGER,
    FOREIGN KEY (autor) REFERENCES tb_user (username),
    FOREIGN KEY (pergunta_id) REFERENCES tb_perguntas (id)
);

