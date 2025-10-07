/**
 * Serviço de Autenticação
 * Gerencia login, logout e sessão do usuário
 */
class AuthService {
  constructor() {
    this.storageKey = 'padaria_auth';
    this.usuarioLogado = null;
    this.loadUsuarioFromStorage();
  }

  /**
   * Credenciais padrão para teste
   */
  static get CREDENCIAIS_TESTE() {
    return {
      email: 'admin@padaria.com',
      senha: 'admin123'
    };
  }

  /**
   * Carrega usuário do localStorage
   */
  loadUsuarioFromStorage() {
    try {
      const dadosArmazenados = localStorage.getItem(this.storageKey);
      if (dadosArmazenados) {
        const dados = JSON.parse(dadosArmazenados);
        this.usuarioLogado = UsuarioModel.fromJSON(dados.usuario);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do storage:', error);
      this.logout();
    }
  }

  /**
   * Salva usuário no localStorage
   */
  saveUsuarioToStorage() {
    try {
      const dados = {
        usuario: this.usuarioLogado?.toJSON(),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(dados));
    } catch (error) {
      console.error('Erro ao salvar usuário no storage:', error);
    }
  }

  /**
   * Realiza login do usuário
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise<{success: boolean, message: string, usuario?: UsuarioModel}>}
   */
  async login(email, senha) {
    try {
      // Validar entrada
      if (!email || !senha) {
        return {
          success: false,
          message: 'Email e senha são obrigatórios'
        };
      }

      // Simular delay de rede
      await this.delay(1000);

      // Verificar credenciais (em produção, seria uma chamada para API)
      if (email === AuthService.CREDENCIAIS_TESTE.email && 
          senha === AuthService.CREDENCIAIS_TESTE.senha) {
        
        // Criar usuário logado
        this.usuarioLogado = new UsuarioModel({
          id: 1,
          nome: 'Administrador',
          email: email,
          tipo: 'admin',
          ativo: true
        });

        this.usuarioLogado.updateLastLogin();
        this.saveUsuarioToStorage();

        return {
          success: true,
          message: 'Login realizado com sucesso',
          usuario: this.usuarioLogado
        };
      } else {
        return {
          success: false,
          message: 'Email ou senha inválidos'
        };
      }

    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  /**
   * Realiza logout do usuário
   */
  logout() {
    this.usuarioLogado = null;
    localStorage.removeItem(this.storageKey);
    
    // Limpar outros dados de sessão se necessário
    this.clearSessionData();
  }

  /**
   * Limpa dados de sessão
   */
  clearSessionData() {
    // Limpar caches, dados temporários, etc.
    console.log('Dados de sessão limpos');
  }

  /**
   * Verifica se o usuário está logado
   * @returns {boolean}
   */
  isLoggedIn() {
    return this.usuarioLogado !== null && this.usuarioLogado.ativo;
  }

  /**
   * Retorna o usuário logado
   * @returns {UsuarioModel|null}
   */
  getUsuarioLogado() {
    return this.usuarioLogado;
  }

  /**
   * Verifica se o usuário tem permissão de administrador
   * @returns {boolean}
   */
  isAdmin() {
    return this.usuarioLogado?.isAdmin() || false;
  }

  /**
   * Valida a sessão atual
   * @returns {boolean}
   */
  validateSession() {
    if (!this.isLoggedIn()) {
      return false;
    }

    try {
      const dadosArmazenados = localStorage.getItem(this.storageKey);
      if (!dadosArmazenados) {
        this.logout();
        return false;
      }

      const dados = JSON.parse(dadosArmazenados);
      const timestamp = new Date(dados.timestamp);
      const now = new Date();
      const diffHours = (now - timestamp) / (1000 * 60 * 60);

      // Sessão expira em 24 horas
      if (diffHours > 24) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro na validação da sessão:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Atualiza dados do usuário logado
   * @param {Object} novosDados 
   * @returns {boolean}
   */
  updateUsuario(novosDados) {
    if (!this.isLoggedIn()) {
      return false;
    }

    try {
      Object.assign(this.usuarioLogado, novosDados);
      this.usuarioLogado.dataModificacao = new Date().toISOString();
      this.saveUsuarioToStorage();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return false;
    }
  }

  /**
   * Altera senha do usuário (simulação)
   * @param {string} senhaAtual 
   * @param {string} novaSenha 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async alterarSenha(senhaAtual, novaSenha) {
    if (!this.isLoggedIn()) {
      return {
        success: false,
        message: 'Usuário não está logado'
      };
    }

    try {
      // Simular delay de rede
      await this.delay(500);

      // Validar senha atual (em produção, verificar hash)
      if (senhaAtual !== AuthService.CREDENCIAIS_TESTE.senha) {
        return {
          success: false,
          message: 'Senha atual incorreta'
        };
      }

      // Validar nova senha
      if (!novaSenha || novaSenha.length < 6) {
        return {
          success: false,
          message: 'Nova senha deve ter pelo menos 6 caracteres'
        };
      }

      // Em produção, aqui seria feita a atualização no banco de dados
      console.log('Senha alterada com sucesso (simulação)');

      return {
        success: true,
        message: 'Senha alterada com sucesso'
      };

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  /**
   * Registra atividade do usuário
   * @param {string} acao 
   * @param {Object} detalhes 
   */
  logActivity(acao, detalhes = {}) {
    if (!this.isLoggedIn()) {
      return;
    }

    const logEntry = {
      usuario: this.usuarioLogado.id,
      acao,
      detalhes,
      timestamp: new Date().toISOString()
    };

    // Em produção, seria enviado para o servidor
    console.log('Atividade registrada:', logEntry);
  }

  /**
   * Função utilitária para simular delay
   * @param {number} ms 
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Inicializa eventos do serviço
   */
  init() {
    // Verificar sessão periodicamente
    setInterval(() => {
      this.validateSession();
    }, 60000); // Verificar a cada minuto

    // Listener para quando a página é fechada
    window.addEventListener('beforeunload', () => {
      this.logActivity('logout', { motivo: 'Página fechada' });
    });

    console.log('AuthService inicializado');
  }
}

// Criar instância global do serviço
window.authService = new AuthService();