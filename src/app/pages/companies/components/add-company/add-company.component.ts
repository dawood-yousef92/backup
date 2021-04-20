import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {  FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { LoaderService } from 'src/app/modules/auth/_services/loader.service';
import { LookupsService } from 'src/app/pages/lookups.service';
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
  companyId:any;

  companyItem:any;
  companyImages:File[] = [];
  companyImageItems:any;

  constructor( private router: Router,
    private fb: FormBuilder, 
    private loderService: LoaderService,
    private toaster: ToastrService,
    private companiesService:CompaniesService,
    private lookupsService:LookupsService,
    private modalService: NgbModal,
    private route: ActivatedRoute,) { }

  initForm() {
    this.createCompany = this.fb.group({
      logo: [
        null
      ],
      commercialName: [
        this.companyItem?.commercialName || '',
        Validators.compose([
          Validators.required,
          Validators.pattern("[a-zA-Z0-9 ]+"),
        ]),
      ],
      arabicCommercialName: [
        this.companyItem?.arabicCommercialName || '',
        Validators.compose([
          Validators.required
        ]),
      ],
      emailAddress: [
        this.companyItem?.emailAddress || '',
      ],
      businessType: [
        this.companyItem?.businessType || null
      ],
      description: [
        this.companyItem?.description || ''
      ],
      buildingNo: [
        this.companyItem?.buildingNo || ''
      ],
      street: [
        this.companyItem?.street || ''
      ],
      phone: [
        this.companyItem?.phone || '',
        Validators.compose([
          Validators.pattern("[0-9]+"),
          Validators.maxLength(11),
        ]),
      ],
      mobile: [
        this.companyItem?.mobile || '',
        Validators.compose([
          Validators.pattern("[0-9]+"),
          Validators.maxLength(11),
        ]),
      ],
      countryId: [
        this.companyItem?.countryId || ''
      ],
      cityId: [
        this.companyItem?.cityId || ''
      ],
      currencyId: [
        this.companyItem?.currencyId || 'd755b09c-0ce3-4bc7-353f-08d8f772fcd0'
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
    console.log(e);
  }

  selectImages(e) {
    this.companyImages = [];
    e.map((item) => {
      this.companyImages.push(item.file);
    })
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
    if(this.selectedCat.includes(cat)) {
      this.selectedCat.splice(this.selectedCat.indexOf(cat),1);
    }
    else {
      this.selectedCat.push(cat);
      // this.addParents(cat.parentId);
      // let parent = this.categories.find(item => item.id === cat.parentId);
        let parent = e.source._elementRef.nativeElement.offsetParent;
        if(!(parent as HTMLElement).classList.contains('mat-expanded')) {
          e.source._elementRef.nativeElement.offsetParent.click();
        }
      if(!this.selectedCat.includes(cat)) {
        this.selectedCat.push(cat);
      }
    }
    // if(type === 'main') {
    //   if(this.selectedCat.includes(cat)) {
    //     cat.categories.map((item) => {
    //       if(this.selectedCat.includes(item)) {
    //         this.selectedCat.splice(this.selectedCat.indexOf(item),1);
    //       }
    //     })
    //     this.selectedCat.splice(this.selectedCat.indexOf(cat),1);
    //   }
    //   else {
    //     cat.categories.map((item) => {
    //       if(!this.selectedCat.includes(item)) {
    //         this.selectedCat.push(item);
    //       }
    //     })
    //     this.selectedCat.push(cat);
    //     let parent = e.source._elementRef.nativeElement.offsetParent;
    //     if(!(parent as HTMLElement).classList.contains('mat-expanded')) {
    //       e.source._elementRef.nativeElement.offsetParent.click();
    //     }
    //   }
    // }
    // else if(type === 'sub') {
    //   if(this.selectedCat.includes(cat)) {
    //     this.selectedCat.splice(this.selectedCat.indexOf(cat),1);
    //   }
    //   else {
    //     this.selectedCat.push(cat);
    //     let parent = this.categories.find(item => item.id === cat.parentId);
    //     if(!this.selectedCat.includes(cat)) {
    //       this.selectedCat.push(cat);
    //     }
    //   }
    // }
  }

  // addParents(parentId) {
  //   for(let i = 0; this.categories.length > i; i++){
  //     if(this.categories[i]?.id === parentId) {
  //       if(!this.selectedCat.includes(this.categories[i])) {
  //         this.selectedCat.push(this.categories[i]);
  //       }
  //     }
  //     for(let ii = 0; this.categories[i]?.categories?.length > ii; ii++) {
  //       if(this.categories[i]?.categories[ii]?.id === parentId) {
  //         if(!this.selectedCat.includes(this.categories[i])) {
  //           this.selectedCat.push(this.categories[i]);
  //         }
  //         if(!this.selectedCat.includes(this.categories[i]?.categories[ii])) {
  //           this.selectedCat.push(this.categories[i]?.categories[ii]);
  //         }
  //       }
  //       for(let iii = 0; this.categories[i]?.categories.length > iii; iii++) {
  //         if(this.categories[i]?.categories[ii]?.categories[iii]?.id === parentId) {
  //           if(!this.selectedCat.includes(this.categories[i])) {
  //             this.selectedCat.push(this.categories[i]);
  //           }
  //           if(!this.selectedCat.includes(this.categories[i]?.categories[ii])) {
  //             this.selectedCat.push(this.categories[i]?.categories[ii]);
  //           }
  //           if(!this.selectedCat.includes(this.categories[i]?.categories[ii]?.categories[iii])) {
  //             this.selectedCat.push(this.categories[i]?.categories[ii]?.categories[iii]);
  //           }
  //         }
  //         for(let iiii = 0; this.categories[i]?.categories[ii]?.categories?.length > iiii; iiii++) {
  //           if(this.categories[i]?.categories[ii]?.categories[iii]?.categories[iiii]?.id === parentId) {
  //             if(!this.selectedCat.includes(this.categories[i])) {
  //               this.selectedCat.push(this.categories[i]);
  //             }
  //             if(!this.selectedCat.includes(this.categories[i]?.categories[ii])) {
  //               this.selectedCat.push(this.categories[i]?.categories[ii]);
  //             }
  //             if(!this.selectedCat.includes(this.categories[i]?.categories[ii]?.categories[iii])) {
  //               this.selectedCat.push(this.categories[i]?.categories[ii]?.categories[iii]);
  //             }
  //             if(!this.selectedCat.includes(this.categories[i]?.categories[ii]?.categories[iii]?.categories[iiii])) {
  //               this.selectedCat.push(this.categories[i]?.categories[ii]?.categories[iii]?.categories[iiii]);
  //             }
  //           }
  //           for(let iiiii = 0; this.categories[i]?.categories[ii]?.categories[iii]?.length > iiiii; iiiii++) {
  //             if(this.categories[i]?.categories[ii]?.categories[iii]?.categories[iiii]?.id === parentId) {
  //               if(!this.selectedCat.includes(this.categories[i])) {
  //                 this.selectedCat.push(this.categories[i]);
  //               }
  //               if(!this.selectedCat.includes(this.categories[i]?.categories[ii])) {
  //                 this.selectedCat.push(this.categories[i]?.categories[ii]);
  //               }
  //               if(!this.selectedCat.includes(this.categories[i]?.categories[ii]?.categories[iii])) {
  //                 this.selectedCat.push(this.categories[i]?.categories[ii]?.categories[iii]);
  //               }
  //               if(!this.selectedCat.includes(this.categories[i]?.categories[ii]?.categories[iii]?.categories[iiii])) {
  //                 this.selectedCat.push(this.categories[i]?.categories[ii]?.categories[iii]?.categories[iiii]);
  //               }
  //               if(!this.selectedCat.includes(this.categories[i]?.categories[ii]?.categories[iii]?.categories[iiii]?.categories[iiiii])) {
  //                 this.selectedCat.push(this.categories[i]?.categories[ii]?.categories[iii]?.categories[iiii]?.categories[iiiii]);
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  isChecked(cat):boolean {
    let a = false;
    this.selectedCat?.map((item) => {
      if(item.id === cat.id) {
        a = true;
      }
    });
    return a;
    // if(this.selectedCat?.includes(cat)) {
    //   return true;
    // }
    // else {
    //   return false;
    // }
  }

  removeCat(cat) {
    this.selectedCat.splice(this.selectedCat.indexOf(cat),1);
  }

  getCompanyBusinessTypes() {
    this.lookupsService.getBusinessTypes().subscribe((data) => {
      this.companyBusinessTypes = data.result.businessTypeItems;
    });
    this.initForm();
  }

  getCategoriesByBusinessType() {
    // this.selectedCat = [];
    this.loderService.setIsLoading = true;
    this.companiesService.getCategoriesByBusinessType(null,this.createCompany.controls.businessType.value,1,false).subscribe((data) => {
      this.categories = data.result.productsCategoryItem.concat(data.result.servicesCategoryItem);
      this.createCompany.get('companyCategoryIds').setValue([]);
      this.openModal(this.catModal);
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  getCategoriesByBusinessTypeForEdit() {
    // this.selectedCat = [];
    this.loderService.setIsLoading = true;
    this.companiesService.getCategoriesByBusinessType(null,this.companyItem.businessType,1,false).subscribe((data) => {
      this.categories = data.result.productsCategoryItem.concat(data.result.servicesCategoryItem);
      // this.categories.map((item) => {
      //   if(this.companyItem.companyCategoryIds.includes(item.id)) {
      //     this.selectedCat.push(item);
      //   }
      //   if(item.categories.length > 0) {
      //     this.checkCats(item.categories);
      //   }
      // });
      this.createCompany.get('companyCategoryIds').setValue([]);
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  getCategoriesByParentId(cat) {
    if(cat.categories.length > 0) {
      return
    }
    this.companiesService.getCategoriesByBusinessType(cat.id,this.createCompany.controls.businessType.value,null,false).subscribe((data) => {
      // var a = data.result.productsCategoryItem.concat(data.result.servicesCategoryItem);
      this.categories.map((item) => {
        console.log(data);
        if(item.id == data.result.productsCategoryItem.concat(data.result.servicesCategoryItem)[0]?.id) {
          item = data.result.productsCategoryItem.concat(data.result.servicesCategoryItem)[0];
          this.loderService.setIsLoading = false;
        }
        else {
          if(item.categories.length > 0 && data.result.productsCategoryItem.concat(data.result.servicesCategoryItem)[0]) {
            this.findCat(item.categories,data.result.productsCategoryItem.concat(data.result.servicesCategoryItem)[0]);
          }
        }
      });
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  findCat(cats,a) {
    cats.map((item) => {
      if(item.id == a.id) {
        item.categories = a.categories;
        this.loderService.setIsLoading = false;
      }
      else {
        if(item.categories?.length > 0) {
          this.findCat(item.categories,a);
        }
      }
    });
  }
  // checkCats(cats) {
  //   cats.map((cc) => {
  //     if(this.companyItem.companyCategoryIds.includes(cc.id)) {
  //       this.selectedCat.push(cc);
  //     }
  //     if(cc.categories?.length > 0) {
  //       this.checkCats(cc.categories);
  //     }
  //   });
  // }

  getCountries() {
    this.lookupsService.getCountries().subscribe((data) => {
      // this.countries = data.result.countries;
      this.countries.push(data.result.countries.find(item => item.id === '7f4c2c35-feb9-4f6c-9159-9d9280bd047c'));
    });
  }

  getCities(e) {
    this.loderService.setIsLoading = true;
    this.createCompany.get('cityId').setValue('');
    this.lookupsService.getCitiesByCountryId(e.value).subscribe((data) => {
      this.cities = data.result.cities;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  getCurrencies() {
    this.lookupsService.getCurrencies().subscribe((data) => {
      this.currencies = data.result.currencies;
    });
  }

  getCountryCode() {
    return this.countries.find(item => item?.id === this.createCompany.controls.countryId.value)?.countryCode;
  }

  changePhoto() {
    document.getElementById('photoInput').click();
  }

  removePhoto() {
    this.selectedImageName = '';
    this.selectedImageUrl = null;
    (document.getElementById('photoInput') as HTMLInputElement).value = null;
    this.changeProfileImage = null;
    this.createCompany.get('logo').setValue(null);
    if(this.companyId) {
      this.companyItem.logoPath = '';
    }
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

  getCompanyById() {
    this.companiesService.getCompanyById(this.companyId).subscribe((data) => {
      this.companyItem = data.result;
      // this.companyItem = data.result.companyItem;
      this.createCompany.controls['commercialName'].disable();
      this.selectedImageUrl = this.companyItem.logoPath;
      this.selectedCat = data.result.companyCategoryItems;
      this.getCategoriesByBusinessTypeForEdit();
      this.getCities({value: this.companyItem.countryId});
      this.initForm();
    });
  }

  deleteFile(index,type) {
    if(type === 'docs') {
      this.companyItem?.companyDocuments.splice(index,1);
    }
    else {
      this.companyItem?.companyImageItems.splice(index,1)
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.getCompanyBusinessTypes();
    this.getCountries();
    this.getCurrencies();
    this.route.params.subscribe((data) => {
      this.companyId = data.id;
      if(this.companyId) {
        this.getCompanyById();
      }
    });
  }

  submit() {
    this.loderService.setIsLoading = true;
    var formData: FormData = new FormData();
    let cats = []
    for(let i = 0; i < this.selectedCat.length; i++) {
      cats.push(this.selectedCat[i].id as string);
    }
    this.createCompany.get('companyCategoryIds').setValue(cats);

    if(this.changeProfileImage) {
      formData.append('logo',this.changeProfileImage as any, this.changeProfileImage['name']);
    }
    formData.append('commercialName',this.createCompany.controls.commercialName.value);
    formData.append('arabicCommercialName',this.createCompany.controls.arabicCommercialName.value);
    formData.append('emailAddress',this.createCompany.controls.emailAddress.value);
    formData.append('businessType',this.createCompany.controls.businessType.value);
    formData.append('description',this.createCompany.controls.description.value);
    formData.append('buildingNo',this.createCompany.controls.buildingNo.value);
    formData.append('street',this.createCompany.controls.street.value);
    formData.append('phone',this.createCompany.controls.phone.value);
    formData.append('mobile',this.createCompany.controls.mobile.value);
    formData.append('countryId',this.createCompany.controls.countryId.value);
    formData.append('cityId',this.createCompany.controls.cityId.value);
    formData.append('currencyId',this.createCompany.controls.currencyId.value);
    for(let i = 0; i < cats.length; i++){
      formData.append("companyCategoryIds", cats[i]);
    }
    for(let i =0; i < this.documents.length; i++){
      formData.append("attachments", this.documents[i] as File, this.documents[i]['name']);
    }
    for(let i =0; i < this.companyImages.length; i++){
      formData.append("companyImages", this.companyImages[i] as File, this.companyImages[i]['name']);
    }

    if(this.companyId) {
      formData.append('id',this.companyId);
      formData.append('verified',this.companyItem?.verified);
      for(let i =0; i < this.companyItem?.companyDocuments.length; i++){
        formData.append("attachmentIds", this.companyItem?.companyDocuments[i].id);
      }
      for(let i =0; i < this.companyItem?.companyImageItems.length; i++){
        formData.append("companyImagesIds", this.companyItem?.companyImageItems[i].id);
      }
      formData.append('attachmentIds','');
      if(this.companyItem?.logoPath) {
        formData.append('LogoPath',this.companyItem?.logoPath);
      }
      this.companiesService.editCompany(formData).subscribe((data) => {
        this.loderService.setIsLoading = false;
        this.toaster.success(data.message);
        this.router.navigate(['/companies']);
      },(error) => {
        this.loderService.setIsLoading = false;
      });
    }
    else {
      this.companiesService.createCompany(formData).subscribe((data) => {
        this.loderService.setIsLoading = false;
        this.toaster.success(data.result);
        this.router.navigate(['/companies']);
      },(error) => {
        this.loderService.setIsLoading = false;
      });
    }
  }

}
