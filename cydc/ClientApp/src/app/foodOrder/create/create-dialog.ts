import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FoodOrderMenu } from './create.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order-create-dialog',
  templateUrl: './create-dialog.html',
  styleUrls: []
})
export class OrderCreateDialog implements OnInit {
  addresses: Address[] = [];
  tastes: Taste[] = [];
  selected: FoodOrderSelectedDto;

  constructor(
    public dialogRef: MatDialogRef<OrderCreateDialog, OrderCreateDto>,
    public userService: UserService, 
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) menu: FoodOrderMenu) {
    this.selected = new FoodOrderSelectedDto(menu);
  }

  ngOnInit() {
    this.http.get<Address[]>("/api/info/address").subscribe(v => {
      this.addresses = v;
      this.selected.address = v[0];
    });
    this.http.get<Taste[]>("/api/info/taste").subscribe(v => {
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

type Address = {
  id: number;
  name: string;
}

type Taste = {
  id: number;
  name: string;
}

export class FoodOrderSelectedDto {
  address: Address | undefined;
  taste: Taste | undefined;
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

export type OrderCreateDto = {
  addressId: number;
  tasteId: number;
  menuId: number;
  isMe: boolean;
  otherPersonName: string | undefined;
  comment: string | undefined;
}
