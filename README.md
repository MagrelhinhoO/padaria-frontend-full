# Padaria Pão Doce – Front-End (Angular 19)

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
