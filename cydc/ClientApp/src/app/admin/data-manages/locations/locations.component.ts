import { ConfirmDialog } from './../../../shared/dialogs/confirm/confirm.dialog';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationManageDto, DataManagesApiService } from '../data-manages-api.service';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { PromptDialog } from 'src/app/shared/dialogs/prompt/prompt.dialog';

@Component({
  selector: 'app-location',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  dataSource = new MatTableDataSource<LocationManageDto>();
  displayedColumns = ["id", "location", "foodOrderCount", "enabled", "action"];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: DataManagesApiService,
    private loading: GlobalLoadingService,
    private dialogService: MatDialog) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.loadData();
  }

  async loadData() {
    this.dataSource.data = await this.loading.wrap(this.api.getAllLocation().toPromise());
  }

  async toggleEnabled(item: LocationManageDto) {
    await this.loading.wrap(this.api.toggleLocationEnabled(item.id).toPromise());
    this.loadData();
  }

  async applyLocation(item: LocationManageDto, name: string) {
    await this.loading.wrap(this.api.saveLocationName(item.id, name).toPromise());
    this.loadData();
  }

  async delete(item: LocationManageDto) {
    if (!await ConfirmDialog.show(this.dialogService, `确定要删除${item.location}吗？`)) return;
    await this.loading.wrap(this.api.deleteLocation(item.id).toPromise());
    this.loadData();
  }

  async showAddDialog() {
    let name: string | undefined = await PromptDialog.show(this.dialogService, "请输入送餐地点:");
    if (name === undefined) return;
    await this.loading.wrap(this.api.createLocation(name).toPromise());
    this.loadData();
  }
}
