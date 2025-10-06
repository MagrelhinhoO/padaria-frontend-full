import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../../core/services/product/product.service';
import { Product } from '../../../../core/models/product.model';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3>Produtos</h3>
    <button class="btn btn-primary" (click)="novo()">Novo</button>
  </div>

  <div class="row g-2 mb-3">
    <div class="col-md-4">
      <input class="form-control" placeholder="Nome..." [(ngModel)]="filtroNome" (keyup.enter)="load()">
    </div>
    <div class="col-md-2">
      <select class="form-select" [(ngModel)]="filtroAtivo" (change)="load()">
        <option value="">Ativos/Inativos</option>
        <option value="true">Ativos</option>
        <option value="false">Inativos</option>
      </select>
    </div>
    <div class="col-md-2">
      <button class="btn btn-secondary" (click)="load()">Filtrar</button>
    </div>
  </div>

  @if(loading()) {
    <div>Carregando...</div>
  }

  @if(!loading() && products().length === 0) {
    <div class="alert alert-info">Nenhum produto encontrado.</div>
  }

  @if(!loading() && products().length > 0) {
    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Ativo</th>
            <th>Promoção</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (p of products(); track p.id) {
            <tr>
              <td>{{ p.name }}</td>
              <td>{{ p.price | currency:'BRL' }}</td>
              <td>
                <span class="badge" [class.text-bg-success]="p.active" [class.text-bg-secondary]="!p.active">
                  {{ p.active ? 'Sim' : 'Não' }}
                </span>
              </td>
              <td>
                @if(p.promotionTitle) {
                  <span class="badge text-bg-warning">{{ p.promotionTitle }}</span>
                }
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" (click)="editar(p)">Editar</button>
                <button class="btn btn-sm btn-outline-danger" (click)="remover(p)">Excluir</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  }
  `
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(false);
  filtroNome = '';
  filtroAtivo = '';

  constructor(private service: ProductService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading.set(true);
    const filters: any = { name: this.filtroNome };
    if (this.filtroAtivo !== '') filters.active = this.filtroAtivo;
    // fallback: se service.list não aceitar filtros, usar sem argumento
    const obs = (this.service as any).list.length > 0 ? this.service.list(filters) : this.service.list();
    obs.subscribe({
      next: data => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        Swal.fire('Erro', err.error?.message || 'Erro ao carregar', 'error');
      }
    });
  }

  novo() {}
  editar(p: Product) {}

  remover(p: Product) {
    if (!p.id) return;
    Swal.fire({
      title: 'Confirmar',
      text: `Excluir ${p.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim'
    }).then((r: any) => {
      if (r?.isConfirmed) {
        this.service.delete(p.id!).subscribe({
          next: () => {
            Swal.fire('Sucesso', 'Produto excluído', 'success');
            this.load();
          },
          error: err => Swal.fire('Erro', err.error?.message || 'Falha ao excluir', 'error')
        });
      }
    });
  }
}
