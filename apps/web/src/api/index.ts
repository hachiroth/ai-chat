import type { IContext, IConversation, IUser } from '@ai-chat/typed'
import { http } from './http'

const { get, post, put } = http('http://localhost:3000/api/')

const conversations = {
  create: () => post<IConversation>('conversations'),
  resume: (id: string) => get<IContext[]>(`conversations/${id}`),
  setTitle: (id: string, title: string) => put(`conversations/${id}`, {title})
}

const contexts = {
  create: (content: string, conversationId: string) => post<IContext>('contexts', {
    content,
    conversationId,
  }),
}

const ai = {
  /**
   * Chat with AI. Call it before you have to call the `create()` in conversations and contexts.
   * @param conversationId Conversation ID. By `conversations.create()`
   * @param contextId Context ID. By `contexts.create()`
   * @returns AI replies
   */
  chat: (conversationId: string, contextId: string) => get(`chat/${conversationId}/${contextId}`),
}

const auth = {
  register: (username: string, password: string) => post<Omit<IUser, 'password'>>('auth/register', { username, password }),
  login: (username: string, password: string) => post<IUser>('auth/login', { username, password }),
  logout: () => post('auth/logout'),
}

const users = {
  me: () => get<IUser>('users/me'),
  conversations: (uid: string) => get(`users/${uid}/conversations`)
}

export default {
  contexts,
  conversations,
  ai,
  auth,
  users,
}
