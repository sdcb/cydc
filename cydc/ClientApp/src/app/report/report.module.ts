import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { MaterialModule } from '../shared/material/material.module';
import { BaseChartDirective } from './base-chart.directive';

@NgModule({
  declarations: [
    ReportComponent,
    BaseChartDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: ReportComponent }
    ])
  ]
})
export class ReportModule { }
