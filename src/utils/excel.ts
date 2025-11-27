import * as XLSX from 'xlsx';
import { Transaction, Summary } from '@/types/transaction';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const exportToExcel = (
  transactions: Transaction[],
  summary: Summary,
  periodLabel: string
): void => {
  try {
    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Aba 1: Lançamentos
    const transactionsData = transactions.map((t) => ({
      Data: format(new Date(t.date), 'dd/MM/yyyy', { locale: ptBR }),
      Descrição: t.description,
      Tipo: t.type === 'receita' ? 'Receita' : 'Despesa',
      Categoria: t.category,
      Conta: t.account,
      Valor: t.amount,
    }));

    const ws1 = XLSX.utils.json_to_sheet(transactionsData);

    // Ajustar largura das colunas
    ws1['!cols'] = [
      { wch: 12 }, // Data
      { wch: 30 }, // Descrição
      { wch: 10 }, // Tipo
      { wch: 20 }, // Categoria
      { wch: 20 }, // Conta
      { wch: 15 }, // Valor
    ];

    XLSX.utils.book_append_sheet(wb, ws1, 'Lançamentos');

    // Aba 2: Resumo
    const summaryData = [
      { Campo: 'Período', Valor: periodLabel },
      { Campo: '', Valor: '' },
      { Campo: 'Total de Receitas', Valor: summary.totalIncome },
      { Campo: 'Total de Despesas', Valor: summary.totalExpense },
      { Campo: 'Saldo', Valor: summary.balance },
      { Campo: '', Valor: '' },
      { Campo: 'Resumo por Categoria', Valor: '' },
    ];

    // Adicionar totais por categoria
    Object.entries(summary.categoryTotals)
      .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
      .forEach(([category, total]) => {
        summaryData.push({
          Campo: category,
          Valor: total,
        });
      });

    const ws2 = XLSX.utils.json_to_sheet(summaryData);

    // Ajustar largura das colunas
    ws2['!cols'] = [
      { wch: 30 }, // Campo
      { wch: 20 }, // Valor
    ];

    XLSX.utils.book_append_sheet(wb, ws2, 'Resumo');

    // Gerar arquivo
    const fileName = `gestao-financeira-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    throw new Error('Não foi possível gerar o arquivo Excel');
  }
};
