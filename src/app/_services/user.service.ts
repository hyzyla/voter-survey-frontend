import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/index';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  
  
    url = '/api/users/'
    constructor(private http: HttpClient) { }

    getById(id: number) {
        return this.http.get(this.url + id);
    }

    create(user: User) {
        return this.http.post(this.url, user);
    }

    update(user: User) {
        return this.http.put(this.url + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(this.url + id);
    }

    getAllOperators(): Observable<User[]> {
        return this.http.get<User[]>(`${this.url}/operators/`)
    }

    assignVoters(user, voters: any[]): Observable<any> {
        return this.http.post(`${this.url}/${user.id}/assign-voters/`, voters.map(v => v.id));
    }
}