import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, Subject } from 'rxjs';
import { Product } from '../Product';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.beUrl;
  private toUseUrl = this.apiUrl + "grasso-facile/";
  private subject = new Subject<any>();
  
  useDb = (dbName: string) => {
    this.toUseUrl = this.apiUrl + dbName + "/";
    this.subject.next("test");
  }
  
  onUseDb(): Observable<any> {
    return this.subject.asObservable();         // Honestly, idk
  }


  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.toUseUrl+"products/");
  }

  getDatalist(datalist: string): Observable<string[]>{
    return this.http.get<string[]>(this.toUseUrl+"datalists/"+datalist);
  }

  getCodes(): Observable<any> {
    return this.http.get<any>(this.toUseUrl+"codes/");
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.toUseUrl+"products/"+"add", { product }, httpOptions);
  }

  updateProduct = ({ _id, description, brand, location, expiration_date, insertion_date, units, optional, cal, wgt, check }: Product): Observable<Product> => { // Observable<Product>
    return this.http.post<Product>(this.toUseUrl+"products/update/"+_id, { description, brand, location, expiration_date, insertion_date, units, optional, cal, wgt, check }, httpOptions);
  }

  addOption(datalist: string, option: string): Observable<string[]> {
    return this.http.post<string[]>(this.toUseUrl+"datalists/"+datalist, { option });
  }

  /*
  addCode(code: string, description: string){
    return this.http.post<any>(this.toUseUrl+"codes/add", { code, description });
  }
  */
}