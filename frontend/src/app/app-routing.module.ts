import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CustompizzaComponent } from './custompizza/custompizza.component';
import { OrderpizzaComponent } from './orderpizza/orderpizza.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {
    path:'custompizza', component:CustompizzaComponent
  },
  {path:'orderpizza', component:OrderpizzaComponent},
  {path:'cart',component:CartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
