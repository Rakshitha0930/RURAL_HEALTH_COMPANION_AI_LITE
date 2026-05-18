import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaRobot, FaUser, FaPaperPlane, FaTrash } from 'react-icons/fa'
import api from '../lib/axios'
import LoadingSpinner from '../components/common/LoadingSpinner'
import clsx from 'clsx'

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hello! I'm your Rural Health Companion AI. I can help answer general health questions, explain symptoms, and guide you on when to seek medical care. How can I help you today?\n\n⚠️ Remember: I provide general information only — always consult a doctor for medical advice.",
}

export default function AIChatPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const chatMutation = useMutation({
    mutationFn: async (userMessage) => {
      const { data } = await api.post('/ai/chat', {
        message: userMessage,
        history: messages.slice(-10), // send last 10 messages for context
      })
      return data
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ])
    },
    onError: () => {
      toast.error('Failed to get a response. Please try again.')
    },
  })

  const handleSend = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || chatMutation.isPending) return

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    chatMutation.mutate(trimmed)
  }

  const handleClear = () => {
    setMessages([INITIAL_MESSAGE])
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5 text-health-blue">
            <FaRobot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">AI Health Assistant</h1>
            <p className="text-xs text-gray-500">Powered by Gemini AI</p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="btn-secondary gap-1.5 text-xs px-3 py-2"
          title="Clear conversation"
        >
          <FaTrash className="h-3 w-3" />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={clsx('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            {/* Avatar */}
            <div
              className={clsx(
                'flex-shrink-0 rounded-full p-2 self-end',
                msg.role === 'user'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-blue-100 text-health-blue'
              )}
            >
              {msg.role === 'user' ? (
                <FaUser className="h-3.5 w-3.5" />
              ) : (
                <FaRobot className="h-3.5 w-3.5" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={clsx(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                msg.role === 'user'
                  ? 'rounded-br-sm bg-primary-600 text-white'
                  : 'rounded-bl-sm bg-gray-100 text-gray-800'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {chatMutation.isPending && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-100 p-2 text-health-blue self-end">
              <FaRobot className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a health question…"
          className="input-field flex-1"
          disabled={chatMutation.isPending}
        />
        <button
          type="submit"
          disabled={!input.trim() || chatMutation.isPending}
          className="btn-primary px-4"
          aria-label="Send message"
        >
          <FaPaperPlane className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
