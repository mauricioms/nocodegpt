import _ from 'underscore'
import * as bn from '../business'
import * as util from '../util'
import * as http from '../http-protocol'
import * as prompt from './prompt-controller'
import * as gpt from '../openai'
const pc: prompt.PromptController = new prompt.PromptController()

export class PageController {
  private async writeFileTemplate(_username: string, _id: number, _params: gpt.Hash): Promise<void> {
    const ft: bn.FileTemplate = await bn.FileTemplate.get(_id)
    util.writeContentFileSync(
      _username,
      new gpt.FormatString(ft.path).formatKey(_params),
      ft.key,
      new gpt.FormatString(ft.content).formatKey(_params)
    )
  }

  private async addTemplates(_username: string, _name: string): Promise<void> {
    const _params: gpt.Hash = {
      name: _name,
      name_lowercase: _name.toLowerCase()
    }

    await this.writeFileTemplate(_username, 1, _params)
    await this.writeFileTemplate(_username, 2, _params)
    await this.writeFileTemplate(_username, 3, _params)
  }

  async get(_id: number): Promise<http.Response> {
    const result: http.Response = http.defaultResponse()
    const _pg: bn.Page | null = await bn.Page.get(_id)
    result.content = _pg
    return result
  }

  async list(_username: string): Promise<http.Response> {
    const result: http.Response = http.defaultResponse()
    const _ls: bn.Page[] = await bn.Page.list(_username)
    result.content = { list: _ls }
    return result
  }

  async fnPostPage(_body: bn.Page, _username: string): Promise<http.Response> {
    const err: string[] = []

    if (_.isEmpty(_body.name)) {
      err.push('name-empty')
    }

    if (_.isEmpty(_body.description)) {
      err.push('description-empty')
    }

    const _uss: bn.Page | null = await bn.Page.getByName(_body.name, _username)

    if (_uss) {
      err.push('name-exists')
    }

    const ok: boolean = err.length == 0
    if (ok) {
      const _userId: number = await bn.UserSystem.getId(_username)
      const _pg: bn.Page = new bn.Page(_userId, _body.name, _body.description)
      _pg.id = await _pg.save()

      await this.addTemplates(_username, _body.name)

      const _prompt: string = 'Build the Back-end and Front-end of the Web Application.'
      const result: http.Response = await pc.fnPutPrompt(
        _pg.id,
        { chat: _prompt, type: bn.TypePrompt.INITIAL },
        _username
      )

      result.content = { id: _pg.id }
      return result
    } else {
      throw new Error(JSON.stringify(err))
    }
  }
}
