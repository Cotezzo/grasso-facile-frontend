import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-products-list',
  templateUrl: './order-products-list.component.html',
  styleUrls: ['./order-products-list.component.css']
})
export class OrderProductsListComponent implements OnInit {
  @Input() sortInfo: number[] = [];  // Initialize string

  @Output() onSort = new EventEmitter();
  @Output() onClearSort = new EventEmitter();

  bin = faTrash;
  
  constructor() {}

  ngOnInit(): void {}

  onSortClick = (index: number) : void => this.onSort.emit(index)
  onClearClick = () : void => this.onClearSort.emit()
}
