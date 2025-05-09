import type { Customer, Message, Conversation } from "./types"

export const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "João Silva",
    phone: "+55 11 98765-4321",
    funnelStage: "in_negotiation",
    interestedProduct: "Plano Premium Anual",
    lastInteraction: new Date().toISOString(),
  },
  {
    id: "cust-002",
    name: "Maria Oliveira",
    phone: "+55 21 97654-3210",
    funnelStage: "new_lead",
    interestedProduct: "Plano Básico Mensal",
    lastInteraction: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "cust-003",
    name: "Carlos Pereira",
    phone: "+55 31 96543-2109",
    funnelStage: "waiting_payment",
    interestedProduct: "Plano Intermediário Anual",
    lastInteraction: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
]

// Mensagens para João Silva
const joaoMessages: Message[] = [
  {
    id: "msg-001",
    sender: "agent",
    content: "Olá João, tudo bem? Como posso ajudar você hoje?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: "msg-002",
    sender: "customer",
    content: "Oi! Estou interessado no plano premium de vocês. Pode me dar mais informações?",
    timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(), // 29 minutes ago
  },
  {
    id: "msg-003",
    sender: "agent",
    content:
      "Claro! O plano premium inclui acesso a todas as funcionalidades da plataforma, suporte prioritário e até 10 usuários. Custa R$199/mês ou R$1990/ano com 2 meses grátis.",
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(), // 28 minutes ago
  },
  {
    id: "msg-004",
    sender: "customer",
    content: "Entendi. E tem algum desconto para pagamento anual?",
    timestamp: new Date(Date.now() - 1000 * 60 * 27).toISOString(), // 27 minutes ago
  },
  {
    id: "msg-005",
    sender: "agent",
    content: "Sim! No plano anual você economiza o equivalente a 2 meses, pagando R$1990 ao invés de R$2388.",
    timestamp: new Date(Date.now() - 1000 * 60 * 26).toISOString(), // 26 minutes ago
  },
  {
    id: "msg-006",
    sender: "customer",
    content: "Ótimo! E como funciona o período de teste?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
  },
  {
    id: "msg-007",
    sender: "agent",
    content:
      "Oferecemos 14 dias de teste grátis com todas as funcionalidades do plano premium. Você pode cancelar a qualquer momento durante esse período sem custo algum.",
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(), // 24 minutes ago
  },
  {
    id: "msg-008",
    sender: "customer",
    content: "Perfeito! Vou pensar um pouco e te aviso. Qual o prazo máximo para aproveitar esse desconto?",
    timestamp: new Date(Date.now() - 1000 * 60 * 23).toISOString(), // 23 minutes ago
  },
]

// Mensagens para Maria Oliveira
const mariaMessages: Message[] = [
  {
    id: "msg-101",
    sender: "agent",
    content: "Olá Maria, bem-vinda à nossa plataforma! Como posso ajudar?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 60 minutes ago
  },
  {
    id: "msg-102",
    sender: "customer",
    content: "Oi! Queria saber mais sobre os planos básicos de vocês.",
    timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString(), // 59 minutes ago
  },
  {
    id: "msg-103",
    sender: "agent",
    content: "Claro! Nosso plano básico custa R$49/mês e inclui as funcionalidades essenciais para começar.",
    timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString(), // 58 minutes ago
  },
  {
    id: "msg-104",
    sender: "customer",
    content: "Qual é o preço do plano básico?",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
]

// Mensagens para Carlos Pereira
const carlosMessages: Message[] = [
  {
    id: "msg-201",
    sender: "agent",
    content: "Olá Carlos, como vai? Em que posso ajudar hoje?",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
  },
  {
    id: "msg-202",
    sender: "customer",
    content: "Preciso de mais informações sobre o suporte técnico do plano intermediário.",
    timestamp: new Date(Date.now() - 1000 * 60 * 179).toISOString(),
  },
  {
    id: "msg-203",
    sender: "agent",
    content: "O plano intermediário inclui suporte por email com tempo de resposta de até 4 horas em dias úteis.",
    timestamp: new Date(Date.now() - 1000 * 60 * 178).toISOString(),
  },
  {
    id: "msg-204",
    sender: "customer",
    content: "Entendi. E quanto custa esse plano?",
    timestamp: new Date(Date.now() - 1000 * 60 * 177).toISOString(),
  },
  {
    id: "msg-205",
    sender: "agent",
    content: "O plano intermediário custa R$99/mês ou R$990/ano, com economia de 2 meses no pagamento anual.",
    timestamp: new Date(Date.now() - 1000 * 60 * 176).toISOString(),
  },
  {
    id: "msg-206",
    sender: "customer",
    content: "Perfeito! Quero seguir com o plano anual. Como faço o pagamento?",
    timestamp: new Date(Date.now() - 1000 * 60 * 175).toISOString(),
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    customerId: "cust-001",
    customerName: "João Silva",
    messages: joaoMessages,
    lastMessage: joaoMessages[joaoMessages.length - 1].content,
    lastMessageTime: joaoMessages[joaoMessages.length - 1].timestamp,
    unreadCount: 0,
  },
  {
    id: "conv-002",
    customerId: "cust-002",
    customerName: "Maria Oliveira",
    messages: mariaMessages,
    lastMessage: mariaMessages[mariaMessages.length - 1].content,
    lastMessageTime: mariaMessages[mariaMessages.length - 1].timestamp,
    unreadCount: 2,
  },
  {
    id: "conv-003",
    customerId: "cust-003",
    customerName: "Carlos Pereira",
    messages: carlosMessages,
    lastMessage: carlosMessages[carlosMessages.length - 1].content,
    lastMessageTime: carlosMessages[carlosMessages.length - 1].timestamp,
    unreadCount: 1,
  },
]

// Mantemos a exportação do mockCustomer e mockMessages para compatibilidade
export const mockCustomer = mockCustomers[0]
export const mockMessages = joaoMessages
