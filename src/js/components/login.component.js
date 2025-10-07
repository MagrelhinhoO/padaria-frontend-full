/**
 * Componente de Login
 * Gerencia a interface e lógica do login
 */
class LoginComponent {
  constructor() {
    this.form = null;
    this.emailInput = null;
    this.passwordInput = null;
    this.loginBtn = null;
    this.errorMessage = null;
    this.init();
  }

  init() {
    this.bindElements();
    this.bindEvents();
    this.checkAutoLogin();
  }

  bindElements() {
    this.form = document.getElementById('loginForm');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.loginBtn = document.getElementById('loginBtn');
    this.errorMessage = document.getElementById('errorMessage');
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Permitir Enter nos campos
    [this.emailInput, this.passwordInput].forEach(input => {
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.handleSubmit(e);
          }
        });
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.form.checkValidity()) {
      return;
    }

    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value.trim();

    if (!email || !password) {
      this.showError('Por favor, preencha todos os campos');
      return;
    }

    this.setLoading(true);

    try {
      const resultado = await authService.login(email, password);
      
      if (resultado.success) {
        this.hideError();
        this.clearForm();
        // Navegar para o menu será feito pelo app.js
        window.dispatchEvent(new CustomEvent('loginSuccess', { 
          detail: { usuario: resultado.usuario } 
        }));
      } else {
        this.showError(resultado.message);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      this.showError('Erro interno. Tente novamente.');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    if (this.loginBtn) {
      this.loginBtn.disabled = loading;
      this.loginBtn.textContent = loading ? 'Carregando...' : 'Entrar no Sistema';
    }
  }

  showError(message) {
    if (this.errorMessage) {
      this.errorMessage.textContent = message;
      this.errorMessage.style.display = 'block';
      
      // Auto-hide após 5 segundos
      setTimeout(() => this.hideError(), 5000);
    }
  }

  hideError() {
    if (this.errorMessage) {
      this.errorMessage.style.display = 'none';
    }
  }

  clearForm() {
    if (this.form) {
      this.form.reset();
    }
  }

  checkAutoLogin() {
    // Verificar se já está logado
    if (authService.isLoggedIn() && authService.validateSession()) {
      window.dispatchEvent(new CustomEvent('loginSuccess', { 
        detail: { usuario: authService.getUsuarioLogado() } 
      }));
    }
  }

  show() {
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) {
      loginScreen.style.display = 'flex';
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      document.body.style.display = 'flex';
      document.body.style.alignItems = 'center';
      document.body.style.justifyContent = 'center';
      
      // Focar no primeiro campo
      if (this.emailInput) {
        setTimeout(() => this.emailInput.focus(), 100);
      }
    }
  }

  hide() {
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) {
      loginScreen.style.display = 'none';
    }
  }

  destroy() {
    // Limpar event listeners se necessário
    this.hideError();
    this.clearForm();
  }
}

// Criar instância global
window.loginComponent = new LoginComponent();