import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Voter } from '../_models/index';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RecordSerivce {

    constructor(private http: HttpClient) { }

    getRecords(): Observable<Voter[]> {
        return this.http.get<Voter[]>('/api/voters/');
    }
}
