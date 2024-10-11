import express from 'express'
import http from 'http'
import * as io from 'socket.io'
import { EventEmitter } from 'events'
import bodyParser from 'body-parser'

import * as security from './security'
import * as authenticate from './authenticate'

export type UseFunction = (request: express.Request, response: express.Response, next: express.NextFunction) => void

export type RestEndPoint = (app: express.Express, auth: UseFunction, emitter: EventEmitter) => void

export type SocketEndPoint = (socket: io.Socket, emitter: EventEmitter) => void

export interface Route {
  rest: RestEndPoint
  socket: SocketEndPoint
}

export interface RouteHash {
  [key: string]: Route
}

export interface Server {
  server: http.Server
  app: express.Express
  io: io.Server

  listening(port: number | string): void
}

class ServerLoad implements Server {
  constructor(
    public server: http.Server,
    public app: express.Express,
    public io: io.Server
  ) {}

  public listening(port: number | string = 8080): void {
    this.server.listen(port, () => console.log(`Server is running http://localhost:${port}...`))
  }
}

export function Init(): Server {
  const appexpress = express()
  const server = http.createServer(appexpress)
  const ioserver = new io.Server(server)

  appexpress.use('/', express.static('../front-end/dist'))
  appexpress.use('/main', express.static('../front-end/dist'))
  appexpress.use('/add', express.static('../front-end/dist'))
  appexpress.use('/view', express.static('../front-end/dist'))
  appexpress.use('/logout', express.static('../front-end/dist'))
  appexpress.use('/login', express.static('../front-end/dist'))

  appexpress.use(bodyParser.json({ limit: '200mb' }))
  appexpress.use(bodyParser.urlencoded({ extended: true, limit: '200mb', parameterLimit: 50000 }))

  security.configExpress(appexpress)
  authenticate.configExpress(appexpress)

  return new ServerLoad(server, appexpress, ioserver)
}
