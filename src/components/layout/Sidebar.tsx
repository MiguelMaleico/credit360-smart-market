
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  CreditCard, 
  LockKeyhole, 
  Brain, 
  BarChart4, 
  User, 
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles?: Array<'user' | 'partner'>;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const menuItems: SidebarItem[] = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/dashboard', 
      roles: ['user', 'partner'] 
    },
    { 
      icon: CreditCard, 
      label: 'Marketplace', 
      href: '/marketplace', 
      roles: ['user'] 
    },
    { 
      icon: LockKeyhole, 
      label: 'Autorizar Acesso', 
      href: '/authorize', 
      roles: ['user'] 
    },
    { 
      icon: Brain, 
      label: 'Simulação', 
      href: '/simulation', 
      roles: ['user'] 
    },
    { 
      icon: BarChart4, 
      label: 'Gerenciar Ofertas', 
      href: '/partner', 
      roles: ['partner'] 
    },
    { 
      icon: User, 
      label: 'Perfil', 
      href: '/perfil', 
      roles: ['user', 'partner'] 
    }
  ];

  // Filtra itens do menu baseado na role do usuário
  const filteredMenuItems = menuItems.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className={cn(
      "bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link to="/" className="text-xl font-bold text-accent">
            Crédito360
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={onToggle}
        >
          <ChevronRight className={cn(
            "h-5 w-5 transition-transform",
            collapsed ? "rotate-0" : "rotate-180"
          )} />
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-accent" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-accent")} />
                {!collapsed && (
                  <span className="ml-3 truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};
