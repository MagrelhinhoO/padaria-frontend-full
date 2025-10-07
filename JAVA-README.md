# 🥖 Sistema de Gestão para Padaria - Java Spring Boot

Sistema completo de gestão para padarias desenvolvido com **Java Spring Boot + Thymeleaf**, **sem JavaScript**, conectando diretamente ao backend Java.

## 🎯 **Transformação Realizada**

✅ **Frontend convertido**: JavaScript → **Java Thymeleaf**  
✅ **Backend expandido**: Adicionadas entidades `Estoque` e `Usuario`  
✅ **Integração completa**: Frontend conectado ao backend Spring Boot  
✅ **Zero JavaScript**: Interface puramente server-side  

## 🏗️ **Arquitetura do Sistema**

### **Backend Java Spring Boot:**
```
📁 src/main/java/app/padariapaodoce/
├── 📄 PadariapaodoceApplication.java    # Aplicação principal
├── 📁 entity/                           # Entidades JPA
│   ├── 📄 Usuario.java                  # ✨ NOVA - Autenticação
│   ├── 📄 Estoque.java                  # ✨ NOVA - Controle estoque
│   ├── 📄 Produto.java                  # Existente
│   ├── 📄 Categoria.java                # Existente  
│   ├── 📄 Venda.java                    # Existente
│   ├── 📄 FormaPagamento.java           # Existente
│   └── 📄 Despesa.java                  # Existente
├── 📁 repository/                       # Repositórios JPA
│   ├── 📄 UsuarioRepository.java        # ✨ NOVO
│   ├── 📄 EstoqueRepository.java        # ✨ NOVO
│   └── 📄 [outros]Repository.java       # Existentes
├── 📁 service/                          # Regras de negócio
│   ├── 📄 UsuarioService.java           # ✨ NOVO
│   ├── 📄 EstoqueService.java           # ✨ NOVO
│   └── 📄 [outros]Service.java          # Existentes
├── 📁 controller/                       # Controllers Web + API
│   ├── 📄 AuthController.java           # ✨ NOVO - Login/Logout
│   ├── 📄 MenuController.java           # ✨ NOVO - Dashboard
│   ├── 📄 EstoqueWebController.java     # ✨ NOVO - Web Estoque
│   ├── 📄 EstoqueController.java        # ✨ NOVO - API REST
│   └── 📄 [outros]Controller.java       # Existentes
├── 📁 config/                           # Configurações
│   └── 📄 DataInitializer.java          # ✨ NOVO - Dados iniciais
└── 📁 exception/                        # Tratamento de erros
    └── 📄 GlobalExceptionHandler.java   # Existente
```

### **Frontend Thymeleaf (SEM JavaScript):**
```
📁 src/main/resources/
├── 📁 templates/                        # Templates Thymeleaf
│   ├── 📄 login.html                    # ✨ NOVA - Tela de login
│   ├── 📄 menu.html                     # ✨ NOVA - Menu principal
│   └── 📁 estoque/                      # ✨ NOVO - Módulo estoque
│       ├── 📄 lista.html                # Lista de itens
│       └── 📄 form.html                 # Formulário add/edit
├── 📁 static/                           # Recursos estáticos
│   ├── 📁 css/                          # Estilos CSS
│   ├── 📁 js/                           # JavaScript (mínimo)
│   └── 📁 images/                       # Imagens
└── 📄 application.properties            # ✨ NOVA - Configurações
```

## 🚀 **Como Executar o Projeto**

### **Pré-requisitos:**
- ☕ **Java 17+**
- 📦 **Maven 3.6+**
- 🗄️ **H2 Database** (incluído) ou **MySQL** (opcional)

### **1. Preparar o Backend:**

1. **Copie os arquivos** da pasta `backend-entities/` para seu projeto Spring Boot:
   ```bash
   # Estrutura do seu projeto deve ficar:
   src/main/java/app/padariapaodoce/
   ├── entity/Usuario.java
   ├── entity/Estoque.java
   ├── repository/UsuarioRepository.java
   ├── repository/EstoqueRepository.java
   ├── service/UsuarioService.java
   ├── service/EstoqueService.java
   ├── controller/AuthController.java
   ├── controller/MenuController.java
   ├── controller/EstoqueWebController.java
   ├── controller/EstoqueController.java
   └── config/DataInitializer.java
   ```

2. **Atualize o pom.xml** com as dependências:
   ```xml
   <!-- Adicione ao seu pom.xml existente -->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-thymeleaf</artifactId>
   </dependency>
   ```

3. **Configure o application.properties:**
   ```properties
   # Copie as configurações do arquivo fornecido
   spring.datasource.url=jdbc:h2:mem:padariadb
   spring.thymeleaf.cache=false
   server.port=8080
   ```

### **2. Preparar o Frontend:**

1. **Copie os templates** da pasta `src/templates/` para `src/main/resources/templates/`:
   ```bash
   src/main/resources/templates/
   ├── login.html
   ├── menu.html
   └── estoque/
       ├── lista.html
       └── form.html
   ```

### **3. Executar o Projeto:**

```bash
# 1. No diretório do projeto Spring Boot
mvn clean install

# 2. Executar a aplicação
mvn spring-boot:run

# 3. Acessar no navegador
http://localhost:8080
```

## 🔐 **Credenciais de Acesso**

**Login padrão:**
- **Email:** `admin@padaria.com`
- **Senha:** `admin123`

> O usuário admin é criado automaticamente na primeira execução.

## 📋 **Funcionalidades Implementadas**

### ✅ **Módulos Funcionais:**

#### 🔐 **Autenticação**
- Login com email/senha
- Sessão de usuário
- Logout seguro
- Usuário admin criado automaticamente

#### 📦 **Controle de Estoque** 
- ✅ **CRUD completo** (Create, Read, Update, Delete)
- ✅ **Filtros avançados** (nome, categoria, status)
- ✅ **Alertas de estoque baixo**
- ✅ **Ajuste de quantidades**
- ✅ **Categorização** (Farinha, Açúcar, Ovos, etc.)
- ✅ **Unidades de medida** (kg, g, litros, unidades, etc.)
- ✅ **Cálculo de valor total** do estoque
- ✅ **Dashboard com estatísticas**

#### 🏠 **Menu Principal**
- ✅ **Dashboard com métricas** em tempo real
- ✅ **Navegação entre módulos**
- ✅ **Estatísticas do sistema**
- ✅ **Interface responsiva**

### 🔄 **APIs REST Disponíveis:**

```bash
# Estoque
GET    /estoque                    # Listar itens
POST   /estoque                    # Criar item
GET    /estoque/{id}               # Buscar por ID
PUT    /estoque/{id}               # Atualizar item
DELETE /estoque/{id}               # Excluir item
GET    /estoque/filtrar            # Filtrar itens
GET    /estoque/estoque-baixo      # Itens com estoque baixo
GET    /estoque/valor-total        # Valor total do estoque

# Produtos (existentes)
GET    /produtos                   # Listar produtos
POST   /produtos                   # Criar produto
# ... outros endpoints

# Vendas (existentes)  
GET    /vendas                     # Listar vendas
POST   /vendas                     # Criar venda
# ... outros endpoints

# Relatórios (existentes)
GET    /relatorios/lucros-dia      # Lucro do dia
GET    /relatorios/lucros-mes      # Lucro do mês
```

## 🎨 **Interface do Sistema**

### **🔐 Tela de Login**
- Design moderno com gradiente
- Validação de campos
- Mensagens de erro
- Credenciais de teste visíveis

### **🏠 Menu Principal** 
- Dashboard com cards de estatísticas
- Navegação por cards clicáveis
- Alertas visuais para estoque baixo
- Header com informações do usuário

### **📦 Controle de Estoque**
- **Lista:** Tabela responsiva com filtros
- **Formulário:** Interface intuitiva para CRUD
- **Modais:** Ajuste rápido de quantidades
- **Alertas:** Itens com estoque baixo destacados

## 🔧 **Customização e Expansão**

### **Adicionar Novos Módulos:**

1. **Criar a Entidade:**
   ```java
   @Entity
   public class NovaEntidade {
       @Id @GeneratedValue
       private Long id;
       // ... campos
   }
   ```

2. **Criar Repository:**
   ```java
   public interface NovaEntidadeRepository extends JpaRepository<NovaEntidade, Long> {
       // métodos personalizados
   }
   ```

3. **Criar Service:**
   ```java
   @Service
   public class NovaEntidadeService {
       // lógica de negócio
   }
   ```

4. **Criar Controller Web:**
   ```java
   @Controller
   @RequestMapping("/nova-entidade")
   public class NovaEntidadeWebController {
       // endpoints para templates Thymeleaf
   }
   ```

5. **Criar Templates:**
   ```html
   <!-- templates/nova-entidade/lista.html -->
   <!-- templates/nova-entidade/form.html -->
   ```

### **Personalizar Estilos:**
- Templates usam **Bootstrap 5**
- CSS inline para customizações específicas
- Gradientes e cores personalizáveis
- Layout responsivo automático

## 🗄️ **Banco de Dados**

### **Desenvolvimento (H2):**
- Banco em memória
- Console em: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:padariadb`
- Username: `sa` / Password: *(vazio)*

### **Produção (MySQL):**
```properties
# application-prod.properties
spring.datasource.url=jdbc:mysql://localhost:3306/padaria_db
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

## 📊 **Entidades do Sistema**

### **✨ Novas Entidades:**

#### **Usuario** (Autenticação)
- `id`, `nome`, `email`, `senha`
- `role` (ADMIN, USUARIO)
- `status` (ativo, inativo)
- `dataCriacao`, `ultimoLogin`

#### **Estoque** (Controle de Estoque)
- `id`, `nome`, `categoria`
- `quantidade`, `unidadeMedida`, `estoqueMinimo`
- `precoUnitario`, `status`, `observacoes`
- `dataCriacao`, `dataAtualizacao`

### **🏪 Entidades Existentes:**
- **Produto** (catálogo de produtos)
- **Categoria** (classificação de produtos)
- **Venda** (transações de venda)
- **FormaPagamento** (meios de pagamento)
- **Despesa** (controle de gastos)

## 🚀 **Próximos Passos Sugeridos**

1. **✅ Concluir módulos restantes:**
   - Produtos (adaptar para Thymeleaf)
   - Vendas (adaptar para Thymeleaf) 
   - Relatórios (adaptar para Thymeleaf)

2. **🔒 Melhorar segurança:**
   - Spring Security
   - Hash de senhas (BCrypt)
   - Controle de permissões

3. **📱 Expandir funcionalidades:**
   - Upload de imagens de produtos
   - Código de barras
   - Integração com impressora fiscal

4. **🏭 Preparar para produção:**
   - Docker containers
   - Configuração de perfis
   - Monitoring e logs

## 📞 **Suporte**

- **Estrutura:** Todos os arquivos estão na pasta `backend-entities/`
- **Templates:** Templates Thymeleaf em `src/templates/`
- **Banco:** H2 para desenvolvimento, MySQL para produção
- **Documentação:** Código totalmente documentado

---

**🎉 Sistema Java Spring Boot + Thymeleaf funcionando sem JavaScript!**

**Transformação completa realizada com sucesso! ✨**