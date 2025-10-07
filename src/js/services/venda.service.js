"use strict";
// Tipos e modelo de Venda (auto-contido para evitar módulos)
class VendaModel {
    constructor(data = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.id = (_a = data.id) !== null && _a !== void 0 ? _a : 0;
        this.dataHora = (_b = data.dataHora) !== null && _b !== void 0 ? _b : new Date().toISOString();
        this.nomeCliente = (_c = data.nomeCliente) !== null && _c !== void 0 ? _c : '';
        this.itens = (_d = data.itens) !== null && _d !== void 0 ? _d : [];
        this.subtotal = (_e = data.subtotal) !== null && _e !== void 0 ? _e : 0;
        this.total = (_f = data.total) !== null && _f !== void 0 ? _f : 0;
        this.formaPagamento = (_g = data.formaPagamento) !== null && _g !== void 0 ? _g : 'Dinheiro';
        this.status = (_h = data.status) !== null && _h !== void 0 ? _h : 'Concluída';
    }
    static fromJSON(json) {
        const vm = new VendaModel(json);
        vm.itens = (json.itens || []).map((i) => {
            var _a, _b, _c, _d;
            return ({
                produtoId: Number(i.produtoId),
                nomeProduto: String((_a = i.nomeProduto) !== null && _a !== void 0 ? _a : ''),
                precoUnitario: Number((_b = i.precoUnitario) !== null && _b !== void 0 ? _b : 0),
                quantidade: Number((_c = i.quantidade) !== null && _c !== void 0 ? _c : 0),
                subtotal: Number((_d = i.subtotal) !== null && _d !== void 0 ? _d : 0)
            });
        });
        return vm;
    }
    toJSON() {
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
    validate() {
        const errors = [];
        if (!this.dataHora)
            errors.push('Data/Hora é obrigatória');
        if (!Array.isArray(this.itens) || this.itens.length === 0)
            errors.push('Informe ao menos um item');
        if (this.total < 0)
            errors.push('Total não pode ser negativo');
        return { valid: errors.length === 0, errors };
    }
}
class VendaService {
    constructor() {
        this.storageKey = 'padaria_vendas';
        this.vendas = [];
        this.loadFromStorage();
        this.initDadosIniciais();
    }
    loadFromStorage() {
        try {
            const dadosArmazenados = localStorage.getItem(this.storageKey);
            if (dadosArmazenados) {
                const dados = JSON.parse(dadosArmazenados);
                this.vendas = (dados || []).map((v) => VendaModel.fromJSON(v));
            }
        }
        catch (error) {
            console.error('Erro ao carregar vendas do storage:', error);
            this.vendas = [];
        }
    }
    saveToStorage() {
        try {
            const dados = this.vendas.map(venda => venda.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(dados));
        }
        catch (error) {
            console.error('Erro ao salvar vendas no storage:', error);
        }
    }
    initDadosIniciais() {
        if (this.vendas.length === 0) {
            const dadosIniciais = [
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
    getAll() {
        return [...this.vendas];
    }
    getById(id) {
        return this.vendas.find(v => v.id === id) || null;
    }
    // Compat: alguns componentes esperam um método `listar()`
    listar() {
        return this.getAll();
    }
    async add(dadosVenda) {
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
        }
        catch (error) {
            return { success: false, message: 'Erro interno do servidor' };
        }
    }
    getEstatisticas() {
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
    getNextId() {
        return this.vendas.length > 0 ? Math.max(...this.vendas.map(v => v.id)) + 1 : 1;
    }
}
// Expor globalmente para compatibilidade com HTML atual
// @ts-ignore
;
window.vendaService = new VendaService();
