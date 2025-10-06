import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/products`;

  list(filters: any = {}): Observable<Product[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(k => {
      const v = filters[k];
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, v);
      }
    });
    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  get(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  save(p: Product) {
    return p.id
      ? this.http.put<Product>(`${this.baseUrl}/${p.id}`, p)
      : this.http.post<Product>(this.baseUrl, p);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
