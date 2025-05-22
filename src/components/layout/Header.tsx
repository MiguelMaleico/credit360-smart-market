
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFinance } from '@/contexts/FinanceContext';
import { Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadNotificationsCount, markNotificationAsRead } = useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', authRequired: true, roles: ['user', 'partner'] },
    { title: 'Marketplace', path: '/marketplace', authRequired: true, roles: ['user'] },
    { title: 'Autorizar Acesso', path: '/authorize', authRequired: true, roles: ['user'] },
    { title: 'Simulação', path: '/simulation', authRequired: true, roles: ['user'] },
    { title: 'Gerenciar Ofertas', path: '/partner', authRequired: true, roles: ['partner'] },
  ];

  // Filtra itens de menu baseado na autenticação e role do usuário
  const filteredMenuItems = menuItems.filter(item => {
    if (item.authRequired && !isAuthenticated) return false;
    if (user && item.roles && !item.roles.includes(user.role)) return false;
    return true;
  });

  return (
    <header className="bg-white dark:bg-sidebar sticky top-0 z-30 w-full border-b shadow-sm">
      <div className="container px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              Crédito360
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4">
          {filteredMenuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Notificações */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotificationsCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground"
                      >
                        {unreadNotificationsCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className={cn("flex flex-col items-start p-3", !notification.read && "bg-slate-50 dark:bg-slate-900")}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="font-medium">{notification.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      Nenhuma notificação disponível
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Perfil do usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePicture} alt={user?.name} />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil">Meu perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/register">Cadastre-se</Link>
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-card border-b shadow-lg animate-fade-in">
          <nav className="container px-4 py-3 flex flex-col space-y-2">
            {filteredMenuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="py-2 px-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
