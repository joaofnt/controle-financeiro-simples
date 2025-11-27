import { Summary } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategorySummaryProps {
  summary: Summary;
}

export function CategorySummary({ summary }: CategorySummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const sortedCategories = Object.entries(summary.categoryTotals)
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
    .slice(0, 10);

  if (sortedCategories.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedCategories.map(([category, total]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm font-medium">{category}</span>
              <span
                className={`text-sm font-bold ${
                  total >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {formatCurrency(total)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
