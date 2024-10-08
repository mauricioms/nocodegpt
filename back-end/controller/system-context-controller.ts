import _ from 'underscore'
import * as bn from '../business'
import * as util from '../util'

import * as http from '../http-protocol'

export class SystemContextController {
  async getByUsername(_username: string): Promise<http.Response> {
    const result: http.Response = http.defaultResponse()
    const _cs: bn.SystemContext = await bn.SystemContext.getByUsername(_username)
    result.content = _cs
    return result
  }

  async fnPostSystemContext(_cs: bn.SystemContext, _username: string): Promise<http.Response> {
    const _userId: number = await bn.UserSystem.getId(_username)
    _cs.userId = _userId

    return await new Promise<http.Response>((resolve: (result: http.Response) => void): void => {
      const result: http.Response = http.defaultResponse()
      const err: string[] = []

      if (_.isEmpty(_cs.name)) {
        err.push('name-empty')
      }

      if (!_.isEmpty(_cs.name) && _cs.name.length > 100) {
        err.push('name-maxlength')
      }

      if (_.isEmpty(_cs.context)) {
        err.push('context-empty')
      }

      const ok: boolean = err.length == 0
      if (ok) {
        const filePath: string = `/front-end/src/views/LoginView.vue`
        util.writeContentFileSync(_username, filePath, `<!--##name-system##-->`, _cs.name)

        const sc: bn.SystemContext = new bn.SystemContext(_cs.userId, _cs.name, _cs.context)
        sc.save((_id: number): void => {
          result.content = { id: _id }
          resolve(result)
        })
      } else {
        throw new Error(JSON.stringify(err))
      }
    })
  }
}
