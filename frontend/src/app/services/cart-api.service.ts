import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Ingredient {
  id: number;
  tname: string;
  price: number;
  image?: string;
}

interface CartItem {
  _id?: string | number;
  id: string;
  name: string;
  type: string;
  price: string | number;
  image: string;
  description: string;
  ingredients: Ingredient[];
  quantity: number;
  originalQuantity?: number;
  quantityChanged?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class CartApiService {

  private apiUrl = "http://localhost:3000/api/cart";

  constructor(private http: HttpClient) {}

  // ✅ Save cart item into MongoDB
 addToCartMongo(item:CartItem) {
  return this.http.post(this.apiUrl, item);
}

  // ✅ fetch cart from mongo
  getCartMongo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ✅ delete cart item from mongo using _id
  deleteCartItemMongo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
 deleteCartById(id:  string|number): Observable<any> {
  return this.http.delete(`http://localhost:3000/api/cart/${id}`);
}

  // ✅ update quantity in mongo
 updateQuantityMongo(id: string, quantity: number) {
  return this.http.put(`http://localhost:3000/api/cart/quantity/${id}`, { quantity });
}
 addCustomPizza(payload: any) {
    return this.http.post("http://localhost:3000/api/cart/custompizza/add", payload);
  }

  // ✅ clear cart
  clearCartMongo(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}
