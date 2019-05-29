import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FoodOrderDto } from './admin-user-dtos';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-batch-pay-dialog',
  templateUrl: 'batch-pay.dialog.html'
})

export class BatchPayDialog implements OnInit, BatchPayDialogData {
  userId: string;
  userName: string;
  unpayedOrders: BatchPayOrderItem[];
  payedAmount = 0;
  columns = ['selected', 'name', 'time', 'price'];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BatchPayDialogData,
    private dialogRef: MatDialogRef<BatchPayDialogData, boolean>,
    private loading: GlobalLoadingService,
    private api: AdminApiService) {
    this.userId = data.userId;
    this.userName = data.userName;
    this.unpayedOrders = data.unpayedOrders.map(x => {
      return {
        ...x,
        selected: true,
      };
    });
    this.payedAmount = this.unpayedOrders.reduce((a, b) => a + b.price, 0);
  }

  static show(dialogService: MatDialog, data: BatchPayDialogData) {
    const dialog = dialogService.open<BatchPayDialog, BatchPayDialogData, boolean>(BatchPayDialog, {
      data: data,
      width: '800px'
    });
    return dialog.afterClosed().toPromise();
  }

  async ngOnInit() {}

  toggleSelectAll(selected: boolean) {
    console.log(arguments);
    for (const item of this.unpayedOrders) { item.selected = selected; }
  }

  cancel() { this.dialogRef.close(); }

  allItemSelected() { return this.unpayedOrders.every(x => !!x.selected); }

  selectedAmount() { return this.unpayedOrders.filter(x => x.selected).reduce((a, b) => a + b.price, 0); }

  selectedCount() { return this.unpayedOrders.filter(x => x.selected).length; }

  selectedOrderIds() { return this.unpayedOrders.filter(x => x.selected).map(x => x.id); }

  async confirm() {
    await this.loading.wrap(this.api.batchPay(this.userId, this.selectedOrderIds(), this.payedAmount).toPromise());
    this.dialogRef.close(true);
  }
}

export interface BatchPayDialogData {
  userId: string;
  userName: string;
  unpayedOrders: FoodOrderDto[];
}

interface BatchPayOrderItem extends FoodOrderDto {
  selected: boolean;
}
