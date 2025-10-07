/**
 * Componente de Produtos
 * Gerencia a interface e lógica do catálogo de produtos
 */
class ProdutosComponent {
  constructor() {
    this.produtos = [];
    this.filteredProdutos = [];
    this.currentProduto = null;
    this.isEditing = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Botões principais
    const backBtn = document.getElementById('backToMenuFromProdutos');
    const addBtn = document.getElementById('addProdutoBtn');
    const saveBtn = document.getElementById('saveProdutoBtn');
    const cancelBtn = document.getElementById('cancelProdutoBtn');

    if (backBtn) {
      backBtn.addEventListener('click', () => this.navigateToMenu());
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => this.openAddModal());
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.handleSave());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.closeModal());
    }

    // Pesquisa e filtros
    const searchInput = document.getElementById('searchProdutos');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    const categoryFilter = document.getElementById('produtoCategoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => this.handleCategoryFilter(e.target.value));
    }

    const statusFilter = document.getElementById('produtoStatusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
    }

    // Form events
    const form = document.getElementById('produtoForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSave();
      });
    }

    // Preview de preço com margem
    const custoInput = document.getElementById('produtoCusto');
    const margemInput = document.getElementById('produtoMargem');
    if (custoInput && margemInput) {
      custoInput.addEventListener('input', () => this.updatePrecoPreview());
      margemInput.addEventListener('input', () => this.updatePrecoPreview());
    }
  }

  async show() {
    const produtosScreen = document.getElementById('produtosScreen');
    if (produtosScreen) {
      produtosScreen.style.display = 'block';
      await this.loadProdutos();
      this.render();
    }
  }

  hide() {
    const produtosScreen = document.getElementById('produtosScreen');
    if (produtosScreen) {
      produtosScreen.style.display = 'none';
    }
  }

  async loadProdutos() {
    try {
      this.produtos = await produtoService.listar();
      this.filteredProdutos = [...this.produtos];
      this.updateStats();
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      this.showNotification('Erro ao carregar produtos', 'error');
    }
  }

  render() {
    this.renderTable();
    this.renderCategoryOptions();
  }

  renderTable() {
    const tableBody = document.getElementById('produtosTableBody');
    if (!tableBody) return;

    if (this.filteredProdutos.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center">
            <div class="empty-state">
              <p>Nenhum produto encontrado</p>
              <button onclick="window.produtosComponent.openAddModal()" class="btn btn-primary">
                Adicionar Primeiro Produto
              </button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = this.filteredProdutos.map(produto => `
      <tr class="${this.getRowClass(produto)}">
        <td>
          <div class="produto-info">
            <strong>${produto.nome}</strong>
            ${produto.descricao ? `<br><small class="text-muted">${produto.descricao}</small>` : ''}
          </div>
        </td>
        <td>${produto.categoria}</td>
        <td>R$ ${produto.custo.toFixed(2)}</td>
        <td>${produto.margem}%</td>
        <td class="price">R$ ${produto.preco.toFixed(2)}</td>
        <td>
          <span class="status-badge status-${produto.status}">
            ${this.getStatusText(produto.status)}
          </span>
        </td>
        <td>
          ${produto.promocao ? `
            <span class="promocao-badge">
              ${produto.promocao.desconto}% OFF
            </span>
          ` : '-'}
        </td>
        <td class="actions">
          <button onclick="window.produtosComponent.openEditModal(${produto.id})" 
                  class="btn btn-sm btn-outline-primary" title="Editar">
            ✏️
          </button>
          <button onclick="window.produtosComponent.togglePromocao(${produto.id})" 
                  class="btn btn-sm btn-outline-warning" title="Promoção">
            🏷️
          </button>
          <button onclick="window.produtosComponent.duplicateProduto(${produto.id})" 
                  class="btn btn-sm btn-outline-info" title="Duplicar">
            📋
          </button>
          <button onclick="window.produtosComponent.deleteProduto(${produto.id})" 
                  class="btn btn-sm btn-outline-danger" title="Excluir">
            🗑️
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderCategoryOptions() {
    const categoryFilter = document.getElementById('produtoCategoryFilter');
    const produtoCategorySelect = document.getElementById('produtoCategoria');
    
    const categories = [...new Set(this.produtos.map(produto => produto.categoria))];
    
    if (categoryFilter) {
      const currentValue = categoryFilter.value;
      categoryFilter.innerHTML = `
        <option value="">Todas as categorias</option>
        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      `;
      categoryFilter.value = currentValue;
    }

    if (produtoCategorySelect) {
      const currentValue = produtoCategorySelect.value;
      produtoCategorySelect.innerHTML = `
        <option value="">Selecione uma categoria</option>
        <option value="Pães">Pães</option>
        <option value="Doces">Doces</option>
        <option value="Salgados">Salgados</option>
        <option value="Bolos">Bolos</option>
        <option value="Tortas">Tortas</option>
        <option value="Biscoitos">Biscoitos</option>
        <option value="Bebidas">Bebidas</option>
        <option value="Sanduíches">Sanduíches</option>
        <option value="Especiais">Especiais</option>
        <option value="Outros">Outros</option>
        ${categories.filter(cat => !['Pães', 'Doces', 'Salgados', 'Bolos', 'Tortas', 'Biscoitos', 'Bebidas', 'Sanduíches', 'Especiais', 'Outros'].includes(cat))
          .map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      `;
      produtoCategorySelect.value = currentValue;
    }
  }

  getRowClass(produto) {
    if (produto.status === 'inativo') return 'row-inactive';
    if (produto.promocao) return 'row-promocao';
    return '';
  }

  getStatusText(status) {
    const statusMap = {
      'ativo': 'Ativo',
      'inativo': 'Inativo',
      'esgotado': 'Esgotado',
      'sazonal': 'Sazonal'
    };
    return statusMap[status] || status;
  }

  openAddModal() {
    this.currentProduto = null;
    this.isEditing = false;
    this.clearForm();
    this.openModal('Adicionar Produto');
  }

  async openEditModal(produtoId) {
    try {
      this.currentProduto = await produtoService.buscarPorId(produtoId);
      this.isEditing = true;
      this.populateForm(this.currentProduto);
      this.openModal('Editar Produto');
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      this.showNotification('Erro ao carregar produto', 'error');
    }
  }

  openModal(title) {
    const modal = document.getElementById('produtoModal');
    const modalTitle = document.getElementById('produtoModalTitle');
    
    if (modal && modalTitle) {
      modalTitle.textContent = title;
      modal.style.display = 'flex';
      
      // Focar no primeiro campo
      const firstInput = modal.querySelector('input, select');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
      
      this.updatePrecoPreview();
    }
  }

  closeModal() {
    const modal = document.getElementById('produtoModal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.clearForm();
  }

  clearForm() {
    const form = document.getElementById('produtoForm');
    if (form) {
      form.reset();
    }
    this.updatePrecoPreview();
  }

  populateForm(produto) {
    const fields = [
      'produtoNome', 'produtoCategoria', 'produtoDescricao', 'produtoCusto',
      'produtoMargem', 'produtoStatus', 'produtoObservacoes'
    ];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field) return;
      
      const propertyName = fieldId.replace('produto', '').toLowerCase();
      
      const propertyMap = {
        'nome': 'nome',
        'categoria': 'categoria', 
        'descricao': 'descricao',
        'custo': 'custo',
        'margem': 'margem',
        'status': 'status',
        'observacoes': 'observacoes'
      };
      
      const realProperty = propertyMap[propertyName];
      if (realProperty && produto[realProperty] !== undefined) {
        field.value = produto[realProperty];
      }
    });
    
    this.updatePrecoPreview();
  }

  updatePrecoPreview() {
    const custoInput = document.getElementById('produtoCusto');
    const margemInput = document.getElementById('produtoMargem');
    const precoPreview = document.getElementById('precoPreview');
    
    if (!custoInput || !margemInput || !precoPreview) return;
    
    const custo = parseFloat(custoInput.value) || 0;
    const margem = parseFloat(margemInput.value) || 0;
    
    const preco = custo * (1 + margem / 100);
    
    precoPreview.textContent = `Preço Final: R$ ${preco.toFixed(2)}`;
    
    // Colorir baseado na margem
    if (margem < 20) {
      precoPreview.style.color = '#e74c3c'; // Vermelho - margem baixa
    } else if (margem < 50) {
      precoPreview.style.color = '#f39c12'; // Laranja - margem média
    } else {
      precoPreview.style.color = '#27ae60'; // Verde - margem boa
    }
  }

  async handleSave() {
    try {
      const formData = this.getFormData();
      
      if (!this.validateForm(formData)) {
        return;
      }

      if (this.isEditing && this.currentProduto) {
        await produtoService.atualizar(this.currentProduto.id, formData);
        this.showNotification('Produto atualizado com sucesso!', 'success');
      } else {
        await produtoService.criar(formData);
        this.showNotification('Produto adicionado com sucesso!', 'success');
      }

      this.closeModal();
      await this.loadProdutos();
      this.render();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      this.showNotification('Erro ao salvar produto', 'error');
    }
  }

  getFormData() {
    const custo = parseFloat(document.getElementById('produtoCusto')?.value) || 0;
    const margem = parseFloat(document.getElementById('produtoMargem')?.value) || 0;
    const preco = custo * (1 + margem / 100);
    
    return {
      nome: document.getElementById('produtoNome')?.value?.trim(),
      categoria: document.getElementById('produtoCategoria')?.value?.trim(),
      descricao: document.getElementById('produtoDescricao')?.value?.trim() || '',
      custo: custo,
      margem: margem,
      preco: preco,
      status: document.getElementById('produtoStatus')?.value || 'ativo',
      observacoes: document.getElementById('produtoObservacoes')?.value?.trim() || ''
    };
  }

  validateForm(data) {
    if (!data.nome) {
      this.showNotification('Nome é obrigatório', 'error');
      return false;
    }
    if (!data.categoria) {
      this.showNotification('Categoria é obrigatória', 'error');
      return false;
    }
    if (data.custo <= 0) {
      this.showNotification('Custo deve ser maior que zero', 'error');
      return false;
    }
    if (data.margem < 0) {
      this.showNotification('Margem não pode ser negativa', 'error');
      return false;
    }
    return true;
  }

  async togglePromocao(produtoId) {
    try {
      const produto = await produtoService.buscarPorId(produtoId);
      if (!produto) return;

      if (produto.promocao) {
        // Remover promoção
        const confirmed = confirm(`Remover promoção de "${produto.nome}"?`);
        if (confirmed) {
          await produtoService.removerPromocao(produtoId);
          this.showNotification('Promoção removida!', 'success');
        }
      } else {
        // Adicionar promoção
        const desconto = prompt(
          `Adicionar promoção para "${produto.nome}"\n\n` +
          `Digite o percentual de desconto (0-100):`
        );

        if (desconto === null) return;

        const descontoNum = parseFloat(desconto);
        if (isNaN(descontoNum) || descontoNum <= 0 || descontoNum > 100) {
          this.showNotification('Desconto inválido (deve ser entre 0 e 100)', 'error');
          return;
        }

        const descricao = prompt('Descrição da promoção (opcional):') || `${descontoNum}% de desconto`;

        await produtoService.adicionarPromocao(produtoId, {
          desconto: descontoNum,
          descricao: descricao,
          dataInicio: new Date(),
          dataFim: null
        });

        this.showNotification('Promoção adicionada!', 'success');
      }

      await this.loadProdutos();
      this.render();
    } catch (error) {
      console.error('Erro ao gerenciar promoção:', error);
      this.showNotification('Erro ao gerenciar promoção', 'error');
    }
  }

  async duplicateProduto(produtoId) {
    try {
      const produto = await produtoService.buscarPorId(produtoId);
      if (!produto) return;

      const confirmed = confirm(`Duplicar produto "${produto.nome}"?`);
      if (!confirmed) return;

      const novoProduto = {
        ...produto,
        nome: `${produto.nome} (Cópia)`,
        promocao: null // Não duplicar promoção
      };

      delete novoProduto.id; // Remover ID para criar novo
      delete novoProduto.dataCriacao;
      delete novoProduto.dataAtualizacao;

      await produtoService.criar(novoProduto);
      this.showNotification('Produto duplicado com sucesso!', 'success');
      
      await this.loadProdutos();
      this.render();
    } catch (error) {
      console.error('Erro ao duplicar produto:', error);
      this.showNotification('Erro ao duplicar produto', 'error');
    }
  }

  async deleteProduto(produtoId) {
    try {
      const produto = await produtoService.buscarPorId(produtoId);
      if (!produto) return;

      const confirmed = confirm(
        `Tem certeza que deseja excluir "${produto.nome}"?\n\n` +
        `Esta ação não pode ser desfeita.`
      );

      if (!confirmed) return;

      await produtoService.excluir(produtoId);
      this.showNotification('Produto excluído com sucesso!', 'success');
      
      await this.loadProdutos();
      this.render();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      this.showNotification('Erro ao excluir produto', 'error');
    }
  }

  handleSearch(searchTerm) {
    this.filterProdutos();
  }

  handleCategoryFilter(category) {
    this.filterProdutos();
  }

  handleStatusFilter(status) {
    this.filterProdutos();
  }

  filterProdutos() {
    const searchTerm = document.getElementById('searchProdutos')?.value?.toLowerCase() || '';
    const categoryFilter = document.getElementById('produtoCategoryFilter')?.value || '';
    const statusFilter = document.getElementById('produtoStatusFilter')?.value || '';

    this.filteredProdutos = this.produtos.filter(produto => {
      const matchSearch = !searchTerm || 
        produto.nome.toLowerCase().includes(searchTerm) ||
        produto.categoria.toLowerCase().includes(searchTerm) ||
        produto.descricao.toLowerCase().includes(searchTerm);
      
      const matchCategory = !categoryFilter || produto.categoria === categoryFilter;
      const matchStatus = !statusFilter || produto.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });

    this.renderTable();
  }

  updateStats() {
    const totalProdutos = document.getElementById('totalProdutos');
    const produtosAtivos = document.getElementById('produtosAtivos');
    const produtosPromocao = document.getElementById('produtosPromocao');
    const ticketMedio = document.getElementById('ticketMedio');

    if (totalProdutos) {
      totalProdutos.textContent = this.produtos.length;
    }

    const ativos = this.produtos.filter(produto => produto.status === 'ativo');
    if (produtosAtivos) {
      produtosAtivos.textContent = ativos.length;
    }

    const promocoes = this.produtos.filter(produto => produto.promocao);
    if (produtosPromocao) {
      produtosPromocao.textContent = promocoes.length;
    }

    const precoMedio = this.produtos.length > 0 
      ? this.produtos.reduce((sum, produto) => sum + produto.preco, 0) / this.produtos.length 
      : 0;
    if (ticketMedio) {
      ticketMedio.textContent = `R$ ${precoMedio.toFixed(2)}`;
    }
  }

  navigateToMenu() {
    window.dispatchEvent(new CustomEvent('navigateToScreen', { 
      detail: { screen: 'menu' } 
    }));
  }

  showNotification(message, type = 'info') {
    // Implementar sistema de notificações
    if (type === 'error') {
      alert('Erro: ' + message);
    } else {
      alert(message);
    }
  }

  destroy() {
    // Cleanup se necessário
  }
}

// Criar instância global
window.produtosComponent = new ProdutosComponent();