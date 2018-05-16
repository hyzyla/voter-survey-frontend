import { Component, OnInit, NgModule, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { User, Constituency } from '../_models/index';
import { StatusesModule } from '../statusesManager/statusesManager.component';
import { TerritoryModule } from '../territoriesManager/territoriesManager.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TerritoryService } from '../_services';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit {
  @Input() user: any; 
  displayStatusManager: boolean = false;
  displayTerritoryManager: boolean = false;
  selectedConstrituency: Constituency;
  constituencies: Constituency[];
  @Output() constituencyChanged = new EventEmitter();
  @Output() statusChanged = new EventEmitter();
  @Output() voterAddded = new EventEmitter();

  constructor(private territoryService: TerritoryService) {}

  ngOnInit() {
    this.territoryService.constituency.getAll()
      .subscribe((constituencies: Constituency[]) => {
        constituencies = constituencies.map(c => new Constituency(c));
        constituencies.unshift(new Constituency({name: "Всі округи"}))
        this.constituencies = constituencies;
        if (constituencies.length > 0){
          this.onSelectConsituency(constituencies[0])
        } 
      })
  }

  updateConstituencies() {
    this.territoryService.constituency.getAll()
      .subscribe((constituencies: Constituency[]) => {
        this.constituencies = constituencies.map(c => new Constituency(c));
        this.constituencies.unshift(new Constituency({name: "Всі округи"}))
      })
  }

  onSelectConsituency(constituency: Constituency) {
    this.selectedConstrituency = constituency;
    this.constituencyChanged.emit(this.selectedConstrituency);
  }

  onStatusesChanged() {
    this.statusChanged.emit(this.selectedConstrituency);
  }

  Constituency

  displayAdminPanel() {
    window.open(`${environment.urlApi}/admin/`, "blank")
    return false;
  }

  reloadApp() {
    location.reload(true);
  }
}

@NgModule({
  declarations: [
    HeaderComponent,
  ],
  imports: [
    StatusesModule,
    TerritoryModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    MatOptionModule,
    MatToolbarModule,
    CommonModule,
    MatIconModule,
  ],
  exports: [
    HeaderComponent,
  ]
})
export class MainHeaderModule {
}
