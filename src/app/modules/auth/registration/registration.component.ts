import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { first } from 'rxjs/operators';
import { LoaderService } from '../_services/loader.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  successMessage:string;
  activationLink:string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loderService: LoaderService
  ) {
    if (localStorage.getItem("token")) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(6),
            Validators.maxLength(320),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit() {
    this.loderService.setIsLoading = true;
    this.authService.register(this.f.email.value, this.f.password.value, this.f.cPassword.value)
      .pipe(first())
      .subscribe((data: any) => {
        this.loderService.setIsLoading = false;
        this.successMessage = data.result.successMessage;
        this.activationLink = decodeURIComponent(data.result.emailConfirmationUrl);
      },
      (error) => {
        this.loderService.setIsLoading = false;
        console.log(error);
      });
  }

  // confirmEmail() {
  //   this.authService.confirmEmail(this.userId,this.code).subscribe((data) => {

  //   });
  // }
}
