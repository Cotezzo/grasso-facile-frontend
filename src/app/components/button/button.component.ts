import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; // Input: <app-button parameters-taken-in-input></app-button>

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() text: string | undefined;
  @Input() color: string | undefined;
  @Output() btnClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  onClick(): void {  // Actiavted on (click) = onAddProduct() in button.component.html
    this.btnClick.emit(); // Personalized function instead of hardcoded one, emits onClick event
  }
}
