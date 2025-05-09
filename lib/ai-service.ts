import type { Message } from "./types"

// Tipo de retorno para incluir o possível aviso
type SuggestionsResponse = string[] | { suggestions: string[]; warning: string }

// Novo tipo para o resumo da conversa
interface SummaryResponse {
  summary: string
  conversionRate: number
}

// Função para gerar sugestões
export async function generateSuggestions(messages: Message[]): Promise<SuggestionsResponse> {
  try {
    // Format messages for the API
    const formattedMessages = messages.slice(-10) // Get only the last 10 messages

    // Call our own API endpoint instead of DeepSeek directly
    const response = await fetch("/api/ai-suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: formattedMessages }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `API error: ${response.status}`
      console.error("API error:", response.status, errorData)
      throw new Error(errorMessage)
    }

    const data = await response.json()

    // Return the full response which may include warnings
    if (data.suggestions) {
      return data
    }

    // Fallback to mock suggestions if something went wrong
    return {
      suggestions: getMockSuggestions(messages),
      warning: "Usando sugestões mockadas: resposta da API inválida",
    }
  } catch (error: any) {
    console.error("Error generating suggestions:", error)
    // Fallback to mock suggestions if API fails
    return {
      suggestions: getMockSuggestions(messages),
      warning: `Usando sugestões mockadas: ${error.message}`,
    }
  }
}

// Nova função para gerar o resumo da conversa
export async function generateChatSummary(messages: Message[]): Promise<SummaryResponse> {
  try {
    // Format messages for the API
    const formattedMessages = messages.slice(-15) // Get a bit more context for summary

    // Call our own API endpoint for summary
    const response = await fetch("/api/chat-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: formattedMessages }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Return the summary data
    if (data.summary && typeof data.conversionRate === "number") {
      return data
    }

    // Fallback to mock summary if something went wrong
    return getMockSummary(messages)
  } catch (error) {
    console.error("Error generating chat summary:", error)
    // Fallback to mock summary if API fails
    return getMockSummary(messages)
  }
}

// Função para gerar resumo mockado
function getMockSummary(messages: Message[]): SummaryResponse {
  // Verificar se há mensagens sobre preço, desconto, etc. para estimar a probabilidade
  const allContent = messages.map((m) => m.content.toLowerCase()).join(" ")
  let conversionRate = 50 // Taxa padrão

  if (allContent.includes("preço") || allContent.includes("valor") || allContent.includes("custo")) {
    conversionRate += 10
  }

  if (allContent.includes("desconto") || allContent.includes("promoção")) {
    conversionRate += 15
  }

  if (allContent.includes("interessado") || allContent.includes("gostei")) {
    conversionRate += 20
  }

  if (allContent.includes("caro") || allContent.includes("alto")) {
    conversionRate -= 15
  }

  if (allContent.includes("pensar") || allContent.includes("avaliar")) {
    conversionRate -= 10
  }

  // Limitar entre 5% e 95%
  conversionRate = Math.min(95, Math.max(5, conversionRate))

  // Resumo baseado no conteúdo da conversa
  let summary = "O cliente demonstrou interesse nos produtos e está avaliando as opções."

  if (conversionRate > 70) {
    summary =
      "O cliente demonstra alto interesse no produto e está próximo de fechar negócio. Recomenda-se oferecer condições especiais para finalizar a venda."
  } else if (conversionRate < 30) {
    summary =
      "O cliente parece hesitante e pode precisar de mais informações ou um incentivo adicional para avançar na negociação."
  }

  return {
    summary,
    conversionRate,
  }
}

// Função para gerar sugestões mockadas baseadas no contexto da conversa
function getMockSuggestions(messages: Message[]): string[] {
  const lastCustomerMessage =
    [...messages]
      .reverse()
      .find((msg) => msg.sender === "customer")
      ?.content.toLowerCase() || ""

  // Default suggestions
  let suggestions = [
    "Você já utilizou alguma solução similar anteriormente?",
    "Qual seria o prazo ideal para implementação?",
    "Além de você, quem mais estaria envolvido na decisão de compra?",
  ]

  // Context-based suggestions
  if (
    lastCustomerMessage.includes("preço") ||
    lastCustomerMessage.includes("valor") ||
    lastCustomerMessage.includes("custo")
  ) {
    suggestions = [
      "Qual é o seu orçamento para esta solução?",
      "Você prefere um plano mensal ou anual com desconto?",
      "Além do preço, quais outros fatores são importantes para sua decisão?",
    ]
  } else if (lastCustomerMessage.includes("funcionalidade") || lastCustomerMessage.includes("recurso")) {
    suggestions = [
      "Qual funcionalidade específica é mais importante para o seu negócio?",
      "Como você imagina utilizando esse recurso no dia a dia?",
      "Quais são os resultados que você espera alcançar com essa funcionalidade?",
    ]
  } else if (lastCustomerMessage.includes("pensar") || lastCustomerMessage.includes("avaliar")) {
    suggestions = [
      "O que você precisa para tomar uma decisão hoje?",
      "Quais são suas principais preocupações sobre o produto?",
      "Posso agendar uma demonstração personalizada para você e sua equipe?",
    ]
  } else if (lastCustomerMessage.includes("desconto") || lastCustomerMessage.includes("promoção")) {
    suggestions = [
      "Se conseguirmos um desconto especial, você estaria pronto para fechar hoje?",
      "Quantos usuários você precisaria no total?",
      "Você prefere um contrato mais longo com um desconto maior?",
    ]
  }

  return suggestions
}
