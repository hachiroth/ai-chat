import type { IContext, IConversation, IUser } from '@ai-chat/typed'
import { http } from './http'

const SERVER_DOMAIN = import.meta.env.DEV ? 'http://localhost:3000/api/' : import.meta.env.VITE_SERVER_DOMAIN

const { get, post, put, delete: remove } = http(SERVER_DOMAIN)

const conversations = {
  create: () => post<IConversation>('conversations'),
  resume: (id: string) => get<IContext[]>(`conversations/${id}`),
  setTitle: (id: string, title: string) => put(`conversations/${id}`, { title }),
  remove: (id: string) => remove(`conversations/${id}`),
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
  conversations: (uid: string) => get(`users/${uid}/conversations`),
}

export default {
  contexts,
  conversations,
  ai,
  auth,
  users,
}
