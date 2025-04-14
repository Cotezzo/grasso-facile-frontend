import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, Subject } from 'rxjs';
import { Product } from '../Product';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({ providedIn: 'root' })
export class ProductService {

    /* ==== PROPERTIES ====================================================== */
    private apiUrl = environment.beUrl;
    private toUseUrl = this.apiUrl + "grasso-facile/";
    private subject = new Subject<any>();


    /* ==== CONSTRUCTOR ===================================================== */
    constructor(private http: HttpClient) { /* Empty constructor */ }


    /* ==== DATABASE INITIALIZATION ========================================= */
    /** Sets the Mongo database to be used (there are two databases:
     *  "grasso-facile" and "grasso-difficile") and sets the backend urlpath. */
    useDb(dbName: string): void {
        this.toUseUrl = this.apiUrl + dbName + "/";
        this.subject.next("test");
    }

    /** Honestly, idk */
    onUseDb(): Observable<any> {
        return this.subject.asObservable();
    }


    /* ==== READ ============================================================ */
    /** Retrieves all the products from the backend.
     *  @returns {Observable<Product[]>} Products array. */
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.toUseUrl + "products/");
    }

    /** Retrieves the specified datalists (textbox hints) from the backend.
     *  @param {"description" | "location" | "brand"} datalist Datalist name to be retrieved.
     *  @returns {Observable<string[]>} Textbox hints array. */
    getDatalist(datalist: string): Observable<string[]> {
        return this.http.get<string[]>(this.toUseUrl + "datalists/" + datalist);
    }

    /** Retrieves all the product codes from the backend.
     *  @returns {Observable<string[]>} Codes array.
     *  @deprecated */
    getCodes(): Observable<any> {
        return this.http.get<any>(this.toUseUrl + "codes/");
    }


    /* ==== WRITE =========================================================== */
    /** Sends the provided product data to the backend for storage.
     *  @param {Product} product The new product data.
     *  @returns {Observable<Product>} Added product data. */
    addProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.toUseUrl + "products/" + "add", { product }, httpOptions);
    }
    
    /** Sends the updated product item to the backend for storage.
     *  @param {Product} product The new product data.
     *  @returns {Observable<Product>} Updated product data. */
    updateProduct = ({ _id, description, brand, location, expiration_date, insertion_date, units, optional, cal, wgt, check }: Product): Observable<Product> => { // Observable<Product>
        return this.http.post<Product>(this.toUseUrl + "products/update/" + _id, { description, brand, location, expiration_date, insertion_date, units, optional, cal, wgt, check }, httpOptions);
    }

    /** Sends and item for the specified datalist to the backend for storage.
     *  @param {"description" | "location" | "brand"} datalist Datalist name to be updated.
     *  @param {string} option New datalist hint to be added.
     *  @returns {Observable<string[]>} Updated datalist.
     *  @deprecated Datalist updates moved to product/add backend-side. */
    addOption(datalist: string, option: string): Observable<string[]> {
        return this.http.post<string[]>(this.toUseUrl + "datalists/" + datalist, { option });
    }

    /** Sends a new code to the backend for storage.
     *  @param {string} code Bar code associated to the product description.
     *  @param {string} description Product description.
     *  @deprecated Codes are no longer used (never have been). */
    addCode(code: string, description: string){
      return this.http.post<any>(this.toUseUrl+"codes/add", { code, description });
    }
}