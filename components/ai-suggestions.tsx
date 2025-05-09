"use client"

import { useState, useEffect, useRef } from "react"
import type { Message, Customer } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Lightbulb, RefreshCw, AlertTriangle, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AiSuggestionsProps {
  messages: Message[]
  customer: Customer
  onSuggestClick: (suggestion: string) => void
}

export function AiSuggestions({ messages, customer, onSuggestClick }: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<string>("")
  const [conversionRate, setConversionRate] = useState<number>(50)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastProcessedMessagesRef = useRef<string>("")

  useEffect(() => {
    const currentMessagesJson = JSON.stringify(messages.map((m) => ({ id: m.id, content: m.content })))

    if (currentMessagesJson === lastProcessedMessagesRef.current) {
      console.log("Mensagens não mudaram, ignorando atualização")
      return
    }

    console.log("Mensagens atualizadas, gerando sugestões...", messages.length)
    lastProcessedMessagesRef.current = currentMessagesJson

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsLoading(true)

    timeoutRef.current = setTimeout(() => {
      if (messages.length > 0) {
        fetchSuggestions()
      } else {
        setIsLoading(false)
        setSuggestions([])
        setSummary("Inicie uma conversa para receber sugestões.")
        setConversionRate(50)
      }
    }, 500)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [messages])

  const fetchSuggestions = async () => {
    if (messages.length === 0) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("Buscando sugestões da API...")

      const recentMessages = messages.slice(-15)

      const response = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: recentMessages }),
      })

      console.log("Resposta da API:", response.status)

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      console.log("Dados recebidos:", data)

      if (data.suggestions && Array.isArray(data.suggestions)) {
        console.log("Sugestões recebidas:", data.suggestions)
        setSuggestions(data.suggestions)

        if (data.summary) {
          setSummary(data.summary)
        }

        if (typeof data.conversionRate === "number") {
          setConversionRate(data.conversionRate)
        }
      } else {
        console.error("Formato de resposta inválido:", data)
        throw new Error("Formato de resposta inválido")
      }
    } catch (err: any) {
      console.error("Erro ao gerar sugestões:", err)
      setError(`Falha ao buscar sugestões: ${err.message}`)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const getConversionColor = (rate: number) => {
    if (rate < 30) return "text-red-500"
    if (rate < 70) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="w-80 p-4 bg-muted/30 flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
              Sugestões da IA
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchSuggestions}
              disabled={isLoading}
              className="h-8 w-8"
              title="Atualizar sugestões"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          {error ? (
            <div className="p-3 bg-destructive/10 rounded-md mb-3">
              <p className="text-sm text-destructive flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </p>
            </div>
          ) : null}

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-sm h-auto py-2 px-3 whitespace-normal text-left"
                  onClick={() => onSuggestClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma sugestão disponível. Inicie uma conversa para receber recomendações.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-start pt-4 border-t">
          <div className="flex items-center justify-between w-full mb-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              Análise da Conversa
            </h4>
            <Badge variant="outline" className={getConversionColor(conversionRate)}>
              {conversionRate}% Conversão
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">{summary}</p>
          <div className="w-full mt-2">
            <Progress value={conversionRate} className="h-1.5 w-full" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
