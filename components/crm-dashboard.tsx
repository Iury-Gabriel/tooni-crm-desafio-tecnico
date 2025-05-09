"use client"

import { useState, useEffect } from "react"
import { CustomerSidebar } from "@/components/customer-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { AiSuggestions } from "@/components/ai-suggestions"
import { ConversationsList } from "@/components/conversations-list"
import { mockCustomers, mockConversations } from "@/lib/mock-data"
import type { Message, Customer, FunnelStage, Conversation } from "@/lib/types"

export function CrmDashboard() {
  // Estado para o cliente atual, mensagens e conversas
  const [activeCustomerId, setActiveCustomerId] = useState<string>(mockCustomers[0].id)
  const [customer, setCustomer] = useState<Customer>(mockCustomers[0])
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [activeConversation, setActiveConversation] = useState<Conversation>(mockConversations[0])

  // Atualiza o cliente ativo quando o ID muda
  useEffect(() => {
    const selectedCustomer = mockCustomers.find((c) => c.id === activeCustomerId) || mockCustomers[0]
    setCustomer(selectedCustomer)

    // Encontra a conversa ativa para este cliente
    const customerConversation = conversations.find((conv) => conv.customerId === activeCustomerId)
    if (customerConversation) {
      setActiveConversation(customerConversation)
    }
  }, [activeCustomerId, conversations])

  // Function to update customer funnel stage
  const updateFunnelStage = (stage: FunnelStage) => {
    setCustomer({ ...customer, funnelStage: stage })
  }

  // Function to mark customer as sold
  const markAsSold = () => {
    setCustomer({ ...customer, funnelStage: "sold" })
    addMessage({
      id: Date.now().toString(),
      sender: "agent",
      content: "Obrigado pela sua compra! Estamos processando seu pedido.",
      timestamp: new Date().toISOString(),
    })
  }

  // Function to send payment link
  const sendPaymentLink = () => {
    addMessage({
      id: Date.now().toString(),
      sender: "agent",
      content: "Aqui está seu link de pagamento: https://pagamento.tooni.app/checkout/123",
      timestamp: new Date().toISOString(),
    })
  }

  // Function to add a new message
  const addMessage = (message: Message) => {
    setConversations((prevConversations) => {
      return prevConversations.map((conv) => {
        if (conv.id === activeConversation.id) {
          // Atualiza a conversa ativa com a nova mensagem
          const updatedMessages = [...conv.messages, message]

          // Também atualiza a última mensagem e timestamp para a lista de conversas
          return {
            ...conv,
            messages: updatedMessages,
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
            unreadCount: 0, // Zera contagem de não lidas quando é o agente enviando
          }
        }
        return conv
      })
    })
  }

  // Função para alternar entre conversas
  const handleConversationSelect = (conversationId: string) => {
    const selected = conversations.find((c) => c.id === conversationId)
    if (selected) {
      setActiveConversation(selected)
      setActiveCustomerId(selected.customerId)

      // Marca mensagens como lidas
      setConversations((prevConversations) => {
        return prevConversations.map((conv) => {
          if (conv.id === conversationId) {
            return { ...conv, unreadCount: 0 }
          }
          return conv
        })
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <ConversationsList
        conversations={conversations}
        activeConversationId={activeConversation.id}
        onSelectConversation={handleConversationSelect}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1">
          <CustomerSidebar
            customer={customer}
            onSendPaymentLink={sendPaymentLink}
            onMarkAsSold={markAsSold}
            onUpdateFunnelStage={updateFunnelStage}
          />
          <ChatInterface
            messages={activeConversation.messages}
            customerName={customer.name}
            onSendMessage={addMessage}
          />
        </div>
        <AiSuggestions
          messages={activeConversation.messages}
          customer={customer}
          onSuggestClick={(suggestion) => {
            addMessage({
              id: Date.now().toString(),
              sender: "agent",
              content: suggestion,
              timestamp: new Date().toISOString(),
            })
          }}
        />
      </div>
    </div>
  )
}
