/**
 * Componente de Controle de Estoque
 * Gerencia a interface e lógica do controle de estoque
 */
class EstoqueComponent {
  constructor() {
    this.itens = [];
    this.filteredItens = [];
    this.currentItem = null;
    this.isEditing = false;
    this.sortConfig = { key: null, direction: 'asc' };
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Botões principais
    const backBtn = document.getElementById('backToMenuFromEstoque');
    const addBtn = document.getElementById('addItemBtn');
    const saveBtn = document.getElementById('saveItemBtn');
    const cancelBtn = document.getElementById('cancelItemBtn');

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
    const searchInput = document.getElementById('searchEstoque');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => this.handleCategoryFilter(e.target.value));
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
    }

    // Form validation
    const form = document.getElementById('itemForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSave();
      });
    }
  }

  async show() {
    const estoqueScreen = document.getElementById('estoqueScreen');
    if (estoqueScreen) {
      estoqueScreen.style.display = 'block';
      await this.loadItens();
      this.render();
    }
  }

  hide() {
    const estoqueScreen = document.getElementById('estoqueScreen');
    if (estoqueScreen) {
      estoqueScreen.style.display = 'none';
    }
  }

  async loadItens() {
    try {
      this.itens = await estoqueService.listar();
      this.filteredItens = [...this.itens];
      this.updateStats();
    } catch (error) {
      console.error('Erro ao carregar itens do estoque:', error);
      this.showNotification('Erro ao carregar estoque', 'error');
    }
  }

  render() {
    this.renderTable();
    this.renderCategoryOptions();
  }

  renderTable() {
    const tableBody = document.getElementById('estoqueTableBody');
    if (!tableBody) return;

    if (this.filteredItens.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            <div class="empty-state">
              <p>Nenhum item encontrado</p>
              <button onclick="window.estoqueComponent.openAddModal()" class="btn btn-primary">
                Adicionar Primeiro Item
              </button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = this.filteredItens.map(item => `
      <tr class="${this.getRowClass(item)}">
        <td>${item.nome}</td>
        <td>${item.categoria}</td>
        <td>
          <span class="quantidade ${item.quantidade <= item.estoqueMinimo ? 'baixo-estoque' : ''}">
            ${item.quantidade} ${item.unidadeMedida}
          </span>
        </td>
        <td>${item.estoqueMinimo} ${item.unidadeMedida}</td>
        <td>R$ ${item.precoUnitario.toFixed(2)}</td>
        <td>
          <span class="status-badge status-${item.status}">
            ${this.getStatusText(item.status)}
          </span>
        </td>
        <td class="actions">
          <button onclick="window.estoqueComponent.openEditModal(${item.id})" 
                  class="btn btn-sm btn-outline-primary" title="Editar">
            ✏️
          </button>
          <button onclick="window.estoqueComponent.adjustStock(${item.id})" 
                  class="btn btn-sm btn-outline-success" title="Ajustar Estoque">
            📦
          </button>
          <button onclick="window.estoqueComponent.deleteItem(${item.id})" 
                  class="btn btn-sm btn-outline-danger" title="Excluir">
            🗑️
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderCategoryOptions() {
    const categoryFilter = document.getElementById('categoryFilter');
    const itemCategorySelect = document.getElementById('itemCategoria');
    
    const categories = [...new Set(this.itens.map(item => item.categoria))];
    
    if (categoryFilter) {
      const currentValue = categoryFilter.value;
      categoryFilter.innerHTML = `
        <option value="">Todas as categorias</option>
        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      `;
      categoryFilter.value = currentValue;
    }

    if (itemCategorySelect) {
      const currentValue = itemCategorySelect.value;
      itemCategorySelect.innerHTML = `
        <option value="">Selecione uma categoria</option>
        <option value="Farinha">Farinha</option>
        <option value="Açúcar">Açúcar</option>
        <option value="Ovos">Ovos</option>
        <option value="Leite">Leite</option>
        <option value="Fermento">Fermento</option>
        <option value="Sal">Sal</option>
        <option value="Manteiga">Manteiga</option>
        <option value="Chocolate">Chocolate</option>
        <option value="Frutas">Frutas</option>
        <option value="Temperos">Temperos</option>
        <option value="Embalagens">Embalagens</option>
        <option value="Outros">Outros</option>
        ${categories.filter(cat => !['Farinha', 'Açúcar', 'Ovos', 'Leite', 'Fermento', 'Sal', 'Manteiga', 'Chocolate', 'Frutas', 'Temperos', 'Embalagens', 'Outros'].includes(cat))
          .map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      `;
      itemCategorySelect.value = currentValue;
    }
  }

  getRowClass(item) {
    if (item.status === 'inativo') return 'row-inactive';
    if (item.quantidade <= item.estoqueMinimo) return 'row-warning';
    return '';
  }

  getStatusText(status) {
    const statusMap = {
      'ativo': 'Ativo',
      'inativo': 'Inativo',
      'descontinuado': 'Descontinuado'
    };
    return statusMap[status] || status;
  }

  openAddModal() {
    this.currentItem = null;
    this.isEditing = false;
    this.clearForm();
    this.openModal('Adicionar Item ao Estoque');
  }

  async openEditModal(itemId) {
    try {
      this.currentItem = await estoqueService.buscarPorId(itemId);
      this.isEditing = true;
      this.populateForm(this.currentItem);
      this.openModal('Editar Item do Estoque');
    } catch (error) {
      console.error('Erro ao buscar item:', error);
      this.showNotification('Erro ao carregar item', 'error');
    }
  }

  openModal(title) {
    const modal = document.getElementById('itemModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (modal && modalTitle) {
      modalTitle.textContent = title;
      modal.style.display = 'flex';
      
      // Focar no primeiro campo
      const firstInput = modal.querySelector('input, select');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }

  closeModal() {
    const modal = document.getElementById('itemModal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.clearForm();
  }

  clearForm() {
    const form = document.getElementById('itemForm');
    if (form) {
      form.reset();
    }
  }

  populateForm(item) {
    const fields = ['itemNome', 'itemCategoria', 'itemQuantidade', 'itemUnidadeMedida', 
                    'itemEstoqueMinimo', 'itemPrecoUnitario', 'itemStatus', 'itemObservacoes'];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field) return;
      
      const propertyName = fieldId.replace('item', '').toLowerCase();
      
      // Mapear nomes de propriedades
      const propertyMap = {
        'nome': 'nome',
        'categoria': 'categoria', 
        'quantidade': 'quantidade',
        'unidademedida': 'unidadeMedida',
        'estoqueminimo': 'estoqueMinimo',
        'precounitario': 'precoUnitario',
        'status': 'status',
        'observacoes': 'observacoes'
      };
      
      const realProperty = propertyMap[propertyName];
      if (realProperty && item[realProperty] !== undefined) {
        field.value = item[realProperty];
      }
    });
  }

  async handleSave() {
    try {
      const formData = this.getFormData();
      
      if (!this.validateForm(formData)) {
        return;
      }

      if (this.isEditing && this.currentItem) {
        await estoqueService.atualizar(this.currentItem.id, formData);
        this.showNotification('Item atualizado com sucesso!', 'success');
      } else {
        await estoqueService.criar(formData);
        this.showNotification('Item adicionado com sucesso!', 'success');
      }

      this.closeModal();
      await this.loadItens();
      this.render();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      this.showNotification('Erro ao salvar item', 'error');
    }
  }

  getFormData() {
    return {
      nome: document.getElementById('itemNome')?.value?.trim(),
      categoria: document.getElementById('itemCategoria')?.value?.trim(),
      quantidade: parseFloat(document.getElementById('itemQuantidade')?.value) || 0,
      unidadeMedida: document.getElementById('itemUnidadeMedida')?.value?.trim(),
      estoqueMinimo: parseFloat(document.getElementById('itemEstoqueMinimo')?.value) || 0,
      precoUnitario: parseFloat(document.getElementById('itemPrecoUnitario')?.value) || 0,
      status: document.getElementById('itemStatus')?.value || 'ativo',
      observacoes: document.getElementById('itemObservacoes')?.value?.trim() || ''
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
    if (data.quantidade < 0) {
      this.showNotification('Quantidade não pode ser negativa', 'error');
      return false;
    }
    if (!data.unidadeMedida) {
      this.showNotification('Unidade de medida é obrigatória', 'error');
      return false;
    }
    if (data.estoqueMinimo < 0) {
      this.showNotification('Estoque mínimo não pode ser negativo', 'error');
      return false;
    }
    if (data.precoUnitario <= 0) {
      this.showNotification('Preço unitário deve ser maior que zero', 'error');
      return false;
    }
    return true;
  }

  async adjustStock(itemId) {
    try {
      const item = await estoqueService.buscarPorId(itemId);
      if (!item) return;

      const adjustment = prompt(
        `Ajustar estoque de "${item.nome}"\n` +
        `Estoque atual: ${item.quantidade} ${item.unidadeMedida}\n\n` +
        `Digite a nova quantidade:`
      );

      if (adjustment === null) return;

      const newQuantity = parseFloat(adjustment);
      if (isNaN(newQuantity) || newQuantity < 0) {
        this.showNotification('Quantidade inválida', 'error');
        return;
      }

      await estoqueService.ajustarEstoque(itemId, newQuantity);
      this.showNotification('Estoque ajustado com sucesso!', 'success');
      
      await this.loadItens();
      this.render();
    } catch (error) {
      console.error('Erro ao ajustar estoque:', error);
      this.showNotification('Erro ao ajustar estoque', 'error');
    }
  }

  async deleteItem(itemId) {
    try {
      const item = await estoqueService.buscarPorId(itemId);
      if (!item) return;

      const confirmed = confirm(
        `Tem certeza que deseja excluir "${item.nome}"?\n\n` +
        `Esta ação não pode ser desfeita.`
      );

      if (!confirmed) return;

      await estoqueService.excluir(itemId);
      this.showNotification('Item excluído com sucesso!', 'success');
      
      await this.loadItens();
      this.render();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      this.showNotification('Erro ao excluir item', 'error');
    }
  }

  handleSearch(searchTerm) {
    this.filterItens();
  }

  handleCategoryFilter(category) {
    this.filterItens();
  }

  handleStatusFilter(status) {
    this.filterItens();
  }

  filterItens() {
    const searchTerm = document.getElementById('searchEstoque')?.value?.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    this.filteredItens = this.itens.filter(item => {
      const matchSearch = !searchTerm || 
        item.nome.toLowerCase().includes(searchTerm) ||
        item.categoria.toLowerCase().includes(searchTerm);
      
      const matchCategory = !categoryFilter || item.categoria === categoryFilter;
      const matchStatus = !statusFilter || item.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });

    this.renderTable();
  }

  updateStats() {
    const totalItens = document.getElementById('totalItens');
    const itensAtivos = document.getElementById('itensAtivos');
    const alertasEstoque = document.getElementById('alertasEstoque');
    const valorTotalEstoque = document.getElementById('valorTotalEstoque');

    if (totalItens) {
      totalItens.textContent = this.itens.length;
    }

    const ativos = this.itens.filter(item => item.status === 'ativo');
    if (itensAtivos) {
      itensAtivos.textContent = ativos.length;
    }

    const alertas = this.itens.filter(item => item.quantidade <= item.estoqueMinimo);
    if (alertasEstoque) {
      alertasEstoque.textContent = alertas.length;
      alertasEstoque.style.color = alertas.length > 0 ? '#e74c3c' : '#27ae60';
    }

    const valorTotal = this.itens.reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0);
    if (valorTotalEstoque) {
      valorTotalEstoque.textContent = `R$ ${valorTotal.toFixed(2)}`;
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
window.estoqueComponent = new EstoqueComponent();