import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import * as bn from './business'
import OpenAI from 'openai'
import { BadRequestError } from 'openai/error.mjs'
import * as gpt from './openai'

export function restartCommand(username: string): void {
  execSync(`pm2 restart ${username}`)
}

export interface Code {
  name: string
  path: string
  language: string
  content: string
}

export function fnCodeLanguage(content: string, _name: string): Code[] {
  const rs: Code[] = []

  const codes: RegExpMatchArray | null = content.match(/```\w+\n[\s\S]*?\n```/g)
  if (codes) {
    for (const i in codes) {
      const _lang: RegExpMatchArray | null = codes[i].match(/```\w+/)
      const _content: string = codes[i].replace(/```\w+/, '').replace(/```/, '')
      if (_lang) {
        const _language: string = _lang[0].replace(/```/g, '')
        rs.push({ language: _language, content: _content, path: '', name: _name })
      }
    }
  }

  const fileNames: RegExpMatchArray | null = content.match(/\/(back-end|front-end)\/.*\.(sql|ts|vue)/g)
  if (fileNames) {
    let c: number = 0
    for (const i in fileNames) {
      const pathname: string = fileNames[i].replace(/`/g, '')
      if (rs[c]) {
        rs[c].path = pathname
        const _namef: RegExpMatchArray | null = pathname.match(/[^\/]+?(?=\.\w+$)\.(ts|vue|sql)/g)
        rs[c].name = _namef ? _namef[0] : _name
        c++
      }
    }
  }

  return rs
}

export interface Hash {
  [key: string]: bn.TypeModule
}

export const types: Hash = {
  vue: bn.TypeModule.FRONTEND,
  typescript: bn.TypeModule.BACKEND,
  sql: bn.TypeModule.DATABASE
}

export function readContentFileSync(_username: string, _path: string): string {
  if (_path && _path.trim() != '') {
    const context: string = __dirname + `/projects-data/${_username}`
    const filePath: string = `${context}${_path}`

    console.log(`Read File: ${filePath}`)

    const contents: string = readFileSync(filePath, 'utf-8') || ''
    return contents
  }

  return ''
}

export function writeContentFileSync(
  _username: string,
  _path: string,
  _text: string | null,
  _textReplace: string = ''
): void {
  if (_path && _path.trim() != '') {
    const context: string = __dirname + `/projects-data/${_username}`
    const filePath: string = `${context}${_path}`

    if (_text) {
      const contents: string = readFileSync(filePath, 'utf-8') || ''
      const replaced = contents.replace(new RegExp(_text, 'g'), _textReplace)
      writeFileSync(filePath, replaced, 'utf-8')
    } else {
      writeFileSync(filePath, _textReplace, 'utf-8')
    }
  }
}

export async function fnSendOpenAI(
  r: bn.PromptRequest,
  user: gpt.MessagePrompt,
  system: gpt.MessagePrompt,
  assistent: gpt.MessagePrompt
): Promise<string> {
  const content: string[] = []

  try {
    const chat: OpenAI.ChatCompletion = await gpt.prompt(user, system, assistent)

    for await (const _c of chat.choices) {
      content.push(_c.message.content + '\n\n')

      const s: bn.PromptResponse = new bn.PromptResponse(
        r.id,
        _c.message.content || '',
        chat.id,
        chat.object,
        chat.created + '',
        chat.model,
        _c.index,
        chat.usage?.prompt_tokens || 0,
        chat.usage?.completion_tokens || 0,
        chat.usage?.total_tokens || 0
      )

      await s.save()
    }
  } catch (error: unknown) {
    const err: Error = (error as BadRequestError).error as Error
    const s: bn.PromptResponse = new bn.PromptResponse(r.id, err.message)
    await s.save()
  }

  return content.join('\n')
}
