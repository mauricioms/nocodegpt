I am a software developer and I want your help to generate a full Web app with context "`{context}`", using the following programming technologies:

- Vue.js version 3 Using Typescript with Composition API.
- ExpressJS.
- SQLite 3.
- Authenticate using JSON Web Token.

The web app should be organized into two modules: front-end and back-end.

Requests must send the token (Front-End):
`const token: string = localStorage.getItem('auth-token-user') as string`

Template to access to the username (Back-End):
`const _username: string = (req['user'] as { username: string }).username`

Database table naming standard: `tb_<name>`

Another table already in the database:

```sql
CREATE TABLE tb_user (
    username VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY (username)
);
```

Beginning of the End-Point path: `/api/{api-rest}/`

For constant variable: `const router = express.Router();` do not use middleware.

Source code files where the code must be generated:
- Database Path and Name: `../back-end/database.db` 
- SQL for Drop and Create Table: `/back-end/sql/{file-name}.sql`
- Back-End: `/back-end/routes/{file-name}.ts`
- Front-End: `/front-end/src/views/{file-name}View.vue`

Requisites in Portuguese: `{description}`
