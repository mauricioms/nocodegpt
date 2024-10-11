import fs from 'fs'
import * as gpt from '../openai'
import moment from 'moment'
import { Database } from 'sqlite3'

const db: Database = new Database('make_wizard.db')

export async function createTables(): Promise<void> {
  await new Promise<void>((resolve: () => void): void => {
    db.exec(fs.readFileSync(__dirname + '/database.sql').toString())
    resolve()
  })
}

export enum TypeModule {
  FRONTEND = 'F',
  BACKEND = 'B',
  DATABASE = 'D'
}

export const PATH_FRONTEND: string = '/front-end/src/views'
export const PATH_BACKEND: string = '/back-end'

export class SystemContext {
  constructor(
    public userId: number,
    public name: string,
    public context: string,
    public id: number = 0
  ) {}

  save(
    callback: (_id: number) => void = (_id: number): void => {
      console.log(`ID: ${_id}`)
    }
  ): void {
    let sql: string = `INSERT OR REPLACE INTO tb_system_context (name, context, user_id) VALUES('${this.name}', '${this.context}', ${this.userId}) RETURNING id`
    if (this.id > 0) {
      sql = `INSERT OR REPLACE INTO tb_system_context (id, name, context, user_id) VALUES(${this.id}, '${this.name}', '${this.context}', ${this.userId}) RETURNING id`
    }

    const rs: unknown = db.exec(sql)
    console.log(`SQL: ${sql}`)
    console.log(`Result: `, rs)
    sql = `SELECT MAX(id) as id FROM tb_system_context `
    db.get(sql, (_, _rs: { id: number }): void => {
      console.log(`SQL: ${sql}`)
      callback(_rs?.id)
    })
  }

  destroy(): void {
    if (this.id > 0) {
      const sql: string = `DELETE FROM tb_system_context WHERE id = ${this.id}`
      const rs: unknown = db.exec(sql)
      console.log(`SQL: ${sql}`)
      console.log(`Result: `, rs)
    }
  }

  static async get(_id: number): Promise<SystemContext> {
    return await new Promise<SystemContext>((resolve: (m: SystemContext) => void): void => {
      const sql: string = `SELECT cs.id, cs.name, context, user_id as userId FROM tb_system_context cs INNER JOIN tb_user_system tus ON tus.id = cs.user_id WHERE cs.id = ${_id}`
      db.get(sql, (_, _rs: SystemContext): void => {
        resolve(new SystemContext(_rs.userId, _rs.name, _rs.context, _rs.id))
      })
      console.log(`SQL: ${sql}`)
    })
  }

  static async getByUsername(_username: string): Promise<SystemContext | null> {
    return await new Promise<SystemContext | null>((resolve: (m: SystemContext | null) => void): void => {
      const sql: string = `SELECT cs.id, cs.name, context, user_id as userId FROM tb_system_context cs INNER JOIN tb_user_system tus ON tus.id = cs.user_id WHERE tus.username = '${_username}'`
      db.get(sql, (_, _rs: SystemContext): void => {
        if (_rs) {
          resolve(new SystemContext(_rs.userId, _rs.name, _rs.context, _rs.id))
        } else {
          resolve(null)
        }
      })
      console.log(`SQL: ${sql}`)
    })
  }

  static async list(pageId: number = 0): Promise<SystemContext[]> {
    return await new Promise<SystemContext[]>((resolve: (m: SystemContext[]) => void): void => {
      let sql: string = `SELECT id, name, context, user_id as pageId FROM tb_system_context`
      if (pageId > 0) {
        sql += ` WHERE page_id = ${pageId}`
      }

      db.all(sql, (_, _result: SystemContext[]): void => {
        resolve(
          _result.map((_rs: SystemContext): SystemContext => {
            return new SystemContext(_rs.userId, _rs.name, _rs.context, _rs.id)
          })
        )
      })
      console.log(`SQL: ${sql}`)
    })
  }
}

export class FilePage {
  static async listRequest(_pageId: number, _requestId: number): Promise<FilePage[]> {
    return new Promise<FilePage[]>((resolve: (_files: FilePage[]) => void): void => {
      const sql: string = `
SELECT   path, name, type, pageId, requestId, (SELECT content FROM tb_file as f WHERE f.path = fp.path AND f.request_id = fp.requestId) as content FROM (
	SELECT   tf.path, tf.name, tf.type, tf.page_id as pageId, max(tf.request_id) as requestId 
	FROM tb_file tf INNER JOIN tb_page tp ON tp.id = tf.page_id
	WHERE page_id = ${_pageId} AND tp.deleted = 0 AND tf.request_id <= ${_requestId} 
	GROUP BY tf.path, tf.name, tf.type, tf.page_id
) as fp
      `
      db.all(sql, (_, _rs: FilePage[] | null): void => {
        if (_rs) {
          resolve(
            _rs.map((_f: FilePage): FilePage => {
              return new FilePage(_f.pageId, _f.requestId, _f.path, _f.name, _f.type, _f.content)
            })
          )
        } else {
          resolve([])
        }
      })
    })
  }

  constructor(
    public pageId: number,
    public requestId: number,
    public path: string,
    public name: string,
    public type: string,
    public content: string = ''
  ) {}

  async updateContent(_template: string): Promise<void> {
    return await new Promise<void>((callback: () => void): void => {
      const sql: string = `UPDATE tb_file SET content = '${_template.replaceAll("'", "''")}' WHERE "path"='${this.path}';`
      db.exec(sql, callback)
    })
  }

  async save(): Promise<void> {
    return await new Promise<void>((resolve: () => void): void => {
      if (this.path && this.path.trim() != '') {
        const sql: string = `INSERT OR REPLACE INTO tb_file (path, type, name, page_id, request_id, content) VALUES ('${this.path}', '${this.type}', '${this.name}', ${this.pageId}, ${this.requestId}, '${this.content.replaceAll("'", "''")}') RETURNING path`
        db.exec(sql, (): void => {
          //console.log(`SQL: ${sql}`)
          console.log(`Create FilePage: ${this.path}`)
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  destroy(): void {
    if (this.path != null) {
      const sql: string = `DELETE FROM tb_file WHERE path = '${this.path}'`
      const rs: unknown = db.exec(sql)
      console.log(`SQL: ${sql}`)
      console.log(`Result: `, rs)
    }
  }

  static async get(_path: string): Promise<FilePage> {
    return await new Promise<FilePage>((resolve: (m: FilePage) => void): void => {
      const sql: string = `SELECT path, name, type, page_id as pageId, request_id as requestId, content FROM tb_file WHERE path = '${_path}'`
      db.get(sql, (_, _rs: FilePage): void => {
        resolve(new FilePage(_rs.pageId, _rs.requestId, _rs.path, _rs.name, _rs.type, _rs.content))
      })
      console.log(`SQL: ${sql}`)
    })
  }

  static async listAllSystem(_username: string, _pageId: number): Promise<FilePage[]> {
    return new Promise<FilePage[]>((resolve: (_files: FilePage[]) => void): void => {
      const sql: string = `
SELECT   path, name, type, requestId, (SELECT content FROM tb_file as f WHERE f.path = fp.path AND f.request_id = fp.requestId) as content FROM (
	SELECT   tf.path, tf.name, tf.type, max(tf.request_id) as requestId 
	FROM tb_file tf INNER JOIN tb_page tp ON tp.id = tf.page_id
	WHERE tp.deleted = 0 AND tf.request_id <= tp.request_id AND tp.user_id = (SELECT id FROM tb_user_system us WHERE us.username  = 'user08') 
	GROUP BY tf.path, tf.name, tf.type
) as fp
      `
      db.all(sql, (_, _rs: FilePage[] | null): void => {
        if (_rs) {
          resolve(
            _rs.map((_f: FilePage): FilePage => {
              return new FilePage(_pageId, _f.requestId, _f.path, _f.name, _f.type, _f.content)
            })
          )
        } else {
          resolve([])
        }
      })
    })
  }

  static async listLast(_pageId: number): Promise<FilePage[]> {
    return new Promise<FilePage[]>((resolve: (_files: FilePage[]) => void): void => {
      const sql: string = `
SELECT   path, name, type, pageId, requestId, (SELECT content FROM tb_file as f WHERE f.path = fp.path AND f.request_id = fp.requestId) as content FROM (
	SELECT   tf.path, tf.name, tf.type, tf.page_id as pageId, max(tf.request_id) as requestId 
	FROM tb_file tf INNER JOIN tb_page tp ON tp.id = tf.page_id
	WHERE page_id = ${_pageId} AND tp.deleted = 0 AND tf.request_id <= tp.request_id
	GROUP BY tf.path, tf.name, tf.type, tf.page_id
) as fp
      `
      db.all(sql, (_, _rs: FilePage[] | null): void => {
        if (_rs) {
          resolve(
            _rs.map((_f: FilePage): FilePage => {
              return new FilePage(_f.pageId, _f.requestId, _f.path, _f.name, _f.type, _f.content)
            })
          )
        } else {
          resolve([])
        }
      })
    })
  }

  static async list(pageId: number = 0): Promise<FilePage[]> {
    return await new Promise<FilePage[]>((resolve: (m: FilePage[]) => void): void => {
      let sql: string = `SELECT path, name, type, page_id as pageId, request_id as requestId, content FROM tb_file`
      if (pageId > 0) {
        sql += ` WHERE page_id = ${pageId}`
      }

      db.all(sql, (_, _rs: FilePage[] | null): void => {
        if (_rs) {
          resolve(
            _rs.map((_f: FilePage): FilePage => {
              return new FilePage(_f.pageId, _f.requestId, _f.path, _f.name, _f.type, _f.content)
            })
          )
        } else {
          resolve([])
        }
      })
      console.log(`SQL: ${sql}`)
    })
  }
}

export class FileTemplate {
  constructor(
    public path: string,
    public content: string,
    public key: string | null,
    public id: number = 0
  ) {}

  save(callback: () => void = (): void => {}): void {
    let sql: string = `INSERT OR REPLACE INTO tb_file_template (path, content, key_templaye) VALUES ('${this.path}', '${this.template.replaceAll("'", "''")}', '${this.key}') RETURNING id`

    if (this.id > 0) {
      sql = `INSERT OR REPLACE INTO tb_file_template (id, path, content, key_templaye) VALUES (${this.id},'${this.path}', '${this.template.replaceAll("'", "''")}', '${this.key}') RETURNING id`
    }

    db.exec(sql, (): void => {
      console.log(`SQL: ${sql}`)
      callback()
    })
  }

  destroy(): void {
    if (this.id > 0) {
      const sql: string = `DELETE FROM tb_file_template WHERE id = ${this.id}`
      db.exec(sql, (): void => {
        console.log(`SQL: ${sql}`)
      })
    }
  }

  static async get(_id: number): Promise<FileTemplate> {
    return await new Promise<FileTemplate>((resolve: (m: FileTemplate) => void): void => {
      const sql: string = `SELECT id, "path", content, key_template as key FROM tb_file_template WHERE id = ${_id}`
      db.get(sql, (_, _f: FileTemplate): void => {
        resolve(new FileTemplate(_f.path, _f.content, _f.key, _f.id))
      })
      console.log(`SQL: ${sql}`)
    })
  }

  static async list(): Promise<FileTemplate[]> {
    return await new Promise<FileTemplate[]>((resolve: (m: FileTemplate[]) => void): void => {
      const sql: string = `SELECT id, "path", content, key_template as key FROM tb_file_template`

      db.all(sql, (_, _rs: FileTemplate[]): void => {
        resolve(
          _rs.map((_f: FileTemplate): FileTemplate => {
            return new FileTemplate(_f.path, _f.content, _f.key, _f.id)
          })
        )
      })
      console.log(`SQL: ${sql}`)
    })
  }
}

export enum TypePrompt {
  INITIAL = 1,
  FEATURE = 2,
  BUG_FIXING = 3,
  LAYOUT = 4,
  OTHER = 5
}

export class PromptType {
  constructor(
    public name: string,
    public messageSystem: string | null = null,
    public messageUser: string | null = null,
    public extensions: string | null,
    public id: number = 0
  ) {}

  static async get(_id: number): Promise<PromptType | null> {
    return await new Promise<PromptType | null>((resolve: (m: PromptType | null) => void): void => {
      const sql: string = `SELECT id, name, message_system as messageSystem, message_user as messageUser, file_extension as extensions FROM tb_prompt_type WHERE id = ${_id}`
      db.get(sql, (_, _rs: PromptType): void => {
        if (_rs) {
          resolve(new PromptType(_rs.name, _rs.messageSystem, _rs.messageUser, _rs.extensions, _rs.id))
        } else {
          resolve(null)
        }
      })
      console.log(`SQL: ${sql}`)
    })
  }

  static async list(): Promise<PromptType[]> {
    return await new Promise<PromptType[]>((resolve: (m: PromptType[]) => void): void => {
      const sql: string = `SELECT id, name, message_system as messageSystem, message_user as messageUser, file_extension as extensions FROM tb_prompt_type `
      db.all(sql, (_, _rs: PromptType[]): void => {
        resolve(
          _rs.map((_f: PromptType): PromptType => {
            return new PromptType(_f.name, _f.messageSystem, _f.messageUser, _f.extensions, _f.id)
          })
        )
      })
      console.log(`SQL: ${sql}`)
    })
  }
}

export class PromptRequest {
  constructor(
    public pageId: number,
    public content: string,
    public typeId: number,
    public contentFull: string,
    public role: string = gpt.TypeMessage.user,
    public id: number = 0
  ) {
    this.promptType = new PromptType('', null, null, '', typeId)
  }

  async listResponse(): Promise<PromptResponse[]> {
    return await PromptResponse.list(this.id)
  }

  public previousId: number = 0
  public responses: PromptResponse[] = []
  public promptType: PromptType | null = null

  async save(): Promise<number> {
    return await new Promise<number>((resolve: (_id: number) => void): void => {
      db.get(`SELECT request_id FROM tb_page WHERE id = ${this.pageId}`, (_, _ts: { request_id: number }): void => {
        let sql: string = ``

        if (this.id > 0) {
          sql = `INSERT OR REPLACE INTO tb_prompt_request (id, role, content, content_full, type_id, page_id) VALUES (${this.id}, '${this.role}', '${this.content.replaceAll("'", "''")}', '${this.contentFull.replaceAll("'", "''")}', ${this.typeId}, ${this.pageId})`
        } else {
          const requestId: number = _ts.request_id || 0
          sql = `INSERT OR REPLACE INTO tb_prompt_request (role, content, content_full, type_id, page_id, previous_id) VALUES ('${this.role}', '${this.content.replaceAll("'", "''")}', '${this.contentFull.replaceAll("'", "''")}', ${this.typeId}, ${this.pageId}, ${requestId})`
        }

        db.exec(sql, (): void => {
          sql = `SELECT MAX(id) as id FROM tb_prompt_request `
          db.get(sql, (_, _rs: { id: number }): void => {
            console.log(`SQL: ${sql}`)
            resolve(_rs?.id)
          })
        })
      })
    })
  }

  destroy(): void {
    if (this.id > 0) {
      const sql: string = `DELETE FROM tb_prompt_request WHERE id = ${this.id}`
      const rs: unknown = db.exec(sql)
      console.log(`SQL: ${sql}`)
      console.log(`Result: `, rs)
    }
  }

  static async get(_id: number): Promise<PromptRequest> {
    return await new Promise<PromptRequest>((resolve: (m: PromptRequest) => void): void => {
      const sql: string = `SELECT id, role, content, type_id as typeId, page_id as pageId, previous_id as previousId FROM tb_prompt_request WHERE id = ${_id}`
      db.get(sql, (_, _rs: PromptRequest): void => {
        const pr: PromptRequest = new PromptRequest(
          _rs.pageId,
          _rs.content,
          _rs.typeId,
          _rs.contentFull,
          _rs.role,
          _rs.id
        )
        pr.previousId = _rs.previousId
        resolve(pr)
      })
      console.log(`SQL: ${sql}`)
    })
  }

  static async list(pageId: number = 0): Promise<PromptRequest[]> {
    async function loadPromptResponse(_rs: PromptRequest[]): Promise<PromptRequest[]> {
      const rs: PromptRequest[] = []
      for await (const _pr of _rs) {
        const pr: PromptRequest = new PromptRequest(
          _pr.pageId,
          _pr.content,
          _pr.typeId,
          _pr.contentFull,
          _pr.role,
          _pr.id
        )
        pr.previousId = _pr.previousId
        pr.promptType = await PromptType.get(_pr.typeId)
        pr.responses = await pr.listResponse()
        rs.push(pr)
      }
      return rs
    }

    return await new Promise<PromptRequest[]>(
      (resolve: (m: PromptRequest[]) => void, reject: (err: Error) => void): void => {
        if (pageId > 0) {
          const sql: string = `SELECT id, role, content, content_full as contentFull, type_id as typeId, page_id as pageId, previous_id as previousId FROM tb_prompt_request WHERE deleted = false AND page_id = ${pageId}`
          db.all(sql, (_, _rs: PromptRequest[]): void => {
            loadPromptResponse(_rs)
              .then((rs: PromptRequest[]): void => {
                resolve(rs)
              })
              .catch((err: Error): void => {
                reject(err)
              })
          })
        } else {
          const sql: string =
            'SELECT id, role, content, content_full as contentFull, type_id as typeId, page_id as pageId, previous_id as previousId FROM tb_prompt_request WHERE deleted = false '
          db.all(sql, (_, _rs: PromptRequest[]): void => {
            loadPromptResponse(_rs)
              .then((rs: PromptRequest[]): void => {
                resolve(rs)
              })
              .catch((err: Error): void => {
                reject(err)
              })
          })
        }
      }
    )
  }
}

export class PromptResponse {
  constructor(
    public requestId: number = 0,
    public message: string,
    public id: string = 'bad-request-error-' + moment().format('YYYY-MM-DD-HH:mm:ss'),
    public object: string = '',
    public created: string = moment().format('YYYY-MM-DD HH:mm:ss'),
    public model: string = '',
    public idx: number = 0,
    public prompt_tokens: number = 0,
    public completion_tokens: number = 0,
    public total_tokens: number = 0
  ) {}

  async save(): Promise<void> {
    return await new Promise((resolve: () => void): void => {
      if (this.id != '') {
        const sql: string = `
INSERT INTO tb_prompt_response (id, "object", created, model, idx, message, prompt_tokens, completion_tokens, total_tokens, request_id)
VALUES(
  '${this.id}', 
  '${this.object}', 
  '${this.created}', 
  '${this.model}', 
  ${this.idx}, 
  '${this.message.replaceAll("'", "''")}', 
  ${this.prompt_tokens}, 
  ${this.completion_tokens}, 
  ${this.total_tokens}, 
  ${this.requestId}
);`
        db.exec(sql, (): void => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  destroy(): void {
    if (this.id != null) {
      const sql: string = `DELETE FROM tb_prompt_request WHERE id = '${this.id}' `
      const rs: unknown = db.exec(sql)
      console.log(`SQL: ${sql}`)
      console.log(`Result: `, rs)
    }
  }

  static async get(_id: string): Promise<PromptResponse> {
    return await new Promise<PromptResponse>((resolve: (m: PromptResponse) => void): void => {
      const sql: string = `SELECT id, "object", created, model, idx, message, prompt_tokens, completion_tokens, total_tokens, request_id FROM tb_prompt_response WHERE id = '${_id}'`
      db.get(sql, (_, pr: PromptResponse): void => {
        resolve(
          new PromptResponse(
            0,
            pr.message,
            pr.id,
            pr.object,
            pr.created,
            pr.model,
            pr.idx,
            pr.prompt_tokens,
            pr.completion_tokens,
            pr.total_tokens
          )
        )
      })
      console.log(`SQL: ${sql}`)
    })
  }

  static async list(requestId: number = 0): Promise<PromptResponse[]> {
    let whereStr: string = ''

    if (requestId > 0) {
      whereStr = `WHERE request_id = ${requestId}`
    }

    const sql: string =
      'SELECT id, "object", created, model, idx, message, prompt_tokens, completion_tokens, total_tokens FROM tb_prompt_response ' +
      whereStr

    return await new Promise<PromptResponse[]>((resolve: (m: PromptResponse[]) => void): void => {
      db.all(sql, (_, _rs: PromptResponse[]): void => {
        resolve(
          _rs.map((pr: PromptResponse): PromptResponse => {
            return new PromptResponse(
              requestId,
              pr.message,
              pr.id,
              pr.object,
              pr.created,
              pr.model,
              pr.idx,
              pr.prompt_tokens,
              pr.completion_tokens,
              pr.total_tokens
            )
          })
        )
      })
      console.log(`SQL: ${sql}`)
    })
  }
}

export class Page {
  constructor(
    public userId: number,
    public name: string = '',
    public description: string = '',
    public requestId: number = 0,
    public id: number = 0
  ) {}

  async listFiles(): Promise<FilePage[]> {
    return await FilePage.list(this.id)
  }

  public requests: PromptRequest[] = []
  public files: FilePage[] = []

  async listPromptRequest(): Promise<PromptRequest[]> {
    return await PromptRequest.list(this.id)
  }

  updateRequestId(_requestId: number): void {
    this.requestId = _requestId
    const sql: string = `UPDATE tb_page SET request_id = ${_requestId} WHERE id = ${this.id}`
    const rs: unknown = db.exec(sql)
    console.log(`Result: `, rs)
    console.log(`SQL: ${sql}`)
  }

  async save(): Promise<number> {
    return await new Promise<number>((resolve: (_id: number) => void): void => {
      let sql: string = ``

      if (this.id > 0) {
        sql = `INSERT OR REPLACE INTO tb_page (id, name, description, user_id, request_id) VALUES (${this.id}, '${this.name}', '${this.description}', '${this.userId}', ${this.requestId}) RETURNING id`
      } else {
        sql = `INSERT INTO tb_page (name, description, user_id, request_id) VALUES ('${this.name}', '${this.description}', '${this.userId}', ${this.requestId}) RETURNING id`
      }

      const rs: unknown = db.exec(sql)
      console.log(`Result: `, rs)
      console.log(`SQL: ${sql}`)

      if (this.id > 0) {
        resolve(this.id)
      } else {
        sql = `SELECT MAX(id) as id FROM tb_page `
        db.get(sql, (_, _rs: { id: number }): void => {
          resolve(_rs?.id)
        })
        console.log(`SQL: ${sql}`)
      }
    })
  }

  destroy(): void {
    if (this.id > 0) {
      const sql: string = `DELETE FROM tb_page WHERE id = ${this.id}`
      const rs: unknown = db.exec(sql)
      console.log(`Result: `, rs)
    }
  }

  static async getByName(_name: string, _username: string): Promise<Page | null> {
    return await new Promise<Page | null>((resolve: (m: Page | null) => void): void => {
      const sql: string = `SELECT us.id, us.name, description, user_id as userId, request_id as requestId FROM tb_page us INNER JOIN tb_user_system sys ON sys.id = us.user_id WHERE deleted = false AND us.name = '${_name}' AND  username = '${_username}'`

      db.get(sql, (_, _us: Page): void => {
        if (_us) {
          const us: Page = new Page(_us.userId, _us.name, _us.description, _us.requestId, _us.id)
          resolve(us)
        } else {
          resolve(null)
        }
      })
      console.log(`SQL: ${sql}`)
    })
  }

  static async get(_id: number): Promise<Page | null> {
    return await new Promise<Page | null>((resolve: (m: Page | null) => void): void => {
      const sql: string = `SELECT id, name, description, user_id as userId, request_id as requestId FROM tb_page WHERE id = ${_id}`

      db.get(sql, (_, _us: Page): void => {
        if (_us) {
          const us: Page = new Page(_us.userId, _us.name, _us.description, _us.requestId, _us.id)

          us.listPromptRequest()
            .then((_ls: PromptRequest[]): void => {
              us.requests = _ls

              us.listFiles()
                .then((_fs: FilePage[]): void => {
                  us.files = _fs
                  resolve(us)
                })
                .catch((): void => {})
            })
            .catch((): void => {})
        } else {
          resolve(null)
        }
      })
      console.log(`SQL: ${sql}`)
    })
  }

  static async list(_username: string): Promise<Page[]> {
    return await new Promise<Page[]>((resolve: (m: Page[]) => void): void => {
      const sql: string = `SELECT us.id, us.name, description, user_id, request_id as requestId FROM tb_page us INNER JOIN tb_user_system tus ON tus.id = us.user_id WHERE deleted = false AND tus.username = '${_username}';`
      db.all(sql, (_, _rs: Page[]): void => {
        resolve(
          _rs.map((_us: Page): Page => {
            const us: Page = new Page(_us.userId, _us.name, _us.description, _us.requestId, _us.id)
            return us
          })
        )
      })
      console.log(`SQL: ${sql}`)
    })
  }
}

export class UserSystem {
  constructor(
    public username: string,
    public name: string,
    public password: string,
    public host: string,
    public id: number = 0
  ) {}

  save(
    callback: (_id: number) => void = function (_id: number): void {
      console.log('ID:', _id)
    }
  ): void {
    let sql: string = `INSERT OR REPLACE INTO tb_user_system (name, username, password, host) VALUES('${this.name}', '${this.username}', '${this.password}', '${this.host}') RETURNING id`
    if (this.id > 0) {
      sql = `INSERT OR REPLACE INTO tb_user_system (id, name, username, password, host) VALUES(${this.id}, '${this.name}', '${this.username}', '${this.password}', '${this.host}') RETURNING id`
    }

    const rs: unknown = db.exec(sql)
    console.log(`SQL: ${sql}`)
    console.log(`Result: `, rs)

    const sqlId = `SELECT MAX(id) as id FROM tb_user_system `
    db.get(sqlId, (_, _rs: { id: number }): void => {
      callback(_rs?.id)
    })

    console.log(sqlId)
  }

  static async getPassword(_username: string): Promise<string> {
    return await new Promise<string>((resolve: (m: string) => void): void => {
      const sql: string = `SELECT password FROM tb_user_system WHERE username = '${_username}'`
      db.get(sql, (_, _obj: { password: string }): void => {
        resolve(_obj?.password || '')
      })
    })
  }

  static async getId(_username: string): Promise<number> {
    return await new Promise<number>((resolve: (m: number) => void): void => {
      const sql: string = `SELECT id FROM tb_user_system WHERE username = '${_username}'`
      db.get(sql, (_, _rs: { id: number }): void => {
        if (_rs) {
          console.log(`SQL: ${sql}`)
          resolve(_rs.id)
        } else {
          resolve(0)
        }
      })
    })
  }

  static async getUsername(_username: string): Promise<UserSystem | null> {
    return await new Promise<UserSystem | null>((resolve: (m: UserSystem | null) => void): void => {
      const sql: string = `SELECT id, name, username, password, host FROM tb_user_system WHERE username = '${_username}'`
      db.get(sql, (_, _us: UserSystem): void => {
        if (_us) {
          const us: UserSystem = new UserSystem(_us.username, _us.name, _us.password, _us.host, _us.id)
          console.log(`SQL: ${sql}`)
          resolve(us)
        } else {
          resolve(null)
        }
      })
    })
  }

  static async get(_id: number): Promise<UserSystem | null> {
    return await new Promise<UserSystem | null>((resolve: (m: UserSystem | null) => void): void => {
      const sql: string = `SELECT id, name, username, password, host FROM tb_user_system WHERE id = ${_id}`
      db.get(sql, (_, _us: UserSystem): void => {
        if (_us) {
          const us: UserSystem = new UserSystem(_us.username, _us.name, _us.password, _us.host, _us.id)
          console.log(`SQL: ${sql}`)
          resolve(us)
        } else {
          resolve(null)
        }
      })
    })
  }

  static async list(): Promise<UserSystem[]> {
    return await new Promise<UserSystem[]>((resolve: (m: UserSystem[]) => void): void => {
      const sql: string = `SELECT id, name, username, password, host FROM tb_user_system`
      db.all(sql, (_, _rs: UserSystem[]): void => {
        resolve(
          _rs.map((_us: UserSystem): UserSystem => {
            return new UserSystem(_us.username, _us.name, _us.password, _us.host, _us.id)
          })
        )
        console.log(`SQL: ${sql}`)
      })
    })
  }

  destroy(): void {
    if (this.username != null) {
      const sql: string = `DELETE FROM tb_user_system WHERE username = '${this.username}'`
      const rs: unknown = db.exec(sql)
      console.log(`SQL: ${sql}`)
      console.log(`Result: `, rs)
    }
  }
}
