export type TransactionType = 'receita' | 'despesa';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  category: string;
  account: string;
  amount: number;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryTotals: Record<string, number>;
}
