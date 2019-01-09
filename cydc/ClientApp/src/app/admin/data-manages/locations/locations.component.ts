import { Component, OnInit } from '@angular/core';
import { LocationManageDto, DataManagesApiService } from '../data-manages-api.service';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';

@Component({
  selector: 'app-location',
  templateUrl: './locations.component.html',
  styles: []
})
export class LocationsComponent implements OnInit {
  allLocation!: LocationManageDto[];
  displayedColumns = ["id", "location", "foodOrderCount", "status", "action"]
  constructor(
    private api: DataManagesApiService, 
    private loading: GlobalLoadingService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getAllLocation().subscribe(x => this.allLocation = x);
  }

  async toggleEnabled(item: LocationManageDto) {
    await this.loading.wrap(this.api.toggleLocationEnabled(item.id).toPromise());
    this.loadData();
  }

  async applyLocation(item: LocationManageDto, name: string) {
    await this.loading.wrap(this.api.saveLocationName(item.id, name).toPromise());
    this.loadData();
  }

  delete(item: LocationManageDto) {
    if (!confirm(`确定要删除${item.location}吗？`)) return;
    this.api.deleteLocation(item.id).subscribe(() => this.loadData());
  }
}
