import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import ChatLayout from '@/components/ChatLayout';
import ChatArea from '@/components/ChatArea';
import ChatInput from '@/components/ChatInput';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  type: 'text' | 'audio' | 'video' | 'image';
  reactions?: Record<string, number>;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: {
        id: 'bot',
        name: 'Telegrafo IA',
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect fill="%230066ff" width="48" height="48" rx="24"/><text x="24" y="32" font-size="24" font-weight="bold" fill="white" text-anchor="middle" font-family="system-ui">T</text></svg>',
      },
      content: 'Olá! Bem-vindo ao Telegrafo Chat. Como posso ajudá-lo?',
      timestamp: new Date(Date.now() - 60000),
      type: 'text',
    },
  ]);

  const [replying, setReplying] = useState<Message | null>(null);

  /**
   * Enviar mensagem
   */
  const handleSendMessage = useCallback(
    (content: string, type: 'text' | 'audio' | 'video') => {
      if (!user) return;

      const getDefaultAvatar = (name: string) => {
        const initial = (name || 'U')[0].toUpperCase();
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect fill="%23e0e7ff" width="48" height="48" rx="24"/><text x="24" y="32" font-size="20" font-weight="bold" fill="%230066ff" text-anchor="middle" font-family="system-ui">${initial}</text></svg>`;
      };

      const userAvatar = (user as any).avatar || getDefaultAvatar(user.name || 'Você');

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: {
          id: user.id.toString(),
          name: user.name || 'Você',
          avatar: userAvatar,
        },
        content,
        timestamp: new Date(),
        type,
      };

      setMessages((prev) => [...prev, newMessage]);
      setReplying(null);

      // Simular resposta da IA após 1 segundo
      setTimeout(() => {
        const aiResponse: Message = {
          id: `msg-${Date.now()}`,
          sender: {
            id: 'bot',
            name: 'Telegrafo IA',
            avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect fill="%230066ff" width="48" height="48" rx="24"/><text x="24" y="32" font-size="24" font-weight="bold" fill="white" text-anchor="middle" font-family="system-ui">T</text></svg>',
          },
          content: 'Recebi sua mensagem! Estou processando...',
          timestamp: new Date(),
          type: 'text',
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    },
    [user]
  );

  /**
   * Responder a uma mensagem
   */
  const handleReply = useCallback((message: Message) => {
    setReplying(message);
  }, []);

  /**
   * Deletar mensagem
   */
  const handleDelete = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  /**
   * Reagir a uma mensagem
   */
  const handleReact = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...msg, reactions };
        }
        return msg;
      })
    );
  }, []);

  // Memoizar lista de mensagens para evitar re-renders desnecessários
  const memoizedMessages = useMemo(() => messages, [messages]);

  return (
    <ChatLayout>
      {/* Cabeçalho do chat */}
      <div className="border-b border-border bg-card px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">Telegrafo Chat</h1>
        <p className="text-sm text-muted-foreground">Chat em tempo real com IA</p>
      </div>

      {/* Mensagens de contexto (reply) */}
      {replying && (
        <div className="bg-secondary/50 border-l-4 border-primary px-4 py-2 mx-4 mt-2 rounded">
          <p className="text-xs font-semibold text-muted-foreground">
            Respondendo a {replying.sender.name}
          </p>
          <p className="text-sm text-foreground truncate">{replying.content}</p>
        </div>
      )}

      {/* Área de chat */}
      <ChatArea
        messages={memoizedMessages}
        currentUserId={user?.id.toString() || ''}
        onReply={handleReply}
        onDelete={handleDelete}
        onReact={handleReact}
      />

      {/* Input de mensagem */}
      <ChatInput onSendMessage={handleSendMessage} disabled={!user} />
    </ChatLayout>
  );
}
