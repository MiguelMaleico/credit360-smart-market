
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Shield, Zap, BarChart3, PiggyBank } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-sidebar py-4 border-b shadow-sm">
        <div className="container px-4 mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            Crédito360
          </div>
          
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Cadastre-se</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-credito-900 via-credito-800 to-credito-700 text-white py-20">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Marketplace de Crédito Inteligente via Open Finance
              </h1>
              <p className="text-lg opacity-80">
                Encontre as melhores ofertas de crédito personalizadas para o seu perfil financeiro,
                com total transparência e segurança.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link to="/register">
                    Começar Agora
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                  <Link to="/login">
                    Já tenho conta
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex justify-end">
              <div className="relative w-[400px] h-[400px] bg-gradient-to-br from-accent to-accent/20 rounded-full flex items-center justify-center">
                <div className="absolute w-80 h-80 bg-white/5 backdrop-blur-sm rounded-full animate-pulse-slow"></div>
                <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="text-4xl font-bold">Crédito360</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
            <p className="text-muted-foreground">
              Nossa plataforma revoluciona o acesso a crédito através da integração com Open Finance,
              permitindo ofertas personalizadas e melhores condições.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-sidebar p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Autorização Segura</h3>
              <p className="text-muted-foreground">
                Autorize o compartilhamento de dados bancários de forma segura e controlada, seguindo as normas do Open Finance.
              </p>
            </div>
            
            <div className="bg-white dark:bg-sidebar p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Análise de IA</h3>
              <p className="text-muted-foreground">
                Nossa inteligência artificial analisa seu perfil financeiro para determinar score e capacidade de pagamento.
              </p>
            </div>
            
            <div className="bg-white dark:bg-sidebar p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ofertas Personalizadas</h3>
              <p className="text-muted-foreground">
                Receba propostas de crédito personalizadas, compatíveis com sua realidade financeira.
              </p>
            </div>
            
            <div className="bg-white dark:bg-sidebar p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-4">
                <PiggyBank className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Melhores Condições</h3>
              <p className="text-muted-foreground">
                Compare taxas e condições para escolher a opção mais vantajosa para seu perfil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-muted-foreground mb-8">
              Crie sua conta agora e tenha acesso às melhores ofertas de crédito do mercado.
            </p>
            <Button size="lg" asChild>
              <Link to="/register">
                Cadastre-se gratuitamente
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-950 py-8 mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold text-primary">Crédito360</div>
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              &copy; {new Date().getFullYear()} Crédito360. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
