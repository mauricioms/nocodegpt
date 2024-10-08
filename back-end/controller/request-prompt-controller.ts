import * as http from '../http-protocol'
import * as bn from '../business'
import * as util from '../util'

export class PromptRequestController {
  async get(_id: number, _requestId: number, _username: string): Promise<http.Response> {
    const result: http.Response = http.defaultResponse()

    const _pg: bn.Page | null = await bn.Page.get(_id)

    if (_pg) {
      const files: bn.FilePage[] = await bn.FilePage.listRequest(_pg.id, _requestId)

      for (const f of files) {
        util.writeContentFileSync(_username, f.path, null, f.content)
      }

      _pg.updateRequestId(_requestId)
      util.restartCommand(_username)
      result.content = { ok: true }
    } else {
      result.content = { ok: false }
    }
    return result
  }
}
