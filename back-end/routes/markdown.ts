import express from 'express'
import * as io from 'socket.io'
import { EventEmitter } from 'events'

import * as http from '../http-protocol'
import * as appweb from '../app-web'

import * as bn from '../business'

import { MDParse } from '../md-parse'

const md: MDParse = new MDParse()

function fnTypePrompt(_typeId: bn.TypePrompt): string {
  return _typeId == bn.TypePrompt.INITIAL
    ? 'Initial'
    : _typeId == bn.TypePrompt.FEATURE
      ? 'Feature'
      : _typeId == bn.TypePrompt.BUG_FIXING
        ? 'Bug-Fixing'
        : _typeId == bn.TypePrompt.LAYOUT
          ? 'Layout'
          : 'Other'
}

async function fnMarkdownView(_id: number): Promise<string> {
  const _us: bn.Page | null = await bn.Page.get(_id)
  if (_us) {
    let _md: string = ``

    let i = 0
    for await (const pr of _us.requests) {
      ++i
      _md += `++++ [${fnTypePrompt(pr.typeId)}] Version ${i}: ${pr.content}\n${pr.contentFull}\n++++\n`

      _md += '\n+++ ChatGPT:\n'
      for (const r of pr.responses) {
        _md += r.message
      }
      _md += '\n+++\n'
    }

    return await md.toHTML(_md)
  }

  return ''
}

const markdownRest: appweb.RestEndPoint = (app: express.Express, auth: appweb.UseFunction): void => {
  app.use('/fonts/FiraCode.ttf', express.static(__dirname + '/../md-parse/FiraCode-Regular.ttf'))
  app.use('/service/fonts/', express.static(__dirname + '/../node_modules/katex/dist/fonts/'))

  app.use('/fonts/', express.static(__dirname + '/../node_modules/katex/dist/fonts/'))

  app.get([`/service/markdown/:id`], (request: express.Request, response: express.Response): void => {
    const _id: number = (request.params?.id as unknown as number) || 0

    fnMarkdownView(_id)
      .then((_html: string): void => {
        response.setHeader('Content-Type', 'text/html')
        response.send(_html.replace(new RegExp('##USER-STORE##', 'g'), _id + ''))
      })
      .catch((err: unknown): void => {
        console.log(err)
        const result: http.Response = http.defaultResponse()
        result.status = http.status(500)
        result.content = 'A.'
        response.status(result.status.code).json(result)
      })
  })

  // Aqui você implementa suas rotas RestFul.
}

// eslint-disable-next-line
const markdownSocket: appweb.SocketEndPoint = (socket: io.Socket, emitter: EventEmitter): void => {
  // Aqui você implementa seus Sockets.
}

/*
 * Todo arquivo deve exportar um variavel com o mesmo nome do arquivo,
 * contendo um objeto com as funções padrão de cada arquivo.
 */
export const markdown: appweb.Route = {
  rest: markdownRest,
  socket: markdownSocket
}
