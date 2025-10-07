/**
 * Serviço de Estoque
 * Gerencia operações CRUD e lógica de negócio do estoque
 */
class EstoqueService {
  constructor() {
    this.storageKey = 'padaria_estoque';
    this.itens = [];
    this.loadFromStorage();
    this.initDadosIniciais();
  }

  /**
   * Carrega dados do localStorage
   */
  loadFromStorage() {
    try {
      const dadosArmazenados = localStorage.getItem(this.storageKey);
      if (dadosArmazenados) {
        const dados = JSON.parse(dadosArmazenados);
        this.itens = dados.map(item => EstoqueModel.fromJSON(item));
      }
    } catch (error) {
      console.error('Erro ao carregar estoque do storage:', error);
      this.itens = [];
    }
  }

  /**
   * Salva dados no localStorage
   */
  saveToStorage() {
    try {
      const dados = this.itens.map(item => item.toJSON());
      localStorage.setItem(this.storageKey, JSON.stringify(dados));
    } catch (error) {
      console.error('Erro ao salvar estoque no storage:', error);
    }
  }

  /**
   * Inicializa dados iniciais se não houver dados no storage
   */
  initDadosIniciais() {
    if (this.itens.length === 0) {
      const dadosIniciais = [
        { id: 1, nome: 'Pão Francês', categoria: 'Pães', quantidade: 50, estoqueMin: 20, preco: 0.75, unidade: 'un' },
        { id: 2, nome: 'Pão Doce', categoria: 'Pães', quantidade: 15, estoqueMin: 10, preco: 2.50, unidade: 'un' },
        { id: 3, nome: 'Croissant', categoria: 'Pães', quantidade: 8, estoqueMin: 15, preco: 4.00, unidade: 'un' },
        { id: 4, nome: 'Brigadeiro', categoria: 'Doces', quantidade: 25, estoqueMin: 10, preco: 1.50, unidade: 'un' },
        { id: 5, nome: 'Beijinho', categoria: 'Doces', quantidade: 18, estoqueMin: 10, preco: 1.50, unidade: 'un' },
        { id: 6, nome: 'Coxinha', categoria: 'Salgados', quantidade: 12, estoqueMin: 15, preco: 3.50, unidade: 'un' },
        { id: 7, nome: 'Pastel', categoria: 'Salgados', quantidade: 20, estoqueMin: 10, preco: 4.00, unidade: 'un' },
        { id: 8, nome: 'Refrigerante', categoria: 'Bebidas', quantidade: 30, estoqueMin: 20, preco: 3.00, unidade: 'un' },
        { id: 9, nome: 'Suco Natural', categoria: 'Bebidas', quantidade: 5, estoqueMin: 10, preco: 4.50, unidade: 'un' },
        { id: 10, nome: 'Café', categoria: 'Bebidas', quantidade: 40, estoqueMin: 15, preco: 2.00, unidade: 'un' }
      ];

      this.itens = dadosIniciais.map(item => new EstoqueModel(item));
      this.saveToStorage();
    }
  }

  /**
   * Retorna todos os itens do estoque
   * @param {boolean} apenasAtivos - Se deve retornar apenas itens ativos
   * @returns {EstoqueModel[]}
   */
  getAll(apenasAtivos = true) {
    return apenasAtivos ? this.itens.filter(item => item.ativo) : this.itens;
  }

  // Compatibilidade: alguns componentes usam listar()/criar()
  listar(apenasAtivos = true) {
    return this.getAll(apenasAtivos);
  }

  /**
   * Busca item por ID
   * @param {number} id 
   * @returns {EstoqueModel|null}
   */
  getById(id) {
    return this.itens.find(item => item.id === id) || null;
  }

  /**
   * Busca itens por nome (busca parcial)
   * @param {string} nome 
   * @returns {EstoqueModel[]}
   */
  searchByName(nome) {
    if (!nome) return this.getAll();
    
    const termoBusca = nome.toLowerCase();
    return this.itens.filter(item => 
      item.ativo && item.nome.toLowerCase().includes(termoBusca)
    );
  }

  /**
   * Filtra itens por categoria
   * @param {string} categoria 
   * @returns {EstoqueModel[]}
   */
  getByCategoria(categoria) {
    if (!categoria) return this.getAll();
    
    return this.itens.filter(item => 
      item.ativo && item.categoria === categoria
    );
  }

  /**
   * Busca itens com filtros combinados
   * @param {Object} filtros - {nome?, categoria?, status?}
   * @returns {EstoqueModel[]}
   */
  search(filtros = {}) {
    let resultado = this.getAll();

    if (filtros.nome) {
      const termoBusca = filtros.nome.toLowerCase();
      resultado = resultado.filter(item => 
        item.nome.toLowerCase().includes(termoBusca)
      );
    }

    if (filtros.categoria) {
      resultado = resultado.filter(item => 
        item.categoria === filtros.categoria
      );
    }

    if (filtros.status) {
      resultado = resultado.filter(item => 
        item.getStatusEstoque() === filtros.status
      );
    }

    return resultado;
  }

  /**
   * Adiciona novo item ao estoque
   * @param {Object} dadosItem 
   * @returns {Promise<{success: boolean, message: string, item?: EstoqueModel}>}
   */
  async add(dadosItem) {
    try {
      // Gerar novo ID
      const novoId = this.getNextId();
      dadosItem.id = novoId;

      // Criar modelo
      const novoItem = new EstoqueModel(dadosItem);

      // Validar
      const validacao = novoItem.validate();
      if (!validacao.valid) {
        return {
          success: false,
          message: validacao.errors.join(', ')
        };
      }

      // Verificar se já existe item com mesmo nome
      const itemExistente = this.itens.find(item => 
        item.nome.toLowerCase() === novoItem.nome.toLowerCase() && item.ativo
      );

      if (itemExistente) {
        return {
          success: false,
          message: 'Já existe um item com este nome'
        };
      }

      // Adicionar à lista
      this.itens.push(novoItem);
      this.saveToStorage();

      // Log da atividade
      authService.logActivity('estoque_adicionar', {
        item: novoItem.nome,
        quantidade: novoItem.quantidade
      });

      return {
        success: true,
        message: 'Item adicionado com sucesso',
        item: novoItem
      };

    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  // Compatibilidade: alias para add
  async criar(dadosItem) {
    return this.add(dadosItem);
  }

  /**
   * Atualiza item existente
   * @param {number} id 
   * @param {Object} novosDados 
   * @returns {Promise<{success: boolean, message: string, item?: EstoqueModel}>}
   */
  async update(id, novosDados) {
    try {
      const item = this.getById(id);
      if (!item) {
        return {
          success: false,
          message: 'Item não encontrado'
        };
      }

      // Atualizar dados
      Object.assign(item, novosDados);
      item.dataModificacao = new Date().toISOString();

      // Validar
      const validacao = item.validate();
      if (!validacao.valid) {
        return {
          success: false,
          message: validacao.errors.join(', ')
        };
      }

      this.saveToStorage();

      // Log da atividade
      authService.logActivity('estoque_atualizar', {
        item: item.nome,
        alteracoes: Object.keys(novosDados)
      });

      return {
        success: true,
        message: 'Item atualizado com sucesso',
        item: item
      };

    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  /**
   * Remove item do estoque (soft delete)
   * @param {number} id 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async remove(id) {
    try {
      const item = this.getById(id);
      if (!item) {
        return {
          success: false,
          message: 'Item não encontrado'
        };
      }

      // Soft delete
      item.ativo = false;
      item.dataModificacao = new Date().toISOString();
      this.saveToStorage();

      // Log da atividade
      authService.logActivity('estoque_remover', {
        item: item.nome
      });

      return {
        success: true,
        message: 'Item removido com sucesso'
      };

    } catch (error) {
      console.error('Erro ao remover item:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  /**
   * Adiciona quantidade ao estoque
   * @param {number} id 
   * @param {number} quantidade 
   * @param {string} motivo 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async adicionarQuantidade(id, quantidade, motivo = 'Entrada manual') {
    try {
      const item = this.getById(id);
      if (!item) {
        return {
          success: false,
          message: 'Item não encontrado'
        };
      }

      if (quantidade <= 0) {
        return {
          success: false,
          message: 'Quantidade deve ser maior que zero'
        };
      }

      item.adicionarEstoque(quantidade, motivo);
      this.saveToStorage();

      // Log da atividade
      authService.logActivity('estoque_entrada', {
        item: item.nome,
        quantidade: quantidade,
        motivo: motivo
      });

      return {
        success: true,
        message: `${quantidade} ${item.unidade} adicionado(s) ao estoque`
      };

    } catch (error) {
      console.error('Erro ao adicionar quantidade:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  /**
   * Remove quantidade do estoque
   * @param {number} id 
   * @param {number} quantidade 
   * @param {string} motivo 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async removerQuantidade(id, quantidade, motivo = 'Saída manual') {
    try {
      const item = this.getById(id);
      if (!item) {
        return {
          success: false,
          message: 'Item não encontrado'
        };
      }

      if (quantidade <= 0) {
        return {
          success: false,
          message: 'Quantidade deve ser maior que zero'
        };
      }

      const sucesso = item.removerEstoque(quantidade, motivo);
      if (!sucesso) {
        return {
          success: false,
          message: 'Estoque insuficiente'
        };
      }

      this.saveToStorage();

      // Log da atividade
      authService.logActivity('estoque_saida', {
        item: item.nome,
        quantidade: quantidade,
        motivo: motivo
      });

      return {
        success: true,
        message: `${quantidade} ${item.unidade} removido(s) do estoque`
      };

    } catch (error) {
      console.error('Erro ao remover quantidade:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  /**
   * Retorna estatísticas do estoque
   * @returns {Object}
   */
  getEstatisticas() {
    const itensAtivos = this.getAll();
    
    return {
      totalItens: itensAtivos.length,
      valorTotal: itensAtivos.reduce((sum, item) => sum + item.getValorTotal(), 0),
      itensBaixos: itensAtivos.filter(item => item.isEstoqueBaixo()).length,
      itensCriticos: itensAtivos.filter(item => item.isEstoqueCritico()).length,
      porCategoria: this.getEstatisticasPorCategoria()
    };
  }

  /**
   * Retorna estatísticas por categoria
   * @returns {Object}
   */
  getEstatisticasPorCategoria() {
    const stats = {};
    const itensAtivos = this.getAll();

    itensAtivos.forEach(item => {
      if (!stats[item.categoria]) {
        stats[item.categoria] = {
          quantidade: 0,
          valorTotal: 0,
          itens: 0
        };
      }

      stats[item.categoria].quantidade += item.quantidade;
      stats[item.categoria].valorTotal += item.getValorTotal();
      stats[item.categoria].itens += 1;
    });

    return stats;
  }

  /**
   * Retorna itens com estoque baixo
   * @returns {EstoqueModel[]}
   */
  getItensEstoqueBaixo() {
    return this.getAll().filter(item => item.isEstoqueBaixo());
  }

  /**
   * Retorna próximo ID disponível
   * @returns {number}
   */
  getNextId() {
    return this.itens.length > 0 ? Math.max(...this.itens.map(item => item.id)) + 1 : 1;
  }

  /**
   * Exporta dados do estoque
   * @returns {string} - JSON string
   */
  exportData() {
    return JSON.stringify(this.itens.map(item => item.toJSON()), null, 2);
  }

  /**
   * Importa dados do estoque
   * @param {string} jsonData 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async importData(jsonData) {
    try {
      const dados = JSON.parse(jsonData);
      
      if (!Array.isArray(dados)) {
        return {
          success: false,
          message: 'Formato de dados inválido'
        };
      }

      // Validar cada item
      const itensValidos = [];
      for (const itemData of dados) {
        const item = new EstoqueModel(itemData);
        const validacao = item.validate();
        
        if (validacao.valid) {
          itensValidos.push(item);
        }
      }

      if (itensValidos.length === 0) {
        return {
          success: false,
          message: 'Nenhum item válido encontrado'
        };
      }

      this.itens = itensValidos;
      this.saveToStorage();

      return {
        success: true,
        message: `${itensValidos.length} itens importados com sucesso`
      };

    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return {
        success: false,
        message: 'Erro ao processar arquivo de importação'
      };
    }
  }
}

// Criar instância global do serviço
window.estoqueService = new EstoqueService();