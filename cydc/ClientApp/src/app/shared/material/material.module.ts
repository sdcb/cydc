import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

const materialModules = [
  MatDialogModule,
  MatButtonModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
  MatCardModule,
  NgbModule, 
];

@NgModule({
  imports: materialModules,
  exports: materialModules, 
})
export class MaterialModule {
}
