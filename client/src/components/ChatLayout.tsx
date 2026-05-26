import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import {
  Image,
  FileText,
  MapPin,
  List,
  Users,
  Music,
  Gamepad2,
  Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatLayoutProps {
  children: ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'gallery', label: 'Galeria', icon: <Image size={24} />, path: '/gallery' },
  { id: 'files', label: 'Arquivo', icon: <FileText size={24} />, path: '/files' },
  { id: 'location', label: 'Localização', icon: <MapPin size={24} />, path: '/location' },
  { id: 'list', label: 'Lista', icon: <List size={24} />, path: '/list' },
  { id: 'contacts', label: 'Contato', icon: <Users size={24} />, path: '/contacts' },
  { id: 'music', label: 'Música', icon: <Music size={24} />, path: '/music' },
  { id: 'games', label: 'Jogos', icon: <Gamepad2 size={24} />, path: '/games' },
  { id: 'radio', label: 'Rádio', icon: <Radio size={24} />, path: '/radio' },
];

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [location, navigate] = useLocation();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Conteúdo principal */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>

      {/* Barra de navegação inferior */}
      <nav className="border-t border-border bg-card shadow-lg">
        <div className="flex justify-around items-center h-20 px-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-smooth',
                'hover:bg-secondary active:scale-95',
                location === item.path
                  ? 'text-primary bg-secondary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title={item.label}
              aria-label={item.label}
            >
              <div className="flex items-center justify-center w-8 h-8">
                {item.icon}
              </div>
              <span className="text-xs font-medium truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
