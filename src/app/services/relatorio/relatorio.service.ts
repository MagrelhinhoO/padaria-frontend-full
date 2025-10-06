
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelatorioLucro } from '../../models/relatorio.model';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private apiUrl = 'http://localhost:8080/relatorios';

  constructor(private http: HttpClient) {}

  lucroDia(data: string): Observable<RelatorioLucro> {
    let params = new HttpParams().set('data', data);
    return this.http.get<RelatorioLucro>(`${this.apiUrl}/lucros-dia`, { params });
  }

  lucroMes(ano: number, mes: number): Observable<RelatorioLucro> {
    let params = new HttpParams()
      .set('ano', ano.toString())
      .set('mes', mes.toString());
    return this.http.get<RelatorioLucro>(`${this.apiUrl}/lucros-mes`, { params });
  }
}
