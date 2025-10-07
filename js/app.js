// Configuração da API
const API_BASE_URL = 'http://localhost:8080';

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Configura data de hoje para relatórios
    const today = new Date().toISOString().split('T')[0];
    const relatorioDataInput = document.getElementById('relatorio-data');
    if (relatorioDataInput) {
        relatorioDataInput.value = today;
    }

    // Carrega dados iniciais
    loadDashboard();
    showSection('dashboard');
});

// Utilidades
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const alertId = 'alert-' + Date.now();
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHTML;
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.remove();
        }
    }, 5000);
}

function formatCurrency(value) {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Navegação entre seções
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Load data for the section
        switch(sectionName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'produtos':
                loadProdutos();
                break;
            case 'categorias':
                loadCategorias();
                break;
            case 'vendas':
                loadVendas();
                break;
            case 'despesas':
                loadDespesas();
                break;
        }
    }
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.erro || `Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showAlert(error.message, 'danger');
        throw error;
    } finally {
        hideLoading();
    }
}

// Dashboard Functions
async function loadDashboard() {
    try {
        const [produtos, vendas, categorias] = await Promise.all([
            apiRequest('/produtos'),
            apiRequest('/vendas'),
            apiRequest('/categorias')
        ]);
        
        document.getElementById('total-produtos').textContent = produtos.length;
        document.getElementById('total-vendas').textContent = vendas.length;
        document.getElementById('total-categorias').textContent = categorias.length;
        
        // Load today's profit
        const today = new Date().toISOString().split('T')[0];
        try {
            const relatorio = await apiRequest(`/relatorios/lucros-dia?data=${today}`);
            document.getElementById('lucro-hoje').textContent = formatCurrency(relatorio.lucro);
        } catch (error) {
            document.getElementById('lucro-hoje').textContent = 'R$ 0,00';
        }
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

// Products Functions
async function loadProdutos() {
    try {
        const produtos = await apiRequest('/produtos');
        const tbody = document.getElementById('produtos-table-body');
        
        tbody.innerHTML = produtos.map(produto => `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${formatCurrency(produto.preco)}</td>
                <td>${produto.categoria ? produto.categoria.nome : 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editProduto(${produto.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduto(${produto.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function showProdutoModal(produto = null) {
    // Load categories for select
    try {
        const categorias = await apiRequest('/categorias');
        const select = document.getElementById('produto-categoria');
        select.innerHTML = '<option value="">Selecione uma categoria</option>' +
            categorias.map(cat => `<option value="${cat.id}">${cat.nome}</option>`).join('');
        
        if (produto) {
            document.getElementById('produto-id').value = produto.id;
            document.getElementById('produto-nome').value = produto.nome;
            document.getElementById('produto-preco').value = produto.preco;
            document.getElementById('produto-categoria').value = produto.categoria ? produto.categoria.id : '';
        } else {
            document.getElementById('produto-form').reset();
            document.getElementById('produto-id').value = '';
        }
        
        const modal = new bootstrap.Modal(document.getElementById('produtoModal'));
        modal.show();
    } catch (error) {
        console.error('Erro ao abrir modal de produto:', error);
    }
}

async function editProduto(id) {
    try {
        const produto = await apiRequest(`/produtos/${id}`);
        showProdutoModal(produto);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    }
}

async function salvarProduto() {
    const id = document.getElementById('produto-id').value;
    const nome = document.getElementById('produto-nome').value;
    const preco = parseFloat(document.getElementById('produto-preco').value);
    const categoriaId = document.getElementById('produto-categoria').value;
    
    if (!nome || !preco || !categoriaId) {
        showAlert('Preencha todos os campos obrigatórios', 'warning');
        return;
    }
    
    const produto = {
        nome,
        preco,
        categoria: { id: parseInt(categoriaId) }
    };
    
    try {
        if (id) {
            produto.id = parseInt(id);
            await apiRequest(`/produtos/${id}`, {
                method: 'PUT',
                body: JSON.stringify(produto)
            });
            showAlert('Produto atualizado com sucesso!');
        } else {
            await apiRequest('/produtos', {
                method: 'POST',
                body: JSON.stringify(produto)
            });
            showAlert('Produto criado com sucesso!');
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('produtoModal'));
        modal.hide();
        loadProdutos();
        
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
    }
}

async function deleteProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            await apiRequest(`/produtos/${id}`, { method: 'DELETE' });
            showAlert('Produto excluído com sucesso!');
            loadProdutos();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    }
}

// Categories Functions
async function loadCategorias() {
    try {
        const categorias = await apiRequest('/categorias');
        const tbody = document.getElementById('categorias-table-body');
        
        tbody.innerHTML = categorias.map(categoria => `
            <tr>
                <td>${categoria.id}</td>
                <td>${categoria.nome}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editCategoria(${categoria.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategoria(${categoria.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

function showCategoriaModal(categoria = null) {
    if (categoria) {
        document.getElementById('categoria-id').value = categoria.id;
        document.getElementById('categoria-nome').value = categoria.nome;
    } else {
        document.getElementById('categoria-form').reset();
        document.getElementById('categoria-id').value = '';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('categoriaModal'));
    modal.show();
}

async function editCategoria(id) {
    try {
        const categoria = await apiRequest(`/categorias/${id}`);
        showCategoriaModal(categoria);
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
    }
}

async function salvarCategoria() {
    const id = document.getElementById('categoria-id').value;
    const nome = document.getElementById('categoria-nome').value;
    
    if (!nome) {
        showAlert('Preencha o nome da categoria', 'warning');
        return;
    }
    
    const categoria = { nome };
    
    try {
        if (id) {
            categoria.id = parseInt(id);
            await apiRequest(`/categorias/${id}`, {
                method: 'PUT',
                body: JSON.stringify(categoria)
            });
            showAlert('Categoria atualizada com sucesso!');
        } else {
            await apiRequest('/categorias', {
                method: 'POST',
                body: JSON.stringify(categoria)
            });
            showAlert('Categoria criada com sucesso!');
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('categoriaModal'));
        modal.hide();
        loadCategorias();
        
    } catch (error) {
        console.error('Erro ao salvar categoria:', error);
    }
}

async function deleteCategoria(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        try {
            await apiRequest(`/categorias/${id}`, { method: 'DELETE' });
            showAlert('Categoria excluída com sucesso!');
            loadCategorias();
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
        }
    }
}

// Sales Functions
async function loadVendas() {
    try {
        const vendas = await apiRequest('/vendas');
        const tbody = document.getElementById('vendas-table-body');
        
        tbody.innerHTML = vendas.map(venda => `
            <tr>
                <td>${venda.id}</td>
                <td>${formatDate(venda.data)}</td>
                <td>${formatCurrency(venda.valorTotal)}</td>
                <td>${venda.formaPagamento ? venda.formaPagamento.descricao : 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editVenda(${venda.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVenda(${venda.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar vendas:', error);
    }
}

async function showVendaModal(venda = null) {
    // Load payment methods for select
    try {
        const pagamentos = await apiRequest('/pagamentos');
        const select = document.getElementById('venda-pagamento');
        select.innerHTML = '<option value="">Selecione uma forma de pagamento</option>' +
            pagamentos.map(pag => `<option value="${pag.id}">${pag.descricao}</option>`).join('');
        
        if (venda) {
            document.getElementById('venda-id').value = venda.id;
            document.getElementById('venda-data').value = venda.data;
            document.getElementById('venda-valor').value = venda.valorTotal;
            document.getElementById('venda-pagamento').value = venda.formaPagamento ? venda.formaPagamento.id : '';
        } else {
            document.getElementById('venda-form').reset();
            document.getElementById('venda-id').value = '';
            // Set today's date as default
            document.getElementById('venda-data').value = new Date().toISOString().split('T')[0];
        }
        
        const modal = new bootstrap.Modal(document.getElementById('vendaModal'));
        modal.show();
    } catch (error) {
        console.error('Erro ao abrir modal de venda:', error);
    }
}

async function editVenda(id) {
    try {
        const venda = await apiRequest(`/vendas/${id}`);
        showVendaModal(venda);
    } catch (error) {
        console.error('Erro ao buscar venda:', error);
    }
}

async function salvarVenda() {
    const id = document.getElementById('venda-id').value;
    const data = document.getElementById('venda-data').value;
    const valorTotal = parseFloat(document.getElementById('venda-valor').value);
    const pagamentoId = document.getElementById('venda-pagamento').value;
    
    if (!data || !valorTotal || !pagamentoId) {
        showAlert('Preencha todos os campos obrigatórios', 'warning');
        return;
    }
    
    const venda = {
        data,
        valorTotal,
        formaPagamento: { id: parseInt(pagamentoId) }
    };
    
    try {
        if (id) {
            venda.id = parseInt(id);
            await apiRequest(`/vendas/${id}`, {
                method: 'PUT',
                body: JSON.stringify(venda)
            });
            showAlert('Venda atualizada com sucesso!');
        } else {
            await apiRequest('/vendas', {
                method: 'POST',
                body: JSON.stringify(venda)
            });
            showAlert('Venda criada com sucesso!');
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('vendaModal'));
        modal.hide();
        loadVendas();
        loadDashboard(); // Update dashboard
        
    } catch (error) {
        console.error('Erro ao salvar venda:', error);
    }
}

async function deleteVenda(id) {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
        try {
            await apiRequest(`/vendas/${id}`, { method: 'DELETE' });
            showAlert('Venda excluída com sucesso!');
            loadVendas();
            loadDashboard(); // Update dashboard
        } catch (error) {
            console.error('Erro ao excluir venda:', error);
        }
    }
}

// Expenses Functions
async function loadDespesas() {
    try {
        const despesas = await apiRequest('/despesas');
        const tbody = document.getElementById('despesas-table-body');
        
        tbody.innerHTML = despesas.map(despesa => `
            <tr>
                <td>${despesa.id}</td>
                <td>${despesa.descricao}</td>
                <td>${formatCurrency(despesa.valor)}</td>
                <td>${formatDate(despesa.data)}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editDespesa(${despesa.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDespesa(${despesa.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar despesas:', error);
    }
}

function showDespesaModal(despesa = null) {
    if (despesa) {
        document.getElementById('despesa-id').value = despesa.id;
        document.getElementById('despesa-descricao').value = despesa.descricao;
        document.getElementById('despesa-valor').value = despesa.valor;
        document.getElementById('despesa-data').value = despesa.data;
    } else {
        document.getElementById('despesa-form').reset();
        document.getElementById('despesa-id').value = '';
        // Set today's date as default
        document.getElementById('despesa-data').value = new Date().toISOString().split('T')[0];
    }
    
    const modal = new bootstrap.Modal(document.getElementById('despesaModal'));
    modal.show();
}

async function editDespesa(id) {
    try {
        const despesa = await apiRequest(`/despesas/${id}`);
        showDespesaModal(despesa);
    } catch (error) {
        console.error('Erro ao buscar despesa:', error);
    }
}

async function salvarDespesa() {
    const id = document.getElementById('despesa-id').value;
    const descricao = document.getElementById('despesa-descricao').value;
    const valor = parseFloat(document.getElementById('despesa-valor').value);
    const data = document.getElementById('despesa-data').value;
    
    if (!descricao || !valor || !data) {
        showAlert('Preencha todos os campos obrigatórios', 'warning');
        return;
    }
    
    const despesa = { descricao, valor, data };
    
    try {
        if (id) {
            despesa.id = parseInt(id);
            await apiRequest(`/despesas/${id}`, {
                method: 'PUT',
                body: JSON.stringify(despesa)
            });
            showAlert('Despesa atualizada com sucesso!');
        } else {
            await apiRequest('/despesas', {
                method: 'POST',
                body: JSON.stringify(despesa)
            });
            showAlert('Despesa criada com sucesso!');
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('despesaModal'));
        modal.hide();
        loadDespesas();
        loadDashboard(); // Update dashboard
        
    } catch (error) {
        console.error('Erro ao salvar despesa:', error);
    }
}

async function deleteDespesa(id) {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
        try {
            await apiRequest(`/despesas/${id}`, { method: 'DELETE' });
            showAlert('Despesa excluída com sucesso!');
            loadDespesas();
            loadDashboard(); // Update dashboard
        } catch (error) {
            console.error('Erro ao excluir despesa:', error);
        }
    }
}

// Reports Functions
async function gerarRelatorioDia() {
    const data = document.getElementById('relatorio-data').value;
    if (!data) {
        showAlert('Selecione uma data', 'warning');
        return;
    }
    
    try {
        const relatorio = await apiRequest(`/relatorios/lucros-dia?data=${data}`);
        const resultDiv = document.getElementById('relatorio-dia-result');
        
        resultDiv.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h5>Entradas</h5>
                            <h4>${formatCurrency(relatorio.entradas)}</h4>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-danger text-white">
                        <div class="card-body text-center">
                            <h5>Saídas</h5>
                            <h4>${formatCurrency(relatorio.saidas)}</h4>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                            <h5>Lucro</h5>
                            <h4>${formatCurrency(relatorio.lucro)}</h4>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Erro ao gerar relatório do dia:', error);
    }
}

async function gerarRelatorioMes() {
    const ano = parseInt(document.getElementById('relatorio-ano').value);
    const mes = parseInt(document.getElementById('relatorio-mes').value);
    
    if (!ano || !mes) {
        showAlert('Selecione ano e mês', 'warning');
        return;
    }
    
    try {
        const relatorio = await apiRequest(`/relatorios/lucros-mes?ano=${ano}&mes=${mes}`);
        const resultDiv = document.getElementById('relatorio-mes-result');
        
        resultDiv.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h5>Entradas</h5>
                            <h4>${formatCurrency(relatorio.entradas)}</h4>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-danger text-white">
                        <div class="card-body text-center">
                            <h5>Saídas</h5>
                            <h4>${formatCurrency(relatorio.saidas)}</h4>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                            <h5>Lucro</h5>
                            <h4>${formatCurrency(relatorio.lucro)}</h4>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Erro ao gerar relatório do mês:', error);
    }
}