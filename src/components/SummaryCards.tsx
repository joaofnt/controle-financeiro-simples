import { Summary } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  summary: Summary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-success/20 bg-gradient-to-br from-success/5 to-success/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
          <ArrowUpCircle className="h-5 w-5 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(summary.totalIncome)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
          <ArrowDownCircle className="h-5 w-5 text-danger" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-danger">
            {formatCurrency(summary.totalExpense)}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`border-primary/20 ${
          summary.balance >= 0
            ? 'bg-gradient-to-br from-success/5 to-success/10'
            : 'bg-gradient-to-br from-danger/5 to-danger/10'
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          <Wallet className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              summary.balance >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {formatCurrency(summary.balance)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
