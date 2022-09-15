import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';
import { AuthenticationService } from '../service/authentication.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];

  constructor(
      private authenticationService: AuthenticationService,
      private userService: UserService,
      public route: ActivatedRoute,
      public router: Router,
  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
          this.currentUser = user;
          console.log("user",user)
      });
  }

  ngOnInit() {
      this.loadAllUsers();
  }

  ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.currentUserSubscription.unsubscribe();
  }

  deleteUser(id: number) {
      this.userService.delete(id).pipe(first()).subscribe(() => {
          this.loadAllUsers()
      });
  }

   loadAllUsers() {
      this.userService.getAll().pipe(first()).subscribe(users => {
          this.users = users;
          console.log(this.users);
      });
  }
}
