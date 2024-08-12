import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: 'confirm.dialog.html'
})

export class ConfirmDialog implements OnInit {
    inputText: string = "";

    constructor(
      @Inject(MAT_DIALOG_DATA) public confirmText: string,
      private dialogRef: MatDialogRef<string, boolean>) { }

    ngOnInit() { }

    confirm() {
      this.dialogRef.close(true);
    }

    cancel() {
      this.dialogRef.close(false);
    }

    static show(dialogService: MatDialog, confirmText: string) {
      const dialog = dialogService.open<ConfirmDialog, string, boolean>(ConfirmDialog, {
        data: confirmText,
        width: "400px",
      });
      return dialog.afterClosed().toPromise();
    }
}
