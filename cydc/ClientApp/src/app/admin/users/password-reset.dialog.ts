import { UntypedFormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminUserDto } from './admin-user-dtos';

@Component({
  selector: 'app-password-reset-dialog',
  templateUrl: `password-reset.dialog.html`,
  styles: [``]
})
export class PasswordResetDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PasswordResetDialog, string>,
    @Inject(MAT_DIALOG_DATA)public user: AdminUserDto) {}

  hide = false;
  password = new UntypedFormControl(generatePassword());
  confirmPassword = new UntypedFormControl("", c => {
    if (c.value != this.password.value) {
      return {
        "ConfirmPasswordNeedMatch": true
      };
    }
    return null;
  });

  ngOnInit(): void { }

  confirm() {
    this.dialogRef.close(this.password.value);
  }

  generateRandom() {
    this.password.setValue(generatePassword());
    this.confirmPassword = this.password;
  }

  static getPassword(dialogService: MatDialog, user: AdminUserDto) {
    return dialogService.open<PasswordResetDialog, AdminUserDto, string>(PasswordResetDialog, {
        data: user, width: "400px",
      })
      .afterClosed()
      .toPromise();
  }
}

function generatePassword() {
  const length = 32;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`!@#$%^&*()-=_+[]{};':\",./<>?~";
  let retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
