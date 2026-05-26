import { useRef, useState, useCallback } from 'react';
import { Send, Mic, Video, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'audio' | 'video') => void;
  disabled?: boolean;
}

const MAX_DURATION = 30; // 30 segundos

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaPreview, setMediaPreview] = useState<{
    type: 'audio' | 'video';
    url: string;
    blob: Blob;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Iniciar gravação de áudio
   */
  const startAudioRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setMediaPreview({ type: 'audio', url, blob });
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType('audio');
      setRecordingTime(0);

      // Timer para máximo de 30 segundos
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION - 1) {
            mediaRecorder.stop();
            setIsRecording(false);
            setRecordingType(null);
            if (timerRef.current) clearInterval(timerRef.current);
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
    }
  }, []);

  /**
   * Iniciar gravação de vídeo
   */
  const startVideoRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setMediaPreview({ type: 'video', url, blob });
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType('video');
      setRecordingTime(0);

      // Timer para máximo de 30 segundos
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION - 1) {
            mediaRecorder.stop();
            setIsRecording(false);
            setRecordingType(null);
            if (timerRef.current) clearInterval(timerRef.current);
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
    }
  }, []);

  /**
   * Parar gravação
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isRecording]);

  /**
   * Enviar mensagem de texto
   */
  const handleSendText = useCallback(() => {
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
    }
  }, [message, onSendMessage]);

  /**
   * Enviar mídia gravada
   */
  const handleSendMedia = useCallback(async () => {
    if (mediaPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onSendMessage(base64, mediaPreview.type);
        setMediaPreview(null);
      };
      reader.readAsDataURL(mediaPreview.blob);
    }
  }, [mediaPreview, onSendMessage]);

  /**
   * Cancelar gravação
   */
  const handleCancelRecording = useCallback(() => {
    stopRecording();
    setMediaPreview(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, [stopRecording]);

  // Se estiver gravando, mostrar interface de gravação
  if (isRecording) {
    return (
      <div className="border-t border-border bg-card p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">
            Gravando {recordingType === 'audio' ? 'áudio' : 'vídeo'}...
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {recordingTime}s / {MAX_DURATION}s
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={stopRecording}
          className="transition-smooth"
        >
          Parar
        </Button>
      </div>
    );
  }

  // Se houver prévia de mídia, mostrar interface de confirmação
  if (mediaPreview) {
    return (
      <div className="border-t border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {mediaPreview.type === 'audio' ? 'Áudio' : 'Vídeo'} pronto para enviar
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancelRecording}
            className="text-destructive hover:text-destructive"
          >
            <X size={16} />
          </Button>
        </div>
        {mediaPreview.type === 'audio' ? (
          <audio controls className="w-full rounded">
            <source src={mediaPreview.url} type="audio/webm" />
          </audio>
        ) : (
          <video controls className="w-full rounded max-h-48">
            <source src={mediaPreview.url} type="video/webm" />
          </video>
        )}
        <Button
          onClick={handleSendMedia}
          className="w-full transition-smooth"
          disabled={disabled}
        >
          <Send size={16} className="mr-2" />
          Enviar {mediaPreview.type === 'audio' ? 'Áudio' : 'Vídeo'}
        </Button>
      </div>
    );
  }

  // Interface padrão de input
  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex items-end gap-3">
        {/* Botões de mídia */}
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={startAudioRecording}
            disabled={disabled}
            title="Gravar áudio (máx 30s)"
            className="hover:bg-secondary transition-smooth"
          >
            <Mic size={20} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={startVideoRecording}
            disabled={disabled}
            title="Gravar vídeo (máx 30s)"
            className="hover:bg-secondary transition-smooth"
          >
            <Video size={20} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={disabled}
            title="Anexar arquivo"
            className="hover:bg-secondary transition-smooth"
          >
            <Paperclip size={20} />
          </Button>
        </div>

        {/* Input de texto */}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendText();
            }
          }}
          placeholder="Digite uma mensagem..."
          disabled={disabled}
          className={cn(
            'flex-1 rounded-lg transition-smooth',
            'focus:ring-2 focus:ring-primary'
          )}
        />

        {/* Botão de envio */}
        <Button
          size="icon"
          onClick={handleSendText}
          disabled={!message.trim() || disabled}
          className="transition-smooth hover:scale-105 active:scale-95"
        >
          <Send size={20} />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Áudio e vídeo limitados a {MAX_DURATION} segundos
      </p>
    </div>
  );
}
