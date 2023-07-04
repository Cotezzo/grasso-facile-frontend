import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datalist-option',
  templateUrl: './datalist-option.component.html',
  styleUrls: ['./datalist-option.component.css']
})
export class DatalistOptionComponent implements OnInit {
  @Input() option: string = "";
  constructor() { }

  ngOnInit(): void {}
}
