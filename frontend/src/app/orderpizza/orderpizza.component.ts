import { Component, OnInit } from '@angular/core';
import { CartApiService } from '../services/cart-api.service';
import { PizzaApiService } from '../services/pizza-api.service';

@Component({
  selector: 'app-orderpizza',
  templateUrl: './orderpizza.component.html',
  styleUrls: ['./orderpizza.component.css']
})
export class OrderpizzaComponent implements OnInit {

  pizzas: any[] = [];
  cartData: any[] = [];

  constructor(
    private cartApi: CartApiService,
    private pizzaApi: PizzaApiService
  ) {}

  ngOnInit(): void {
    this.cartApi.getCartMongo().subscribe({
      next: (cart: any[]) => {
        this.cartData = cart || [];
        this.loadPizzasFromBackend();
      },
      error: (err) => console.error("❌ Error loading cart:", err)
    });
  }

  loadPizzasFromBackend(): void {
    this.pizzaApi.getPizzas().subscribe({
      next: (data: any[]) => {
        this.pizzas = data || [];
        console.log("✅ pizzas:", this.pizzas);
      },
      error: (err) => console.error("❌ Error fetching pizzas:", err)
    });
  }

  addToCart(pizza: any): void {

    const existing = this.cartData.find(item => String(item.id) === String(pizza.id));

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;

      if (existing._id) {
        this.cartApi.updateQuantityMongo(existing._id, existing.quantity).subscribe({
          next: () => console.log("✅ Quantity updated in MongoDB"),
          error: (err) => console.error("❌ Error updating quantity:", err)
        });
      }

      pizza.inCart = true;
      return;
    }

    const cartItem: any = {
      ...pizza,
      quantity: 1,
      addedAt: new Date()
    };

    this.cartApi.addToCartMongo(cartItem).subscribe({
      next: (savedItem: any) => {
        cartItem._id = savedItem._id;

        this.pizzaApi.updatePizzaInCart(String(pizza.id), true).subscribe({
          next: () => console.log("✅ Pizza inCart updated"),
          error: (err) => console.error("❌ Error updating inCart:", err)
        });

        this.cartData.push(cartItem);
        pizza.inCart = true;
      },
      error: (err) => {
        console.error("❌ Error saving cart:", err);
        alert("MongoDB error! Cart not saved.");
      }
    });
  }
}
