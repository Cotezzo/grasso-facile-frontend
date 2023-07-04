import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../Product';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @Output() onAddProduct: EventEmitter<Product> = new EventEmitter();

  @Input() datalistDescriptionOptions: string[] = [];                                                        // Hint values in input textboxes
  @Input() datalistLocationOptions: string[] = [];
  @Input() datalistBrandOptions: string[] = [];
  // @Input() codes: any = {};

  description: string | undefined;                                                                  // Inputs
  brand: string | undefined;
  optional: string | undefined;
  expiration_date: string | undefined;
  location: string | undefined;
  units: number = 1;

  cal: number | undefined;
  wgt: number | undefined;

  showAddProduct: boolean = false;                                                                  // The state of the toggle

  constructor(private uiService: UiService, private productService: ProductService) {
    this.uiService.onToggle().subscribe(value => this.showAddProduct = value);  // Subscribe to the onToggle to toggle the form
    this.productService.onUseDb().subscribe(_ => this.clearInputs());
  }

  ngOnInit(): void {}

  onSubmit() {
    if(!this.description || !this.expiration_date || !this.location || !+this.units || isNaN(this.units)) return alert("Fill all the inputs. ");
    if(this.cal && this.cal <= 0) return alert("Calories must be > 0");
    if(this.wgt && this.wgt <= 0) return alert("Weight must be > 0");

    const description: string = this.description.toLowerCase();
    const brand: string | undefined = this.brand?.toLowerCase();
    const location: string = this.location.toLowerCase();
    const optional: string | undefined = this.optional;

    if(!this.datalistDescriptionOptions.includes(description)) {              // Add new description hint if not present
      this.datalistDescriptionOptions.push(description);
      this.productService.addOption("description", description).subscribe();
    }
    
    if(brand && !this.datalistBrandOptions.includes(brand)) {                 //    ^^             brand                ^^
      this.datalistBrandOptions.push(brand)
      this.productService.addOption("brand", brand).subscribe();
    }

    if(!this.datalistLocationOptions.includes(location)) {                    //    ^^            location              ^^
      this.datalistLocationOptions.push(location)
      this.productService.addOption("location", location).subscribe();
    }

    /*
    if(code && !this.codes.hasOwnProperty(code)){                             //    ^^   code-description association   ^^
      this.codes[code] = description;
      this.productService.addCode(code, description).subscribe();
    }
    */

    var dateObj = new Date();
    var year = dateObj.getUTCFullYear();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    
    const newProduct: Product = {                                             // Create new product to add
      description,
      brand,
      expiration_date: this.expiration_date,
      insertion_date: `${year}-${month>9?'':0}${month}-${day>9?'':0}${day}`,
      location,
      units: +this.units,

      optional,
      cal: this.cal,
      wgt: this.wgt
    }

    this.onAddProduct.emit(newProduct);                                       // Emit event with the new product
    this.clearInputs();
  }

  clearInputs = () => {
    this.description = "";                                                    // Reset input fields
    this.brand = "";
    this.optional = "";
    this.location = "";
    this.expiration_date = "";
    this.units = 1;
    this.cal = undefined;
    this.wgt = undefined;
  }
  
  /*
  checkCode(code: string){
    if(!code) return;
    const description = this.codes[code];                                     // Check if at the code corresponds a description
    if(description) this.description = description;                           // If it does, override the old description
  }
  */
}
