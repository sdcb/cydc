import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { FoodOrderApiService, FoodTaste, OrderAddress, OrderCreateDto, FoodOrderMenu } from '../food-order-api.service';
import { FormControl } from '@angular/forms';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'app-order-create-dialog',
  templateUrl: './create-dialog.html',
  styleUrls: ['./create-dialog.css']
})
export class OrderCreateDialog implements OnInit {
  addresses: OrderAddress[] = [];
  tastes: FoodTaste[] = [];
  personNames: string[] = [];
  selected: FoodOrderSelectedDto;

  constructor(
    public dialogRef: MatDialogRef<OrderCreateDialog, OrderCreateDto>,
    public userService: UserService,
    private api: FoodOrderApiService,
    @Inject(MAT_DIALOG_DATA) menu: FoodOrderMenu) {
    this.selected = new FoodOrderSelectedDto(menu);
  }

  ngOnInit() {
    this.api.getAllAddress().subscribe(async v => {
      this.addresses = v;
      const lastLocationId = await this.api.getMyLastLocationId().toPromise();
      this.selected.address = v.filter(x => x.id === lastLocationId)[0] || v[0];
    });
    this.api.getAllTaste().subscribe(async v => {
      this.tastes = v;
      const lastTasteId = await this.api.getMyLastTasteId().toPromise();
      this.selected.taste = v.filter(x => x.id === lastTasteId)[0] || v[0];
    });
    this.selected.otherPersonName.valueChanges.pipe(debounce(() => timer(500))).subscribe(val => {
      this.api.searchPersonNames(val).subscribe(personNames => {
        this.personNames = personNames;
      });
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
  otherPersonName = new FormControl();

  constructor(public menu: FoodOrderMenu) {
  }

  validate() {
    if (this.address === undefined) return false;
    if (this.taste === undefined) return false;
    if (!this.isMe && !this.otherPersonName.value) return false;
    return true;
  }

  toCreateDto(): OrderCreateDto {
    return {
      addressId: this.address!.id,
      tasteId: this.taste!.id,
      menuId: this.menu.id,
      comment: this.comment,
      isMe: this.isMe,
      otherPersonName: this.otherPersonName.value
    };
  }
}
