import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { VoterDialog } from './voterDialog/voter.component';
import { AssignDialog } from './assignDialog/assign.component';
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
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import {ListboxModule} from 'primeng/listbox';

@NgModule({
    declarations: [
      TableComponent,
      VoterDialog,
      StationSelectComponent,
      AssignDialog
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
      TooltipModule,
      CheckboxModule,
      ListboxModule,
    ],
    exports: [
      TableComponent,
    ]
  })
  export class MainTableModule {
  
  }