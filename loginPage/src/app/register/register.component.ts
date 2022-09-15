import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {  UserService } from '../service/user.service';
import { AuthenticationService } from '../service/authentication.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm : FormGroup;
  loading = false;
  submitted = false;
  alterSucess: boolean;
  alterWarning: boolean;
  warningMsg: any;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public userService: UserService,
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
        firstName: new FormControl('',[ Validators.required]),
        email: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
        username:new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required,Validators.minLength(6)])
    });
}

// convenience getter for easy access to form fields
get f() { return this.registerForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading = true;
    console.log(this.registerForm.value)
    this.userService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
            data => {
              console.log("data",data)
             
              this.alterWarning = false;
              this.alterSucess = true;
                setTimeout(() => {
                  this.alterSucess = true;
                  this.router.navigate(['/login']);
                }, 3000);
            },
            error => {
              console.log(error);
              this.alterWarning = true;
              this.alterSucess = false;
              this.warningMsg = error
                this.loading = false;
            });
}
}
