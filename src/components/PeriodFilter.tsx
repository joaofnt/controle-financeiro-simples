import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface PeriodFilterProps {
  filterType: 'all' | 'month' | 'custom';
  selectedMonth: string;
  customStart: string;
  customEnd: string;
  onFilterTypeChange: (type: 'all' | 'month' | 'custom') => void;
  onMonthChange: (month: string) => void;
  onCustomStartChange: (date: string) => void;
  onCustomEndChange: (date: string) => void;
  onExport: () => void;
}

export function PeriodFilter({
  filterType,
  selectedMonth,
  customStart,
  customEnd,
  onFilterTypeChange,
  onMonthChange,
  onCustomStartChange,
  onCustomEndChange,
  onExport,
}: PeriodFilterProps) {
  // Gerar lista de meses (últimos 12 meses)
  const months: string[] = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(date.toISOString().substring(0, 7));
  }

  const getMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label>Filtrar por Período</Label>
            <Select
              value={filterType}
              onValueChange={(value: 'all' | 'month' | 'custom') =>
                onFilterTypeChange(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os lançamentos</SelectItem>
                <SelectItem value="month">Por mês</SelectItem>
                <SelectItem value="custom">Período personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filterType === 'month' && (
            <div className="flex-1 space-y-2">
              <Label>Selecione o Mês</Label>
              <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {getMonthLabel(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filterType === 'custom' && (
            <>
              <div className="flex-1 space-y-2">
                <Label>Data Inicial</Label>
                <Input
                  type="date"
                  value={customStart}
                  onChange={(e) => onCustomStartChange(e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Data Final</Label>
                <Input
                  type="date"
                  value={customEnd}
                  onChange={(e) => onCustomEndChange(e.target.value)}
                />
              </div>
            </>
          )}

          <Button onClick={onExport} className="whitespace-nowrap">
            <Download className="mr-2 h-4 w-4" />
            Exportar para Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
