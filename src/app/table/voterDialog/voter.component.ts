import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Voter, Status } from '../../_models/index';
import { StatusService } from '../../_services/status.service';
import { TerritoryService, VoterService } from '../../_services';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'voter-dialog',
  templateUrl: './voter.component.html',
  styleUrls: ['./voter.component.css'],
})
export class VoterDialog {
  
  _display: boolean;
  statuses: Status[] = [];

  @Output() displayChange = new EventEmitter();
  @Input() get display() { return this._display; }

  @Output() onFormSubmit = new EventEmitter();
  @Input() voter;

  constructor(private territoryService: TerritoryService,
              private statusService: StatusService,
              private voterService: VoterService) { }

  set display(value: boolean) {
    this._display = value;
    this.displayChange.emit(value);
  }

  onSubmit() {
    let value;
    let record = {};
    for (let key in this.voter) {
      value = this.voter[key];
      if (!value) continue;
      record[key] = value.value === undefined ? value : value.value;
    }
    this.onFormSubmit.emit(record);
    this.display = false;
  }

  onHide(stationSelect) {
    this.voter = undefined;
    this.statuses = undefined;
    stationSelect.clear();
  }

  loadAttributes(station) {
    this.statuses = [];
    if (!station) return;
    
    let s1$ = this.statusService.getStatic()
    let s2$ = this.territoryService.station.getStatuses(station)

    Observable.forkJoin(s1$, s2$)
      .map(([s1, s2]) => [...s1, ...s2])
      .subscribe(statuses => this.statuses = statuses);

    this.voter.station = station;
  }

}