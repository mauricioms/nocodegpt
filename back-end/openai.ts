import OpenAI from 'openai'

export interface Hash {
  [key: string]: string
}

export class FormatString {
  constructor(private value: string = '') {}
  public format(...args: string[]): string {
    return this.value.replace(/{(\d+)}/g, function (_match: string, _number: number): string {
      return typeof args[_number] != 'undefined' ? args[_number] : _match
    })
  }

  public formatArray(arrayString: string[]): string {
    let i: number = 0
    for (const a of arrayString) {
      this.value = this.formatIndex(a, i++)
    }
    return this.value
  }

  public formatKey(args: Hash): string {
    for (const key in args) {
      const valueReplace: string = args[key]
      this.value = this.value.replace(new RegExp(`\\{${key}\\}`, 'g'), valueReplace)
    }

    return this.value
  }

  public formatIndex(valueReplace: string, idx: number = 0): string {
    return this.value.replace(new RegExp(`\\{${idx}\\}`, 'g'), valueReplace)
  }

  public toString(): string {
    return this.value
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_TOKEN
})

export enum TypeMessage {
  system = 'system',
  user = 'user',
  assistant = 'assistant'
}

export interface Message {
  role: TypeMessage
  content: string
}

export interface GPT {
  maxTokens: number
  model: string
  calculateMaxTokens(_msg: Message[]): number
}

abstract class AbstractGPT implements GPT {
  constructor() {}

  abstract maxTokens: number
  abstract model: string

  calculateMaxTokens(_messages: Message[]): number {
    let _rs: number = this.maxTokens
    let _msg: string = ''

    for (const m of _messages) {
      _msg += m.content
    }

    if (_msg) {
      _rs = this.maxTokens - _msg.split(/\n| /gm).length
    }

    return _rs - 600
  }
}

export class GPT4 extends AbstractGPT {
  constructor(
    public maxTokens: number = 8191,
    public model: string = 'gpt-4'
  ) {
    super()
  }
}

const config: GPT = new GPT4()
const temperature: number = 0

export interface MessagePrompt {
  message: string
  params: Hash
}

export async function prompt(
  _userMessage: MessagePrompt,
  _systemMessage: MessagePrompt | null = null,
  _assistantMessage: MessagePrompt | null = null
): Promise<OpenAI.ChatCompletion> {
  const _messages: Message[] = []

  if (_systemMessage) {
    _messages.push({
      role: TypeMessage.system,
      content: new FormatString(_systemMessage.message).formatKey(_systemMessage.params)
    })
  }

  if (_assistantMessage) {
    _messages.push({
      role: TypeMessage.assistant,
      content: new FormatString(_assistantMessage.message).formatKey(_assistantMessage.params)
    })
  }

  _messages.push({
    role: TypeMessage.user,
    content: new FormatString(_userMessage.message).formatKey(_userMessage.params)
  })

  const response: OpenAI.ChatCompletion = await openai.chat.completions.create({
    model: config.model,
    messages: _messages,
    temperature: temperature,
    max_tokens: config.calculateMaxTokens(_messages),
    top_p: 1, // Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: [] //Up to four sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
  })

  return response
}
