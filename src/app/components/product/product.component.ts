import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faCartPlus, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';  // Icone fighe
import { Product } from '../../Product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  @Input() product: Product = { description: "", expiration_date: "", insertion_date: "", location: "", units: 0, check: false }; // Standard value to avoid '| undefined'                                                                   
  @Input() checkDate: boolean = false;                                                                // Whenever or not to print the highlighted border
  @Input() filter: boolean = true;                                                                    // Whenever or not to print the product

  @Output() onRemoveUnit = new EventEmitter();                                                        // EventEmitter for removing units, used in products-list
  @Output() onAddUnit = new EventEmitter();                                                           // EventEmitter for adding units, used in products-list
  @Output() onOpenDialog = new EventEmitter();
  @Output() onCheckUnit = new EventEmitter();

  cartDown = faCartArrowDown;                                                                         // HTML Icon
  cartPlus = faCartPlus;                                                                              // HTML Icon

  constructor(public dialog: MatDialog) { }
  ngOnInit(): void { }

  onRemove = (product: Product): void => this.onRemoveUnit.emit(product);     // On red cart click, emits 'onRemoveUnit' event
  onAdd = (product: Product): void => this.onAddUnit.emit(product);           // On green cart click, emits 'onAddUnit' event
  onClick = (product: Product): void => this.onOpenDialog.emit(product);      // On product click, emits 'onOpenDialog' event
  onCheck = (product: Product): void => { this.onCheckUnit.emit(product); } // On checkbox click, emits event to products-list-component.html
}