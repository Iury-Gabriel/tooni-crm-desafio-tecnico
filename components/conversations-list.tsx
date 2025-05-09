"use client"

import { useState } from "react"
import type { Conversation } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreVertical } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ConversationsListProps {
  conversations: Conversation[]
  activeConversationId: string
  onSelectConversation: (conversationId: string) => void
}

export function ConversationsList({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatRelativeTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ptBR,
      })
    } catch (e) {
      return ""
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="w-80 border-r flex flex-col h-full bg-muted/10">
      <div className="p-3 border-b bg-muted/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Conversas</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Nova conversa</DropdownMenuItem>
              <DropdownMenuItem>Arquivadas</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar ou começar nova conversa"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">Nenhuma conversa encontrada</div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 border-b",
                activeConversationId === conversation.id && "bg-muted",
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={conversation.customerName} />
                <AvatarFallback>
                  {conversation.customerName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{conversation.customerName}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(conversation.lastMessageTime)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground truncate">{truncateText(conversation.lastMessage, 40)}</p>

                  {conversation.unreadCount > 0 && (
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-medium">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
