import * as http from '../http-protocol'

export class FilePageController {
  async postFileCopy(
    _id: number,
    _username: string,
    _body: { code: string },
    _typeFile: string
  ): Promise<http.Response> {
    return await new Promise<http.Response>((resolve: (rs: http.Response) => void): void => {
      const result: http.Response = http.defaultResponse()

      //const _code: string = Buffer.from(_body.code, 'base64').toString('binary')
      //const context: string = `./projects-data/${_username}`
      //const _us: bn.Page | null = await bn.Page.get(_id)
      resolve(result)
    })
  }
}
