export type FunnelStage = "new_lead" | "in_negotiation" | "waiting_payment" | "sold"

export interface Customer {
  id: string
  name: string
  phone: string
  funnelStage: FunnelStage
  interestedProduct: string
  lastInteraction: string
}

export interface Message {
  id: string
  sender: "customer" | "agent"
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  customerId: string
  customerName: string
  messages: Message[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}
