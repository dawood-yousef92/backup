import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LookupsService {
    constructor(private http: HttpClient){}

    
    getBusinessTypes(): Observable<any> {
        return this.http.get<any>('Lookups/GetBusinessTypes');
    }
    
    getCountries(): Observable<any> {
        return this.http.post<any>('Lookups/GetCountries', {});
    }

    getCitiesByCountryId(id): Observable<any> {
        return this.http.post<any>('Lookups/GetCitiesByCountryId', {countryId: id});
    }

    getCurrencies(): Observable<any> {
        return this.http.post<any>('Lookups/GetCurrencies', {});
    }

}