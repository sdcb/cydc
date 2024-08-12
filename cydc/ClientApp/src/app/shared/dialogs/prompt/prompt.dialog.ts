import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
    selector: 'app-prompt-dialog',
    templateUrl: 'prompt.dialog.html'
})

export class PromptDialog implements OnInit {
    inputText: string = "";

    constructor(
      @Inject(MAT_DIALOG_DATA) public promptText: string,
      private dialogRef: MatDialogRef<string, string>) { }

    ngOnInit() { }

    confirm() {
      this.dialogRef.close(this.inputText);
    }

    static show(dialogService: MatDialog, promptText: string) {
      const dialog = dialogService.open<PromptDialog, string, string>(PromptDialog, {
        data: promptText,
        width: "400px",
      });
      return dialog.afterClosed().toPromise();
    }
}
