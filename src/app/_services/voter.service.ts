import { Station, Voter, Constituency } from "../_models";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/";

@Injectable()
export class VoterService {
    static url = '/api/voters/';
    get url() {
        return VoterService.url;
    }

    constructor(private http: HttpClient) {} 

    getAll(): Observable<Voter[]> {
        return this.http.get<Voter[]>(`${this.url}`);
    }

    update(voter: Voter): Observable<Voter> {
        return this.http.put<Voter>(`${this.url}${voter.id}/`, voter);
    }

    create(voter: Voter): Observable<Voter> {
        return this.http.post<Voter>(`${this.url}`, voter);
    }

    delete(voter: Voter): Observable<Voter> {
        return this.http.delete<Voter>(`${this.url}${voter.id}/`);
    }
}
