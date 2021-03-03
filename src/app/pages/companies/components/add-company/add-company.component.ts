import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { LoaderService } from 'src/app/modules/auth/_services/loader.service';
import { CompaniesService } from '../../companies.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  errorImageSize:boolean = false;
  selectedImageUrl:any = null;
  defaultImage = './assets/images/defaultuser.png';
  selectedImageName:string;
  changeProfileImage:File;

  createCompany: FormGroup;
  companyBusinessTypes:any;
  categories:any;
  selectedCat:any[] = [];
  countries:any[] = [];
  cities:any[] = [];
  currencies:any[] = [];
  categoriesFilter:string = '';
  countriesFilter:string = '';

  constructor( private router: Router,
    private fb: FormBuilder, 
    private loderService: LoaderService,
    private toaster: ToastrService,
    private companiesService:CompaniesService,
    private modalService: NgbModal) { }

  initForm() {
    this.createCompany = this.fb.group({
      logoPath: [
        ''
      ],
      legalName: [
        '',
        Validators.compose([
          Validators.pattern("[a-zA-Z0-9 ]+"),
        ]),
      ],
      adminEmail: [
        ''
      ],
      businessType: [
        null
      ],
      description: [
        ''
      ],
      buildingNo: [
        ''
      ],
      street: [
        ''
      ],
      phone: [
        '',
        Validators.compose([
          Validators.pattern("[0-9]+"),
          Validators.maxLength(11),
        ]),
      ],
      mobile: [
        '',
        Validators.compose([
          Validators.pattern("[0-9]+"),
          Validators.maxLength(11),
        ]),
      ],
      countryId: [
        ''
      ],
      cityId: [
        ''
      ],
      currencyId: [
        ''
      ],
      companyCategoryIds: [
        []
      ],
      verified: [
        true
      ],
    });
  }

  openModal(content) {
    this.modalService.open(content, { centered: true } );
  }

  clickCat(e) {
    e.stopPropagation();
  }

  selectCat(e,cat) {
    if(this.selectedCat.includes(cat)) {
      this.selectedCat.splice(this.selectedCat.indexOf(cat),1);
    }
    else {
      this.selectedCat.push(cat);
    }
  }

  isChecked(cat):boolean {
    if(this.selectedCat?.includes(cat)) {
      return true;
    }
    else {
      return false;
    }
  }

  removeCat(cat) {
    this.selectedCat.splice(this.selectedCat.indexOf(cat),1);
  }

  getCompanyBusinessTypes() {
    this.companiesService.getCompanyBusinessTypes().subscribe((data) => {
      this.companyBusinessTypes = data.result.businessTypeItems;
    });
  }

  getCategoriesByBusinessType() {
    this.companiesService.getCategoriesByBusinessType(this.createCompany.controls.businessType.value).subscribe((data) => {
      this.categories = data.result.productsCategoryItem;
    });
  }

  getCountries() {
    this.companiesService.getCountries().subscribe((data) => {
      this.countries = data.result.countries;
    });
  }

  getCities(e) {
    this.createCompany.get('cityId').setValue('');
    this.companiesService.getCitiesByCountyId(e.value).subscribe((data) => {
      this.cities = data.result.cities;
    });
  }

  getCurrencies() {
    this.companiesService.getCurrencies().subscribe((data) => {
      this.currencies = data.result.currencies;
    });
  }

  getCountryCode() {
    return this.countries.find(item => item.id === this.createCompany.controls.countryId.value)?.countryCode;
  }

  changePhoto() {
    document.getElementById('photoInput').click();
  }

  removePhoto() {
    this.selectedImageName = '';
    this.selectedImageUrl = null;
    (document.getElementById('photoInput') as HTMLInputElement).value = null;
    this.changeProfileImage = null;
    this.createCompany.get('logoPath').setValue(null);
  }

  readURL(e) {
    this.loderService.setIsLoading = true;
    let inputTarget = e.target;
    if (inputTarget.files && inputTarget.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          if(inputTarget.files[0].size > 2000000) {
            this.errorImageSize = true;
            this.selectedImageUrl = null;
            this.selectedImageName = '';
            this.changeProfileImage = null;
            (document.getElementById('photoInput') as HTMLInputElement).value = null;
          }
          else {
            this.errorImageSize = false;
            this.selectedImageUrl = e.target.result;
            this.selectedImageName = inputTarget.files[0].name;
            this.changeProfileImage = inputTarget.files[0];
          }
          this.loderService.setIsLoading = false;
        }
        reader.readAsDataURL(inputTarget.files[0]);
    }
    this.loderService.setIsLoading = false;
  }

  search(e,type) {
    if(type === 'categories') {
      this.categoriesFilter = e;
    }
    else if(type === 'countries') {
      this.countriesFilter = e;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.getCompanyBusinessTypes();
    // this.getCategoriesByBusinessType();
    this.getCountries();
    this.getCurrencies();
  }

  submit() {
    this.loderService.setIsLoading = true;
    this.companiesService.createCompany(this.createCompany.value).subscribe((data) => {
      this.loderService.setIsLoading = false;
      this.toaster.success(data.result);
      this.router.navigate(['/companies']);
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

}
