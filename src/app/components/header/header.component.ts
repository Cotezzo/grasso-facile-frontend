import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  options: Intl.DateTimeFormatOptions = {year: "numeric", month: "numeric", day: 'numeric'};

  subtitle: string = `Elenco dei prodotti in scadenza - ${new Date().toLocaleDateString("uk-UK")}`;
  showAddProduct: boolean = false;
  subscription: Subscription;

  constructor(private uiService: UiService, private productService: ProductService) {
    this.subscription = this.uiService.onToggle().subscribe(value => this.showAddProduct = value);
  }

  ngOnInit(): void {}  // Run when the component loads

  toggleAddProduct(): void{   // Triggered by the btnClick event (emitted by button.component.ts)
    this.uiService.toggleAddProduct();
  }


  usingGrassoFacile: number = 0;
  title: string = HeaderComponent.titles[this.usingGrassoFacile];
  src: string = HeaderComponent.logoPaths[this.usingGrassoFacile];

  private static dbNames: string[] = ["grasso-facile", "grasso-difficile"];
  private static titles: string[] = ["Grasso Facile", "Grasso Difficile"];
  private static logoPaths: string[] = ["/TogoColBurro.png", "/BarreCoiPomodori.png"];
  // private static logoPaths: string[] = ["https://media.discordapp.net/attachments/860584859802140672/872509751915855892/TogoColBurro.png", "https://cdn.discordapp.com/attachments/408649609766764544/873961908435312750/TogoColBurro.png"];
  onClick = () => {
    this.usingGrassoFacile = this.usingGrassoFacile ? 0 : 1;
    this.productService.useDb(HeaderComponent.dbNames[this.usingGrassoFacile]);
    this.title = HeaderComponent.titles[this.usingGrassoFacile];
    this.src = HeaderComponent.logoPaths[this.usingGrassoFacile];
  }
}