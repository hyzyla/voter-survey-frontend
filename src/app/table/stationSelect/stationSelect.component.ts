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
    this.initStation()
  }

  ngOnInit() {
    this.initStation()
  }

  initStation() {
    this.loadRegions();
    if (this.station) {
      this.territoryService.station.getDistrict(this.station)
        .subscribe((district: District) => {
          this.territoryService.district.getRegion(district) 
            .subscribe((region: Region) => {

              this.loadRegions();
              this.selectedRegion = region;

              this.loadDistricts(region);
              this.selectedDistrict = district;

              this.loadStations(district);
              this.selectedStation = this.station;

              this.onStationChange.emit(this.station);
            });
        });
    }
  }

  loadRegions() {
    this.territoryService.region.getAll()
    .subscribe((regions: Region[]) => this.regions = regions);
  }

  loadDistricts(region: Region) {
    this.territoryService.district.getByRegion(region)
      .subscribe((districts: District[]) => this.districts = districts);
  }

  loadStations(district: District) {
    this.territoryService.station.getByDistrict(district)
    .subscribe((stations: Station[]) => this.stations = stations);
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
      this.loadDistricts(new Region(value));
      this.stations = [];
      delete this.selectedDistrict;
      delete this.selectedStation;
      this.onStationChange.emit(this.selectedStation);
    } else if (type === 'district') {
      this.loadStations(new District(value));
      delete this.selectedStation;
    } else {
      this._station = value;
    }

    this.onStationChange.emit(this.selectedStation);
  }

}