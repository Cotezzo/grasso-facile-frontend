import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/Product';

@Component({
  selector: 'app-confirm-remove-dialog',
  templateUrl: './confirm-remove-dialog.component.html',
  styleUrls: ['./confirm-remove-dialog.component.css']
})
export class ConfirmRemoveDialogComponent implements OnInit {
    public product: Product;
    public delta: number;

    constructor(@Inject(MAT_DIALOG_DATA) public data: { product: Product, delta: number }) {
        this.product = data.product;
        this.delta = data.delta;
    }

    ngOnInit(): void { }
}
