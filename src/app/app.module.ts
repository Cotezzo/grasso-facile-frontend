import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ButtonComponent } from './components/button/button.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductComponent } from './components/product/product.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { OrderProductsListComponent } from './components/order-products-list/order-products-list.component';
import { FilterProductsListComponent } from './components/filter-products-list/filter-products-list.component';
import { DatalistOptionComponent } from './components/datalist-option/datalist-option.component';
import { UpdateProductDialogComponent } from './components/update-product-dialog/update-product-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConfirmRemoveDialogComponent } from './components/confirm-remove-dialog/confirm-remove-dialog.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ButtonComponent,
    ProductsListComponent,
    ProductComponent,
    AddProductComponent,
    OrderProductsListComponent,
    FilterProductsListComponent,
    DatalistOptionComponent,
    UpdateProductDialogComponent,
    FooterComponent,
    ConfirmRemoveDialogComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    UpdateProductDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
