import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction, TransactionType } from '@/types/transaction';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  categories: string[];
  accounts: string[];
  onAddCategory: (category: string) => void;
  onAddAccount: (account: string) => void;
}

export function TransactionForm({
  onAddTransaction,
  categories,
  accounts,
  onAddCategory,
  onAddAccount,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'despesa' as TransactionType,
    category: '',
    account: '',
    amount: '',
  });

  const [newCategory, setNewCategory] = useState('');
  const [newAccount, setNewAccount] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewAccount, setShowNewAccount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast.error('Por favor, informe uma descrição');
      return;
    }

    if (!formData.category) {
      toast.error('Por favor, selecione ou adicione uma categoria');
      return;
    }

    if (!formData.account) {
      toast.error('Por favor, selecione ou adicione uma conta');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Por favor, informe um valor válido');
      return;
    }

    onAddTransaction({
      date: formData.date,
      description: formData.description.trim(),
      type: formData.type,
      category: formData.category,
      account: formData.account,
      amount,
    });

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: 'despesa',
      category: '',
      account: '',
      amount: '',
    });

    toast.success('Lançamento adicionado com sucesso!');
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setShowNewCategory(false);
      toast.success('Categoria adicionada!');
    }
  };

  const handleAddAccount = () => {
    if (newAccount.trim()) {
      onAddAccount(newAccount.trim());
      setFormData({ ...formData, account: newAccount.trim() });
      setNewAccount('');
      setShowNewAccount(false);
      toast.success('Conta adicionada!');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Lançamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TransactionType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Compra no supermercado"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              {showNewCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nova categoria"
                  />
                  <Button type="button" onClick={handleAddCategory} size="sm">
                    Adicionar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCategory(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      value === 'new'
                        ? setShowNewCategory(true)
                        : setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Nova Categoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Conta/Carteira</Label>
              {showNewAccount ? (
                <div className="flex gap-2">
                  <Input
                    value={newAccount}
                    onChange={(e) => setNewAccount(e.target.value)}
                    placeholder="Nova conta"
                  />
                  <Button type="button" onClick={handleAddAccount} size="sm">
                    Adicionar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewAccount(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select
                    value={formData.account}
                    onValueChange={(value) =>
                      value === 'new'
                        ? setShowNewAccount(true)
                        : setFormData({ ...formData, account: value })
                    }
                  >
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc} value={acc}>
                          {acc}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Nova Conta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0,00"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Lançamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
