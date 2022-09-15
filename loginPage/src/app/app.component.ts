import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './service/authentication.service';
import { User } from './_models/user';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
 
    currentUser: User;
  user: any;
  admindiv: any;
  title: any;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
      this.admindiv = true;
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
     this.user = this.currentUser.role
     console.log(this.user)
     if(this.user == 'admin')
     {
       this.admindiv = true;
       console.log("data")
     }
     else(this.user === "user")
     {
      this.admindiv = false;
     }
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
