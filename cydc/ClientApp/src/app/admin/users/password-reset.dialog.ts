import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-password-reset-dialog',
  templateUrl: `password-reset.dialog.html`,
  styles: [``]
})
export class PasswordResetDialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<PasswordResetDialog, string>) { }

  password = new FormControl("");
  confirmPassword = new FormControl("", c => {
    if (c.value != this.password.value) {
      return {
        "ConfirmPasswordNeedMatch": true
      };
    }
    return null;
  });

  ngOnInit(): void { }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close(this.password.value);
  }

  generateRandom() {
    this.password.setValue(generatePassword());
    this.confirmPassword = this.password;
  }

  static getPassword(dialogService: MatDialog) {
    return dialogService.open<PasswordResetDialog, string, string>(PasswordResetDialog)
      .afterClosed()
      .toPromise();
  }
}

function generatePassword() {
  const length = 8;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`!@#$%^&*()-=_+[]{};':\",./<>?~";
  let retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
