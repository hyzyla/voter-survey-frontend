import { Component, OnInit, ViewChild, AfterViewInit, HostListener, Input } from '@angular/core';
import { RecordSerivce, VoterService } from '../_services/index';
import { Voter, Status, Constituency, User } from '../_models';
import { StatusService } from '../_services/status.service';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { MenuItem, SelectItem } from 'primeng/api';
import { ConstituencyService, TerritoryService } from '../_services/territory.service';
import { Observable } from 'rxjs';
import { AlertService } from '../_services/alert.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserService } from '../_services/user.service';

ObjectUtils.prototype.resolveFieldData = function (data, field) {
  if (data && field) {
    return data[field];
  }
  else {
    return null;
  }
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [
    VoterService,
    StatusService,
  ]
})
export class TableComponent implements OnInit, AfterViewInit {
  operators: any;
  selectedOperators: any[];
  displayAssignDialog: boolean = false;
  records: any[];
  cols: any[];
  newRecord: boolean;
  recordData: any;
  displayDialog: boolean = false;
  selectedRecord: any[];
  contextMenu: MenuItem[]
  rangeValue: number = null;
  numberActionOptions: SelectItem[];
  tableHeight: string;
  reinit: boolean;
  selectedColumns: any[];
  currentConstituency;

  @Input() user;

  constructor(
    private statusService: StatusService,
    private voterService: VoterService,
    private territoryService: TerritoryService,
    private messageService: MessageService,
    private userService: UserService,
  ) { }

  ngAfterViewInit() {
    
  }

  appendColumns(selected = false) {

    let new_array = ([
      {
        field: "id",
        header: "ID",
        type: 2,
        options: []
      },
      {
        field: "station_number",
        header: "Дільниця",
        type: 2,
        options: []
      },
      {
        field: "station_address",
        header: "Адреса дільниці",
        type: 2,
        options: []
      }
    ])

    if (selected) {
      this.selectedColumns = new_array.concat(this.selectedColumns);
    } else {
      this.cols = new_array.concat(this.cols);
    }

  }

  ngOnInit() {
    this.tableHeight = (window.innerHeight - 186) + 'px';
    this.reinit = true;
    this.contextMenu = [
      { label: 'Видалити', command: (event) => this.deleteRecord() },
    ]
    
    this.numberActionOptions = [
        {
          label: ">", value: "gt"
        },
        {
          label: "<", value: "lt",
        },
        {
          label: "=", value: "equals"
        }
    ]
    this.loadData(undefined);
    this.loadUsers();
  }

  loadData(constituency: Constituency | undefined) {
    if (this.currentConstituency && !constituency) {
      constituency = this.currentConstituency;
    }
    this.currentConstituency = constituency;

    this.records = [];
    if (constituency && constituency.id) {      
      this.territoryService.constituency.getVoters(constituency)
        .subscribe((records: Voter[]) => this.records = records.map(r => this.fromVoterToRow(r)));
    } else {
      this.voterService.getAll()
        .subscribe((records: Voter[]) => this.records = records.map(r => this.fromVoterToRow(r)));
    }
    this.loadColumns(constituency);
  }
  
  loadUsers() {
    this.userService.getAllOperators()
    .subscribe((users: User[]) => this.operators = users.map(
      value => <Object>{label: value.username, value: value}
    ));
  }


  loadColumns(constituency: Constituency | undefined) {
    this.cols = [];
    if (constituency && constituency.id) {    
      let s1$ = this.statusService.getStatic()
      let s2$ = this.territoryService.constituency.getStatuses(constituency)
      Observable.forkJoin(s1$, s2$)
        .map(([s1, s2]) => { 
          return [...s1, ...s2]; 
        })
        .subscribe(statuses => this.initColums(statuses));
    } else {
      this.statusService.getAll()
        .subscribe((statuses: Status[]) => this.initColums(statuses))
    }
  }

  initColums(statuses: Status[]) {
    this.cols = statuses.map(value => this.fromStatusToColumn(new Status(value)));
    this.appendColumns();
    this.selectedColumns = this.cols.filter(value => value.isStatic);
    this.appendColumns(true);
  }

  printValue(a, b, c, d){
    console.log(a,b,c,d);
    this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
  }

  filterNumbers(value, type, col, dt) {
    if (value) col.filterValue = value;
    if (!col.filterType)  col.filterType = 'gt';
    dt.filter(col.filterValue, col.field, col.filterType);
  }

  getMultiselectOptions(options) {
    return options.map(item => <Object>{label: item.value, value: item.value});
  }

  showDialogToAdd() {
    this.newRecord = true;
    this.recordData = {};
    this.displayDialog = true;
  }

  exportRecords(dt) {
    if (this.selectedRecord instanceof Array && this.selectedRecord.length > 1) {
      dt.exportCSV({selecselectionOnly:true})
    } else {
      dt.exportCSV()
    }
  }

  saveRecord(event) {
    const records = [...this.records];
    if (this.newRecord) {
      this.voterService.create(this.fromRowToVoter(event))
        .subscribe(r => { 
          records.push(this.fromVoterToRow(r));
          this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно створено'})
          this.recordData = undefined;
        });
        
    } else {
      this.voterService.update(this.fromRowToVoter(event))
        .subscribe(r => {
          this.recordData = undefined;
          records[this.records.indexOf(this.selectedRecord[0])] = this.fromVoterToRow(r);
          this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно збережено'});
        });
    }
  
    this.records = records;
    this.displayDialog = false;
  }

  deleteRecord() {
    if (!this.selectedRecord) return;
    if (!(this.selectedRecord instanceof Array)) {
      this.selectedRecord = [this.selectedRecord]
    }
    this.selectedRecord.forEach(record => {
      const index = this.records.indexOf(record);
      this.voterService.delete(this.fromRowToVoter(record))
        .subscribe(_ =>
          this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно видалено'})
        );
      this.records = this.records.filter((val, i) => i !== index);
    });
    this.selectedRecord = [];
    this.displayDialog = false;
  }

  showDialogToEdit(event) {
    if (!this.selectedRecord || (event && event.originalEvent && event.originalEvent.ctrlKey)) return;
    if (!(this.selectedRecord instanceof Array)) {
      this.selectedRecord = [this.selectedRecord]
    }

    if (this.selectedRecord instanceof Array && this.selectedRecord.length === 1) {
      this.recordData = this.cloneRecord(this.selectedRecord[0]);
    } else return;

    this.newRecord = false;
    this.displayDialog = true;
  }

  showDialogToAssign() {
    if (!(this.selectedRecord instanceof Array)) {
      this.selectedRecord = [this.selectedRecord]
    }
    this.displayAssignDialog = true;
    console.log("Assign ", this.displayAssignDialog);
  }

  fromVoterToRow(voter: Voter) {
    let attrib = voter.attrib;
    attrib['id'] = voter.id;
    attrib['station_number'] = voter.station.number;
    attrib['station_address'] = voter.station.address;
    attrib['station'] = voter.station;
    return attrib;
  }

  fromRowToVoter(row) {
    
    let id = row.id;
    let station = row.station;
    delete row['station']
    delete row['station_number']
    delete row['station_address']
    delete row['id']

    let voter: Voter = <Voter>{
      id: id,
      station: station,
      attrib: row,
    }
    return voter;
  }

  fromStatusToColumn(status: Status) {
    return {
      field: status.id,
      header: status.name,
      type: status._type,
      options: status.options,
      isStatic: status.isStatic,
    }
  }

  cloneRecord(r) {
    const record = {};
    for (const field of Object.keys(r)) {
      record[field] = r[field];
    }
    return record;
  }

  assignVoters() {
    let observables = this.selectedOperators.map(value =>  this.userService.assignVoters(value, this.selectedRecord));
    Observable.forkJoin(observables).subscribe(_ => {
      this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно збережено'})
      this.selectedOperators = [];
    });
    this.displayAssignDialog = false;
    
  }
}
