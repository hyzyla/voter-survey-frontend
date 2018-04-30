import { Component, OnInit, Output } from '@angular/core';
 
import { User, Constituency } from '../_models/index';
import { UserService } from '../_services/index';
 
@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
    currentUser: User;

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    
    ngOnInit() {
    }

    /*
    ngOnInit() {
        this.loadAllUsers();
    }
    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }
    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
    */
}
