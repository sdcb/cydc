import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ChartsModule } from 'ng2-charts-x';
import { MaterialModule } from '../shared/material/material.module';

@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: ReportComponent }
    ])
  ]
})
export class ReportModule { }
