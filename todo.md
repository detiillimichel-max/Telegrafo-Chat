# Telegrafo-Chat - TODO

## Fase 1: Setup GitHub, Estrutura, PWA e Tema Base
- [ ] Inicializar repositório GitHub (detiillimichel-max/Telegrafo-Chat)
- [ ] Configurar .gitignore e estrutura de pastas
- [ ] Implementar PWA (manifest.json, Service Worker com stale-while-revalidate)
- [ ] Configurar tema claro com tons de azul moderno (estilo Copilot)
- [ ] Adicionar dependências para performance (lazy loading, code splitting, React.memo)
- [ ] Configurar Google Fonts com display=swap
- [ ] Commit: "Implementado: Setup inicial do projeto, PWA e tema base"

## Fase 2: UI Base - Barra Inferior, Chat e Input
- [x] Criar layout de barra de navegação inferior com ícones (Galeria, Arquivo, Localização, Lista, Contato, Música, Jogos, Rádio)
- [x] Implementar layout de chat individual com área de mensagens
- [x] Criar área de input com suporte a texto, áudio e vídeo (máx 30s)
- [x] Implementar menu de contexto nas mensagens (responder, copiar, deletar, reagir)
- [x] Adicionar avatares de 48px com border-radius 50% e margem de 12px
- [x] Commit: "Implementado: UI base com barra inferior, chat e input"

## Fase 3: Autenticação Firebase
- [ ] Integrar Firebase Auth (Email/Senha)
- [ ] Criar página de login/registro
- [ ] Implementar perfil de usuário com avatar de 48px
- [ ] Adicionar persistência de sessão
- [ ] Commit: "Implementado: Autenticação Firebase e perfil de usuário"

## Fase 4: Conteúdo Extra via iFrames
- [ ] Integrar 5 links de jogos via iframes
- [ ] Integrar Rádio América via iframe
- [ ] Integrar Calculadora via iframe
- [ ] Criar navegação para acessar conteúdo extra
- [ ] Commit: "Implementado: Integração de jogos, rádio e calculadora"

## Fase 5: Rotas Proxy /api (Aguardando Comando)
- [ ] Criar rotas proxy para Groq (IA)
- [ ] Criar rotas proxy para ElevenLabs (síntese de voz)
- [ ] Criar rotas proxy para GNews (notícias)
- [ ] Criar rotas proxy para Whisper (transcrição de voz)
- [ ] Implementar validação e rate limiting
- [ ] Commit: "Implementado: Rotas proxy /api para integrações externas"

## Fase 6: Chamadas de Vídeo/Voz e IA Telegrafo (Aguardando Comando)
- [ ] Integrar Daily.co SDK para chamadas de vídeo
- [ ] Implementar chamadas de voz
- [ ] Integrar IA Telegrafo com Groq
- [ ] Implementar síntese de voz com ElevenLabs (feminina/masculina)
- [ ] Criar seletor de voz no perfil do usuário
- [ ] Commit: "Implementado: Chamadas Daily.co e IA Telegrafo com voz"

## Fase 7: Geração de Imagens, Transcrição e Notificações
- [ ] Implementar geração de imagens a partir de descrições de texto
- [ ] Exibir imagens geradas diretamente na conversa
- [ ] Implementar transcrição automática de voz com Whisper
- [ ] Exibir transcrição abaixo do player de áudio
- [ ] Implementar notificações ao dono do app (novo usuário, mensagens, chamadas perdidas)
- [ ] Commit: "Implementado: Geração de imagens, transcrição e notificações"

## Fase 8: Otimizações e Testes Finais
- [ ] Implementar lazy loading de componentes (React.lazy + Suspense)
- [ ] Implementar code splitting
- [ ] Otimizar memoização (React.memo, useMemo)
- [ ] Implementar Web Workers para processamento pesado
- [ ] Prevenir reflows no DOM
- [ ] Configurar compressão Brotli
- [ ] Configurar CDN edge caching
- [ ] Executar testes de performance
- [ ] Commit: "Implementado: Otimizações de performance e testes finais"

## Bugs e Correções
(Nenhum até o momento)
