import { http } from '@/fetch-api'

export interface SystemContext {
  pageId: number
  name: string
  context: string
  id: number
}

export interface PromptResponse {
  id: string
  object: string
  created: string
  model: string
  idx: number
  message: string
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  requestId: number
}

export interface PromptRequest {
  responses: PromptResponse[]
  pageId: number
  content: string
  typeId: number
  id: number
  role: string
}

export interface FilePage {
  pageId: number
  path: string
  moduleFile: string
}

export interface Page {
  requests: PromptRequest[]
  files: FilePage[]
  name: string
  description: string
  id: number
  requestId: number
}

export interface PromptType {
  id: number
  name: string
  message?: string
}

export async function PutPrompt(_id: number, _type: number, _message: string): Promise<{ ok: boolean }> {
  const obj: any = { chat: _message, type: _type, id: _id }
  return await http.POST(`/service/send-prompt`, obj).then((data: unknown): { ok: boolean } => {
    return (data as { content: { ok: boolean } }).content
  })
}

export async function SetTask(_id: number, _requestId: number): Promise<{ ok: boolean }> {
  return await http.GET(`/service/page/${_id}/prompt-request/${_requestId}`).then((data: unknown): { ok: boolean } => {
    return (data as { content: { ok: boolean } }).content
  })
}

export async function GetSystemContext(): Promise<SystemContext | null> {
  return await http.GET(`/service/system-context`).then((data: unknown): SystemContext | null => {
    return (data as { content: SystemContext | null }).content
  })
}

export async function PostSystemContext(obj: SystemContext): Promise<{ id: number }> {
  return await http.POST(`/service/system-context`, obj).then((data: unknown): { id: number } => {
    return (data as { content: { id: number } }).content
  })
}

export async function GetPromptTypeList(): Promise<PromptType[]> {
  return await http
    .GET(`/service/type-prompt-list`)
    .then((data: unknown): { list: PromptType[] } => {
      return (data as { content: { list: PromptType[] } }).content
    })
    .then((data: unknown): PromptType[] => {
      return (data as { list: PromptType[] }).list
    })
}

export async function GetPage(_id: number): Promise<Page> {
  return await http.GET(`/service/page/${_id}`).then((data: unknown): Page => {
    return (data as { content: Page }).content
  })
}

export async function PostPage(obj: Page): Promise<{ id: number }> {
  return await http.POST(`/service/page-new`, obj).then((data: unknown): { id: number } => {
    return (data as { content: { id: number } }).content
  })
}

export async function GetPageList(): Promise<Page[]> {
  return await http
    .GET(`/service/page-list`)
    .then((data: unknown): { list: Page[] } => {
      return (data as { content: { list: Page[] } }).content
    })
    .then((data: unknown): Page[] => {
      return (data as { list: Page[] }).list
    })
}

export async function GetMarkdown(_id: number): Promise<string> {
  return await http.HTML(`/service/markdown/${_id}`)
}

export { http, type Response, type Status } from '@/fetch-api'
