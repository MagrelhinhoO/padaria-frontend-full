// Tipos e modelo de Venda (auto-contido para evitar módulos)

type FormaPagamento = 'Dinheiro' | 'Cartão' | 'PIX' | string;

interface VendaItem {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

interface Venda {
  id: number;
  dataHora: string; // ISO string
  nomeCliente: string;
  itens: VendaItem[];
  subtotal: number;
  total: number;
  formaPagamento: FormaPagamento;
  status: 'Concluída' | 'Pendente' | 'Cancelada' | string;
}

class VendaModel implements Venda {
  id: number;
  dataHora: string;
  nomeCliente: string;
  itens: VendaItem[];
  subtotal: number;
  total: number;
  formaPagamento: FormaPagamento;
  status: 'Concluída' | 'Pendente' | 'Cancelada' | string;

  constructor(data: Partial<Venda> = {}) {
    this.id = data.id ?? 0;
    this.dataHora = data.dataHora ?? new Date().toISOString();
    this.nomeCliente = data.nomeCliente ?? '';
    this.itens = data.itens ?? [];
    this.subtotal = data.subtotal ?? 0;
    this.total = data.total ?? 0;
    this.formaPagamento = data.formaPagamento ?? 'Dinheiro';
    this.status = (data.status as any) ?? 'Concluída';
  }

  static fromJSON(json: any): VendaModel {
    const vm = new VendaModel(json);
    vm.itens = (json.itens || []).map((i: any) => ({
      produtoId: Number(i.produtoId),
      nomeProduto: String(i.nomeProduto ?? ''),
      precoUnitario: Number(i.precoUnitario ?? 0),
      quantidade: Number(i.quantidade ?? 0),
      subtotal: Number(i.subtotal ?? 0)
    }));
    return vm;
  }

  toJSON(): Venda {
    return {
      id: this.id,
      dataHora: this.dataHora,
      nomeCliente: this.nomeCliente,
      itens: this.itens,
      subtotal: this.subtotal,
      total: this.total,
      formaPagamento: this.formaPagamento,
      status: this.status
    };
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.dataHora) errors.push('Data/Hora é obrigatória');
    if (!Array.isArray(this.itens) || this.itens.length === 0) errors.push('Informe ao menos um item');
    if (this.total < 0) errors.push('Total não pode ser negativo');
    return { valid: errors.length === 0, errors };
  }
}

interface EstatisticasVenda {
  vendasHoje: number;
  faturamentoHoje: number;
  ticketMedio: number;
  vendasMes: number;
  faturamentoMes: number;
}

class VendaService {
  private storageKey = 'padaria_vendas';
  private vendas: VendaModel[] = [];

  constructor() {
    this.loadFromStorage();
    this.initDadosIniciais();
  }

  private loadFromStorage(): void {
    try {
      const dadosArmazenados = localStorage.getItem(this.storageKey);
      if (dadosArmazenados) {
        const dados = JSON.parse(dadosArmazenados);
        this.vendas = (dados || []).map((v: any) => VendaModel.fromJSON(v));
      }
    } catch (error) {
      console.error('Erro ao carregar vendas do storage:', error);
      this.vendas = [];
    }
  }

  private saveToStorage(): void {
    try {
      const dados = this.vendas.map(venda => venda.toJSON());
      localStorage.setItem(this.storageKey, JSON.stringify(dados));
    } catch (error) {
      console.error('Erro ao salvar vendas no storage:', error);
    }
  }

  private initDadosIniciais(): void {
    if (this.vendas.length === 0) {
      const dadosIniciais: Venda[] = [
        {
          id: 1, dataHora: '2025-10-06T08:30:00', nomeCliente: 'Maria Silva',
          itens: [
            { produtoId: 1, nomeProduto: 'Pão Francês', precoUnitario: 0.75, quantidade: 10, subtotal: 7.50 },
            { produtoId: 10, nomeProduto: 'Café', precoUnitario: 2.00, quantidade: 2, subtotal: 4.00 }
          ],
          subtotal: 11.50, total: 11.50, formaPagamento: 'Dinheiro', status: 'Concluída'
        },
        {
          id: 2, dataHora: '2025-10-06T09:15:00', nomeCliente: 'João Santos',
          itens: [
            { produtoId: 3, nomeProduto: 'Croissant', precoUnitario: 4.00, quantidade: 2, subtotal: 8.00 },
            { produtoId: 9, nomeProduto: 'Suco Natural', precoUnitario: 4.50, quantidade: 1, subtotal: 4.50 }
          ],
          subtotal: 12.50, total: 12.50, formaPagamento: 'Cartão', status: 'Concluída'
        },
        {
          id: 3, dataHora: '2025-10-06T10:00:00', nomeCliente: 'Ana Costa',
          itens: [
            { produtoId: 4, nomeProduto: 'Brigadeiro', precoUnitario: 1.50, quantidade: 5, subtotal: 7.50 },
            { produtoId: 5, nomeProduto: 'Beijinho', precoUnitario: 1.50, quantidade: 3, subtotal: 4.50 }
          ],
          subtotal: 12.00, total: 12.00, formaPagamento: 'PIX', status: 'Concluída'
        }
      ];

      this.vendas = dadosIniciais.map(v => VendaModel.fromJSON(v));
      this.saveToStorage();
    }
  }

  getAll(): VendaModel[] {
    return [...this.vendas];
  }

  getById(id: number): VendaModel | null {
    return this.vendas.find(v => v.id === id) || null;
  }

  // Compat: alguns componentes esperam um método `listar()`
  listar(): VendaModel[] {
    return this.getAll();
  }

  async add(dadosVenda: Partial<Venda>): Promise<{ success: boolean; message: string; venda?: VendaModel }> {
    try {
      const novoId = this.getNextId();
      const venda = new VendaModel({ ...dadosVenda, id: novoId });
      const validacao = venda.validate();

      if (!validacao.valid) {
        return { success: false, message: validacao.errors.join(', ') };
      }

      this.vendas.push(venda);
      this.saveToStorage();
      return { success: true, message: 'Venda registrada com sucesso', venda };
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  getEstatisticas(): EstatisticasVenda {
    const hoje = new Date().toISOString().slice(0, 10);
    const vendasHoje = this.vendas.filter(v => v.dataHora.startsWith(hoje));
    const concluidas = vendasHoje.filter(v => v.status === 'Concluída');

    const faturamentoHoje = concluidas.reduce((sum, v) => sum + (v.total || 0), 0);
    const ticketMedio = concluidas.length > 0 ? faturamentoHoje / concluidas.length : 0;

    return {
      vendasHoje: vendasHoje.length,
      faturamentoHoje,
      ticketMedio,
      vendasMes: this.vendas.length,
      faturamentoMes: this.vendas.filter(v => v.status === 'Concluída').reduce((sum, v) => sum + (v.total || 0), 0)
    };
  }

  private getNextId(): number {
    return this.vendas.length > 0 ? Math.max(...this.vendas.map(v => v.id)) + 1 : 1;
  }
}

// Expor globalmente para compatibilidade com HTML atual
// @ts-ignore
;(window as any).vendaService = new VendaService();
