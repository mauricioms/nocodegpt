//import bcrypt from 'bcrypt'
import express from 'express'
import { Request } from 'express'
import jwt from 'jsonwebtoken'

import * as http from './http-protocol'
import * as bn from './business/index'

export class User {
  private static SECRET: string =
    process.env.JWT_SECRET +
    '.TWFzIGJ1c3F1ZW0gZW0gcHJpbWVpcm8gbHVnYXIgbyBSZWlubyBkZSBEZXVzIGUgYSBzdWEganVzdGnDp2EsIGUgdG9kYXMgZXN0YXMgY29pc2FzIGxoZXMgc2Vyw6NvIGFjcmVzY2VudGFkYXMuIChNYXRldXMgNjozMyk='
  private static TIMEOUT: number = (process.env.JWT_TIMEOUT as unknown as number) || 60 * 60 * 24

  constructor(public username: string = '') {}

  public static createToken(_user: User): string {
    return jwt.sign({ username: _user.username }, User.SECRET, {
      algorithm: 'HS512',
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
  const token: string | undefined = request.header(HEADER_AUTHORIZATION)?.split(' ')[1]

  if (!token) {
    const result: http.Response = { status: http.status(403), content: null }
    response.status(result.status.code).json(result)
  } else {
    try {
      const _user: User = User.createUser(token)

      const requestUser: RequestUser = request as RequestUser
      requestUser.user = _user

      next()
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        const result: http.Response = {
          status: http.status(401),
          content: null
        }
        result.status.message = 'Token Expired.'
        response.status(result.status.code).json(result)
      } else {
        const result: http.Response = {
          status: http.status(403),
          content: null
        }
        response.status(result.status.code).json(result)
      }
    }
  }
}

async function comparePassword(plainTextPassword: string, hashPassword: string): Promise<boolean> {
  return new Promise<boolean>((resolve: (_ok: boolean) => void): void => {
    resolve(plainTextPassword === hashPassword)
  }) //await bcrypt.compare(plainTextPassword, hashPassword)
}

export function configExpress(app: express.Express): void {
  console.log('Config resource: /auth/login')

  app.get(['/auth/valid'], requireAuth, (request: express.Request, response: express.Response): void => {
    const result: http.Response = {
      status: http.status(202),
      content: null
    }
    result.status.message = 'Is Logged In.'
    response.status(result.status.code).json(result)
  })

  app.post(['/auth/login'], (request: express.Request, response: express.Response): void => {
    const { username, password } = request.body as { username: string; password: string }

    async function fn(
      username: string,
      password: string
    ): Promise<{ token: string; host: string; name: string } | null> {
      const passwordUser: string = await loadPassword(username)
      const ok: boolean = await comparePassword(password, passwordUser)
      if (ok) {
        const user = new User(username)
        const _token: string = User.createToken(user)
        const _us: bn.UserSystem | null = await bn.UserSystem.getUsername(username)
        if (_us) {
          return { token: _token, host: _us.host, name: _us.name }
        }
      }

      return null
    }

    const result: http.Response = http.defaultResponse()

    fn(username, password)
      .then((_obj: { token: string; host: string; name: string } | null): void => {
        if (_obj == null) {
          result.status = http.status(401)
          result.status.message = 'Invalid User.'
        } else {
          const _token: string = _obj.token
          const _host: string = _obj.host
          const _name: string = _obj.name

          result.token = _token
          result.content = { host: _host, name: _name }
          result.status.message = 'Logged in successfully.'
        }

        response.status(result.status.code).json(result)
      })
      .catch((err: Error): void => {
        result.status = http.status(500)
        result.status.message = 'Failed to login. Erro:' + err.message
        response.status(result.status.code).json(result)
      })
  })
}

/*
async function isUserManager(_username: string): Promise<boolean> {
  const roles: number[] = await new Promise<number[]>(
    (resolve: (roles: number[]) => void , reject: (e: Error) => void): void => {
      console.log('Login:', _username)
      resolve([1])
    }
  )
  return roles.some((role: number) => role == 9)
}
*/

async function loadPassword(_username: string): Promise<string> {
  return await bn.UserSystem.getPassword(_username)
}
