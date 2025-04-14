import { Component, OnInit } from '@angular/core';
import { byPropertiesOf } from '../../sort';
import { Product } from '../../Product';
import { ProductService } from '../../services/product.service';
import { UpdateProductDialogComponent } from '../update-product-dialog/update-product-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmRemoveDialogComponent } from '../confirm-remove-dialog/confirm-remove-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
    selector: 'app-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.css']
})

export class ProductsListComponent implements OnInit {

    /* ==== PROPERTIES ====================================================== */
    /** Actual stored products array. */
    products: Product[] = [];
    /** Hint values for input textbox "description". */
    datalistDescriptionOptions: string[] = [];
    /** Hint values for input textbox "location". */
    datalistLocationOptions: string[] = [];
    /** Hint values for input textbox "brand". */
    datalistBrandOptions: string[] = [];
    /** Bar code / description associations - @deprecated */
    //codes: any = {};

    /** Available sort properties (on which fields sorting can be applied). */
    private static sortProperties: string[] = ["description", "location", "brand", "expiration_date", "insertion_date", "optional", "check"];
    /** Sort states relative to the sortProperties list (if sort on that field is active and what is its value).
     *  Sort values for fields in "sortProperties". 0 = no sort applied.
     *? Property is not private since it is accessed HTML frontend component. */
    sortInfo: number[] = [0, 0, 0, 0, 0, 0, 0];
    /** List of properties to sort by the list. */
    private sortBy: string[] = [];
    /** Filter list for comparing- */
    private filters: any = {};
    /** Date used to compare expiration dates and highlight expiring product. */
    private expirationThresholdDate: string = "";


    /* ==== CONSTRUCTOR ===================================================== */
    constructor(private productService: ProductService, public dialog: MatDialog) {
        // Initialize Mongo Database - once finished, call actual initialization
        this.productService.onUseDb().subscribe(_ => this.ngOnInit());
    }

    ngOnInit(): void {
        // Clear all previous sortings, filters and products
        this.clearSort();
        this.clearFilter();
        this.clearData();

        // Retrieve products from backend, order them by expiration_date by default
        this.productService.getProducts().subscribe(products => {
            this.products = products;
            this.sort(3);
        });

        // Retrieve dropdown box hints
        this.productService.getDatalist("description").subscribe(options => this.datalistDescriptionOptions = options);
        this.productService.getDatalist("location").subscribe(options => this.datalistLocationOptions = options);
        this.productService.getDatalist("brand").subscribe(options => this.datalistBrandOptions = options);
        // this.productService.getCodes().subscribe(codes => this.codes = codes);

        // Set product expiration threshold date
        this.expirationThresholdDate = this.getCurrentDate(7);
    }


    /* ==== UTILS =========================================================== */
    /** Returns the current date in form "yyyy-mm-dd".
     *  @param {number} daysToAdd number of days to be added to the date.
     *  @returns {string} string representing the date. */
    getCurrentDate(daysToAdd: number = 0): string {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + daysToAdd);

        const month = dateObj.getUTCMonth() + 1;
        const day = dateObj.getUTCDate();

        return `${dateObj.getUTCFullYear()}-${month > 9 ? '' : 0}${month}-${day > 9 ? '' : 0}${day}`;
    }

    /** Resets all instance data variables (products and textbox hints). */
    clearData = () => {
        this.products = [];
        this.datalistDescriptionOptions = [];
        this.datalistLocationOptions = [];
        this.datalistBrandOptions = [];
        // this.codes = {};
    }

    /** Retrieves the position of the given product._id in the products array.
     *  @param  {string} _id Id of the product. 
     *  @returns {number} Product index. */
    getProductIndexFromId(_id: string): number {
        for (let i = 0; i < this.products.length; i++)
            if (this.products[i]._id === _id) return i;
        return -1;
    }

    /** Updates the product with the input id, refreshing database and frontend.
     *  @param {Product} product The updated product data. */
    async updateProduct({ _id, description, brand, location, expiration_date, insertion_date, units, optional, cal, wgt, check }: Product): Promise<any> {
        return this.handleErrorDialogue(async () => {
            // Validate input parameters
            if (!_id)
                throw new Error(`Product _id is not defined (${_id})`);
            if (!expiration_date || !insertion_date || !description || !location)
                throw new Error(`One of expiration_date, insertion_date, description, location is not defined`)

            // Store input values as lowerCase (brand is not mandatory)
            description = description.toLowerCase();
            location = location.toLowerCase();
            brand = brand ? brand.toLowerCase() : undefined;

            // Send updated product to the backend
            const product = { _id, description, brand, location, expiration_date, insertion_date, units, optional, cal, wgt, check };
            await this.productService.updateProduct(product).toPromise()
                .then(_response => {
                    console.log(`Product updated, response from backend: ${JSON.stringify(_response)}`);

                    // Retrieve product position in list
                    const index = this.getProductIndexFromId(_id);

                    // If units is 0, remove product from array; else, update it
                    if (units < 1) {
                        this.products.splice(index, 1);
                    } else {
                        this.products[index] = product;
                    }
                });

            // Return true to indicate successful update
            return true;
        });
    }

    async handleErrorDialogue(cb: Function): Promise<void> {
        try {
            return await cb();
        } catch (e) {
            // If an error occurs , warn the user.
            // This will also avoid updating the frontend.
            console.error("error:\n", e);
            this.dialog.open(ErrorDialogComponent);
        }
    }


    /* ==== UPDATE PRODUCTS CALLBACKS ======================================= */
    /** Callback of the orange trash can. Resets sortings. */
    clearSort() {
        this.sortInfo = [0, 0, 0, 0, 0, 0, 0];
        this.sortBy = [];
    }
    /** Callback of the red trash can. Resets filters. */
    clearFilter() {
        this.filters = {};
    }

    /** Callback of the add-product dropdown menu. When the "Add Product" button
     *  is clicked, pushes the new product to backend and to displayed list.
     *  @param {Product} product The new product data. */
    addProduct(product: Product) {
        this.handleErrorDialogue(async () => {
            await this.productService
                // Send product to backend, retrieving generated _id.
                .addProduct(product)
                // Add new data to instance array (triggering frontend update).
                .toPromise()
                .then(newProduct => this.products.push(newProduct));
        });

    }

    /** Callback triggered when clicking on the green cart button for a product.
     *  Adds a unit to the product, updating both database and frontend.
     *  @param {Product} product The product that will be updated. */
    addUnit(product: Product) {
        this.updateProduct({ ...product, units: product.units + 1 });
    }

    /** Callback triggered when clicking on the red cart button for a product.
     *  Removes a unit from the product, updating both database and frontend.
     *  If product reaches 0 units, a dialogue is displayed for the user to
     *  confirm the product deletion.
     *  @param {Product} product The product that will be updated. */
    removeUnit(product: Product): void {

        // If there is only one unit, open dialogue before removing the product.
        if (product.units == 1) {
            this.dialog
                .open(ConfirmRemoveDialogComponent)
                .afterClosed()
                .subscribe(confimed => {
                    // If user clicks "confirm", go ahead and delete it.
                    if (confimed) {
                        this.updateProduct({ ...product, units: product.units - 1 });
                    }
                });
        }

        // If not, directly update product info.
        else {
            this.updateProduct({ ...product, units: product.units - 1 });
        }
    }

    /** Callback triggered when clicking on the checkbox for a product.
     *  It checks or unchecks the box, saving its state on the backend.
     *  @param {Product} product The product that will be updated. */
    async checkUnit(product: Product): Promise<void> {
        // Product.check has the value of the checkbox before being clicked
        const previous = product.check;

        // Set product value to the frontend value (frontend changes on click
        // even if product.check hasn't changed)
        product.check = !product.check;

        // Update database
        const updated = await this.updateProduct(product);

        // If there was an error during update, revert product.check state.
        // This will trigger the frontend update and display the previous value.
        if(!updated) {
            product.check = previous;
        }
    }

    /** Callback invoked when the product is clicked.
     *  Opens the produt update form.
     *  @param {Product} product The product that will be updated. */
    openUpdateDialog(product: Product): void {
        this.dialog.open(UpdateProductDialogComponent, {
            data: {
                product: { ...product },
                datalistLocationOptions: this.datalistLocationOptions,
                datalistBrandOptions: this.datalistBrandOptions
            }
        })
            .afterClosed()
            .subscribe(data => {
                if (data) {
                    this.updateProduct(data.product);
                }
            });
    }


    /* ==== SORTINGS & FILTERS CALLBACKS ==================================== */
    /** Updates sortInfo and sortBy directly from the html input, then sorts the products list
     *  @param value */
    sort(value: number): void {
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

    /** Given the index of the property, retrieves the state of the sort, and
     *  creates the corresponding string for the sortBy.
     *  @param index 
     *  @returns {string} */
    getPropertyNameFromSortInfoIndex(index: number): string {
        const sortValue_toAdd = this.sortInfo[index]; // console.log(this.sortInfo, sortValue_toAdd, result) => [ 0, 0, 0, 0, 1 ] 4 units
        return sortValue_toAdd ? (sortValue_toAdd < 0 ? '-' : '') + ProductsListComponent.sortProperties[index] : "";
    }

    /** Adds a property value to the filters array.
     *  @param {prop: string, value: string | number} */
    updateFilter({ prop, value }: { prop: string, value: string | number | boolean }) {
        this.filters[prop] = value;
    }

    /** Filters products checking the filters list (used in html)
     *  @param product 
     *  @returns {boolean} */
    filter(product: any): boolean {
        // ! Crashes with non keyof Product properties in filters
        // For every property in the filter
        for (const key of Object.keys(this.filters)) {
            const filter = this.filters[key];
            if (filter !== undefined && filter !== null) {
                if (filter === false && product[key])
                    return false;

                // Compare the corrispective value in the product
                // If one doesn't match, returns false (don't display product)
                if (!product[key]?.toString().toLowerCase().includes(filter.toString().toLowerCase()))
                    return false;
            }
        }

        // If it never breaks, returns true (display product)
        return true;
    }

    /** Checks if the product is about to expire or not (used in html).
     *  @param expiration_date 
     *  @returns {boolean} */
    checkDate(expiration_date: string): boolean {
        return this.expirationThresholdDate > expiration_date;
    }
}