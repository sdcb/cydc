import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { FoodOrderApiService, FoodTaste, OrderAddress, OrderCreateDto, FoodOrderMenu } from '../food-order-api.service';

@Component({
  selector: 'app-order-create-dialog',
  templateUrl: './create-dialog.html',
  styleUrls: []
})
export class OrderCreateDialog implements OnInit {
  addresses: OrderAddress[] = [];
  tastes: FoodTaste[] = [];
  selected: FoodOrderSelectedDto;

  constructor(
    public dialogRef: MatDialogRef<OrderCreateDialog, OrderCreateDto>,
    public userService: UserService, 
    private api: FoodOrderApiService, 
    @Inject(MAT_DIALOG_DATA) menu: FoodOrderMenu) {
    this.selected = new FoodOrderSelectedDto(menu);
  }

  ngOnInit() {
    this.api.getAllAddress().subscribe(v => {
      this.addresses = v;
      this.selected.address = v[0];
    });
    this.api.getAllTaste().subscribe(v => {
      this.tastes = v;
      this.selected.taste = v[0];
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    if (!this.selected.validate()) return;
    this.dialogRef.close(this.selected.toCreateDto());
  }
}

export class FoodOrderSelectedDto {
  address: OrderAddress | undefined;
  taste: FoodTaste | undefined;
  comment: string | undefined;
  isMe: boolean = true;
  otherPersonName: string | undefined;

  constructor(public menu: FoodOrderMenu) {
  }

  validate() {
    if (this.address === undefined) return false;
    if (this.taste === undefined) return false;
    if (!this.isMe && this.otherPersonName === undefined) return false;
    return true;
  }

  toCreateDto(): OrderCreateDto {
    return {
      addressId: this.address!.id,
      tasteId: this.taste!.id,
      menuId: this.menu.id,
      comment: this.comment,
      isMe: this.isMe,
      otherPersonName: this.otherPersonName
    };
  }
}
