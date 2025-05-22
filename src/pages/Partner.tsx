
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CreditOffer } from '@/types/finance';

const offerSchema = z.object({
  institutionName: z.string().min(3, 'Nome da instituição é obrigatório'),
  amount: z.coerce.number().min(1000, 'Valor mínimo é R$ 1.000'),
  minAmount: z.coerce.number().min(1000, 'Valor mínimo é R$ 1.000'),
  maxAmount: z.coerce.number().min(1000, 'Valor mínimo é R$ 1.000'),
  interestRate: z.coerce
    .number()
    .min(0.001, 'Taxa deve ser maior que 0.001')
    .max(0.10, 'Taxa deve ser menor que 0.10'),
  minInstallments: z.coerce.number().min(1, 'Mínimo de 1 parcela'),
  maxInstallments: z.coerce.number().min(1, 'Mínimo de 1 parcela'),
  minScore: z.coerce.number().min(300, 'Score mínimo é 300').max(850, 'Score máximo é 850'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  requirementsDescription: z.string().min(10, 'Requisitos são obrigatórios'),
});

const Partner: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Mock de ofertas da instituição
  const [partnerOffers, setPartnerOffers] = useState<CreditOffer[]>([
    {
      id: '1',
      institutionId: 'bank-1',
      institutionName: 'Banco Exemplo',
      amount: 15000,
      minAmount: 5000,
      maxAmount: 20000,
      interestRate: 0.028,
      minInstallments: 12,
      maxInstallments: 48,
      minScore: 600,
      compatibility: 0.85,
      description: 'Crédito pessoal com taxa competitiva para clientes com bom histórico financeiro.',
      requirementsDescription: 'Score mínimo de 600 pontos. Renda mínima comprovada de R$ 2.500.'
    },
    {
      id: '2',
      institutionId: 'bank-1',
      institutionName: 'Banco Exemplo',
      amount: 8000,
      minAmount: 3000,
      maxAmount: 10000,
      interestRate: 0.035,
      minInstallments: 6,
      maxInstallments: 24,
      minScore: 550,
      compatibility: 0.7,
      description: 'Empréstimo pessoal para necessidades imediatas com aprovação rápida.',
      requirementsDescription: 'Score mínimo de 550 pontos. Sem restrições no CPF.'
    }
  ]);

  const form = useForm<z.infer<typeof offerSchema>>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      institutionName: user?.name || '',
      amount: 10000,
      minAmount: 5000,
      maxAmount: 20000,
      interestRate: 0.035,
      minInstallments: 12,
      maxInstallments: 36,
      minScore: 600,
      description: '',
      requirementsDescription: '',
    },
  });

  // Redirecionar se não estiver autenticado ou não for uma instituição parceira
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'partner') {
    return <Navigate to="/dashboard" />;
  }

  // Formata o valor para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formata a taxa de juros como percentual
  const formatInterestRate = (rate: number) => {
    return (rate * 100).toFixed(2) + '%';
  };

  const openNewOfferDialog = () => {
    form.reset();
    setIsEditing(false);
    setEditingOfferId(null);
    setIsDialogOpen(true);
  };

  const openEditOfferDialog = (offer: CreditOffer) => {
    form.reset({
      institutionName: offer.institutionName,
      amount: offer.amount,
      minAmount: offer.minAmount,
      maxAmount: offer.maxAmount,
      interestRate: offer.interestRate,
      minInstallments: offer.minInstallments,
      maxInstallments: offer.maxInstallments,
      minScore: offer.minScore,
      description: offer.description,
      requirementsDescription: offer.requirementsDescription,
    });
    setIsEditing(true);
    setEditingOfferId(offer.id);
    setIsDialogOpen(true);
  };

  const handleDeleteOffer = (id: string) => {
    setPartnerOffers(partnerOffers.filter(offer => offer.id !== id));
    toast({
      title: "Oferta excluída",
      description: "A oferta foi removida com sucesso."
    });
  };

  const onSubmit = (data: z.infer<typeof offerSchema>) => {
    if (isEditing && editingOfferId) {
      // Atualizar oferta existente
      setPartnerOffers(
        partnerOffers.map(offer => 
          offer.id === editingOfferId 
            ? { 
                ...offer, 
                ...data, 
                compatibility: 0.8 // Valor padrão para simulação
              } 
            : offer
        )
      );
      
      toast({
        title: "Oferta atualizada",
        description: "A oferta foi atualizada com sucesso."
      });
    } else {
      // Criar nova oferta
      const newOffer: CreditOffer = {
        id: Date.now().toString(),
        institutionId: 'bank-1', // Valor fixo para simulação
        ...data,
        compatibility: 0.8 // Valor padrão para simulação
      };
      
      setPartnerOffers([...partnerOffers, newOffer]);
      
      toast({
        title: "Oferta criada",
        description: "A nova oferta foi criada com sucesso."
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Ofertas</h1>
            <p className="text-muted-foreground mt-1">
              Crie e gerencie suas ofertas de crédito
            </p>
          </div>
          
          <Button onClick={openNewOfferDialog}>
            <Plus className="mr-2 h-4 w-4" /> Nova Oferta
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suas Ofertas de Crédito</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Oferta</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Taxa</TableHead>
                  <TableHead>Score Min.</TableHead>
                  <TableHead>Parcelas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerOffers.length > 0 ? (
                  partnerOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[120px]">{offer.description}</div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(offer.minAmount)} - {formatCurrency(offer.maxAmount)}
                      </TableCell>
                      <TableCell>{formatInterestRate(offer.interestRate)} a.m.</TableCell>
                      <TableCell>{offer.minScore}</TableCell>
                      <TableCell>
                        {offer.minInstallments} - {offer.maxInstallments}x
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditOfferDialog(offer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteOffer(offer.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma oferta cadastrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Oferta' : 'Nova Oferta de Crédito'}</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da oferta de crédito. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Instituição</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Padrão (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Mínimo (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Máximo (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taxa de Juros (0.035 = 3.5%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.001" {...field} />
                        </FormControl>
                        <FormDescription>Digite como decimal (ex: 0.035 para 3.5%)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Score Mínimo</FormLabel>
                        <FormControl>
                          <Input type="number" min="300" max="850" {...field} />
                        </FormControl>
                        <FormDescription>Entre 300 e 850</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minInstallments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parcelas Mínimas</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxInstallments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parcelas Máximas</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição da Oferta</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requirementsDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requisitos</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {isEditing ? 'Atualizar Oferta' : 'Criar Oferta'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Partner;
