import { Init, Server, RouteHash, Route } from './app-web'
import * as io from 'socket.io'
import * as authenticate from './authenticate'
import * as route from './routes'
import { EventEmitter } from 'events'

import * as bn from './business'

export function system_main(): void {
  const server: Server = Init()
  const emitter: EventEmitter = new EventEmitter()

  const _route: RouteHash = route

  server.io.on('connection', (socket: io.Socket) => {
    for (const i in _route) {
      const r: Route = _route[i]
      r.socket(socket, emitter)
    }

    socket.on('disconnect', () => {
      console.log('Socket Disconnected.')
    })
  })

  bn.createTables()
    .then((): void => {
      /*
      let i = 0
      for (const u of ['mauricio', 'marcotulio', 'user3', 'user4', 'user5', 'user6', 'user7']) {
        const us: bn.UserSystem = new bn.UserSystem(u, `User ${++i}`, 'minha-senha', `https://user${i}.ithread.com.br`)
        us.save()
      }
      */

      for (const i in _route) {
        const r: Route = _route[i]
        r.rest(server.app, authenticate.requireAuth, emitter)
      }

      server.listening((process.env.WEB_PORT as unknown as number) || 8080)
    })
    .catch((): void => {})
}

system_main()
