import { Transaction } from '@/types/transaction';

const STORAGE_KEY = 'financial-transactions';
const CATEGORIES_KEY = 'financial-categories';
const ACCOUNTS_KEY = 'financial-accounts';

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Erro ao salvar transações:', error);
  }
};

export const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    return [];
  }
};

export const saveCategories = (categories: string[]): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Erro ao salvar categorias:', error);
  }
};

export const loadCategories = (): string[] => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [
      'Salário',
      'Aluguel',
      'Mercado',
      'Transporte',
      'Lazer',
      'Dívidas',
      'Investimentos',
      'Educação',
      'Saúde',
      'Outros',
    ];
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    return ['Salário', 'Aluguel', 'Mercado', 'Transporte', 'Lazer', 'Outros'];
  }
};

export const saveAccounts = (accounts: string[]): void => {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Erro ao salvar contas:', error);
  }
};

export const loadAccounts = (): string[] => {
  try {
    const data = localStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [
      'Carteira',
      'Conta Corrente',
      'Nubank',
      'Poupança',
      'Outros',
    ];
  } catch (error) {
    console.error('Erro ao carregar contas:', error);
    return ['Carteira', 'Conta Corrente', 'Nubank', 'Poupança'];
  }
};
