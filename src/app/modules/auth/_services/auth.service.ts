import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userD: Subject<any> = new Subject();
  private userDetails: any;

  set currentUserDetails(index: any) {
    this.userDetails = index;
    this.userD.next(index);
  }

  get currentUserDetails() {
    return this.userDetails;
  }

  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/Account/Login`,
      {
        email,
        password,
      }
    );
  }

  register(email: string, password: string, confirmPassword: string): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/Account/Register`,
      {
        email,
        password,
        confirmPassword
      }
    );
  }

  confirmEmail(userId:string,code:string): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/Account/ConfirmEmail`,
      {
        userId,
        code,
      }
    );
  }

  forgetPassword(email:string): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/Account/ForgotPassword`,
      {
        email,
      }
    );
  }

  resetPassword(email:string,password:string,confirmPassword:string,code:string): Observable<any>{
    return this.httpClient.post(
      `${environment.apiUrl}/Account/ResetPassword`,
      {
        email,
        password,
        confirmPassword,
        code,
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}/Manage/GetUser`);
  }
}
