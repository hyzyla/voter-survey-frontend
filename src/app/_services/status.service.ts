import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TreeNode } from 'primeng/api';
import { Status, Station } from '../_models/index';
import { StationService } from '../_services/territory.service';
import { Observable } from 'rxjs/Observable';
import { Constituency } from '../_models/territory';

@Injectable()
export class StatusService {
    url = '/api/statuses/';
    constructor(private http: HttpClient) { }

	getStatic(): Observable<Status[]> {
		return this.http.get<Status[]>(`${this.url}static`)
	}
 
    getAll() {
        return this.http.get<Status[]>(this.url);
    }

	create(status: Status) {
		return this.http.post(this.url, status.object);
	}

	update(status: Status) {
		return this.http.put(this.url + status.id + '/', status.object);
	}

	delete(status: Status) {
		return this.http.delete(this.url + status.id + '/');
	}

	getByStation(station: Station) {
		return this.http.get(`${StationService.url}${station.id}/statuses/`)
	}
}
