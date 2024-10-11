import express from 'express'
import * as io from 'socket.io'
import { EventEmitter } from 'events'

import * as http from '../http-protocol'
import * as appweb from '../app-web'

import * as bn from '../business'
import * as authenticate from '../authenticate'

import * as promptrequest from '../controller/request-prompt-controller'
const promptRequestController: promptrequest.PromptRequestController = new promptrequest.PromptRequestController()

function executeCatch(err: Error, response: express.Response): void {
  const result: http.Response = http.defaultResponse()
  result.status = http.status(500)
  result.status.message = err.message
  response.status(result.status.code).json(result)
}

function updateRequestId(request: express.Request, response: express.Response): void {
  const _id: number = (request.params?.id as unknown as number) || 0
  const _requestId: number = (request.params?.requestId as unknown as number) || 0
  const r: authenticate.RequestUser = request as authenticate.RequestUser

  promptRequestController
    .get(_id, _requestId, r.user.username)
    .then((result: http.Response): void => {
      response.status(result.status.code).json(result)
    })
    .catch((err: Error): void => {
      executeCatch(err, response)
    })
}

function getPage(request: express.Request, response: express.Response): void {
  const _id: number = (request.params?.id as unknown as number) || 0

  pageController
    .get(_id)
    .then((result: http.Response): void => {
      response.status(result.status.code).json(result)
    })
    .catch((err: Error): void => {
      executeCatch(err, response)
    })
}

import * as pagecontroller from '../controller/page-controller'
const pageController: pagecontroller.PageController = new pagecontroller.PageController()

function postNewPage(request: express.Request, response: express.Response): void {
  const r: authenticate.RequestUser = request as authenticate.RequestUser
  const _body = request.body as bn.Page

  pageController
    .fnPostPage(_body, r.user.username)
    .then((result: http.Response): void => {
      response.status(result.status.code).json(result)
    })
    .catch((err: Error): void => {
      executeCatch(err, response)
    })
}

import * as promptcontroller from '../controller/prompt-controller'
const promptController: promptcontroller.PromptController = new promptcontroller.PromptController()

function sendPrompt(request: express.Request, response: express.Response): void {
  const _body: { id: number; chat: string; type: number } = request.body as { chat: string; type: number; id: number }
  const _id: number = _body.id || 0
  const r: authenticate.RequestUser = request as authenticate.RequestUser

  promptController
    .fnPutPrompt(_id, _body, r.user.username)
    .then((result: http.Response): void => {
      response.status(result.status.code).json(result)
    })
    .catch((err: Error): void => {
      executeCatch(err, response)
    })
}

function getPageList(request: express.Request, response: express.Response): void {
  const r: authenticate.RequestUser = request as authenticate.RequestUser

  pageController
    .list(r.user.username)
    .then((result: http.Response): void => {
      response.status(result.status.code).json(result)
    })
    .catch((err: Error): void => {
      executeCatch(err, response)
    })
}
/*
import * as filepage from '../controller/file-page-controller'
const filepageController: filepage.FilePageController = new filepage.FilePageController()

function postFileCopy(request: express.Request, response: express.Response): void {
  const r: authenticate.RequestUser = request as authenticate.RequestUser

  const _username: string = r.user.username
  const _id: number = (request.params?.id as unknown as number) || 0
  const _typeFile: string = (request.params?.file as unknown as string) || ''
  const _body: { code: string } = request.body as { code: string }

  filepageController
    .postFileCopy(_id, _username, _body, _typeFile)
    .then((result: http.Response): void => {
      response.status(result.status.code).json(result)
    })
    .catch((err: Error): void => {
      executeCatch(err, response)
    })
}
*/

import * as systemcontext from '../controller/system-context-controller'
const systemContextController: systemcontext.SystemContextController = new systemcontext.SystemContextController()

function postSystemContext(request: express.Request, response: express.Response): void {
  const r: authenticate.RequestUser = request as authenticate.RequestUser
  const _body = request.body as bn.SystemContext

  systemContextController
    .fnPostSystemContext(_body, r.user.username)
    .then((result: http.Response): void => {
      response.status(result.status.code).json(result)
    })
    .catch((err: Error): void => {
      executeCatch(err, response)
    })
}

function getSystemContext(request: express.Request, response: express.Response): void {
  const r: authenticate.RequestUser = request as authenticate.RequestUser

  systemContextController
    .getByUsername(r.user.username)
    .then((result: http.Response): void => {
      response.status(result.status.code).json(result)
    })
    .catch((err: Error): void => {
      executeCatch(err, response)
    })
}

function getTypePromptList(request: express.Request, response: express.Response): void {
  promptController
    .listTypes()
    .then((result: http.Response): void => {
      response.status(result.status.code).json(result)
    })
    .catch((err: Error): void => {
      executeCatch(err, response)
    })
}

const pageRest: appweb.RestEndPoint = (app: express.Express, auth: appweb.UseFunction): void => {
  app.post([`/service/send-prompt`], auth, sendPrompt)
  app.get([`/service/page/:id/prompt-request/:requestId`], auth, updateRequestId)
  app.post([`/service/system-context`], auth, postSystemContext)
  app.get([`/service/system-context`], auth, getSystemContext)

  app.get([`/service/type-prompt-list`], auth, getTypePromptList)

  app.get([`/service/page/:id`], auth, getPage)
  app.post([`/service/page-new`], auth, postNewPage)

  app.get([`/service/page-list`], auth, getPageList)

  //app.post([`/service/copy/:file/:id`], auth, postFileCopy)
}

// eslint-disable-next-line
const pageSocket: appweb.SocketEndPoint = (socket: io.Socket, emitter: EventEmitter): void => {
  // Aqui você implementa seus Sockets.
}

/*
 * Todo arquivo deve exportar um variavel com o mesmo nome do arquivo,
 * contendo um objeto com as funções padrão de cada arquivo.
 */
export const page: appweb.Route = {
  rest: pageRest,
  socket: pageSocket
}
