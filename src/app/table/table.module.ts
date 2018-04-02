import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { VoterDialog } from './voterDialog/voter.component';
import { DialogModule } from 'primeng/dialog';
import { StationSelectComponent } from './stationSelect/stationSelect.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';


@NgModule({
    declarations: [
      TableComponent,
      VoterDialog,
      StationSelectComponent
    ],
    imports: [
      TableModule,
      CommonModule,
      ButtonModule,
      DialogModule,
      DropdownModule,
      FormsModule,
      BrowserModule,
      InputTextModule,
      ContextMenuModule,
      MultiSelectModule,
      SliderModule,
      SpinnerModule,
      ScrollPanelModule,
    ],
    exports: [
      TableComponent,
    ]
  })
  export class MainTableModule {
  
  }