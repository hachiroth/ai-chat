export interface IBase {
  _id: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface IUser extends IBase {
  username: string
  password: string
  avatar: string
}

export interface IConversation extends IBase {
  uid: string
  title: string
}

export type ContextRole = 'user' | 'assistant' | 'system'

export interface IContext extends IBase {
  uid: string
  role: ContextRole
  content: string
  conversationId: string
}

export interface EventSourceReturn<T = any> {
  event: string
  data: T
}
