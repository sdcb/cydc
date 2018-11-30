import { NgModule } from '@angular/core';
import { NgbTooltipModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';

const materialModules = [
  NgbTooltipModule,
  NgbAlertModule, 
  MatDialogModule,
  MatButtonModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
  MatCardModule,
  MatInputModule,
  MatRadioModule,
  MatPaginatorModule, 
];

@NgModule({
  imports: materialModules,
  exports: materialModules, 
})
export class MaterialModule {
}
