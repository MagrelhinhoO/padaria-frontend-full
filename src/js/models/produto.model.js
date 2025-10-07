/**
 * Modelo de dados para Produto
 * Representa a estrutura de dados de um produto do catálogo
 */
class ProdutoModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || '';
    this.categoria = data.categoria || '';
    this.preco = data.preco || 0;
    this.precoPromocional = data.precoPromocional || null;
    this.descricao = data.descricao || '';
    this.ingredientes = data.ingredientes || [];
    this.tempoPreparacao = data.tempoPreparacao || 0; // em minutos
    this.calorias = data.calorias || null;
    this.peso = data.peso || null; // em gramas
    this.imagem = data.imagem || '';
    this.tags = data.tags || []; // ['sem glúten', 'vegano', etc]
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    this.destaque = data.destaque !== undefined ? data.destaque : false;
    this.disponivel = data.disponivel !== undefined ? data.disponivel : true;
    this.dataCriacao = data.dataCriacao || new Date().toISOString();
    this.dataModificacao = data.dataModificacao || new Date().toISOString();
  }

  /**
   * Valida os dados do produto
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

    if (this.preco <= 0) {
      errors.push('Preço deve ser maior que zero');
    }

    if (this.precoPromocional && this.precoPromocional >= this.preco) {
      errors.push('Preço promocional deve ser menor que o preço normal');
    }

    if (this.tempoPreparacao < 0) {
      errors.push('Tempo de preparação não pode ser negativo');
    }

    if (this.calorias && this.calorias < 0) {
      errors.push('Calorias não podem ser negativas');
    }

    if (this.peso && this.peso <= 0) {
      errors.push('Peso deve ser maior que zero');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Verifica se o produto está em promoção
   * @returns {boolean}
   */
  isPromocao() {
    return this.precoPromocional && this.precoPromocional < this.preco;
  }

  /**
   * Retorna o preço atual (promocional se houver, senão o normal)
   * @returns {number}
   */
  getPrecoAtual() {
    return this.isPromocao() ? this.precoPromocional : this.preco;
  }

  /**
   * Calcula o desconto percentual se houver promoção
   * @returns {number} - percentual de desconto
   */
  getDescontoPercentual() {
    if (!this.isPromocao()) return 0;
    return Math.round(((this.preco - this.precoPromocional) / this.preco) * 100);
  }

  /**
   * Verifica se o produto pode ser vendido
   * @returns {boolean}
   */
  podeVender() {
    return this.ativo && this.disponivel;
  }

  /**
   * Adiciona uma tag ao produto
   * @param {string} tag 
   */
  adicionarTag(tag) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.dataModificacao = new Date().toISOString();
    }
  }

  /**
   * Remove uma tag do produto
   * @param {string} tag 
   */
  removerTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.dataModificacao = new Date().toISOString();
    }
  }

  /**
   * Verifica se o produto tem uma tag específica
   * @param {string} tag 
   * @returns {boolean}
   */
  temTag(tag) {
    return this.tags.includes(tag);
  }

  /**
   * Adiciona um ingrediente ao produto
   * @param {string} ingrediente 
   */
  adicionarIngrediente(ingrediente) {
    if (ingrediente && !this.ingredientes.includes(ingrediente)) {
      this.ingredientes.push(ingrediente);
      this.dataModificacao = new Date().toISOString();
    }
  }

  /**
   * Remove um ingrediente do produto
   * @param {string} ingrediente 
   */
  removerIngrediente(ingrediente) {
    const index = this.ingredientes.indexOf(ingrediente);
    if (index > -1) {
      this.ingredientes.splice(index, 1);
      this.dataModificacao = new Date().toISOString();
    }
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
   * Formata o preço atual em Real brasileiro
   * @returns {string}
   */
  getPrecoAtualFormatado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.getPrecoAtual());
  }

  /**
   * Formata o preço promocional em Real brasileiro
   * @returns {string}
   */
  getPrecoPromocionalFormatado() {
    if (!this.precoPromocional) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.precoPromocional);
  }

  /**
   * Formata o tempo de preparação
   * @returns {string}
   */
  getTempoPreparacaoFormatado() {
    if (this.tempoPreparacao === 0) return 'Imediato';
    if (this.tempoPreparacao < 60) return `${this.tempoPreparacao} min`;
    
    const horas = Math.floor(this.tempoPreparacao / 60);
    const minutos = this.tempoPreparacao % 60;
    
    if (minutos === 0) return `${horas}h`;
    return `${horas}h ${minutos}min`;
  }

  /**
   * Formata o peso
   * @returns {string}
   */
  getPesoFormatado() {
    if (!this.peso) return '';
    if (this.peso < 1000) return `${this.peso}g`;
    return `${(this.peso / 1000).toFixed(1)}kg`;
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
      preco: this.preco,
      precoPromocional: this.precoPromocional,
      descricao: this.descricao,
      ingredientes: this.ingredientes,
      tempoPreparacao: this.tempoPreparacao,
      calorias: this.calorias,
      peso: this.peso,
      imagem: this.imagem,
      tags: this.tags,
      ativo: this.ativo,
      destaque: this.destaque,
      disponivel: this.disponivel,
      dataCriacao: this.dataCriacao,
      dataModificacao: this.dataModificacao
    };
  }

  /**
   * Cria instância do modelo a partir de dados brutos
   * @param {Object} data 
   * @returns {ProdutoModel}
   */
  static fromJSON(data) {
    return new ProdutoModel(data);
  }

  /**
   * Lista de categorias padrão
   * @returns {string[]}
   */
  static getCategorias() {
    return ['Pães', 'Doces', 'Salgados', 'Bebidas', 'Bolos', 'Tortas', 'Lanches'];
  }

  /**
   * Lista de tags padrão
   * @returns {string[]}
   */
  static getTagsPadrao() {
    return [
      'Sem Glúten',
      'Vegano',
      'Diet',
      'Light',
      'Integral',
      'Artesanal',
      'Gourmet',
      'Tradicional',
      'Especial',
      'Sazonal'
    ];
  }
}

// Exportar para uso global
window.ProdutoModel = ProdutoModel;