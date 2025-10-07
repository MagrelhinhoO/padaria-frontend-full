"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendaModel = void 0;
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
exports.VendaModel = VendaModel;
