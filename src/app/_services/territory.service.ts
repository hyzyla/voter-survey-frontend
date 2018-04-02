import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TreeNode } from 'primeng/api';
import { Region, District, Station, Constituency, Status } from '../_models/index';
import { Observable } from 'rxjs';
import { Voter } from '../_models/voter';

export class RegionService {
	url = '/api/regions/';
	constructor(private http: HttpClient) { }

	getAll(): Observable<Region[]> {
		return this.http.get<Region[]>(this.url);
	}

	create(region: Region) {
		return this.http.post(this.url, region);
	}

	update(region: Region) {
		return this.http.put(this.url + region.id + '/', region);
	}

	delete(region: Region) {
		return this.http.delete(this.url + region.id + '/');
	}

	addStatus(region: Region, status: Status) {
		return this.http.post(`${this.url}${region.id}/add-status/`, status);
	}

	deleteAllStatuses(region: Region) {
		return this.http.delete(`${this.url}${region.id}/statuses/`);
	}
}


export class DistrictService {
	static url = '/api/districts/';
	get url(){
		return DistrictService.url;
	}

	constructor(private http: HttpClient) { }

	getByRegion(region: Region): Observable<District[]> {
		return this.http.get<District[]>(region.districts);
	}

	getAll() {
		return this.http.get(this.url);
	}

	create(district: District) {
		return this.http.post(this.url, district);
	}

	update(district: District) {
		return this.http.put(this.url + district.id + '/', district);
	}

	delete(district: District) {
		return this.http.delete(this.url + district.id + '/');
	}

	addStatus(district: District, status: Status) {
		return this.http.post(`${this.url}${district.id}/add-status/`, status);
	}

	getRegion(district: District): Observable<Region> {
		return this.http.get<Region>(`${this.url}${district.id}/region/`);
	}

	deleteAllStatuses(district: District) {
		return this.http.delete(`${this.url}${district.id}/statuses/`);
	}
	

}

export class StationService {
	static url = '/api/polling-stations/';
	get url() {
		return StationService.url;
	}
	constructor(private http: HttpClient) { }

	getByDistrict(district: District): Observable<Station[]> {
		return this.http.get<Station[]>(`${DistrictService.url}${district.id}/stations/`);
	}

	getByConstituency(constituency: Constituency) {
		return this.http.get(`${ConstituencyService.url}${constituency.id}/stations/`);
	}

	getAll() {
		return this.http.get(this.url);
	}

	create(station: Station) {
		return this.http.post(this.url, station);
	}

	update(station: Station) {
		return this.http.put(this.url + station.id + '/', station);
	}

	delete(station: Station) {
		return this.http.delete(this.url + station.id + '/');
	}

	addStatus(station: Station, status: Status) {
		return this.http.post(`${this.url}${station.id}/add-status/`, status);
	}

	getStatuses(station: Station): Observable<Status[]> {
		return this.http.get<Status[]>(`${this.url}${station.id}/statuses/`);
	}

	getDistrict(station: Station): Observable<District> {
		return this.http.get<District>(`${this.url}${station.id}/district/`);
	}

	deleteAllStatuses(station: Station) {
		return this.http.delete(`${this.url}${station.id}/delete-statuses/`);
	}

	deleteStatus(station: Station, status: Status) {
		return this.http.put(`${this.url}${station.id}/delete-status/`, status);
	}
}

export class ConstituencyService {
  
	static url = '/api/constituencies/';

	get url(){
		return ConstituencyService.url;
	}
	
	constructor(private http: HttpClient) { }

	getAll(): Observable<Constituency[]> {
		return this.http.get<Constituency[]>(this.url);
	}

	create(constituency: Constituency) {
		return this.http.post(this.url, constituency);
	}

	update(constituency: Constituency) {
		return this.http.put(this.url + constituency.id + '/', constituency);
	}

	delete(constituency: Constituency) {
		return this.http.delete(this.url + constituency.id + '/');
	}

	deleteStation(constituency: Constituency, station: Station) {
		return this.http.put(`${this.url}${constituency.id}/delete-station/`, station);
  }
  
	addStation(constituency: Constituency, station: Station): any {
		return this.http.put(`${this.url}${constituency.id}/add-station/`, station);
	}

	getVoters(constituency: Constituency): Observable<Voter[]> {
        return this.http.get<Voter[]>(`${this.url}${constituency.id}/voters/`);
	}
	
	getStatuses(constituency: Constituency): Observable<Status[]> {
        return this.http.get<Status[]>(`${this.url}${constituency.id}/statuses/`);
    }
}


export function createLeafNode(r) {
	return {
		label: r.name,
		data: r,
		leaf: false,
		droppable: true,
		draggable: false,
	};
}

export function createStationNode(r) {
	return {
		label: r.number,
		data: r,
		draggable: true,
		droppable: false,
	};
}


@Injectable()
export class TerritoryService {
	region: RegionService;
	district: DistrictService;
	station: StationService;
	constituency: ConstituencyService;

	constructor(private http: HttpClient) {
		this.region = new RegionService(http);
		this.district  = new DistrictService(http);
		this.station = new StationService(http);
		this.constituency = new ConstituencyService(http);
	 }

}
