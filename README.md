# Telegrafo-Chat

Mensageiro familiar em tempo real. Interface dark com avatares circulares, envio de texto, áudio e foto, e canal “FAMÍLIA”.

Demo:
detiillimichel-max.github.io/Telegrafo-Chat/
## Visão Geral
Telegrafo-Chat nasceu como um app single-file feito com Sonnet e evoluiu para um monorepo full-stack com React 19 + Tailwind 4 + Express 4 + tRPC 11 + Manus Auth.

O visual atual em produção é o OIO ONE FAMÍLIA: header com logo, seletor de membros Michel / Gabriela / Michele Detilli / ADD, área de mensagens e composer com câmera, microfone e botão enviar.

## Stack
- Frontend: React 19, Tailwind 4, shadcn/ui, Vite
- Backend: Express 4, tRPC 11, Superjson
- Auth: Manus OAuth, sessão via cookie
- DB: Drizzle ORM + MySQL/TiDB
- Realtime: tRPC subscriptions / WebSocket

## Estrutura
client/ → App React
server/ → tRPC routers
drizzle/ → schema.ts
index.html → Build estático do Sonnet no Pages

O GitHub Pages está servindo o index.html da raiz. As pastas client/ e server/ do Manus ainda não estão em deploy.

## Rodando Local
pnpm install
pnpm db:push
pnpm dev

## Build
pnpm build

## Roadmap
- Migrar UI do OIO ONE para client/src/pages/Chat.tsx
- Procedures message.send, message.list
- Upload de mídia
- Notificações push

© 2026 Michel Detilli.
Todos os direitos reservados. 
É permitido mensagens escrita e em áudio foto e vídeo online. É proibida a cópia, distribuição ou uso comercial do código sem autorização.
Contato detiillimichel@gmail.com
