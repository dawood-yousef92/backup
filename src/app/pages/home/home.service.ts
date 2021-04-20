import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    constructor(private http: HttpClient){}

    getUser(): Observable<any> {
        return this.http.get<any>('Manage/GetUser');
    }

    getBannerImages(): Observable<any> {
        return this.http.post<any>('BannerImages/GetBannerImages', {});
    }

}