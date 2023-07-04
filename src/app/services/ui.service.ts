import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private showAddProduct: boolean = false;
  private subject = new Subject<any>();

  constructor() { }

  // Open/Close add product form handler
  toggleAddProduct(): void {
    this.showAddProduct = !this.showAddProduct; // On toggle, inverts the state
    this.subject.next(this.showAddProduct);     // Passes the state at the object (??)
  }

  onToggle(): Observable<any> {
    return this.subject.asObservable();         // Honestly, idk
  }
}