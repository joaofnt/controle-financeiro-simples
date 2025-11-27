import { useState, useEffect, useMemo } from 'react';
import { Transaction, Summary } from '@/types/transaction';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { SummaryCards } from '@/components/SummaryCards';
import { CategorySummary } from '@/components/CategorySummary';
import { PeriodFilter } from '@/components/PeriodFilter';
import {
  saveTransactions,
  loadTransactions,
  saveCategories,
  loadCategories,
  saveAccounts,
  loadAccounts,
} from '@/utils/storage';
import { exportToExcel } from '@/utils/excel';
import { toast } from 'sonner';
import { Wallet } from 'lucide-react';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'month' | 'custom'>('month');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().substring(0, 7)
  );
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Carregar dados do localStorage
  useEffect(() => {
    setTransactions(loadTransactions());
    setCategories(loadCategories());
    setAccounts(loadAccounts());
  }, []);

  // Adicionar transação
  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  // Deletar transação
  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    toast.success('Lançamento removido');
  };

  // Adicionar categoria
  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
    }
  };

  // Adicionar conta
  const handleAddAccount = (account: string) => {
    if (!accounts.includes(account)) {
      const updatedAccounts = [...accounts, account];
      setAccounts(updatedAccounts);
      saveAccounts(updatedAccounts);
    }
  };

  // Filtrar transações
  const filteredTransactions = useMemo(() => {
    if (filterType === 'all') {
      return transactions;
    }

    if (filterType === 'month') {
      return transactions.filter((t) => t.date.startsWith(selectedMonth));
    }

    if (filterType === 'custom' && customStart && customEnd) {
      return transactions.filter(
        (t) => t.date >= customStart && t.date <= customEnd
      );
    }

    return transactions;
  }, [transactions, filterType, selectedMonth, customStart, customEnd]);

  // Calcular resumo
  const summary: Summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === 'receita')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
      .filter((t) => t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const categoryTotals: Record<string, number> = {};
    filteredTransactions.forEach((t) => {
      const amount = t.type === 'receita' ? t.amount : -t.amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
    });

    return {
      totalIncome,
      totalExpense,
      balance,
      categoryTotals,
    };
  }, [filteredTransactions]);

  // Exportar para Excel
  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      toast.error('Não há lançamentos para exportar');
      return;
    }

    let periodLabel = 'Todos os lançamentos';
    if (filterType === 'month') {
      const [year, month] = selectedMonth.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      periodLabel = date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
      });
    } else if (filterType === 'custom' && customStart && customEnd) {
      periodLabel = `${new Date(customStart).toLocaleDateString(
        'pt-BR'
      )} até ${new Date(customEnd).toLocaleDateString('pt-BR')}`;
    }

    try {
      exportToExcel(filteredTransactions, summary, periodLabel);
      toast.success('Arquivo Excel gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar arquivo Excel');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-primary rounded-xl">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gestão Financeira
          </h1>
          <p className="text-muted-foreground mt-2">
            Controle suas finanças de forma simples e eficiente
          </p>
        </div>

        {/* Filtro e exportação */}
        <div className="mb-6">
          <PeriodFilter
            filterType={filterType}
            selectedMonth={selectedMonth}
            customStart={customStart}
            customEnd={customEnd}
            onFilterTypeChange={setFilterType}
            onMonthChange={setSelectedMonth}
            onCustomStartChange={setCustomStart}
            onCustomEndChange={setCustomEnd}
            onExport={handleExport}
          />
        </div>

        {/* Cards de resumo */}
        <div className="mb-6">
          <SummaryCards summary={summary} />
        </div>

        {/* Grid principal */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <TransactionForm
              onAddTransaction={handleAddTransaction}
              categories={categories}
              accounts={accounts}
              onAddCategory={handleAddCategory}
              onAddAccount={handleAddAccount}
            />
          </div>

          {/* Resumo por categoria */}
          <div>
            <CategorySummary summary={summary} />
          </div>
        </div>

        {/* Lista de transações */}
        <div className="mt-6">
          <TransactionList
            transactions={filteredTransactions}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
