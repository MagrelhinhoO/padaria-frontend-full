/**
 * Componente de Menu Principal
 * Gerencia a interface e navegação do menu principal
 */
class MenuComponent {
  constructor() {
    this.menuItems = [];
    this.currentUser = null;
    this.init();
  }

  init() {
    this.setupMenuItems();
    this.bindEvents();
  }

  setupMenuItems() {
    this.menuItems = [
      {
        id: 'estoque',
        titulo: 'Controle de Estoque',
        descricao: 'Gerencie matérias-primas e ingredientes',
        icone: '📦',
        handler: () => this.navigateToScreen('estoque')
      },
      {
        id: 'produtos',
        titulo: 'Catálogo de Produtos',
        descricao: 'Cadastre e gerencie produtos da padaria',
        icone: '🥖',
        handler: () => this.navigateToScreen('produtos')
      },
      {
        id: 'vendas',
        titulo: 'Sistema de Vendas',
        descricao: 'Processe vendas e controle caixa',
        icone: '💰',
        handler: () => this.navigateToScreen('vendas')
      },
      {
        id: 'relatorios',
        titulo: 'Relatórios Gerenciais',
        descricao: 'Visualize relatórios e análises',
        icone: '📊',
        handler: () => this.navigateToScreen('relatorios')
      }
    ];
  }

  bindEvents() {
    // Event listener para logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }
  }

  render() {
    const menuScreen = document.getElementById('menuScreen');
    if (!menuScreen) return;

    // Atualizar informações do usuário
    this.renderUserInfo();
    
    // Render menu items
    this.renderMenuItems();
    
    // Aplicar estatísticas
    this.loadDashboardStats();
  }

  renderUserInfo() {
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome && this.currentUser) {
      userWelcome.textContent = `Bem-vindo, ${this.currentUser.nome}!`;
    }

    const currentDateTime = document.getElementById('currentDateTime');
    if (currentDateTime) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('pt-BR');
      currentDateTime.textContent = `${dateStr} - ${timeStr}`;
    }
  }

  renderMenuItems() {
    const menuItemsContainer = document.getElementById('menuItems');
    if (!menuItemsContainer) return;

    menuItemsContainer.innerHTML = '';

    this.menuItems.forEach(item => {
      const menuItemElement = this.createMenuItemElement(item);
      menuItemsContainer.appendChild(menuItemElement);
    });
  }

  createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
      <div class="menu-item-icon">${item.icone}</div>
      <div class="menu-item-content">
        <h3>${item.titulo}</h3>
        <p>${item.descricao}</p>
      </div>
    `;

    menuItem.addEventListener('click', item.handler);
    menuItem.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        item.handler();
      }
    });

    // Tornar focável
    menuItem.setAttribute('tabindex', '0');
    menuItem.setAttribute('role', 'button');

    return menuItem;
  }

  async loadDashboardStats() {
    try {
      // Carregar estatísticas para o dashboard
      const stats = await this.getDashboardStats();
      this.renderStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  async getDashboardStats() {
    const [produtos, estoque, vendas] = await Promise.all([
      produtoService.listar(),
      estoqueService.listar(),
      vendaService.getAll()
    ]);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vendasHoje = vendas.filter(venda => {
      const dataVenda = new Date(venda.dataHora || venda.dataVenda);
      dataVenda.setHours(0, 0, 0, 0);
      return dataVenda.getTime() === hoje.getTime();
    });

    const faturamentoHoje = vendasHoje.reduce((total, venda) => total + venda.total, 0);
    const itensComBaixoEstoque = estoque.filter(item => item.quantidade <= item.estoqueMinimo);

    return {
      totalProdutos: produtos.length,
      totalItensEstoque: estoque.length,
      vendasHoje: vendasHoje.length,
      faturamentoHoje: faturamentoHoje,
      alertasEstoque: itensComBaixoEstoque.length
    };
  }

  renderStats(stats) {
    const statsElements = {
      totalProdutos: document.getElementById('statTotalProdutos'),
      totalItensEstoque: document.getElementById('statTotalEstoque'),
      vendasHoje: document.getElementById('statVendasHoje'),
      faturamentoHoje: document.getElementById('statFaturamentoHoje'),
      alertasEstoque: document.getElementById('statAlertas')
    };

    if (statsElements.totalProdutos) {
      statsElements.totalProdutos.textContent = stats.totalProdutos;
    }
    if (statsElements.totalItensEstoque) {
      statsElements.totalItensEstoque.textContent = stats.totalItensEstoque;
    }
    if (statsElements.vendasHoje) {
      statsElements.vendasHoje.textContent = stats.vendasHoje;
    }
    if (statsElements.faturamentoHoje) {
      statsElements.faturamentoHoje.textContent = `R$ ${stats.faturamentoHoje.toFixed(2)}`;
    }
    if (statsElements.alertasEstoque) {
      statsElements.alertasEstoque.textContent = stats.alertasEstoque;
      // Aplicar estilo de alerta se houver itens com baixo estoque
      if (stats.alertasEstoque > 0) {
        statsElements.alertasEstoque.style.color = '#e74c3c';
        statsElements.alertasEstoque.style.fontWeight = 'bold';
      }
    }
  }

  navigateToScreen(screenId) {
    window.dispatchEvent(new CustomEvent('navigateToScreen', { 
      detail: { screen: screenId } 
    }));
  }

  async handleLogout() {
    const confirmed = confirm('Tem certeza que deseja sair do sistema?');
    if (confirmed) {
      await authService.logout();
      window.dispatchEvent(new CustomEvent('logout'));
    }
  }

  show() {
    const menuScreen = document.getElementById('menuScreen');
    if (menuScreen) {
      menuScreen.style.display = 'block';
      document.body.style.background = '#f8f9fa';
      document.body.style.display = 'block';
      document.body.style.alignItems = 'initial';
      document.body.style.justifyContent = 'initial';
      
      // Obter usuário atual
      this.currentUser = authService.getUsuarioLogado();
      
      // Renderizar conteúdo
      this.render();
      
      // Auto-refresh das estatísticas a cada 30 segundos
      this.startStatsRefresh();
    }
  }

  hide() {
    const menuScreen = document.getElementById('menuScreen');
    if (menuScreen) {
      menuScreen.style.display = 'none';
    }
    this.stopStatsRefresh();
  }

  startStatsRefresh() {
    this.stopStatsRefresh(); // Clear any existing interval
    this.statsInterval = setInterval(() => {
      this.loadDashboardStats();
    }, 30000); // 30 segundos
  }

  stopStatsRefresh() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  destroy() {
    this.stopStatsRefresh();
  }
}

// Criar instância global
window.menuComponent = new MenuComponent();