import { Component, OnInit } from '@angular/core';
import { LocationDto, FoodOrderApiService } from 'src/app/foodOrder/food-order-api.service';

@Component({
  selector: 'app-location',
  templateUrl: './locations.component.html',
  styles: []
})
export class LocationsComponent implements OnInit {
  allLocation!: LocationDto[];
  displayedColumns = ["id", "location", "action"]
  constructor(private foodOrderApi: FoodOrderApiService) { }

  ngOnInit() {
    this.foodOrderApi.getAllLocation().subscribe(x => this.allLocation = x);
  }
}
