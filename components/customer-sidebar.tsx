"use client"

import type { Customer, FunnelStage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, DollarSign, CheckCircle } from "lucide-react"

interface CustomerSidebarProps {
  customer: Customer
  onSendPaymentLink: () => void
  onMarkAsSold: () => void
  onUpdateFunnelStage: (stage: FunnelStage) => void
}

export function CustomerSidebar({
  customer,
  onSendPaymentLink,
  onMarkAsSold,
  onUpdateFunnelStage,
}: CustomerSidebarProps) {
  const funnelStages: { value: FunnelStage; label: string }[] = [
    { value: "new_lead", label: "Novo Lead" },
    { value: "in_negotiation", label: "Em Negociação" },
    { value: "waiting_payment", label: "Aguardando Pagamento" },
    { value: "sold", label: "Vendido" },
  ]

  return (
    <div className="border-b bg-muted/10 p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-sm">{customer.name}</h3>
          <div className="flex items-center gap-2">
            <Select value={customer.funnelStage} onValueChange={(value) => onUpdateFunnelStage(value as FunnelStage)}>
              <SelectTrigger className="h-7 text-xs w-[140px]">
                <SelectValue placeholder="Etapa do Funil" />
              </SelectTrigger>
              <SelectContent>
                {funnelStages.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={onSendPaymentLink} variant="outline" className="h-8">
          <DollarSign className="mr-1 h-3.5 w-3.5" />
          <span className="text-xs">Link de Pagamento</span>
        </Button>

        <Button size="sm" onClick={onMarkAsSold} variant="default" className="h-8">
          <CheckCircle className="mr-1 h-3.5 w-3.5" />
          <span className="text-xs">Marcar Vendido</span>
        </Button>
      </div>
    </div>
  )
}
