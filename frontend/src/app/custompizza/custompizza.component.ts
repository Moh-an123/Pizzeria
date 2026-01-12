import { Component } from '@angular/core';
import Data from '../../json/Data.json';
import { CartApiService } from '../services/cart-api.service';

export interface Ingredient {
  id: number;
  tname: string;
  price: number;
  image?: string;
  selected?: boolean; // ✅ UI only
}

export interface CartItem {
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
  selector: 'app-custompizza',
  templateUrl: './custompizza.component.html',
  styleUrls: ['./custompizza.component.css']
})
export class CustompizzaComponent {

  Ingredients: Ingredient[] = (Data as any).Ingredients.map((ingredient: any) => ({
    ...ingredient,
    price: Number(ingredient.price),
    id: Number(ingredient.id),
    selected: false
  }));

  selectedIngredients: Ingredient[] = [];

  private readonly basePizzaPrice: number = 199;
  private readonly pizzaName: string = "Custom Pizza";
  private readonly pizzaType: string = "veg";
  private readonly pizzaImage: string =
    "https://commons.wikimedia.org/wiki/Special:FilePath/Pizza.jpg";
  private readonly pizzaDescription: string =
    "Customized pizza with selected ingredients";

  constructor(private cartApi: CartApiService) {}

  generateCustomId(): string {
    return "CUSTOM-" + Math.floor(100000 + Math.random() * 900000);
  }

  addIngredient(item: Ingredient) {
    if (item.selected) return;

    item.selected = true;
    this.selectedIngredients.push(item);
  }

  removeIngredient(item: Ingredient) {
    item.selected = false;
    this.selectedIngredients = this.selectedIngredients.filter(
      (ing) => ing.id !== item.id
    );
  }

  sendToCart() {
    if (this.selectedIngredients.length === 0) {
      alert("Please select at least 1 ingredient!");
      return;
    }

    const ingredientsList: Ingredient[] = this.selectedIngredients.map((ing) => ({
      id: Number(ing.id),
      tname: ing.tname,
      price: Number(ing.price),
      image: ing.image
    }));

    const cartItem: CartItem = {
      id: this.generateCustomId(),
      name: this.pizzaName,
      type: this.pizzaType,
      price: this.basePizzaPrice,
      image: this.pizzaImage,
      description: this.pizzaDescription,
      ingredients: ingredientsList,
      quantity: 1
    };

    console.log("✅ Sending cartItem:", cartItem);

    this.cartApi.addToCartMongo(cartItem).subscribe({
      next: (saved: any) => {
        console.log("✅ Custom pizza stored in MongoDB cart:", saved);
        alert("✅ Custom Pizza added to cart");

        this.selectedIngredients = [];
        this.Ingredients = this.Ingredients.map((ing) => ({
          ...ing,
          selected: false
        }));
      },
      error: (err) => {
        console.error("❌ Error adding custom pizza:", err);
        alert("❌ Failed to add custom pizza to cart");
      }
    });
  }
}
