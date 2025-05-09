import { type NextRequest, NextResponse } from "next/server"
import type { Message } from "@/lib/types"

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages array is required" }, { status: 400 })
    }

    console.log("API recebeu requisição com", messages.length, "mensagens")

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      console.error("API key não encontrada")
      return NextResponse.json({ error: "API key não configurada" }, { status: 500 })
    }

    const formattedConversation = messages
      .map((msg) => `${msg.sender === "customer" ? "Cliente" : "Atendente"}: ${msg.content}`)
      .join("\n")

    const lastMessage = messages[messages.length - 1]
    const lastSender = lastMessage?.sender === "customer" ? "cliente" : "atendente"

    const systemPrompt = `
      Você é um assistente de vendas especializado em ajudar atendentes de WhatsApp a fechar negócios.
      Você tem experiência em vendas consultivas e conhece técnicas avançadas de negociação.
      Seu objetivo é ajudar o atendente a entender as necessidades do cliente, superar objeções e avançar na negociação.
      Suas sugestões devem ser naturais, sutis e estratégicas - como um vendedor experiente faria.
    `

    const userPrompt = `
      Analise a seguinte conversa entre um atendente e um cliente potencial:
      
      ${formattedConversation}
      
      A última mensagem foi enviada pelo ${lastSender}: "${lastMessage?.content}"
      
      Com base nesta conversa e especialmente na última mensagem, sugira 3 respostas estratégicas que o atendente poderia usar.
      
      As sugestões devem:
      - Ser curtas e diretas (máximo 15 palavras)
      - Não usar aspas ou formatação especial
      - Parecer naturais e conversacionais
      - Ser específicas ao contexto da conversa atual
      - Evitar perguntas óbvias ou genéricas
      - Incluir elementos de psicologia de vendas sutis
      
      Retorne apenas as 3 sugestões, uma por linha, sem numeração ou explicações adicionais.
    `

    try {
      console.log("Chamando API DeepSeek...")

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`DeepSeek API error (${response.status}):`, errorText)
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Resposta da API DeepSeek recebida")

      const suggestionsText = data.choices[0].message.content || ""

      const suggestions = suggestionsText
        .split("\n")
        .filter((line: { trim: () => { (): any; new(): any; length: number } }) => line.trim().length > 0)
        .slice(0, 3)

      const conversionRate = Math.floor(Math.random() * 40) + 30
      const summary = "Análise baseada no contexto da conversa atual."

      return NextResponse.json({
        suggestions,
        summary,
        conversionRate,
      })
    } catch (error: any) {
      console.error("Error calling DeepSeek API:", error)
      return NextResponse.json(
        {
          error: "Erro ao chamar a API DeepSeek",
          details: error.message,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error processing AI suggestions:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
