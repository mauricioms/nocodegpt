import prompts from 'prompts'

import * as pgcontrol from './controller/page-controller'
import * as sccontrol from './controller/system-context-controller'
import * as pcontrol from './controller/prompt-controller'

import * as http from './http-protocol'
import * as bn from './business'

async function main(): Promise<void> {
  const user: { username: string } = await prompts([
    {
      type: 'text',
      name: 'username',
      message: 'Username:'
    }
  ])

  const _username: string = user.username

  const r1: { name: string; context: string } = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Name of Context:'
    },
    {
      type: 'text',
      name: 'context',
      message: 'Context of System:'
    }
  ])

  const sc: sccontrol.SystemContextController = new sccontrol.SystemContextController()
  const rs1: http.Response = await sc.fnPostSystemContext(r1 as bn.SystemContext, _username)
  console.log(r1, rs1)

  const r2: { name: string; description: string } = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Name of Page:'
    },
    {
      type: 'text',
      name: 'description',
      message: 'Description of Page:'
    }
  ])

  const pc: pgcontrol.PageController = new pgcontrol.PageController()
  const rs2: http.Response = await pc.fnPostPage(r2 as bn.Page, _username)
  console.log(r2, rs2)
  const _pageId: number = rs2.content as number

  while (true) {
    const q: { isadd: string } = await prompts([
      {
        type: 'text',
        name: 'isadd',
        message: 'Add Prompt:'
      }
    ])

    if (q.isadd != 'N') {
      const r3: { chat: string; type: number } = await prompts([
        {
          type: 'text',
          name: 'chat',
          message: 'Prompt:'
        },
        {
          type: 'number',
          name: 'type',
          message: 'Type:'
        }
      ])
      const p: pcontrol.PromptController = new pcontrol.PromptController()
      const rs3: http.Response = await p.fnPutPrompt(_pageId, r3, _username)
      console.log(r3, rs3)
    } else {
      break
    }
  }
}

bn.createTables()
  .then((): void => {
    main()
      .then((): void => {
        console.log('Done.')
      })
      .catch((err: Error): void => {
        console.log(err)
      })
  })
  .catch((err: Error): void => {
    console.log(err)
  })
