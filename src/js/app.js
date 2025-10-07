/**
 * Aplicação Principal da Padaria
 * Coordena todos os componentes e gerencia a navegação
 */
class PadariaApp {
  constructor() {
    this.currentScreen = 'login';
    this.components = {};
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      // Aguardar o DOM estar pronto
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initialize());
      } else {
        this.initialize();
      }
    } catch (error) {
      console.error('Erro ao inicializar aplicação:', error);
    }
  }

  async initialize() {
    try {
      // Inicializar serviços
      await this.initializeServices();
      
      // Registrar componentes
      this.registerComponents();
      
      // Configurar eventos globais
      this.setupGlobalEvents();
      
      // Verificar autenticação e determinar tela inicial
      this.determineInitialScreen();
      
      this.isInitialized = true;
      console.log('Aplicação Padaria inicializada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao inicializar aplicação:', error);
      this.showCriticalError('Falha ao inicializar o sistema. Recarregue a página.');
    }
  }

  async initializeServices() {
    // Verificar se os serviços estão disponíveis
    const services = ['authService', 'estoqueService', 'produtoService', 'vendaService', 'relatorioService'];
    
    for (const service of services) {
      if (!window[service]) {
        throw new Error(`Serviço ${service} não encontrado`);
      }
    }

    // Inicializar dados básicos se necessário
    await this.initializeDefaultData();
  }

  async initializeDefaultData() {
    try {
      // Verificar se existem dados básicos, senão criar dados demo
      const produtos = await produtoService.listar();
      const itensEstoque = await estoqueService.listar();
      
      if (produtos.length === 0 || itensEstoque.length === 0) {
        await this.createSampleData();
      }
    } catch (error) {
      console.error('Erro ao inicializar dados padrão:', error);
    }
  }

  async createSampleData() {
    try {
      // Criar alguns itens de estoque básicos
      const estoqueItems = [
        { nome: 'Farinha de Trigo', categoria: 'Farinha', quantidade: 50, unidadeMedida: 'kg', estoqueMinimo: 10, precoUnitario: 3.50, status: 'ativo' },
        { nome: 'Açúcar Cristal', categoria: 'Açúcar', quantidade: 25, unidadeMedida: 'kg', estoqueMinimo: 5, precoUnitario: 4.20, status: 'ativo' },
        { nome: 'Ovos', categoria: 'Ovos', quantidade: 100, unidadeMedida: 'unidades', estoqueMinimo: 20, precoUnitario: 0.50, status: 'ativo' },
        { nome: 'Leite Integral', categoria: 'Leite', quantidade: 20, unidadeMedida: 'litros', estoqueMinimo: 5, precoUnitario: 4.80, status: 'ativo' }
      ];

      for (const item of estoqueItems) {
        await estoqueService.criar(item);
      }

      // Criar alguns produtos básicos
      const produtos = [
        { nome: 'Pão Francês', categoria: 'Pães', descricao: 'Pão francês tradicional', custo: 0.30, margem: 100, preco: 0.60, status: 'ativo' },
        { nome: 'Pão de Açúcar', categoria: 'Pães', descricao: 'Pão doce tradicional', custo: 0.80, margem: 87.5, preco: 1.50, status: 'ativo' },
        { nome: 'Croissant', categoria: 'Pães', descricao: 'Croissant amanteigado', custo: 1.20, margem: 150, preco: 3.00, status: 'ativo' },
        { nome: 'Bolo de Chocolate', categoria: 'Bolos', descricao: 'Bolo de chocolate com cobertura', custo: 8.00, margem: 87.5, preco: 15.00, status: 'ativo' }
      ];

      for (const produto of produtos) {
        await produtoService.criar(produto);
      }

      console.log('Dados de exemplo criados com sucesso');
    } catch (error) {
      console.error('Erro ao criar dados de exemplo:', error);
    }
  }

  registerComponents() {
    // Registrar componentes disponíveis
    this.components = {
      login: window.loginComponent,
      menu: window.menuComponent,
      estoque: window.estoqueComponent,
      produtos: window.produtosComponent
      // Adicionar outros componentes conforme implementados
    };

    // Verificar se todos os componentes estão disponíveis
    for (const [name, component] of Object.entries(this.components)) {
      if (!component) {
        console.warn(`Componente ${name} não encontrado`);
      }
    }
  }

  setupGlobalEvents() {
    // Event listeners para navegação
    window.addEventListener('loginSuccess', (event) => {
      this.handleLoginSuccess(event.detail);
    });

    window.addEventListener('logout', () => {
      this.handleLogout();
    });

    window.addEventListener('navigateToScreen', (event) => {
      this.navigateToScreen(event.detail.screen);
    });

    // Event listeners para erros globais
    window.addEventListener('error', (event) => {
      console.error('Erro global:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Promise rejeitada:', event.reason);
    });

    // Event listener para beforeunload (avisar sobre dados não salvos)
    window.addEventListener('beforeunload', (event) => {
      // Implementar verificação de dados não salvos se necessário
    });

    // Atalhos de teclado globais
    document.addEventListener('keydown', (event) => {
      this.handleGlobalKeyboard(event);
    });
  }

  handleGlobalKeyboard(event) {
    // Atalhos globais
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'q':
          if (this.currentScreen !== 'login') {
            event.preventDefault();
            this.handleLogout();
          }
          break;
        case 'h':
          if (this.currentScreen !== 'login') {
            event.preventDefault();
            this.navigateToScreen('menu');
          }
          break;
      }
    }

    // ESC para voltar
    if (event.key === 'Escape') {
      if (this.currentScreen !== 'login' && this.currentScreen !== 'menu') {
        event.preventDefault();
        this.navigateToScreen('menu');
      }
    }
  }

  determineInitialScreen() {
    // Verificar se usuário já está logado
    if (authService.isLoggedIn() && authService.validateSession()) {
      this.navigateToScreen('menu');
    } else {
      this.navigateToScreen('login');
    }
  }

  handleLoginSuccess(detail) {
    console.log('Login realizado com sucesso:', detail.usuario.nome);
    this.navigateToScreen('menu');
  }

  handleLogout() {
    console.log('Logout realizado');
    authService.logout();
    this.navigateToScreen('login');
  }

  navigateToScreen(screenName) {
    if (!this.isInitialized) {
      console.warn('Aplicação ainda não foi inicializada');
      return;
    }

    // Validar navegação
    if (!this.canNavigateToScreen(screenName)) {
      console.warn(`Navegação para ${screenName} não permitida`);
      return;
    }

    const previousScreen = this.currentScreen;
    
    try {
      // Ocultar tela atual
      this.hideCurrentScreen();
      
      // Atualizar tela atual
      this.currentScreen = screenName;
      
      // Mostrar nova tela
      this.showScreen(screenName);
      
      console.log(`Navegação: ${previousScreen} -> ${screenName}`);
      
    } catch (error) {
      console.error('Erro na navegação:', error);
      // Reverter para tela anterior em caso de erro
      this.currentScreen = previousScreen;
      this.showScreen(previousScreen);
    }
  }

  canNavigateToScreen(screenName) {
    // Tela de login sempre acessível
    if (screenName === 'login') {
      return true;
    }

    // Outras telas requerem autenticação
    if (!authService.isLoggedIn() || !authService.validateSession()) {
      this.navigateToScreen('login');
      return false;
    }

    // Verificar se o componente existe
    if (!this.components[screenName]) {
      console.error(`Componente ${screenName} não encontrado`);
      return false;
    }

    return true;
  }

  hideCurrentScreen() {
    const component = this.components[this.currentScreen];
    if (component && typeof component.hide === 'function') {
      component.hide();
    }

    // Ocultar todas as telas como fallback
    const screens = ['loginScreen', 'menuScreen', 'estoqueScreen', 'produtosScreen', 'vendasScreen', 'relatoriosScreen'];
    screens.forEach(screenId => {
      const screen = document.getElementById(screenId);
      if (screen) {
        screen.style.display = 'none';
      }
    });
  }

  showScreen(screenName) {
    const component = this.components[screenName];
    if (component && typeof component.show === 'function') {
      component.show();
    } else {
      console.error(`Componente ${screenName} não encontrado ou não possui método show()`);
    }

    // Atualizar título da página
    this.updatePageTitle(screenName);
  }

  updatePageTitle(screenName) {
    const titles = {
      login: 'Login - Sistema Padaria',
      menu: 'Menu Principal - Sistema Padaria',
      estoque: 'Controle de Estoque - Sistema Padaria',
      produtos: 'Catálogo de Produtos - Sistema Padaria',
      vendas: 'Sistema de Vendas - Sistema Padaria',
      relatorios: 'Relatórios - Sistema Padaria'
    };

    document.title = titles[screenName] || 'Sistema Padaria';
  }

  showCriticalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: Arial, sans-serif;
      ">
        <div style="
          background: #dc3545;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          max-width: 400px;
        ">
          <h2 style="margin-top: 0;">Erro Crítico</h2>
          <p>${message}</p>
          <button onclick="location.reload()" style="
            background: white;
            color: #dc3545;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
          ">
            Recarregar Página
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }

  // Métodos utilitários públicos
  getCurrentScreen() {
    return this.currentScreen;
  }

  getCurrentUser() {
    return authService.getUsuarioLogado();
  }

  isUserLoggedIn() {
    return authService.isLoggedIn() && authService.validateSession();
  }

  // Método para adicionar novos componentes dinamicamente
  registerComponent(name, component) {
    this.components[name] = component;
    console.log(`Componente ${name} registrado`);
  }

  destroy() {
    // Cleanup da aplicação
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });

    // Remover event listeners globais
    window.removeEventListener('loginSuccess', this.handleLoginSuccess);
    window.removeEventListener('logout', this.handleLogout);
    window.removeEventListener('navigateToScreen', this.navigateToScreen);
  }
}

// Inicializar aplicação quando o script for carregado
window.padariaApp = new PadariaApp();

// Expor globalmente para debug
window.app = window.padariaApp;