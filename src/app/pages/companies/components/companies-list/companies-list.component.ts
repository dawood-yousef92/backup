import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/modules/auth/_services/loader.service';
import { CompaniesService } from '../../companies.service';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent implements OnInit {
  myCompanies:any[] = [];

  constructor(
    private loderService: LoaderService,
    private companiesService:CompaniesService,
  ) { }

  getCompaniesByTenantOwner() {
    this.loderService.setIsLoading = true;
    this.companiesService.getCompaniesByTenantOwner().subscribe((data) => {
      this.loderService.setIsLoading = false;
      this.myCompanies = data.result.companyItems.items;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  ngOnInit(): void {
    this.getCompaniesByTenantOwner();
  }

}
