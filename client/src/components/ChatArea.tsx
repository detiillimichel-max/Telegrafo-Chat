import { useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreVertical, Reply, Copy, Trash2, Smile } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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

interface ChatAreaProps {
  messages: Message[];
  currentUserId: string;
  onReply?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export default function ChatArea({
  messages,
  currentUserId,
  onReply,
  onDelete,
  onReact,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const isOwnMessage = (senderId: string) => senderId === currentUserId;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 smooth-scroll contain-paint"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">Nenhuma mensagem ainda</p>
            <p className="text-sm text-muted-foreground mt-2">
              Comece uma conversa enviando uma mensagem
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'chat-message-with-avatar group',
              isOwnMessage(message.sender.id) && 'flex-row-reverse'
            )}
            onMouseEnter={() => setSelectedMessageId(message.id)}
            onMouseLeave={() => setSelectedMessageId(null)}
          >
            {/* Avatar */}
            <img
              src={message.sender.avatar}
              alt={message.sender.name}
              className="avatar-48 ring-2 ring-border"
              loading="lazy"
            />

            {/* Conteúdo da mensagem */}
            <div
              className={cn(
                'flex-1 flex flex-col gap-1',
                isOwnMessage(message.sender.id) && 'items-end'
              )}
            >
              {/* Header: Nome e timestamp */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {message.sender.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(message.timestamp, 'HH:mm', { locale: ptBR })}
                </span>
              </div>

              {/* Corpo da mensagem */}
              <div
                className={cn(
                  'max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words',
                  isOwnMessage(message.sender.id)
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                )}
              >
                {message.type === 'text' && <p>{message.content}</p>}
                {message.type === 'audio' && (
                  <audio controls className="w-full">
                    <source src={message.content} type="audio/mpeg" />
                    Seu navegador não suporta áudio.
                  </audio>
                )}
                {message.type === 'video' && (
                  <video controls className="w-full rounded">
                    <source src={message.content} type="video/mp4" />
                    Seu navegador não suporta vídeo.
                  </video>
                )}
                {message.type === 'image' && (
                  <img
                    src={message.content}
                    alt="Imagem compartilhada"
                    className="max-w-full rounded"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Reações */}
              {message.reactions && Object.keys(message.reactions).length > 0 && (
                <div className="flex gap-1 mt-1">
                  {Object.entries(message.reactions).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      className="px-2 py-1 rounded-full bg-secondary text-xs hover:bg-accent transition-smooth"
                      onClick={() => onReact?.(message.id, emoji)}
                    >
                      {emoji} {count > 1 ? count : ''}
                    </button>
                  ))}
                </div>
              )}

              {/* Menu de contexto */}
              {selectedMessageId === message.id && (
                <div className="flex gap-1 mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          'p-1 rounded hover:bg-secondary transition-smooth',
                          isOwnMessage(message.sender.id)
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        )}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isOwnMessage(message.sender.id) ? 'end' : 'start'}>
                      <DropdownMenuItem onClick={() => onReply?.(message)}>
                        <Reply size={16} className="mr-2" />
                        Responder
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(message.content)}>
                        <Copy size={16} className="mr-2" />
                        Copiar
                      </DropdownMenuItem>
                      {isOwnMessage(message.sender.id) && (
                        <DropdownMenuItem
                          onClick={() => onDelete?.(message.id)}
                          className="text-destructive"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onReact?.(message.id, '👍')}>
                        <Smile size={16} className="mr-2" />
                        Reagir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
