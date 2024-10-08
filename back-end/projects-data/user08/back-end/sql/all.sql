DROP TABLE IF EXISTS tb_user;

CREATE TABLE tb_user (
    username VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY (username)
);

--##create-table##
