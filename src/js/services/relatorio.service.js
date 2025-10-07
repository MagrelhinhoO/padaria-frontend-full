/**
 * Serviço de Relatórios
 * Gerencia geração de relatórios e estatísticas
 */
class RelatorioService {
  constructor() {
    // Dependências de outros serviços serão injetadas quando necessário
  }

  /**
   * Gera relatório de vendas
   * @param {Date} dataInicio 
   * @param {Date} dataFim 
   * @returns {Object}
   */
  gerarRelatorioVendas(dataInicio = null, dataFim = null) {
    const vendas = vendaService.getAll();
    let vendasFiltradas = vendas;

    // Aplicar filtro de período se fornecido
    if (dataInicio || dataFim) {
      vendasFiltradas = vendas.filter(venda => {
        const dataVenda = new Date(venda.dataHora);
        if (dataInicio && dataVenda < dataInicio) return false;
        if (dataFim && dataVenda > dataFim) return false;
        return true;
      });
    }

    const vendasConcluidas = vendasFiltradas.filter(v => v.status === 'Concluída');
    const totalVendas = vendasConcluidas.length;
    const faturamentoTotal = vendasConcluidas.reduce((sum, v) => sum + v.total, 0);
    const ticketMedio = totalVendas > 0 ? faturamentoTotal / totalVendas : 0;

    // Vendas por forma de pagamento
    const porFormaPagamento = {};
    vendasConcluidas.forEach(venda => {
      if (!porFormaPagamento[venda.formaPagamento]) {
        porFormaPagamento[venda.formaPagamento] = { quantidade: 0, valor: 0 };
      }
      porFormaPagamento[venda.formaPagamento].quantidade++;
      porFormaPagamento[venda.formaPagamento].valor += venda.total;
    });

  return {
      periodo: {
        inicio: dataInicio ? dataInicio.toISOString().slice(0, 10) : 'Início',
        fim: dataFim ? dataFim.toISOString().slice(0, 10) : 'Hoje'
      },
      resumo: {
        totalVendas,
        faturamentoTotal,
        ticketMedio,
        vendasCanceladas: vendasFiltradas.filter(v => v.status === 'Cancelada').length
      },
      porFormaPagamento,
      detalhes: vendasFiltradas.map(venda => ({
        data: new Date(venda.dataHora).toLocaleString('pt-BR'),
        cliente: venda.nomeCliente,
        total: venda.total,
        status: venda.status,
        formaPagamento: venda.formaPagamento
      }))
    };
  }

  /**
   * Gera relatório de estoque
   * @returns {Object}
   */
  gerarRelatorioEstoque() {
    const itens = estoqueService.getAll();
    const estatisticas = estoqueService.getEstatisticas();

    return {
      resumo: {
        totalItens: estatisticas.totalItens,
        valorTotal: estatisticas.valorTotal,
        itensBaixos: estatisticas.itensBaixos,
        itensCriticos: estatisticas.itensCriticos
      },
      porCategoria: estatisticas.porCategoria,
      itensEstoqueBaixo: estoqueService.getItensEstoqueBaixo().map(item => ({
        nome: item.nome,
        categoria: item.categoria,
        quantidade: item.quantidade,
        estoqueMin: item.estoqueMin,
        status: item.getStatusEstoque()
      })),
      detalhes: itens.map(item => ({
        nome: item.nome,
        categoria: item.categoria,
        quantidade: item.quantidade,
        valorUnitario: item.preco,
        valorTotal: item.getValorTotal(),
        status: item.getStatusEstoque()
      }))
    };
  }

  /**
   * Gera relatório de produtos
   * @returns {Object}
   */
  gerarRelatorioProdutos() {
    const produtos = produtoService.getAll();
    const estatisticas = produtoService.getEstatisticas();

    return {
      resumo: {
        totalProdutos: estatisticas.totalProdutos,
        produtosAtivos: estatisticas.produtosAtivos,
        precoMedio: estatisticas.precoMedio,
        emPromocao: estatisticas.emPromocao
      },
      porCategoria: this.agruparProdutosPorCategoria(produtos),
      detalhes: produtos.map(produto => ({
        nome: produto.nome,
        categoria: produto.categoria,
        preco: produto.preco,
        precoPromocional: produto.precoPromocional,
        ativo: produto.ativo,
        disponivel: produto.disponivel
      }))
    };
  }

  /**
   * Gera relatório financeiro
   * @param {Date} dataInicio 
   * @param {Date} dataFim 
   * @returns {Object}
   */
  gerarRelatorioFinanceiro(dataInicio = null, dataFim = null) {
    const relatorioVendas = this.gerarRelatorioVendas(dataInicio, dataFim);
    const relatorioEstoque = this.gerarRelatorioEstoque();

    return {
      periodo: relatorioVendas.periodo,
      receitas: {
        vendas: relatorioVendas.resumo.faturamentoTotal,
        total: relatorioVendas.resumo.faturamentoTotal
      },
      estoque: {
        valorTotal: relatorioEstoque.resumo.valorTotal,
        itensEmRisco: relatorioEstoque.resumo.itensBaixos
      },
      formasPagamento: relatorioVendas.porFormaPagamento,
      indicadores: {
        ticketMedio: relatorioVendas.resumo.ticketMedio,
        totalVendas: relatorioVendas.resumo.totalVendas,
        conversao: this.calcularTaxaConversao(relatorioVendas.resumo)
      }
    };
  }

  /**
   * Agrupa produtos por categoria
   * @param {ProdutoModel[]} produtos 
   * @returns {Object}
   */
  agruparProdutosPorCategoria(produtos) {
    const grupos = {};
    produtos.forEach(produto => {
      if (!grupos[produto.categoria]) {
        grupos[produto.categoria] = { quantidade: 0, precoMedio: 0, produtos: [] };
      }
      grupos[produto.categoria].quantidade++;
      grupos[produto.categoria].produtos.push(produto);
    });

    // Calcular preço médio por categoria
    Object.keys(grupos).forEach(categoria => {
      const produtosDaCategoria = grupos[categoria].produtos;
      grupos[categoria].precoMedio = produtosDaCategoria.reduce((sum, p) => sum + p.preco, 0) / produtosDaCategoria.length;
    });

    return grupos;
  }

  /**
   * Calcula taxa de conversão (simulada)
   * @param {Object} resumoVendas 
   * @returns {number}
   */
  calcularTaxaConversao(resumoVendas) {
    // Em um sistema real, isso seria baseado em visitantes vs vendas
    return resumoVendas.totalVendas > 0 ? Math.min(95, 70 + (resumoVendas.totalVendas * 2)) : 0;
  }

  /**
   * Formata relatório para exibição HTML
   * @param {string} tipo 
   * @param {Object} dados 
   * @returns {string}
   */
  formatarRelatorioHTML(tipo, dados) {
    let html = '';

    switch (tipo) {
      case 'vendas':
        html = this.formatarRelatorioVendasHTML(dados);
        break;
      case 'estoque':
        html = this.formatarRelatorioEstoqueHTML(dados);
        break;
      case 'produtos':
        html = this.formatarRelatorioProdutosHTML(dados);
        break;
      case 'financeiro':
        html = this.formatarRelatorioFinanceiroHTML(dados);
        break;
      default:
        html = '<p>Tipo de relatório não reconhecido</p>';
    }

    return html;
  }

  formatarRelatorioVendasHTML(dados) {
    return `
      <div class="relatorio-content">
        <h4>📊 Relatório de Vendas</h4>
        <p><strong>Período:</strong> ${dados.periodo.inicio} até ${dados.periodo.fim}</p>
        <p><strong>Total de Vendas:</strong> ${dados.resumo.totalVendas}</p>
        <p><strong>Faturamento Total:</strong> ${this.formatarMoeda(dados.resumo.faturamentoTotal)}</p>
        <p><strong>Ticket Médio:</strong> ${this.formatarMoeda(dados.resumo.ticketMedio)}</p>
        <p><strong>Vendas Canceladas:</strong> ${dados.resumo.vendasCanceladas}</p>
      </div>
    `;
  }

  formatarRelatorioEstoqueHTML(dados) {
    return `
      <div class="relatorio-content">
        <h4>📦 Relatório de Estoque</h4>
        <p><strong>Total de Itens:</strong> ${dados.resumo.totalItens}</p>
        <p><strong>Valor Total em Estoque:</strong> ${this.formatarMoeda(dados.resumo.valorTotal)}</p>
        <p><strong>Itens com Estoque Baixo:</strong> ${dados.resumo.itensBaixos}</p>
        <p><strong>Itens Críticos:</strong> ${dados.resumo.itensCriticos}</p>
      </div>
    `;
  }

  formatarRelatorioProdutosHTML(dados) {
    return `
      <div class="relatorio-content">
        <h4>🥖 Relatório de Produtos</h4>
        <p><strong>Total de Produtos:</strong> ${dados.resumo.totalProdutos}</p>
        <p><strong>Produtos Ativos:</strong> ${dados.resumo.produtosAtivos}</p>
        <p><strong>Preço Médio:</strong> ${this.formatarMoeda(dados.resumo.precoMedio)}</p>
        <p><strong>Em Promoção:</strong> ${dados.resumo.emPromocao}</p>
      </div>
    `;
  }

  formatarRelatorioFinanceiroHTML(dados) {
    const formasPagamento = Object.entries(dados.formasPagamento)
      .map(([forma, info]) => `<li>${forma}: ${info.quantidade} vendas (${this.formatarMoeda(info.valor)})</li>`)
      .join('');

    return `
      <div class="relatorio-content">
        <h4>💰 Relatório Financeiro</h4>
        <p><strong>Período:</strong> ${dados.periodo.inicio} até ${dados.periodo.fim}</p>
        <p><strong>Faturamento Total:</strong> ${this.formatarMoeda(dados.receitas.total)}</p>
        <p><strong>Valor em Estoque:</strong> ${this.formatarMoeda(dados.estoque.valorTotal)}</p>
        <p><strong>Ticket Médio:</strong> ${this.formatarMoeda(dados.indicadores.ticketMedio)}</p>
        <h5>Formas de Pagamento:</h5>
        <ul>${formasPagamento}</ul>
      </div>
    `;
  }

  formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  }
}

window.relatorioService = new RelatorioService();