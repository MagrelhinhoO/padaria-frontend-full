// Script para popular dados iniciais no backend
const API_BASE_URL = 'http://localhost:8080';

async function apiRequest(endpoint, options = {}) {
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
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function popularDadosIniciais() {
    console.log('Populando dados iniciais...');
    
    try {
        // Criar formas de pagamento
        const formasPagamento = [
            { descricao: 'Dinheiro' },
            { descricao: 'Cartão de Débito' },
            { descricao: 'Cartão de Crédito' },
            { descricao: 'PIX' }
        ];
        
        for (const forma of formasPagamento) {
            try {
                await apiRequest('/pagamentos', {
                    method: 'POST',
                    body: JSON.stringify(forma)
                });
                console.log(`Forma de pagamento criada: ${forma.descricao}`);
            } catch (error) {
                console.log(`Forma de pagamento já existe: ${forma.descricao}`);
            }
        }
        
        // Criar categorias
        const categorias = [
            { nome: 'Pães' },
            { nome: 'Doces' },
            { nome: 'Salgados' },
            { nome: 'Bebidas' },
            { nome: 'Bolos' }
        ];
        
        const categoriasCreated = [];
        for (const categoria of categorias) {
            try {
                const created = await apiRequest('/categorias', {
                    method: 'POST',
                    body: JSON.stringify(categoria)
                });
                categoriasCreated.push(created);
                console.log(`Categoria criada: ${categoria.nome}`);
            } catch (error) {
                console.log(`Categoria já existe: ${categoria.nome}`);
            }
        }
        
        // Buscar categorias existentes para usar nos produtos
        const categoriasExistentes = await apiRequest('/categorias');
        
        // Criar produtos
        if (categoriasExistentes.length > 0) {
            const produtos = [
                { nome: 'Pão Francês', preco: 0.50, categoria: { id: categoriasExistentes.find(c => c.nome === 'Pães')?.id || categoriasExistentes[0].id } },
                { nome: 'Pão de Açúcar', preco: 2.50, categoria: { id: categoriasExistentes.find(c => c.nome === 'Pães')?.id || categoriasExistentes[0].id } },
                { nome: 'Brigadeiro', preco: 1.50, categoria: { id: categoriasExistentes.find(c => c.nome === 'Doces')?.id || categoriasExistentes[0].id } },
                { nome: 'Coxinha', preco: 3.00, categoria: { id: categoriasExistentes.find(c => c.nome === 'Salgados')?.id || categoriasExistentes[0].id } },
                { nome: 'Refrigerante', preco: 2.00, categoria: { id: categoriasExistentes.find(c => c.nome === 'Bebidas')?.id || categoriasExistentes[0].id } }
            ];
            
            for (const produto of produtos) {
                try {
                    await apiRequest('/produtos', {
                        method: 'POST',
                        body: JSON.stringify(produto)
                    });
                    console.log(`Produto criado: ${produto.nome}`);
                } catch (error) {
                    console.log(`Produto já existe: ${produto.nome}`);
                }
            }
        }
        
        console.log('Dados iniciais populados com sucesso!');
        
    } catch (error) {
        console.error('Erro ao popular dados iniciais:', error);
    }
}

// Execute quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar botão para popular dados
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <a class="nav-link" href="#" onclick="popularDadosIniciais(); return false;">
                <i class="fas fa-database me-1"></i>Popular Dados
            </a>
        `;
        navbarNav.appendChild(li);
    }
});

// Tornar função global
window.popularDadosIniciais = popularDadosIniciais;