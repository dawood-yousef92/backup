import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CompaniesService {
    constructor(private http: HttpClient){}

    getCategoriesByBusinessType(businessType): Observable<any> {
        return this.http.post<any>('Companies/GetCategoriesByBusinessType', {businessType:businessType});
    }

    createCompany(formData): Observable<any> {
        return this.http.post<any>('Companies/CreateCompany', formData);
    }

    getCompaniesByTenantOwner(): Observable<any> {
        return this.http.post<any>('Companies/GetCompaniesByTenantOwner', {rowsPerPage: 2000000});
    }
    
    getCompanyById(companyId): Observable<any> {
        return this.http.post<any>('Companies/GetCompanyById', {id:companyId});
    }

    editCompany(formData): Observable<any> {
        return this.http.put<any>('Companies/EditCompany', formData);
    }
}