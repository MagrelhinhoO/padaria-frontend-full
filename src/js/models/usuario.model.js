/**
 * Modelo de dados para Usuário
 * Representa a estrutura de dados de um usuário do sistema
 */
class UsuarioModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || '';
    this.email = data.email || '';
    this.senha = data.senha || '';
    this.tipo = data.tipo || 'funcionario'; // admin, funcionario
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    this.dataCriacao = data.dataCriacao || new Date().toISOString();
    this.ultimoLogin = data.ultimoLogin || null;
  }

  /**
   * Valida os dados do usuário
   * @returns {Object} - {valid: boolean, errors: string[]}
   */
  validate() {
    const errors = [];

    if (!this.nome || this.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Email deve ter um formato válido');
    }

    if (!this.senha || this.senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!['admin', 'funcionario'].includes(this.tipo)) {
      errors.push('Tipo de usuário deve ser admin ou funcionario');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida formato do email
   * @param {string} email 
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Converte o modelo para objeto simples (para salvar no localStorage ou enviar para API)
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      senha: this.senha, // Em produção, não incluir senha no JSON de retorno
      tipo: this.tipo,
      ativo: this.ativo,
      dataCriacao: this.dataCriacao,
      ultimoLogin: this.ultimoLogin
    };
  }

  /**
   * Cria instância do modelo a partir de dados brutos
   * @param {Object} data 
   * @returns {UsuarioModel}
   */
  static fromJSON(data) {
    return new UsuarioModel(data);
  }

  /**
   * Verifica se o usuário é administrador
   * @returns {boolean}
   */
  isAdmin() {
    return this.tipo === 'admin';
  }

  /**
   * Atualiza último login
   */
  updateLastLogin() {
    this.ultimoLogin = new Date().toISOString();
  }

  /**
   * Gera hash da senha (simulação - em produção usar bcrypt)
   * @param {string} senha 
   * @returns {string}
   */
  static hashPassword(senha) {
    // Simulação de hash - em produção usar bcrypt ou similar
    return btoa(senha + 'salt_secreto');
  }

  /**
   * Verifica senha (simulação - em produção usar bcrypt)
   * @param {string} senhaPlana 
   * @param {string} senhaHash 
   * @returns {boolean}
   */
  static verifyPassword(senhaPlana, senhaHash) {
    return this.hashPassword(senhaPlana) === senhaHash;
  }
}

// Exportar para uso global
window.UsuarioModel = UsuarioModel;