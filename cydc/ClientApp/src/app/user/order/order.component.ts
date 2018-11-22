import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

declare var $: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  siteNotification: string | null = null;
  menus: Menu[] = [];
  addresses: Address[] = [];
  tastes: Taste[] = [];

  selected = {
    menu: <Menu | null>null,
    address: <Address | null>null,
    taste: <Taste | null>null,
    comment: <string | null>null,
    isMe: true,
    otherPersonName: <string | null>null, 
  };

  @ViewChild("confirmDialog")
  confirmDialog!: ElementRef;

  constructor(
    private http: HttpClient,
    private userService: UserService) { }

  ngOnInit() {
    this.http.get("/foodOrder/siteNotification", { responseType: "text" }).subscribe(v => this.siteNotification = v);
    this.http.get<Menu[]>("/info/menu").subscribe(v => {
      this.menus = v;
      this.selected.menu = v[0];
    });
    this.http.get<Address[]>("/info/address").subscribe(v => {
      this.addresses = v;
      this.selected.address = v[0];
    });
    this.http.get<Taste[]>("/info/taste").subscribe(v => {
      this.tastes = v;
      this.selected.taste = v[0];
    });
  }

  submit() {
    console.log("submit: ", this.selected);
    $(this.confirmDialog.nativeElement).modal("show");
  }

  confirm() {
    console.log("confirm: ", this.selected);
  }
}

type Menu = {
  id: number;
  title: string;
  price: string;
  details: string;
}

type Address = {
  id: number;
  name: string;
}

type Taste = {
  id: number;
  name: string;
}
