export type FormaPagamento = 'Dinheiro' | 'Cartão' | 'PIX' | string;

export interface VendaItem {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

export interface Venda {
  id: number;
  dataHora: string; // ISO string
  nomeCliente: string;
  itens: VendaItem[];
  subtotal: number;
  total: number;
  formaPagamento: FormaPagamento;
  status: 'Concluída' | 'Pendente' | 'Cancelada' | string;
}

export class VendaModel implements Venda {
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