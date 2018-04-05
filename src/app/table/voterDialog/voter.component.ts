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
export class VoterDialog implements AfterViewInit {
  
  _display: boolean;
  _voter: any; 
  statuses: Status[] = [];

  @Output() displayChange = new EventEmitter();
  @Output() voterChange = new EventEmitter();
  @Output() onFormSubmit = new EventEmitter();

  @Input() get display() { return this._display; }
  @Input() get voter() { return this._voter; }

  constructor(private territoryService: TerritoryService,
              private statusService: StatusService,
              private voterService: VoterService) { }

  
  ngAfterViewInit() {
    console.log("DONE")
  }

  set display(value: boolean) {
    this._display = value;
    this.displayChange.emit(value);
  }

  set voter(value) {
    this._voter = value;
    this.voterChange.emit(value);
  }

  onSubmit() {
    let value;
    for (let key in this.voter) {
      value = this.voter[key];
      this.voter[key] = value.value === undefined ? value : value.value;
    }
    this.onFormSubmit.emit();
    this.display = false;
  }

  onHide(stationSelect) {
    this._voter = undefined;
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