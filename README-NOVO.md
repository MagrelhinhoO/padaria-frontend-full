# 🥖 Padaria Pão Doce - Sistema de Gestão

Sistema completo de gestão para padaria com frontend HTML/CSS/JavaScript consumindo APIs REST do backend Spring Boot.

## 🚀 **Como usar:**

### **1. Execute o Backend:**
- Certifique-se que seu backend Spring Boot está rodando em http://localhost:8080
- O backend deve ter MySQL configurado e rodando
- Execute o projeto PadariaPaoDoce do GitHub: https://github.com/MagrelhinhoO/PadariaPaoDoce

### **2. Abra o Frontend:**
- Abra o arquivo `index.html` no navegador
- Ou use um servidor local como Live Server do VS Code

### **3. Popular Dados Iniciais:**
- Clique em "Popular Dados" no menu superior
- Isso criará categorias, produtos e formas de pagamento iniciais

## 📋 **Funcionalidades:**

### **✅ Dashboard:**
- Resumo de produtos, vendas, categorias
- Lucro do dia atual
- Cards informativos com totais

### **✅ Gestão de Produtos:**
- Listar, criar, editar e excluir produtos
- Associar produtos a categorias
- Preços em formato monetário brasileiro

### **✅ Gestão de Categorias:**
- CRUD completo de categorias
- Validação de campos obrigatórios

### **✅ Gestão de Vendas:**
- Registrar vendas com data, valor e forma de pagamento
- Histórico completo de vendas
- Cálculos automáticos para relatórios

### **✅ Gestão de Despesas:**
- Controle de despesas da padaria
- Descrição, valor e data das despesas

### **✅ Relatórios:**
- **Relatório Diário:** Entradas, saídas e lucro do dia
- **Relatório Mensal:** Consolidado do mês selecionado
- Visualização com cards coloridos

## 🔗 **APIs Consumidas:**

O frontend consome as seguintes APIs do seu backend:

```
GET    /produtos           - Listar produtos
POST   /produtos           - Criar produto
PUT    /produtos/{id}      - Atualizar produto
DELETE /produtos/{id}      - Excluir produto

GET    /categorias         - Listar categorias
POST   /categorias         - Criar categoria
PUT    /categorias/{id}    - Atualizar categoria
DELETE /categorias/{id}    - Excluir categoria

GET    /vendas             - Listar vendas
POST   /vendas             - Criar venda
PUT    /vendas/{id}        - Atualizar venda
DELETE /vendas/{id}        - Excluir venda

GET    /despesas           - Listar despesas
POST   /despesas           - Criar despesa
PUT    /despesas/{id}      - Atualizar despesa
DELETE /despesas/{id}      - Excluir despesa

GET    /pagamentos         - Listar formas de pagamento
POST   /pagamentos         - Criar forma de pagamento

GET    /relatorios/lucros-dia?data=YYYY-MM-DD     - Relatório diário
GET    /relatorios/lucros-mes?ano=2024&mes=10     - Relatório mensal
```

## 💻 **Tecnologias Utilizadas:**

### **Frontend:**
- HTML5 + CSS3 + JavaScript (Vanilla)
- Bootstrap 5.3 para UI responsiva
- Font Awesome para ícones
- Fetch API para consumo das APIs REST

### **Backend (seu repositório):**
- Spring Boot 3.x
- MySQL Database
- JPA/Hibernate
- REST Controllers com JSON

## 🎨 **Interface:**

- **Responsiva:** Funciona em desktop, tablet e mobile
- **Moderna:** Design clean com Bootstrap 5
- **Intuitiva:** Navegação simples e direta
- **Feedback:** Alertas de sucesso/erro para todas as operações

## 🔧 **Configuração:**

### **API Base URL:**
O frontend está configurado para acessar o backend em:
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

Se seu backend rodar em porta diferente, altere no arquivo `js/app.js`.

### **CORS:**
Certifique-se que seu backend aceita requisições do frontend. Adicione configuração CORS se necessário.

## 📊 **Estrutura de Arquivos:**

```
padaria-frontend-full/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos customizados
├── js/
│   ├── app.js            # Lógica principal da aplicação
│   └── data-init.js      # Script para popular dados iniciais
└── README.md             # Esta documentação
```

## 🚨 **Importante:**

1. **Backend deve estar rodando** em http://localhost:8080
2. **MySQL deve estar configurado** e rodando
3. **Dados iniciais:** Use o botão "Popular Dados" na primeira execução
4. **CORS:** Pode ser necessário configurar CORS no backend para aceitar requisições do frontend

## 🎯 **Como testar:**

1. Execute seu backend Spring Boot
2. Abra `index.html` no navegador
3. Clique em "Popular Dados" para criar dados iniciais
4. Navegue pelas seções: Dashboard, Produtos, Categorias, Vendas, Despesas, Relatórios
5. Teste as operações CRUD em cada seção
6. Gere relatórios para verificar os cálculos

**Sistema 100% funcional consumindo seu backend via JSON/REST APIs!** 🎉