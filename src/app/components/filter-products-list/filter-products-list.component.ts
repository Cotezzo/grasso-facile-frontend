import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';  // Icone fighe
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-filter-products-list',
  templateUrl: './filter-products-list.component.html',
  styleUrls: ['./filter-products-list.component.css']
})
export class FilterProductsListComponent implements OnInit {
  @Output() onFilter = new EventEmitter<{prop: string, value: string}>();
  @Output() onClearFilter = new EventEmitter();

  description: string | undefined;
  brand: string | undefined;
  expiration_date: string | undefined;
  insertion_date: string | undefined;
  location: string | undefined;
  optional: string | undefined;
  
  bin = faTrash;

  constructor(private productService: ProductService) {
    this.productService.onUseDb().subscribe(_ => this.clearFilters());
  }

  ngOnInit(): void {}

  onInput = (prop: string, value: string) => this.onFilter.emit({ prop, value })
  
  onClick = () => {
    this.onClearFilter.emit()
    this.clearFilters();
  }

  clearFilters = () => {
    this.description = undefined;
    this.brand = undefined;
    this.expiration_date = undefined;
    this.insertion_date = undefined;
    this.location = undefined;
    this.optional = undefined;
  }
}
