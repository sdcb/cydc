import { Component, OnInit } from '@angular/core';
import { LocationManageDto, DataManagesApiService } from '../data-manages-api.service';

@Component({
  selector: 'app-location',
  templateUrl: './locations.component.html',
  styles: []
})
export class LocationsComponent implements OnInit {
  allLocation!: LocationManageDto[];
  displayedColumns = ["id", "location", "foodOrderCount", "status", "action"]
  constructor(private api: DataManagesApiService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getAllLocation().subscribe(x => this.allLocation = x);
  }

  delete(item: LocationManageDto) {
    if (!confirm(`确定要删除${item.location}吗？`)) return;
    this.api.deleteLocation(item.id).subscribe(() => this.loadData());
  }
}
