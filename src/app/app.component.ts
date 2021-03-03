import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from './modules/auth/_services/loader.service';
import { TranslationService } from './modules/i18n/translation.service';
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as arLang } from './modules/i18n/vocabs/ar';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'growthway-website';
  testEmitter$ = new BehaviorSubject<boolean>(false);
  constructor(
    private translationService: TranslationService,
    private router: Router,
    private loaderService: LoaderService,
  ) {
    this.translationService.loadTranslations(
      enLang,
      arLang,
    );
  }

  ngOnInit() {
    this.loaderService.loader.subscribe((data) => {
        setTimeout(()=> {
          this.testEmitter$.next(data);
        }, 0);
      },
      (error) => console.log('error', error),
    );
  }
}
