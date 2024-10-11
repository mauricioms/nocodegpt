I am a software developer and I want your help to re-implement the codes from the files, adding a feature in my full web application using the following programming technologies:

- Vue.js version 3 Using Typescript with Composition API.
- ExpressJS.
- SQLite 3.
- Authenticate using JSON Web Token.

The web app should be organized into two modules: front-end and back-end.

Requests must send the token (Front-End):
`const token: string = localStorage.getItem('auth-token-user') as string`

Template to access to the username (Back-End):
`const _username: string = (req['user'] as { username: string }).username`

Database table naming standard: tb_<name>

Beginning of the End-Point path: `/api/{api-rest}/`

For constant variable: `const router = express.Router();` do not use middleware.

Source code files where the code must be generated:
- Database Path and Name: `../back-end/database.db` 
- SQL for Drop and Create Table: `/back-end/sql/{file-name}.sql`
- Back-End: `/back-end/routes/{file-name}.ts`
- Front-End: `/front-end/src/views/{file-name}View.vue`

Output: All the answers should include the file name and all the content of source code files. Particularly, I do not want a diff. 

Re-implement the file codes, adding the features described below in Portuguese: `{description}`
