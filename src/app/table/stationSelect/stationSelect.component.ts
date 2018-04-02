import { Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { Station, Region, District } from '../../_models/index';
import { StatusService } from '../../_services/status.service';
import { RegionService, DistrictService, StationService, TerritoryService } from '../../_services';
import { SelectItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'station-select',
  templateUrl: './stationSelect.component.html',
  //styleUrls: ['./voter.component.css'],
  providers: [
    TerritoryService,
    FormsModule,
  ]
})
export class StationSelectComponent implements OnInit  {
  
  _station: Station;
  @Output() onStationChange: EventEmitter<Station> = new EventEmitter();
  @Input() get station() { return this._station; }

  regions: Region[];
  districts: District[];
  stations: Station[];

  selectedRegion;
  selectedDistrict: any;
  selectedStation: any;

  constructor(private territoryService: TerritoryService) { }

  set station(value) {
    value = value as Station;
    this._station = value;
    this.onStationChange.emit(value);
  }

  ngOnInit() {
    this.territoryService.region.getAll()
      .subscribe((regions: Region[]) => {
        this.regions = regions;
      });
    if (this.station) {
      this.territoryService.station.getDistrict(this.station)
        .subscribe((district: District) => {
          this.territoryService.district.getRegion(district) 
            .subscribe((region: Region) => {
              this.selectedRegion = region;
              this.onChange(region, 'region');
              this.selectedDistrict = district;
              this.onChange(district, 'district');
              this.selectedStation = this.station;
              this.onChange(this.station, 'station');
            });
        });
    }
  }

  clear() {
    this.selectedRegion = false;
    this.selectedDistrict = false;
    this.selectedStation = false;
    this.districts = [];
    this.stations = [];

  }

  onChange(value, type) {
    if (type === 'region') {
      this.territoryService.district.getByRegion(value)
        .subscribe((districts: District[]) => {
          this.districts = districts;
        });
      delete this.selectedDistrict;
      this.stations = [];
      delete this.selectedStation;

    } else if (type === 'district') {
      this.territoryService.station.getByDistrict(value)
        .subscribe((stations: Station[]) => {
          this.stations = stations;
        });
      delete this.selectedStation;
    } else {
      this.station = value;
      return;
    }
    
    this.onStationChange.emit(this.selectedStation);
  }

}