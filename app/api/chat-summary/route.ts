import { type NextRequest, NextResponse } from "next/server"
import type { Message } from "@/lib/types"

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages array is required" }, { status: 400 })
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      console.error("Missing DEEPSEEK_API_KEY environment variable")
      return NextResponse.json({
        summary: "Análise não disponível. Configure a API key.",
        conversionRate: 50,
      })
    }

    const formattedConversation = messages
      .map((msg) => `${msg.sender === "customer" ? "Cliente" : "Atendente"}: ${msg.content}`)
      .join("\n")

    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "Você é um assistente especializado em análise de conversas de vendas. Sua tarefa é resumir conversas e estimar a probabilidade de conversão.",
            },
            {
              role: "user",
              content: `
                Analise a seguinte conversa entre um atendente e um cliente:
                
                ${formattedConversation}
                
                Responda em formato JSON com as seguintes informações:
                1. Um resumo conciso da conversa (campo "summary")
                2. Uma estimativa da probabilidade de conversão em porcentagem de 0 a 100 (campo "conversionRate")
                
                Exemplo de resposta:
                {
                  "summary": "O cliente demonstrou interesse no plano premium e questionou sobre descontos para pagamento anual.",
                  "conversionRate": 65
                }
              `,
            },
          ],
          temperature: 0.3,
          max_tokens: 200,
        }),
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content || ""

      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const jsonStr = jsonMatch[0]
          const summaryData = JSON.parse(jsonStr)

          if (summaryData.summary && typeof summaryData.conversionRate === "number") {
            return NextResponse.json(summaryData)
          }
        }

        throw new Error("Failed to parse AI response")
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
        throw parseError
      }
    } catch (error) {
      console.error("Error calling DeepSeek API:", error)
      return NextResponse.json({
        summary: "Não foi possível analisar a conversa no momento.",
        conversionRate: 50,
      })
    }
  } catch (error: any) {
    console.error("Error processing chat summary:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
