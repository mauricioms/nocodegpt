export interface Status {
  code: number
  message: string
}

export interface Response {
  status: Status
  content: unknown
  token?: string | null
}

export module http {
  export async function DELETE(_url: string): Promise<unknown> {
    return await callUrlJson('DELETE', _url)
  }
  export async function PUT(_url: string, _data: unknown): Promise<unknown> {
    return await callUrlJson('PUT', _url, _data)
  }
  export async function POST(_url: string, _data: unknown): Promise<unknown> {
    return await callUrlJson('POST', _url, _data)
  }
  export async function GET(_url: string): Promise<unknown> {
    return await callUrlJson('GET', _url)
  }

  export async function HTML(_url: string): Promise<string> {
    return await callUrlHTML('GET', _url)
  }

  export async function callUrlJson(_method = 'GET', _url: string, _data: unknown = null): Promise<unknown> {
    // Default options are marked with *

    const myHeaders: Headers = new Headers({
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    })

    const token: string = localStorage.getItem('auth-token') as string
    myHeaders.append('Authorization', `Bearer ${token}`)

    const myInit: any = {
      headers: myHeaders,
      method: _method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: _data ? JSON.stringify(_data) : null // body data type must match "Content-Type" header
    }

    const myRequest = new Request(_url, myInit)
    const response = await fetch(myRequest)
    if (!response.ok) {
      const error = await response.text()
      throw JSON.parse(new Error(error).message)
    }
    return response.json()
  }

  export async function callUrlHTML(_method = 'GET', _url: string, _data: unknown = null): Promise<string> {
    // Default options are marked with *

    const myHeaders: Headers = new Headers({
      'Content-Type': 'text/html'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    })

    const token: string = localStorage.getItem('auth-token') as string
    myHeaders.append('Authorization', `Bearer ${token}`)

    const myInit: any = {
      headers: myHeaders,
      method: _method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: _data ? JSON.stringify(_data) : null // body data type must match "Content-Type" header
    }

    const myRequest = new Request(_url, myInit)
    const response = await fetch(myRequest)
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }
    return response.text()
  }
}
