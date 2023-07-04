import { Component, OnInit } from '@angular/core';
import { byPropertiesOf } from '../../sort';
import { Product } from '../../Product';
import { ProductService } from '../../services/product.service';
import { UpdateProductDialogComponent } from '../update-product-dialog/update-product-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmRemoveDialogComponent } from '../confirm-remove-dialog/confirm-remove-dialog.component';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})

export class ProductsListComponent implements OnInit {
  products: Product[] = [];                                                                             // List of products
  datalistDescriptionOptions: string[] = [];                                                            // Hint values in input textboxes
  datalistLocationOptions: string[] = [];
  datalistBrandOptions: string[] = [];
  // codes: any = {};                                                                                  // Code - Description associations

  private static sortProperties: string[] = ["description", "location", "brand", "expiration_date", "insertion_date", "units"]; // Product props associated with sort value with array index
  sortInfo: number[] = [0, 0, 0, 0, 0, 0];                                                                 // Init values of sort state of product props in the list
  private sortBy: string[] = [];                                                                                // List of properties to sort by the list
  private filters: any = {};          // Send to product                                                        // Filter list for comparing
  private current_date: string = "";  // Send to product                                                        // Date for comparing the expiration and setting the border 

  constructor(private productService: ProductService, public dialog: MatDialog) {
    this.productService.onUseDb().subscribe(_ => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.clearSort();
    this.clearFilter();
    this.clearData();

    this.productService.getProducts().subscribe(products => {
      this.products = products;                                                                         // Initialize products list retrieving them from backend
      this.sort(3);                                                                                     // Order the list for expiration_date by default
    });                  
    this.productService.getDatalist("description").subscribe(options => this.datalistDescriptionOptions = options);
    this.productService.getDatalist("location").subscribe(options => this.datalistLocationOptions = options);
    this.productService.getDatalist("brand").subscribe(options => this.datalistBrandOptions = options);
    // this.productService.getCodes().subscribe(codes => this.codes = codes);

    this.current_date = this.getCurrentDate(7);
  }

  /**
   * Removes a unit to the given product, updating both the database and the frontend list,
   * asking for deletion confirmation in case the product would be eliminated.
   * @param product 
   */
  removeUnit = (product: Product): void => {
    if (product.units == 1) return this.openConfirmDialog(product);
    this.updateUnits(product, -1);
  }

  /**
   * Adds a unit to the given product, updating both the database and the frontend list.
   * @param product 
   */
  addUnit = (product: Product) => {
    this.updateUnits(product, 1);
  }

  /**
   * Updates the units to the given product for a given amount, updating both the database and the frontend list.
   * @param product 
   * @param increment 
   */
  updateUnits = (product: Product, increment: number) => {
    product.units += increment;
    this.updateProduct(product);
  }

  /**
   * When 'Add Product' is clicked, push the new product to the array. Waits for the request in order to give the correct _id.
   * @param product 
   */
  addProduct = (product: Product) => this.productService.addProduct(product).subscribe(newProduct => this.products.push(newProduct));


  /**
   * Given a set of product values, refreshes the database and the frontend products list
   * @param {object} { product }
   * @returns 
   */
  updateProduct = ({ _id, description, brand, location, expiration_date, insertion_date, units, optional, cal, wgt }: Product): any => {
    _id = _id ?? "";  // To avoid undefined error

    if (!expiration_date || !insertion_date || !description || !location) return;  // Invalid parameters

    description = description.toLowerCase();
    brand = brand ? brand.toLowerCase() : undefined;
    location = location.toLowerCase();
    // optional = optional ? optional.toLowerCase() : undefined;

    // Database update
    this.productService.updateProduct({ _id, description, brand, location, expiration_date, insertion_date, units, optional, cal, wgt }).subscribe(); // Update the database, don't wait for the reply

    // Frontend update
    const index = this.getProductIndexFromId(_id);                                                                  // Retrieve position in list
    if (units <= 0) return this.products.splice(index, 1);                                                          // Delete product if units <= 0
    this.products[index] = { _id, description, brand, location, expiration_date, insertion_date, units, optional, cal, wgt }; // Update product
  }

  /**
   * Resets all the variables (if requests don't return, data is resetted anyway)
   */
  clearData = () => {
    this.products = [];
    this.datalistDescriptionOptions = [];
    this.datalistLocationOptions = [];
    this.datalistBrandOptions = [];
    // this.codes = {};
  }

  /**
   * Returns the current date in a specific string form.
   * @param {number} daysToAdd number to add to the date
   * @returns {string} string rapresenting the date
   */
  getCurrentDate = (daysToAdd: number = 0): string => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + daysToAdd);

    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();

    return `${dateObj.getUTCFullYear()}-${month > 9 ? '' : 0}${month}-${day > 9 ? '' : 0}${day}`;
  }

  /**
   * Retrieves the position in the products list of the given product
   * @param _id 
   * @returns {number} index
   */
  getProductIndexFromId(_id: string): number {
    for (let i = 0; i < this.products.length; i++)
      if (this.products[i]._id === _id) return i;
    return -1;
  }


  /**
   * Updates sortInfo and sortBy directly from the html input, then sorts the products list
   * @param value 
   */
  sort = (value: number): void => {
    const prop_name = this.getPropertyNameFromSortInfoIndex(value);                               // Modified propery name, different a seconda del suo stato attuale (prop, -prop, "")
    const index = prop_name ? this.sortBy.indexOf(prop_name) : -1;                                // Indice (nel sortBy) del tipo di sort che c'era prima in questa posizione, se esiste

    this.sortInfo[value] = ((this.sortInfo[value] + 2) % 3) - 1;                                  // Modifico stato sort della proprietà modificata
    const prop_name_toAdd = this.getPropertyNameFromSortInfoIndex(value);                         // Depending on the new value, gets the new name of the modified property (prop, -prop, "")

    if (prop_name_toAdd) {
      if (index > -1) this.sortBy[index] = prop_name_toAdd;                                       // If the property exists and was already in sortBy, override with the new value
      else this.sortBy.push(prop_name_toAdd);                                                     // If the property exists but wasn't in sortBy, add it
    } else if (index > -1) this.sortBy.splice(index, 1);                                          // If the property doesn't exist but was already in sortBy, remove it

    this.products.sort(byPropertiesOf<Product>(this.sortBy));                                     // Uses the props list in gerarchy to sort the list  
  }

  /**
   * Resets the values of the sort handlers
   */
  clearSort = () => {
    this.sortInfo = [0, 0, 0, 0, 0, 0];
    this.sortBy = [];
  }

  /**
   * Given the index of the property, retrieves the state of the sort, and creates the corresponding string for the sortBy
   * @param index 
   * @returns {string}
   */
  getPropertyNameFromSortInfoIndex = (index: number): string => {
    const sortValue_toAdd = this.sortInfo[index]; // console.log(this.sortInfo, sortValue_toAdd, result) => [ 0, 0, 0, 0, 1 ] 4 units
    return sortValue_toAdd ? (sortValue_toAdd < 0 ? '-' : '') + ProductsListComponent.sortProperties[index] : "";
  }

  /**
   * Adds a property value to the filters array
   * @param {prop: string, value: string | number}
   */
  updateFilter = ({ prop, value }: { prop: string, value: string | number }) => this.filters[prop] = value;

  /**
   * Removes all the filters
   */
  clearFilter = () => { this.filters = {}; }

  /**
   * Filters products checking the filters list (used in html)
   * @param product 
   * @returns {boolean}
   */
  filter = (product: any): boolean => {                                                           // ! Crashes with non keyof Product properties in filters
    for (const key of Object.keys(this.filters)) {                                                  // For every property in the filter
      const filter = this.filters[key];
      if (filter)
        if (!product[key]?.toString().toLowerCase().includes(filter.toString().toLowerCase()))      // Compare the corrispective value in the product
          return false;                                                                           // If one doesn't match, returns false (don't display product)
    }
    return true;                                                                                  // If it never breaks, returns true (display product)
  }

  /**
   * Checks if the product is about to expire or not (used in html)
   * @param expiration_date 
   * @returns {boolean}
   */
  checkDate = (expiration_date: string): boolean => this.current_date > expiration_date;

  /**
   * Opens the confirmation dialog for the deletion of a product (remove cart when units == 1)
   * @param _id 
   * @param units 
   * @param index 
   */
  openConfirmDialog = (product: Product): void => {
    const dialogRef = this.dialog.open(ConfirmRemoveDialogComponent);
    dialogRef.afterClosed().subscribe(res => { if (res) this.updateUnits(product, -1) });
  }

  /**
   * Generates a pop-up (described in UpdateProductDialogComponent component) for product updating
   * @param product 
   */
  openUpdateDialog = (product: Product): void => {
    const dialogRef = this.dialog.open(UpdateProductDialogComponent, { data: { product: { ...product }, datalistLocationOptions: this.datalistLocationOptions, datalistBrandOptions: this.datalistBrandOptions } });
    dialogRef.afterClosed().subscribe(res => { if (res) this.updateProduct(res.product) });
  }
}