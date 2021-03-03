import { Component, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { LoaderService } from 'src/app/modules/auth/_services/loader.service';
import { CompaniesService } from '../companies/companies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('slickModal2') slickModal2: SlickCarouselComponent;
  @ViewChild('slickModal3') slickModal3: SlickCarouselComponent;
  @ViewChild('slickModal4') slickModal4: SlickCarouselComponent;

  categories:any[] = [];
  slides = [
    {img: "../../../assets/images/Capture.PNG"},
    {img: "../../../assets/images/Capture.PNG"},
    {img: "../../../assets/images/Capture.PNG"},
  ];
  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "arrows": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
    "rtl": this.getDirection(),
  };
  slideConfig2 = {
    "slidesToShow": 7,
    "slidesToScroll": 5,
    "arrows": false,
    "infinite": true,
    "autoplay": false,
    "dots": false,
    "rtl": this.getDirection(),
    "responsive": [
      {
        breakpoint: 1200,
        settings: {
          "slidesToShow": 6,
          "slidesToScroll": 3,
        }
      },
      {
        breakpoint: 1000,
        settings: {
          "slidesToShow": 5,
          "slidesToScroll": 3,
        }
      },
      {
        breakpoint: 800,
        settings: {
          "slidesToShow": 4,
          "slidesToScroll": 2,
        }
      },
      {
        breakpoint: 700,
        settings: {
          "slidesToShow": 3,
          "slidesToScroll": 2,
        }
      },
      {
        breakpoint: 500,
        settings: {
          "slidesToShow": 2,
          "slidesToScroll": 2,
        }
      },
    ],
  };
  slideConfig3 = {
    "slidesToShow": 5,
    "slidesToScroll": 4,
    "arrows": false,
    "infinite": true,
    "autoplay": false,
    "dots": false,
    "rtl": this.getDirection(),
    "responsive": [
      {
        breakpoint: 1000,
        settings: {
          "slidesToShow": 3,
          "slidesToScroll": 3,
        }
      },
      {
        breakpoint: 500,
        settings: {
          "slidesToShow": 2,
          "slidesToScroll": 2,
        }
      },
    ],
  };
  constructor(private companiesService:CompaniesService,
              private loderService: LoaderService,) {}

  next(num) {
    if (num === 2) {
      this.slickModal2.slickNext();
    }
    else if (num === 3) {
      this.slickModal3.slickNext();
    }
    else if (num === 4) {
      this.slickModal4.slickNext();
    }
  }
  
  prev(num) {
    if (num === 2) {
      this.slickModal2.slickPrev();
    }
    else if (num === 3) {
      this.slickModal3.slickPrev();
    }
    else if (num === 4) {
      this.slickModal4.slickPrev();
    }
  }

  getCategoriesByBusinessType() {
    this.loderService.setIsLoading = true;
    this.companiesService.getCategoriesByBusinessType(3).subscribe((data) => {
      this.categories = data.result.productsCategoryItem;
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  getDirection() {
    if (localStorage.getItem('language') === 'ar') {
      return true;
    }
    else {
      return false;
    }
  }

  ngOnInit() {
    console.log(localStorage.getItem('language'));
    this.getCategoriesByBusinessType();
  }
}