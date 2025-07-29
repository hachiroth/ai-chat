import mongoose from 'mongoose'

const contextSchema = new mongoose.Schema({
  uid: {
    type: String,
    index: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    default: 'user',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  replyTo: String,
  conversationId: String,
}, {
  timestamps: true,
})

export const Context = mongoose.model('Context', contextSchema)
