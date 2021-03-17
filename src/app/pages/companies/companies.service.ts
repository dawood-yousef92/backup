import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CompaniesService {

    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    getCompanyBusinessTypes(): Observable<any> {
        return this.http.get<any>('Companies/GetCompanyBusinessTypes');
    }
    
    getCategoriesByBusinessType(businessType): Observable<any> {
        return this.http.post<any>('Companies/GetCategoriesByBusinessType', {businessType:businessType});
    }

    getCountries(): Observable<any> {
        return this.http.post<any>('Countries/GetCountries', {});
    }

    getCitiesByCountyId(id): Observable<any> {
        return this.http.post<any>('Cities/GetCitiesByCountyId', {countryId: id});
    }

    getCurrencies(): Observable<any> {
        return this.http.post<any>('Currencies/GetCurrencies', {});
    }

    createCompany(formData): Observable<any> {
        return this.http.post<any>('Companies/CreateCompany', formData);
    }

    getCompanyByCreatorEmail(): Observable<any> {
        return this.http.post<any>('Companies/GetCompanyByCreatorEmail', {});
    }
    
    getCompanyById(companyId): Observable<any> {
        return this.http.post<any>('Companies/GetCompanyById', {companyId:companyId});
    }
}