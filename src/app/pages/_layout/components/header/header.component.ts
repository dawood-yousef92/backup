import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesService } from 'src/app/pages/companies/companies.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showSearchBox:boolean = false;
  showmobileMenu:boolean = false;
  isSticky:boolean;
  currencies:any[] = [];
  activeCurrency:any = null;


  constructor(private router: Router,
    private companiesService:CompaniesService,) { }

  
  getCurrencies() {
    this.companiesService.getCurrencies().subscribe((data) => {
      this.currencies = data.result.currencies;
    });
  }

  setActiveCurrency(currency) {
    this.activeCurrency = currency;
  }

  ngOnInit(): void {
    this.getCurrencies();
    window.addEventListener('scroll', this.scroll, true);
    this.scroll;
  }

  scroll = (event): void => {
    if (window.pageYOffset > 130) {
      this.isSticky = true;
    }
    else {
      this.isSticky = false;
    }
  };

  showSearch() {
    this.showSearchBox = !this.showSearchBox;
    if(this.showSearchBox) {  
      setTimeout(function(){
        let element = document.getElementById('searchBox');
        element.focus();
      },100);
    }
  }

  checkIfEnter(e) {
    if(e.key == 'Enter') {
        alert('serach');
    }
  }

  showMobileMenu() {
    this.showmobileMenu = !this.showmobileMenu;
  }

  checkIfLogin() {
    if(localStorage.getItem('token')) {
      return true;
    }
    else {
      return false;
    }
  }

  getProfileImage() {
    return './assets/images/defaultuser.png';
  }

}