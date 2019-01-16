import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FoodOrderDto } from './admin-user-dtos';

@Component({
  selector: 'app-batch-pay-dialog',
  templateUrl: 'batch-pay.dialog.html'
})

export class BatchPayDialog implements OnInit, BatchPayDialogData {
  userName: string;
  unpayedOrders: BatchPayOrderItem[];
  payedAmount = 0;
  columns = ['selected', 'name', 'time', 'price'];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BatchPayDialogData,
    private dialogRef: MatDialogRef<BatchPayDialogData, boolean>) {
    this.userName = data.userName;
    this.unpayedOrders = data.unpayedOrders.map(x => {
      return {
        ...x, 
        selected: true, 
      }
    });
    this.payedAmount = this.unpayedOrders.reduce((a, b) => a + b.price, 0);
  }

  ngOnInit() { }

  allItemSelected() {
    return this.unpayedOrders.every(x => !!x.selected);
  }

  toggleSelectAll(selected: boolean) {
    console.log(arguments);
    for (const item of this.unpayedOrders) item.selected = selected;
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close(true);
  }

  selectedAmount() {
    return this.unpayedOrders.filter(x => x.selected).reduce((a, b) => a + b.price, 0);
  }

  selectedCount() {
    return this.unpayedOrders.filter(x => x.selected).length;
  }

  static show(dialogService: MatDialog, data: BatchPayDialogData) {
    const dialog = dialogService.open<BatchPayDialog, BatchPayDialogData>(BatchPayDialog, {
      data: data,
      width: "800px"
    });
    return dialog.afterClosed().toPromise();
  }
}

export interface BatchPayDialogData {
  userName: string;
  unpayedOrders: FoodOrderDto[];
}

interface BatchPayOrderItem extends FoodOrderDto {
  selected: boolean;
}