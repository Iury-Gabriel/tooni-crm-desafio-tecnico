# Tooni WhatsApp CRM

Um protótipo funcional de CRM para WhatsApp Web com integração de IA para sugestões em tempo real.

## Funcionalidades

- Interface simulada do WhatsApp Web
- Sugestões de IA em tempo real usando DeepSeek
- Painel de informações do cliente
- Gerenciamento de etapas do funil de vendas
- Botões de ação para envio de link de pagamento e marcação de venda

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui para componentes
- DeepSeek AI para geração de sugestões

## Como Instalar

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/seu-usuario/tooni-crm.git
cd tooni-crm
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:
\`\`\`
DEEPSEEK_API_KEY=sua_chave_api_deepseek
\`\`\`

4. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

5. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

- `/app` - Rotas e layouts do Next.js
- `/components` - Componentes React reutilizáveis
  - `/ui` - Componentes de UI básicos (shadcn/ui)
  - Componentes específicos da aplicação
- `/lib` - Utilitários, tipos e serviços
  - `ai-service.ts` - Serviço de integração com DeepSeek AI
  - `types.ts` - Definições de tipos TypeScript
  - `mock-data.ts` - Dados mockados para desenvolvimento

## Possíveis Evoluções

1. **Integração Real com WhatsApp**
   - Implementar a API oficial do WhatsApp Business
   - Suporte a mensagens multimídia (imagens, áudio, documentos)

2. **Melhorias na IA**
   - Treinamento específico para o domínio de vendas
   - Análise de sentimento do cliente
   - Detecção de intenção de compra

3. **Expansão do CRM**
   - Dashboard com métricas de vendas
   - Histórico completo de interações
   - Integração com sistemas de pagamento
   - Automações baseadas em gatilhos

4. **Recursos Adicionais**
   - Templates de mensagens
   - Agendamento de mensagens
   - Chatbots para atendimento inicial
   - Integração com calendário para agendamentos

5. **Melhorias de UX**
   - Tema escuro/claro
   - Notificações em tempo real
   - Interface responsiva para mobile
   - Atalhos de teclado

## Licença

MIT
