import * as pgcontrol from './controller/page-controller'
import * as bn from './business'
import * as sccontrol from './controller/system-context-controller'
import * as pcontrol from './controller/prompt-controller'
import * as http from './http-protocol'

const _username: string = 'mauricio'

async function main(): Promise<void> {
  const sc: sccontrol.SystemContextController = new sccontrol.SystemContextController()
  const rs1: http.Response = await sc.fnPostSystemContext(
    {
      name: 'ForumApp',
      context: `Fórum de perguntas e respostas simples. Neste fórum, os utilizadores podem fazer perguntas e também responder a perguntas propostas por outros utilizadores.`
    } as bn.SystemContext,
    _username
  )
  console.log('RS1:', rs1)

  const pc: pgcontrol.PageController = new pgcontrol.PageController()
  const rs2: http.Response = await pc.fnPostPage(
    {
      name: 'Question',
      description: `Eu gostaria de poder cadastrar perguntas nesta página.
Para cada pergunta, eu gostaria que o sistema armazenasse as seguintes informações: título, descrição, autor, data e hora.`
    } as bn.Page,
    _username
  )
  console.log('RS2:', rs2)
  const _pageId: number = (rs2.content as { id: number }).id

  const p: pcontrol.PromptController = new pcontrol.PromptController()
  const rs3: http.Response = await p.fnPutPrompt(
    _pageId,
    {
      chat: `Gostaria que a pagina lista-se em uma tabela as perguntas cadastradas, adicionando para cada registro um botão de excluir a pergunta já cadastrada.`,
      type: 2
    },
    _username
  )
  console.log('RS3:', rs3)
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
