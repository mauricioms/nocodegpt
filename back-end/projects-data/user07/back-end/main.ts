//import bcrypt from 'bcrypt'
import { Request } from 'express'
import jwt from 'jsonwebtoken'
import express, { Application } from 'express'
import * as bodyParser from 'body-parser'
import http from 'http'
import { Database } from 'sqlite3'

const app = express()

export class User {
  private static SECRET: string = 'F1ZW0gZW0g'
  private static TIMEOUT: number = 60 * 60 * 24

  constructor(public username: string = '') {}

  public static createToken(_user: User): string {
    return jwt.sign({ username: _user.username }, User.SECRET, {
      expiresIn: User.TIMEOUT
    })
  }

  public static createUser(_token: string): User {
    return jwt.verify(_token, User.SECRET) as User
  }
}

export interface RequestUser extends Request {
  user: User
}

const HEADER_AUTHORIZATION: string = 'Authorization'

export type RequireAuth = (request: express.Request, response: express.Response, next: express.NextFunction) => void

export const requireAuth: RequireAuth = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
): void => {
  if (request.path == '/auth/login') {
    next()
  } else {
    const token: string | undefined = request.header(HEADER_AUTHORIZATION)?.split(' ')[1]

    if (!token) {
      response.status(403).json({ token: null })
    } else {
      try {
        const _user: User = User.createUser(token)

        const requestUser: RequestUser = request as RequestUser
        requestUser.user = _user

        next()
      } catch (err: unknown) {
        if (err instanceof jwt.TokenExpiredError) {
          response.status(401).json({ token: null, message: 'Token Expired.' })
        } else {
          response.status(403).json({ token: null, message: 'Token Invalid.' })
        }
      }
    }
  }
}

async function comparePassword(plainTextPassword: string, hashPassword: string): Promise<boolean> {
  return await new Promise<boolean>((resolve: (ok: boolean) => void): void => {
    resolve(plainTextPassword == hashPassword)
  })
}

export function configExpress(app: express.Express): void {
  console.log('Config resource: /auth/login')

  app.get(['/auth/valid'], requireAuth, (request: express.Request, response: express.Response): void => {
    response.status(202).json({ ok: true })
  })

  app.post(['/auth/login'], (request: express.Request, response: express.Response): void => {
    const { username, password } = request.body as { username: string; password: string }

    async function fn(username: string, password: string): Promise<string | null> {
      const passwordUser: string = await loadPassword(username)
      const ok: boolean = await comparePassword(password, passwordUser)
      if (ok) {
        const user = new User(username)
        const _token: string = User.createToken(user)
        return _token
      }

      return null
    }

    fn(username, password)
      .then((_token: string | null): void => {
        let _code: number = 202
        let _message: string = ''

        if (_token == null) {
          _code = 401
          _message = 'Invalid User.'
        } else {
          _message = 'Logged in successfully.'
        }

        response.status(_code).json({ token: _token, message: _message })
      })
      .catch((): void => {
        response.status(500).json({ token: null, message: 'Failed to login.' })
      })
  })
}

async function loadPassword(_username: string): Promise<string> {
  return await new Promise<string>((resolve: (u: string) => void, reject: (e: Error) => void): void => {
    db.exec(
      `
INSERT OR REPLACE INTO tb_user (name, username, password)
VALUES ('${_username}', '${_username}', 'minha-senha');`,
      (): void => {
        resolve('minha-senha')
      }
    )
  })
}

const db: Database = new Database('./database.db')

export interface RouteHash {
  [key: string]: unknown
}

import * as router from './routes'

import fs from 'fs'

function sql_files(_dir: string): string[] {
  const _files: string[] = []

  try {
    const files = fs.readdirSync(_dir)

    files.forEach((file) => {
      _files.push(fs.readFileSync(`${_dir}${file}`, 'utf8'))
    })
  } catch (err) {
    console.log(err)
  }

  return _files
}

export function system_main(): void {
  const _router: RouteHash = router as RouteHash

  const files: string[] = sql_files('./sql/')

  for (const sql of files) {
    db.exec(sql)
  }

  app.use(bodyParser.json())
  app.use(requireAuth)

  configExpress(app)

  for (const i in _router) {
    const a = _router[i] as { default: Application }
    console.log(`/api/${i.toLowerCase()}`)
    app.use(a.default)
  }

  const port: number = (process.env.WEB_PORT as unknown as number) || 8083
  const server = http.createServer(app)
  server.listen(port, () => console.log(`Server is running http://localhost:${port}...`))
}

system_main()
