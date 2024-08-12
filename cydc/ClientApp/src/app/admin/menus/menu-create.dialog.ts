import { Component, OnInit } from '@angular/core';
import { MenuCreateDto } from './admin-menu-dtos';
import { MatLegacyDialogRef as MatDialogRef, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.dialog.html',
  styleUrls: ['./menu-create.dialog.css']
})
export class MenuCreateDialog implements OnInit {
  createDto = new MenuCreateDto();

  constructor(
    public dialogRef: MatDialogRef<MenuCreateDialog, MenuCreateDto>
  ) { }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(this.createDto);
  }

  static getCreateDto(dialogService: MatDialog) {
    return dialogService.open<MenuCreateDialog, void, MenuCreateDto>(MenuCreateDialog).afterClosed().toPromise();
  }
}