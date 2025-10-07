/**
 * Serviço de Produtos
 * Gerencia operações CRUD e lógica de negócio dos produtos
 */
class ProdutoService {
  constructor() {
    this.storageKey = 'padaria_produtos';
    this.produtos = [];
    this.loadFromStorage();
    this.initDadosIniciais();
  }

  loadFromStorage() {
    try {
      const dadosArmazenados = localStorage.getItem(this.storageKey);
      if (dadosArmazenados) {
        const dados = JSON.parse(dadosArmazenados);
        this.produtos = dados.map(produto => ProdutoModel.fromJSON(produto));
      }
    } catch (error) {
      console.error('Erro ao carregar produtos do storage:', error);
      this.produtos = [];
    }
  }

  saveToStorage() {
    try {
      const dados = this.produtos.map(produto => produto.toJSON());
      localStorage.setItem(this.storageKey, JSON.stringify(dados));
    } catch (error) {
      console.error('Erro ao salvar produtos no storage:', error);
    }
  }

  initDadosIniciais() {
    if (this.produtos.length === 0) {
      const dadosIniciais = [
        { id: 1, nome: 'Pão Francês', categoria: 'Pães', preco: 0.75, descricao: 'Pão francês tradicional', ativo: true },
        { id: 2, nome: 'Pão Doce', categoria: 'Pães', preco: 2.50, descricao: 'Pão doce recheado', ativo: true },
        { id: 3, nome: 'Croissant', categoria: 'Pães', preco: 4.00, descricao: 'Croissant folhado', ativo: true },
        { id: 4, nome: 'Brigadeiro', categoria: 'Doces', preco: 1.50, descricao: 'Brigadeiro gourmet', ativo: true },
        { id: 5, nome: 'Beijinho', categoria: 'Doces', preco: 1.50, descricao: 'Beijinho de coco', ativo: true },
        { id: 6, nome: 'Coxinha', categoria: 'Salgados', preco: 3.50, descricao: 'Coxinha de frango', ativo: true },
        { id: 7, nome: 'Pastel', categoria: 'Salgados', preco: 4.00, descricao: 'Pastel assado diversos sabores', ativo: false },
        { id: 8, nome: 'Torta de Maçã', categoria: 'Doces', preco: 6.50, descricao: 'Torta de maçã caseira', ativo: true }
      ];

      this.produtos = dadosIniciais.map(produto => new ProdutoModel(produto));
      this.saveToStorage();
    }
  }

  getAll(apenasAtivos = true) {
    return apenasAtivos ? this.produtos.filter(produto => produto.ativo) : this.produtos;
  }

  // Compatibilidade: alguns componentes usam listar()/criar()
  listar(apenasAtivos = true) {
    return this.getAll(apenasAtivos);
  }

  getById(id) {
    return this.produtos.find(produto => produto.id === id) || null;
  }

  async add(dadosProduto) {
    try {
      const novoId = this.getNextId();
      dadosProduto.id = novoId;
      const novoProduto = new ProdutoModel(dadosProduto);
      const validacao = novoProduto.validate();
      
      if (!validacao.valid) {
        return { success: false, message: validacao.errors.join(', ') };
      }

      this.produtos.push(novoProduto);
      this.saveToStorage();
      return { success: true, message: 'Produto adicionado com sucesso', produto: novoProduto };
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  // Compatibilidade: alias para add
  async criar(dadosProduto) {
    return this.add(dadosProduto);
  }

  async update(id, novosDados) {
    try {
      const produto = this.getById(id);
      if (!produto) {
        return { success: false, message: 'Produto não encontrado' };
      }

      Object.assign(produto, novosDados);
      produto.dataModificacao = new Date().toISOString();
      const validacao = produto.validate();
      
      if (!validacao.valid) {
        return { success: false, message: validacao.errors.join(', ') };
      }

      this.saveToStorage();
      return { success: true, message: 'Produto atualizado com sucesso', produto: produto };
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  async remove(id) {
    try {
      const produto = this.getById(id);
      if (!produto) {
        return { success: false, message: 'Produto não encontrado' };
      }

      produto.ativo = false;
      produto.dataModificacao = new Date().toISOString();
      this.saveToStorage();
      return { success: true, message: 'Produto removido com sucesso' };
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  getEstatisticas() {
    const produtosAtivos = this.getAll();
    return {
      totalProdutos: produtosAtivos.length,
      produtosAtivos: produtosAtivos.filter(p => p.ativo && p.disponivel).length,
      precoMedio: produtosAtivos.reduce((sum, p) => sum + p.preco, 0) / produtosAtivos.length || 0,
      emPromocao: produtosAtivos.filter(p => p.isPromocao()).length
    };
  }

  getNextId() {
    return this.produtos.length > 0 ? Math.max(...this.produtos.map(p => p.id)) + 1 : 1;
  }
}

window.produtoService = new ProdutoService();