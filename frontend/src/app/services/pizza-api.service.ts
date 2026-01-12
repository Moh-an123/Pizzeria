import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PizzaApiService {
  private apiUrl = "http://localhost:3000/api/pizzas";

  constructor(private http: HttpClient) {}

  getPizzas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  updatePizzaInCart(id: string, inCart: boolean) {
  return this.http.put(`http://localhost:3000/api/pizzas/${id}`, { inCart });
}

}
