import { ConfirmDialog } from './../../../shared/dialogs/confirm/confirm.dialog';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataManagesApiService, TasteManageDto } from '../data-manages-api.service';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { PromptDialog } from 'src/app/shared/dialogs/prompt/prompt.dialog';

@Component({
  selector: 'app-tastes',
  templateUrl: './tastes.component.html',
  styleUrls: ['./tastes.component.css'],
})
export class TastesComponent implements OnInit {
  dataSource = new MatTableDataSource<TasteManageDto>();
  displayedColumns = ["id", "name", "foodOrderCount", "enabled", "action"];
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
    this.dataSource.data = await this.loading.wrap(this.api.getAllTaste().toPromise());
  }

  async toggleEnabled(item: TasteManageDto) {
    await this.loading.wrap(this.api.toggleTasteEnabled(item.id).toPromise());
    this.loadData();
  }

  async applyName(item: TasteManageDto, name: string) {
    await this.loading.wrap(this.api.saveTasteName(item.id, name).toPromise());
    this.loadData();
  }

  async delete(item: TasteManageDto) {
    if (!await ConfirmDialog.show(this.dialogService, `确定要删除${item.name}吗？`)) return;
    await this.loading.wrap(this.api.deleteTaste(item.id).toPromise());
    this.loadData();
  }

  async showAddDialog() {
    let name: string | undefined = await PromptDialog.show(this.dialogService, "请输入口味:");
    if (name === undefined) return;
    await this.loading.wrap(this.api.createTaste(name).toPromise());
    this.loadData();
  }
}
