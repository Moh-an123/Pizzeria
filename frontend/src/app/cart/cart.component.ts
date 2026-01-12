import { Component, OnInit } from '@angular/core';
import { CartApiService } from '../services/cart-api.service';

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

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: CartItem[] = [];
  showCart = true;

  constructor(private cartApi: CartApiService) {}

  ngOnInit(): void {
    this.loadCartFromMongo();
  }

  loadCartFromMongo(): void {
    this.cartApi.getCartMongo().subscribe({
      next: (data: any[]) => {
        this.cart = (data || []).map((item: any) => ({
          ...item,
          quantity: item.quantity ?? 1,
          ingredients: item.ingredients ?? [],
          originalQuantity: item.quantity ?? 1,
          quantityChanged: false
        }));
      },
      error: (err) => console.error("❌ Error fetching cart:", err)
    });
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  updateQuantity(item: CartItem, change: number): void {
    item.quantity = Math.max(1, item.quantity + change);
    item.quantityChanged = item.quantity !== item.originalQuantity;
  }

  confirmQuantity(item: CartItem): void {
    if (!item.id) return;

    this.cartApi.updateQuantityMongo(item.id, item.quantity).subscribe({
      next: () => {
        item.originalQuantity = item.quantity;
        item.quantityChanged = false;
      },
      error: (err) => {
        console.error("❌ Quantity update error:", err);
        item.quantity = item.originalQuantity ?? 1;
        item.quantityChanged = false;
      }
    });
  }

  removeFromCart(item: CartItem): void {
    if (!item.id) return;

    this.cartApi.deleteCartById(item.id).subscribe({
      next: () => {
        this.cart = this.cart.filter(i => i.id !== item.id);
      },
      error: (err) => console.error("❌ Delete error:", err)
    });
  }

  clearCart(): void {
    if (this.cart.length === 0) return;

    const confirmClear = confirm("Are you sure you want to clear all cart items?");
    if (!confirmClear) return;

    this.cartApi.clearCartMongo().subscribe({
      next: () => {
        this.cart = [];
      },
      error: (err) => console.error("❌ Clear cart error:", err)
    });
  }

  getItemTotal(item: CartItem): number {
    const basePrice = Number(item.price || 0);

    const ingredientsTotal = (item.ingredients ?? []).reduce(
      (sum, ing) => sum + Number(ing.price || 0),
      0
    );

    return (basePrice + ingredientsTotal) * item.quantity;
  }

  getTotalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cart.reduce((total, item) => total + this.getItemTotal(item), 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.18;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  checkout(): void {
    if (this.cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    alert(`Order placed successfully!\nTotal: ₹${this.getTotal().toFixed(2)}`);
    this.clearCart();
  }
}
