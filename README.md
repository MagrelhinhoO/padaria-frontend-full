# 🥖 Sistema de Gestão para Padaria

Sistema completo de gestão para padarias desenvolvido com HTML5, CSS3 e JavaScript puro, seguindo arquitetura profissional com separação em Models, Services e Components.

## 📋 Funcionalidades

### 🔐 Autenticação
- Sistema de login seguro
- Gerenciamento de sessão
- Validação de credenciais
- **Credenciais padrão**: `admin@padaria.com` / `admin123`

### 📦 Controle de Estoque
- Cadastro completo de itens
- Controle de quantidades
- Alertas de estoque mínimo
- Categorização de produtos
- Ajuste manual de estoque
- Relatórios de estoque

### 🥖 Catálogo de Produtos
- Cadastro de produtos da padaria
- Cálculo automático de preços com margem
- Sistema de promoções
- Categorização por tipo
- Duplicação de produtos
- Preview de preços em tempo real

### 💰 Sistema de Vendas
- Processamento de vendas
- Carrinho de compras
- Cálculo automático de totais
- Controle de caixa
- Histórico de vendas

### 📊 Relatórios Gerenciais
- Relatório de vendas
- Relatório de estoque
- Relatório de produtos
- Relatório financeiro
- Dashboard com estatísticas

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
📁 padaria-frontend-full/
├── 📄 README.md               # Documentação do projeto
├── 📁 src/                    # Código fonte da aplicação
│   ├── 📄 index.html          # Interface principal
│   ├── 📁 css/                # Estilos da aplicação
│   │   ├── 📄 styles.css      # Estilos globais
│   │   └── 📄 components.css  # Estilos dos componentes
│   └── 📁 js/                 # JavaScript da aplicação
│       ├── 📄 app.js          # Aplicação principal
│       ├── 📁 models/         # Modelos de dados
│       │   ├── 📄 usuario.model.js
│       │   ├── 📄 estoque.model.js
│       │   ├── 📄 produto.model.js
│       │   └── 📄 venda.model.js
│       ├── 📁 services/       # Lógica de negócio
│       │   ├── 📄 auth.service.js
│       │   ├── 📄 estoque.service.js
│       │   ├── 📄 produto.service.js
│       │   ├── 📄 venda.service.js
│       │   └── 📄 relatorio.service.js
│       └── 📁 components/     # Componentes de interface
│           ├── 📄 login.component.js
│           ├── 📄 menu.component.js
│           ├── 📄 estoque.component.js
│           └── 📄 produtos.component.js
```

### Padrões Arquiteturais

#### 🎯 **Model-View-Controller (MVC)**
- **Models**: Definem estrutura e validação dos dados
- **Services**: Implementam regras de negócio e persistência
- **Components**: Gerenciam interface e interação do usuário

#### 🔧 **Separation of Concerns**
- **CSS separado**: Estilos organizados por escopo
- **JavaScript modular**: Cada funcionalidade em arquivo específico
- **HTML semântico**: Estrutura clara e acessível

#### 💾 **Data Persistence**
- **localStorage**: Armazenamento local dos dados
- **JSON Serialization**: Formato padronizado para persistência
- **Validação**: Verificação de integridade dos dados

## 🚀 Como Executar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)

### Execução Simples
1. Clone ou baixe o projeto
2. Abra o arquivo `src/index.html` no navegador
3. Faça login com: `admin@padaria.com` / `admin123`

### Execução com Servidor Local (Recomendado)
```bash
# Usando Python
cd src
python -m http.server 8000

# Usando Node.js
npx http-server src -p 8000

# Usando PHP
cd src
php -S localhost:8000
```
Depois acesse: `http://localhost:8000`

## 🎮 Como Usar

### 1️⃣ Login
- Acesse o sistema com as credenciais padrão
- O sistema verifica automaticamente sessões ativas

### 2️⃣ Menu Principal
- Dashboard com estatísticas em tempo real
- Navegação intuitiva entre módulos
- Atalhos de teclado disponíveis

### 3️⃣ Gerenciar Estoque
- **Adicionar Item**: Clique em "Adicionar Item" e preencha os dados
- **Editar**: Clique no ícone de edição (✏️)
- **Ajustar Estoque**: Use o ícone de estoque (📦)
- **Filtros**: Use os filtros por categoria e status

### 4️⃣ Gerenciar Produtos
- **Novo Produto**: Informe custo e margem, o preço é calculado automaticamente
- **Promoções**: Use o ícone de promoção (🏷️) para aplicar descontos
- **Duplicar**: Clone produtos similares com o ícone (📋)

### 5️⃣ Atalhos de Teclado
- `Ctrl + Q`: Logout
- `Ctrl + H`: Voltar ao menu principal
- `ESC`: Voltar à tela anterior

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e moderna
- **CSS3**: Grid, Flexbox, animações e responsividade
- **JavaScript ES6+**: Classes, async/await, arrow functions

### Funcionalidades Avançadas
- **Web Storage API**: Persistência local de dados
- **Event System**: Comunicação entre componentes
- **Form Validation**: Validação client-side
- **Responsive Design**: Interface adaptável

## 🔧 Personalização

### Adicionando Novos Módulos
1. Crie o model em `js/models/`
2. Implemente o service em `js/services/`
3. Desenvolva o component em `js/components/`
4. Registre no `app.js`
5. Adicione a interface no HTML

### Exemplo de Novo Módulo
```javascript
// 1. Model
class NovoModel {
  constructor(data) {
    this.id = data.id || Date.now();
    this.nome = data.nome || '';
  }
  
  validate() {
    return this.nome.length > 0;
  }
}

// 2. Service
class NovoService {
  async criar(data) {
    const item = new NovoModel(data);
    if (!item.validate()) throw new Error('Dados inválidos');
    // Salvar no localStorage
  }
}

// 3. Component
class NovoComponent {
  show() { /* Mostrar interface */ }
  hide() { /* Ocultar interface */ }
}
```

## 🎨 Customização Visual

### Cores do Sistema
```css
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --dark-color: #343a40;
}
```

### Responsividade
- **Desktop**: Layout completo com sidebar
- **Tablet**: Interface adaptada
- **Mobile**: Menu colapsável e layout otimizado

## 📊 Dados de Exemplo

O sistema inicializa automaticamente com dados de demonstração:

### Estoque Inicial
- Farinha de Trigo (50kg)
- Açúcar Cristal (25kg)
- Ovos (100 unidades)
- Leite Integral (20L)

### Produtos Iniciais
- Pão Francês (R$ 0,60)
- Pão de Açúcar (R$ 1,50)
- Croissant (R$ 3,00)
- Bolo de Chocolate (R$ 15,00)

## 🔮 Preparação para Banco de Dados

### Estrutura Preparada
- **Models**: Definição clara das entidades
- **Services**: Abstração da camada de dados
- **Validações**: Regras de negócio implementadas

### Migração Futura
```javascript
// Em vez de localStorage, use APIs REST
class EstoqueService {
  async listar() {
    const response = await fetch('/api/estoque');
    return response.json();
  }
  
  async criar(data) {
    const response = await fetch('/api/estoque', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }
}
```

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature
3. Implemente seguindo os padrões estabelecidos
4. Teste thoroughly
5. Submeta um Pull Request

### Padrões de Código
- Use ESLint para JavaScript
- Siga convenções de nomenclatura consistentes
- Documente funções complexas
- Mantenha responsabilidade única por classe

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no GitHub
- Consulte a documentação no código
- Verifique os console logs para debug

---

**Desenvolvido com ❤️ para modernizar a gestão de padarias**

Aplicação SPA Angular 19 para gestão de padaria: produtos, pedidos, promoções, usuários e relatórios.

## Stack
- Angular 19 (standalone components + roteamento)
- TypeScript
- MDBootstrap (mdb-angular-ui-kit)
- SweetAlert2 (alertas)
- JWT (integração com backend)
- Interceptores para Auth e Erros
- Guards (auth)
- Padrão de estrutura exigido (services / components / models)
- Uso de @for e @if (Angular moderno)

## Requisitos Atendidos
- Layout com menu superior fixo (exceto login)
- Estrutura de entidades de front (modelo inicial)
- Consumo de endpoints via services
- Tratamento de erros conforme payload do backend (GlobalExceptionHandler padronizado)
- Perfis (roles) tratados no front para exibição condicional de menus

## Scripts
```bash
npm install
npm start
npm run build
```

## Variáveis de Ambiente
Ajustar `environment.ts` para apontar para o backend (default: http://localhost:8080).

## Expansões Futuras
- Módulo de Pedidos (orders)
- Módulo de Relatórios
- Módulo de Promoções
- Cadastro de Clientes (Customer) e cardápio público
- Modais para relacionamentos (Property Binding + Event Binding)
- Componentes de formulário (product-form, etc.)

## Estrutura de Erros Esperada do Backend
```json
{
  "timestamp": "2025-09-29T22:10:11",
  "status": 400,
  "error": "Validation Error",
  "message": "Dados inválidos",
  "path": "/products",
  "errors": [
    {"field": "name", "message": "não pode ser vazio"}
  ]
}
```

## Licença
MIT (ajuste conforme necessidade).
