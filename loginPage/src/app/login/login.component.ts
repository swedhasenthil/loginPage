import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { User } from '../_models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  alterWarning: boolean;
  alterSucess: boolean;
  warningMsg: any;
  currentUser: User;
  currentUserSubscription: Subscription;
  constructor(
    public formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public authenticationService: AuthenticationService,
  ) { 
    if (this.authenticationService.currentUserValue) { 
      this.router.navigate(['/']);
  }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });

  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f['username'].value,this.f['password'].value,)
        .pipe(first())
        .subscribe(
            data => {
              this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
                this.currentUser = user;
                console.log("user",user)
                if(this.currentUser.role === "admin"){
                  this.router.navigate(['./admin']);
                }
                else{
                  this.router.navigate([this.returnUrl]);
                }
            });
                
            },
            error => {
              setTimeout(() => {
                this.alterWarning = true;
              }, 500)
              this.alterSucess = false;
              this.warningMsg = error
                this.loading = false;
            });
}
}
