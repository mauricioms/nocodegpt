CREATE TABLE IF NOT EXISTS tb_user_system (
 id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 name VARCHAR(50) NOT NULL,
 username VARCHAR(50) NOT NULL UNIQUE,
 password VARCHAR(50) NOT NULL,
 host TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_page (
 id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 name VARCHAR(50) NOT NULL,
 description TEXT NOT NULL,
 user_id INTEGER NOT NULL DEFAULT 0,
 request_id INTEGER NOT NULL DEFAULT 0,
 deleted BOOLEAN NOT NULL DEFAULT FALSE,

 FOREIGN KEY (user_id) REFERENCES tb_user_system(id)
);

CREATE TABLE IF NOT EXISTS tb_prompt_request (
 id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 role VARCHAR(10) NOT NULL,
 content TEXT NOT NULL,
 type_id INTEGER NOT NULL DEFAULT 0,
 content_full TEXT NULL,
 previous_id INTEGER NOT NULL DEFAULT 0,
 page_id INTEGER NOT NULL DEFAULT 0,
 deleted BOOLEAN NOT NULL DEFAULT FALSE,

 FOREIGN KEY (type_id) REFERENCES tb_prompt_type(id),
 FOREIGN KEY (page_id) REFERENCES tb_page(id)
);

CREATE TABLE IF NOT EXISTS tb_file (
 path TEXT NOT NULL,
 request_id INTEGER NOT NULL DEFAULT 0,
 name VARCHAR(100) NOT NULL,
 type VARCHAR(50) NOT NULL,
 page_id INTEGER NOT NULL DEFAULT 0,
 content TEXT NULL,

 FOREIGN KEY (page_id) REFERENCES tb_page(id),
 FOREIGN KEY (request_id) REFERENCES tb_prompt_request(id),
 PRIMARY KEY (request_id, path)
);

CREATE TABLE IF NOT EXISTS tb_prompt_response (
 id VARCHAR(50) NOT NULL,
 object VARCHAR(50) NOT NULL,
 created VARCHAR(30) NOT NULL,
 model VARCHAR(30) NOT NULL,
 idx INTEGER NOT NULL DEFAULT 0,
 message TEXT NOT NULL,
 prompt_tokens INTEGER NOT NULL DEFAULT 0,
 completion_tokens INTEGER NOT NULL DEFAULT 0,
 total_tokens INTEGER NOT NULL DEFAULT 0,
 request_id INTEGER NOT NULL DEFAULT 0,

 PRIMARY KEY(id),
 FOREIGN KEY (request_id) REFERENCES tb_prompt_request(id)
);

CREATE TABLE IF NOT EXISTS tb_file_template (
 id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 path TEXT NOT NULL,
 content TEXT NOT NULL,
 key_template VARCHAR(30) NULL
);

CREATE TABLE IF NOT EXISTS tb_system_context (
 id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 name VARCHAR(100) NOT NULL,
 context TEXT NOT NULL,
 user_id INTEGER NOT NULL DEFAULT 0,
 FOREIGN KEY (user_id) REFERENCES tb_user_system(id)
);

CREATE TABLE IF NOT EXISTS tb_prompt_type (
 id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 name VARCHAR(50) NOT NULL,
 message_system TEXT NULL,
 message_user TEXT NULL,
 file_extension VARCHAR(100) NULL
);

INSERT OR REPLACE INTO tb_prompt_type (id, name, message_system, message_user, file_extension)
VALUES
(1, 'Initial', 'I am a software developer and I want your help to generate a full Web app with context "{context}", using the following programming technologies:

- Vue.js version 3 Using Typescript with Composition API.
- ExpressJS.
- SQLite 3.
- Authenticate using JSON Web Token.

The web app should be organized into two modules: front-end and back-end.

Requests must send the token (Front-End):
const token: string = localStorage.getItem(''auth-token-user'') as string

Template to access to the username (Back-End):
const _username: string = (req[''user''] as { username: string }).username

Database table naming standard: tb_<name>

Another table already in the database:

```sql
CREATE TABLE tb_user (
    username VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY (username)
);
```

Beginning of the End-Point path: ''/api/{api-rest}/''

For constant variable: `const router = express.Router();` do not use middleware.

Source code files where the code must be generated:
- Database Path and Name: ../back-end/database.db 
- SQL for Drop and Create Table: /back-end/sql/{file-name}.sql
- Back-End: /back-end/routes/{file-name}.ts
- Front-End: /front-end/src/views/{file-name}View.vue

Requisites in Portuguese: {description}
', NULL, NULL),

(2, 'Feature', 'I am a software developer and I want your help to re-implement the codes from the files, adding a feature in my full web application using the following programming technologies:

- Vue.js version 3 Using Typescript with Composition API.
- ExpressJS.
- SQLite 3.
- Authenticate using JSON Web Token.

The web app should be organized into two modules: front-end and back-end.

Requests must send the token (Front-End):
const token: string = localStorage.getItem(''auth-token-user'') as string

Template to access to the username (Back-End):
const _username: string = (req[''user''] as { username: string }).username

Database table naming standard: tb_<name>

Beginning of the End-Point path: ''/api/{api-rest}/''

For constant variable: `const router = express.Router();` do not use middleware.

Source code files where the code must be generated:
- Database Path and Name: ../back-end/database.db 
- SQL for Drop and Create Table: /back-end/sql/{file-name}.sql
- Back-End: /back-end/routes/{file-name}.ts
- Front-End: /front-end/src/views/{file-name}View.vue

Output: All the answers should include the file name and all the content of source code files. Particularly, I do not want a diff.', 
'Re-implement the file codes, adding the features described below in Portuguese:', 'vue;typescript;sql'),

(3, 'Bug-fixing', 'I am a software developer and I want your help to re-implement the codes of the files, fixing a bug in my complete web application using the following programming technologies:

- Vue.js version 3 Using Typescript with Composition API.
- ExpressJS.
- SQLite 3.
- Authenticate using JSON Web Token.

The web app should be organized into two modules: front-end and back-end.

Requests must send the token (Front-End):
const token: string = localStorage.getItem(''auth-token-user'') as string

Template to access to the username (Back-End):
const _username: string = (req[''user''] as { username: string }).username

Database table naming standard: tb_<name>

Beginning of the End-Point path: ''/api/{api-rest}/''

For constant variable: `const router = express.Router();` do not use middleware.

Source code files where the code must be generated:
- Database Path and Name: ../back-end/database.db 
- SQL for Drop and Create Table: /back-end/sql/{file-name}.sql
- Back-End: /back-end/routes/{file-name}.ts
- Front-End: /front-end/src/views/{file-name}View.vue

Output: All the answers should include the file name and all the content of source code files. Particularly, I do not want a diff.
',  'Fix the bug described below in portuguese:', 'vue;typescript;sql'),

(4, 'Layout', 'I am a software developer and I want your help to re-implement the codes of the files, improving the page of my complete web application using the following programming technologies:

Web systems are divided into two modules: front-end and back-end.
Programming Language: Typescript.
Technologies:
- Vue.js version 3 Using Typescript with Composition API.
- ExpressJS.
- SQLite 3.
- Authenticate using JSON Web Token.

Requests must send the token (Front-End):
const token: string = localStorage.getItem(''auth-token-user'') as string

Database table naming standard: tb_<name>

Beginning of the End-Point path: ''/api/{api-rest}/''

For constant variable: `const router = express.Router();` do not use middleware.

Files where the codes must be implemented:
- Front-End: /front-end/src/views/{file-name}View.vue

Output: All the answers should include the file name and all the content of source code files. Particularly, I do not want a diff.
', 'Re-implement the screen by making the code responsive and more spaced out, considering the following request in portuguese described below:
', 'vue')
;

INSERT OR REPLACE INTO tb_file_template (id,"path",content,key_template) VALUES
(1,'/back-end/routes/index.ts','export * as {name} from ''./{name}''
//##add-route##','//##add-route##'),

(2,'/front-end/src/router/index.ts',',
  {
    path: ''/{name_lowercase}'',
    name: ''{name_lowercase}'',
    component: () => import(''@/views/{name}View.vue'')
  },
  {
    path: ''/{name_lowercase}/:id'',
    name: ''{name_lowercase}_manager'',
    component: () => import(''@/views/{name}View.vue'')
  }
  //##route-vue##','//##route-vue##'),

(3,'/front-end/src/App.vue','<RouterLink to="/{name_lowercase}">{name}</RouterLink>
<!--##router-link##-->','<!--##router-link##-->'),

(4,'/back-end/sql/{name_lowercase}.sql','DROP TABLE IF EXISTS tb_{name_lowercase};', NULL),

(5,'/back-end/routes/{name}.ts','import express from ''express''
import jwt from ''jsonwebtoken''
import sqlite3 from ''sqlite3''
import bcrypt from ''bcrypt''
const router = express.Router()

export default router
',NULL),

(6,'/front-end/src/views/{name}View.vue','<script setup lang="ts"></script>
<template><div></div></template>',NULL)
;


INSERT OR REPLACE INTO tb_user_system (id, name, username, password, host)
VALUES
(1,  'Mauricio Monteiro', 'mauricio', 'minha-senha', 'http://localhost:3001'),
(2,  'User 02',             'user02', 'minha-senha', 'http://localhost:3002'),
(3,  'User 03',             'user03', 'minha-senha', 'http://localhost:3003'),
(4,  'User 04',             'user04', 'minha-senha', 'http://localhost:3004'),
(5,  'User 05',             'user05', 'minha-senha', 'http://localhost:3005'),
(6,  'User 06',             'user06', 'minha-senha', 'http://localhost:3006'),
(7,  'User 07',             'user07', 'minha-senha', 'http://localhost:3007'),
(8,  'User 08',             'user08', 'minha-senha', 'http://localhost:3008'),
(9,  'User 09',             'user09', 'minha-senha', 'http://localhost:3009'),
(10, 'User 10',             'user10', 'minha-senha', 'http://localhost:3010'),
(11, 'User 11',             'user11', 'minha-senha', 'http://localhost:3011'),
(12, 'User 12',             'user12', 'minha-senha', 'http://localhost:3012'),
(13, 'User 13',             'user13', 'minha-senha', 'http://localhost:3013'),
(14, 'User 14',             'user14', 'minha-senha', 'http://localhost:3014'),
(15, 'User 15',             'user15', 'minha-senha', 'http://localhost:3015')
;

