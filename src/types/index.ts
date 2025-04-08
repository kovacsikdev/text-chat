export interface Message {
  id: string
  sender: string
  content: string
  timestamp: number
}

export interface ChatRoom {
  code: string
  messages: Message[]
} 