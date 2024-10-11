/* eslint-disable */
import fs from 'fs'
import MarkdownIt from 'markdown-it'
import MarkdownItAttrs from 'markdown-it-attrs'
import MarkdownBlockEmbed from 'markdown-it-block-embed'
import MarkdownBlockquoteCite from 'markdown-it-blockquote-cite'
import MarkdownCollapsible from 'markdown-it-collapsible'
import MarkdownContainer from 'markdown-it-container'
import MarkdownEmoji from 'markdown-it-emoji'
import twemoji from 'twemoji'
import MarkdownFootnote from 'markdown-it-footnote'
import MarkdownGraphviz from 'markdown-it-graphviz'
import MarkdownKatex from 'markdown-it-katex'
import MarkdownLinkAttributes from 'markdown-it-link-attributes'
import MarkdownMark from 'markdown-it-mark'
import MarkdownMultimdTable from 'markdown-it-multimd-table'
import MarkdownReplacements from 'markdown-it-replacements'
import MarkdownSmartarrows from 'markdown-it-smartarrows'
import MarkdownSub from 'markdown-it-sub'
import MarkdownSup from 'markdown-it-sup'
import MarkdownTasks from 'markdown-it-tasks'
import MarkdownHeaderSections from 'markdown-it-header-sections'
import mermaidParse from 'mermaid-parse'
import bob from 'bob-wasm'

import hljs, { type HighlightResult } from 'highlight.js'

import javascript from 'highlight.js/lib/languages/javascript'
import cpp from 'highlight.js/lib/languages/cpp'
import c from 'highlight.js/lib/languages/c'
import python from 'highlight.js/lib/languages/python'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c', c)
hljs.registerLanguage('python', python)

interface Hash {}
type FnPromise = () => Promise<string>
type FnRule = (_tokens: Token[], i: number, options: Hash, env: Hash, obj: Self) => string | FnPromise

interface RuleHash {
  [key: string]: FnRule
}
type FnLine = (_children: unknown, _opt: Hash, _env: Hash) => string
type Nesting = 1 | 0 | -1

declare class Token {
  constructor(type: string, tag: string, nesting: Nesting)

  /**
   * Type of the token, e.g. "paragraph_open"
   */
  type: string

  /**
   * HTML tag name, e.g. "p"
   */
  tag: string

  /**
   * HTML attributes. Format: `[[name1, value1], [name2, value2]]`
   */
  attrs: [string, string][] | null

  /**
   * Source map info. Format: `[line_begin, line_end]`
   */
  map: [number, number] | null

  /**
   * Level change (number in {-1, 0, 1} set), where:
   *
   * - `1` means the tag is opening
   * - `0` means the tag is self-closing
   * - `-1` means the tag is closing
   */
  nesting: 1 | 0 | -1

  /**
   * nesting level, the same as `state.level`
   */
  level: number

  /**
   * An array of child nodes (inline and img tokens)
   */
  children: Token[] | null

  /**
   * In a case of self-closing tag (code, html, fence, etc.),
   * it has contents of this tag.
   */
  content: string

  /**
   * '*' or '_' for emphasis, fence string for fence, etc.
   */
  markup: string

  /**
   * Fence info string
   */
  info: string

  /**
   * A place for plugins to description an arbitrary data
   */
  meta: any

  /**
   * True for block-level tokens, false for inline tokens.
   * Used in renderer to calculate line breaks
   */
  block: boolean

  /**
   * If it's true, ignore this element when rendering. Used for tight lists
   * to hide paragraphs.
   */
  hidden: boolean

  /**
   * Search attribute index by name.
   */
  attrIndex(name: string): number

  /**
   * Add `[name, value]` attribute to list. Init attrs if necessary
   */
  attrPush(attrData: [string, string]): void

  /**
   * Set `name` attribute to `value`. Override old value if exists.
   */
  attrSet(name: string, value: string): void

  /**
   * Get the value of attribute `name`, or null if it does not exist.
   */
  attrGet(name: string): string | null

  /**
   * Join value to existing attribute via space. Or create new attribute if not
   * exists. Useful to operate with token classes.
   */
  attrJoin(name: string, value: string): void
}

interface Self {
  rules: RuleHash
  renderInline: FnLine
  renderer: {
    render: (tokens: Token[], options: Hash, env: Hash) => Promise<string>
  }
  renderToken: (tokens: Token[], i: number, options: Hash, env: Hash) => string
  options: Hash
  parse: (src: string, env: Hash) => Token[]
}

MarkdownIt.prototype.render = function (src: string, env: Hash) {
  env = env || {}

  this.renderer.render = async function (tokens: Token[], options: MarkdownIt.Options, env: Hash): Promise<string> {
    let result = ''
    const rules = this.rules

    let i: number = 0
    for await (const token of tokens) {
      const type: string = token.type
      if (type === 'inline') {
        result += this.renderInline(token.children, options, env)
      } else if (typeof rules[type] !== 'undefined') {
        const fnRule: FnRule = rules[type]
        let obj: unknown = fnRule(tokens, i, options, env, this)

        if (typeof obj == 'string') {
          result += obj
        } else {
          result += await obj
        }
      } else {
        result += await this.renderToken(tokens, i, options, env)
      }
      i++
    }

    return result
  }

  return this.renderer.render(this.parse(src, env), this.options, env)
}

function createCodeBox(hrValue: string, lang: string, source: string): string {
  let lineNumber: number = 1
  //const code: string = Buffer.from(source).toString('base64')
  const _html: string = hrValue.replace(/^/gm, function () {
    return '<span class="line-number-position">&#x200b;<span class="line-number">' + lineNumber++ + '</span></span>'
  })
  return _html
}

export class MDParse {
  constructor(
    private _md: MarkdownIt = new MarkdownIt({
      html: true,
      xhtmlOut: false,
      breaks: true,
      langPrefix: 'language-',
      linkify: true,
      typographer: true,
      quotes: '“”‘’',
      highlight: (str: string, lang: string) => {
        if (lang == 'vue') {
          lang = 'html'
        }

        const hr: HighlightResult = hljs.highlight(str, { language: lang, ignoreIllegals: false })

        const _html: string = createCodeBox(hr.value, lang, str)

        return _html

        return str
      }
    })
  ) {
    bob.loadWASM()

    _md.use(MarkdownItAttrs)
    _md.use(MarkdownBlockEmbed, {
      containerClassName: 'video-embed'
    })
    _md.use(MarkdownBlockquoteCite, { attributionPrefix: '---' })
    _md.use(MarkdownCollapsible)
    _md.use(MarkdownEmoji)
    _md.use(MarkdownFootnote)
    _md.use(MarkdownGraphviz)
    _md.use(MarkdownKatex)
    _md.use(MarkdownLinkAttributes, {
      attrs: {
        target: '_blank',
        rel: 'mddocs'
      }
    })
    _md.use(MarkdownMark)
    _md.use(MarkdownMultimdTable, {
      multiline: false,
      rowspan: false,
      headerless: false,
      multibody: true,
      aotolabel: true
    })
    _md.use(MarkdownReplacements)
    _md.use(MarkdownSmartarrows)
    _md.use(MarkdownSub)
    _md.use(MarkdownSup)
    _md.use(MarkdownTasks)
    _md.use(MarkdownHeaderSections)

    _md.use(function (md: any) {
      const temp = md.renderer.rules.fence.bind(md.renderer.rules)
      md.renderer.rules.fence = (tokens: any, idx: number, options: any, env: any, slf: any) => {
        const token = tokens[idx]
        const code = token.content.trim()
        if (token.info === 'bob') {
          return '<div class="bob">' + bob.render(code) + '</div>'
        }
        return temp(tokens, idx, options, env, slf)
      }
    })

    _md.use(function (md: any) {
      const temp = md.renderer.rules.fence.bind(md.renderer.rules)

      md.renderer.rules.fence = async (tokens: any, idx: number, options: any, env: any, slf: any) => {
        const token = tokens[idx]
        const code = token.content.trim()

        if (token.info === 'mermaid') {
          return await mermaidParse(code, { extension: 'svg' })
        }

        return temp(tokens, idx, options, env, slf)
      }
    })

    _md.renderer.rules.emoji = function (token: any, idx: number) {
      return twemoji.parse(token[idx].content)
    }

    _md.use(MarkdownContainer, 'warning', this._createHTMLContainer('warning', 'Atenção!'))
    _md.use(MarkdownContainer, 'error', this._createHTMLContainer('error', 'Proibído'))
    _md.use(MarkdownContainer, 'info', this._createHTMLContainer('info', 'Informação'))

    _md.use(MarkdownContainer, 'div-center', {
      render: (tokens: Token[], idx: number, _options: Hash) => {
        if (tokens[idx].nesting === 1) {
          return '<div class="div-center">'
        } else {
          return '</div>'
        }
      }
    })

    _md.use(MarkdownContainer, 'columns', {
      validate: function (params: string) {
        return params.trim().match(/^[columns|divide]/)
      },

      render: (tokens: any, idx: number, _options: any) => {
        if (tokens[idx].nesting === 1) {
          if (/^divide/.test(tokens[idx].info.trim())) {
            return '</td>\n<td class="td-divide">'
          } else {
            return '<table class="table-columns"><tbody><tr><td>'
          }
        } else {
          return '</td></tr></tbody></table>'
        }
      }
    })
  }

  private _createHTMLContainer(name: string, title: string) {
    return {
      render: (tokens: any, idx: number, _options: any) => {
        if (tokens[idx].nesting === 1) {
          tokens[idx].attrPush(['class', name])

          return `
<div class="md-container ${name}">
  <div class="md-container-body">
  <h5 class="md-container-title"><i class="md-container-icon"></i>${title}</h5>`
        } else {
          return `
  </div>
</div>
`
        }
      }
    }
  }

  readonly toHTML = async function (input: string = ''): Promise<string> {
    const css: string = fs.readFileSync('./md-parse/style.css', 'utf8')
    const katexCSS: string = fs.readFileSync('./node_modules/katex/dist/katex.min.css', 'utf8')
    const highlight: string = fs.readFileSync('./node_modules/highlight.js/styles/base16/github.css', 'utf8')

    return new Promise<string>((resolve: (html: string) => void) => {
      let render: Promise<string> = this._md.render(input) as Promise<string>

      render.then((output: string) => {
        output += '<style type="text/css">'
        output += css
        output += '</style>'

        output += '<style type="text/css">'
        output += katexCSS
        output += '</style>'

        output += '<style type="text/css">'
        output += highlight
        output += '</style>'

        output += '<script id="md" type="text/javascript">'
        output += `
async function sendCommand(_method, _url, _data)  {
    const myHeaders = new Headers({
      'Content-Type': 'application/json'
    })

    const token = localStorage.getItem('auth-token')
    myHeaders.append('Authorization', 'Bearer ' + token)

    const myInit = {
      headers: myHeaders,
      method: _method,
      mode: 'cors',
      cache: 'no-cache', 
      credentials: 'same-origin', 
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: _data ? JSON.stringify(_data) : null 
    }

    const myRequest = new Request(_url, myInit)
    const response = await fetch(myRequest)
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    return response.text()
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
  }
}

window.fnCopy = function fnCopy(lang, userStore, _code, element) {
  copyToClipboard(_code)
  element.style.backgroundColor = '#CCC'
  element.innerHTML = 'Copied'
  element.disabled = true
}
`
        output += '</script>'

        output += '<iframe name="command" style="display:none"></iframe>'
        output = '<div class="markdown">' + output + '</div>'

        resolve(output)
      })
    })
  }
}
