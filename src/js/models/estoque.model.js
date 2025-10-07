/**
 * Modelo de dados para Item de Estoque
 * Representa a estrutura de dados de um item no estoque
 */
class EstoqueModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || '';
    this.categoria = data.categoria || '';
    this.quantidade = data.quantidade || 0;
    this.estoqueMin = data.estoqueMin || 0;
    this.preco = data.preco || 0;
    this.unidade = data.unidade || 'un'; // un, kg, l, cx
    this.fornecedor = data.fornecedor || '';
    this.dataUltimaEntrada = data.dataUltimaEntrada || null;
    this.dataUltimaSaida = data.dataUltimaSaida || null;
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    this.dataCriacao = data.dataCriacao || new Date().toISOString();
    this.dataModificacao = data.dataModificacao || new Date().toISOString();
  }

  /**
   * Valida os dados do item de estoque
   * @returns {Object} - {valid: boolean, errors: string[]}
   */
  validate() {
    const errors = [];

    if (!this.nome || this.nome.trim().length < 2) {
      errors.push('Nome do produto deve ter pelo menos 2 caracteres');
    }

    if (!this.categoria || this.categoria.trim().length < 2) {
      errors.push('Categoria deve ser informada');
    }

    if (this.quantidade < 0) {
      errors.push('Quantidade não pode ser negativa');
    }

    if (this.estoqueMin < 0) {
      errors.push('Estoque mínimo não pode ser negativo');
    }

    if (this.preco < 0) {
      errors.push('Preço não pode ser negativo');
    }

    if (!['un', 'kg', 'l', 'cx'].includes(this.unidade)) {
      errors.push('Unidade deve ser: un, kg, l ou cx');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calcula o valor total do item em estoque
   * @returns {number}
   */
  getValorTotal() {
    return this.quantidade * this.preco;
  }

  /**
   * Verifica se o estoque está baixo
   * @returns {boolean}
   */
  isEstoqueBaixo() {
    return this.quantidade <= this.estoqueMin;
  }

  /**
   * Verifica se o estoque está crítico (abaixo de 50% do mínimo)
   * @returns {boolean}
   */
  isEstoqueCritico() {
    return this.quantidade <= (this.estoqueMin * 0.5);
  }

  /**
   * Verifica se o estoque está alto (acima de 200% do mínimo)
   * @returns {boolean}
   */
  isEstoqueAlto() {
    return this.quantidade >= (this.estoqueMin * 2);
  }

  /**
   * Retorna o status do estoque
   * @returns {string} - 'critico', 'baixo', 'normal', 'alto'
   */
  getStatusEstoque() {
    if (this.isEstoqueCritico()) return 'critico';
    if (this.isEstoqueBaixo()) return 'baixo';
    if (this.isEstoqueAlto()) return 'alto';
    return 'normal';
  }

  /**
   * Adiciona quantidade ao estoque
   * @param {number} quantidade 
   * @param {string} motivo 
   */
  adicionarEstoque(quantidade, motivo = 'Entrada manual') {
    if (quantidade > 0) {
      this.quantidade += quantidade;
      this.dataUltimaEntrada = new Date().toISOString();
      this.dataModificacao = new Date().toISOString();
      
      // Em produção, aqui seria registrado um log de movimentação
      console.log(`Estoque adicionado: ${quantidade} ${this.unidade} - ${motivo}`);
    }
  }

  /**
   * Remove quantidade do estoque
   * @param {number} quantidade 
   * @param {string} motivo 
   * @returns {boolean} - true se conseguiu remover, false se não tinha estoque suficiente
   */
  removerEstoque(quantidade, motivo = 'Saída manual') {
    if (quantidade > 0 && this.quantidade >= quantidade) {
      this.quantidade -= quantidade;
      this.dataUltimaSaida = new Date().toISOString();
      this.dataModificacao = new Date().toISOString();
      
      // Em produção, aqui seria registrado um log de movimentação
      console.log(`Estoque removido: ${quantidade} ${this.unidade} - ${motivo}`);
      return true;
    }
    return false;
  }

  /**
   * Formata a quantidade com a unidade
   * @returns {string}
   */
  getQuantidadeFormatada() {
    return `${this.quantidade} ${this.unidade}`;
  }

  /**
   * Formata o preço em Real brasileiro
   * @returns {string}
   */
  getPrecoFormatado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.preco);
  }

  /**
   * Formata o valor total em Real brasileiro
   * @returns {string}
   */
  getValorTotalFormatado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.getValorTotal());
  }

  /**
   * Converte o modelo para objeto simples
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      categoria: this.categoria,
      quantidade: this.quantidade,
      estoqueMin: this.estoqueMin,
      preco: this.preco,
      unidade: this.unidade,
      fornecedor: this.fornecedor,
      dataUltimaEntrada: this.dataUltimaEntrada,
      dataUltimaSaida: this.dataUltimaSaida,
      ativo: this.ativo,
      dataCriacao: this.dataCriacao,
      dataModificacao: this.dataModificacao
    };
  }

  /**
   * Cria instância do modelo a partir de dados brutos
   * @param {Object} data 
   * @returns {EstoqueModel}
   */
  static fromJSON(data) {
    return new EstoqueModel(data);
  }

  /**
   * Lista de categorias padrão
   * @returns {string[]}
   */
  static getCategorias() {
    return ['Pães', 'Doces', 'Salgados', 'Bebidas', 'Ingredientes', 'Embalagens'];
  }

  /**
   * Lista de unidades padrão
   * @returns {Object[]}
   */
  static getUnidades() {
    return [
      { value: 'un', label: 'Unidade' },
      { value: 'kg', label: 'Quilograma' },
      { value: 'l', label: 'Litro' },
      { value: 'cx', label: 'Caixa' }
    ];
  }
}

// Exportar para uso global
window.EstoqueModel = EstoqueModel;