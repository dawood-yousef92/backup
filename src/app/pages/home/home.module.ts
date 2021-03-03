import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';
import { HomeComponent } from './home.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    TranslationModule,
    MatExpansionModule,
    MatIconModule,
    SlickCarouselModule,
    MatTabsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class HomeModule {}
