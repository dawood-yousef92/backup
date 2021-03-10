import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {  FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  @ViewChild("catModal") catModal: TemplateRef<any>;
  closeResult = '';
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
  subCategoriesFilter:string = '';
  countriesFilter:string = '';
  subCategories:any[] = [];
  documents:File[] = [];

  constructor( private router: Router,
    private fb: FormBuilder, 
    private loderService: LoaderService,
    private toaster: ToastrService,
    private companiesService:CompaniesService,
    private modalService: NgbModal) { }

  initForm() {
    this.createCompany = this.fb.group({
      image: [
        null
      ],
      legalName: [
        '',
        Validators.compose([
          Validators.required,
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

  selectFiles(e) {
    this.documents = e.documents;
  }

  openModal(content) {
    this.modalService.open(content, { centered: true } ).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  clickCat(e) {
    e.stopPropagation();
  }

  selectCat(e,cat,type) {
    if(type === 'main') {
      if(this.selectedCat.includes(cat)) {
        cat.categories.map((item) => {
          if(this.selectedCat.includes(item)) {
            this.selectedCat.splice(this.selectedCat.indexOf(item),1);
          }
        })
        this.selectedCat.splice(this.selectedCat.indexOf(cat),1);
      }
      else {
        cat.categories.map((item) => {
          if(!this.selectedCat.includes(item)) {
            this.selectedCat.push(item);
          }
        })
        this.selectedCat.push(cat);
        let parent = e.source._elementRef.nativeElement.offsetParent;
        if(!(parent as HTMLElement).classList.contains('mat-expanded')) {
          e.source._elementRef.nativeElement.offsetParent.click();
        }
      }
    }
    else if(type === 'sub') {
      if(this.selectedCat.includes(cat)) {
        this.selectedCat.splice(this.selectedCat.indexOf(cat),1);
      }
      else {
        this.selectedCat.push(cat);
        let parent = this.categories.find(item => item.id === cat.parentId);
        if(!this.selectedCat.includes(parent)) {
          this.selectedCat.push(parent);
        }
      }
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
    this.selectedCat = [];
    this.loderService.setIsLoading = true;
    this.companiesService.getCategoriesByBusinessType(this.createCompany.controls.businessType.value).subscribe((data) => {
      this.categories = data.result.productsCategoryItem;
      this.createCompany.get('companyCategoryIds').setValue(null);
      this.subCategories = [];
      this.openModal(this.catModal);
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
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
    this.createCompany.get('image').setValue(null);
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
    else if(type === 'subCategories') {
      this.subCategoriesFilter = e;
    }
    else if(type === 'countries') {
      this.countriesFilter = e;
    }
  }

  getSubCategories(e) {
    console.log(e);
    this.subCategories = [];
    e.value.map((val) => {
      this.categories.find((item) => {
        if(!this.subCategories.includes(item) && item.id == val) {
          this.subCategories.push(item);
        }
      });
    })
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
    var formData: FormData = new FormData();
    var formData2: FormData = new FormData();
    let cats = []
    for(let i = 0; i < this.selectedCat.length; i++) {
      cats.push(this.selectedCat[i].id);
    }
    this.createCompany.get('companyCategoryIds').setValue(cats);

    if(this.changeProfileImage) {
      formData.append('image',this.changeProfileImage as any, this.changeProfileImage['name']);
    }
    formData.append('legalName',this.createCompany.controls.legalName.value);
    formData.append('adminEmail',this.createCompany.controls.adminEmail.value);
    formData.append('businessType',this.createCompany.controls.businessType.value);
    formData.append('description',this.createCompany.controls.description.value);
    formData.append('buildingNo',this.createCompany.controls.buildingNo.value);
    formData.append('street',this.createCompany.controls.street.value);
    formData.append('phone',this.createCompany.controls.phone.value);
    formData.append('mobile',this.createCompany.controls.mobile.value);
    formData.append('countryId',this.createCompany.controls.countryId.value);
    formData.append('cityId',this.createCompany.controls.cityId.value);
    formData.append('currencyId',this.createCompany.controls.currencyId.value);
    formData.append('companyCategoryIds',this.createCompany.controls.companyCategoryIds.value);
    for(let i =0; i < this.documents.length; i++){
      formData.append("attachments", this.documents[i] as File, this.documents[i]['name']);
    }
    this.companiesService.createCompany(formData).subscribe((data) => {
      this.loderService.setIsLoading = false;
      this.toaster.success(data.result);
      this.router.navigate(['/companies']);
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

}
