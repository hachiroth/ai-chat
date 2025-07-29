interface SparkConfig {
  apiPassword: string
}

export interface IMessage {
  role: string
  content: string
}

interface IRequest {
  model: 'lite'
  user: string
  messages: IMessage[]
  temperature?: number
  top_k?: number
  stream?: boolean
}

export interface IChoice {
  message?: IMessage
  delta?: IMessage
  index: number
}

export interface IUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface IStreamResponse {
  code: number
  message: string
  sid: string
  id: string
  created: number
  choices: IChoice[]
  usage: IUsage
}

export class Spark {
  private config: SparkConfig
  baseURL = 'https://spark-api-open.xf-yun.com/v1/chat/completions'

  constructor(config: SparkConfig) {
    this.config = config
  }

  async* chat(
    conversationId: string,
    messages: IMessage[],
  ): AsyncGenerator<string> {
    const data: IRequest = {
      model: 'lite',
      user: conversationId,
      messages,
      stream: true,
    }

    const headers = {
      'Authorization': `Bearer ${this.config.apiPassword}`,
      'Content-Type': 'application/json',
    }

    const resp = await fetch(this.baseURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!resp.body)
      throw new Error('No response body')

    const reader = resp.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done)
        break

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:'))
          continue

        const jsonStr = trimmed.slice(5).trim()
        if (jsonStr === '[DONE]') {
          yield jsonStr
          return
        }

        try {
          const parsed: IStreamResponse = JSON.parse(jsonStr)
          const delta = parsed.choices?.[0]?.delta
          if (delta?.content) {
            yield delta.content
          }
        }
        catch (err) {
          console.error(err)
          console.error('[chat] JSON parse error:', jsonStr)
        }
      }
    }
  }
}
