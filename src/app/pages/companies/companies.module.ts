import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';
import { CompaniesComponent } from './companies.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { CompaniesListComponent } from './components/companies-list/companies-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import { UploadDocumentsComponent } from './components/upload-documents/upload-documents.component';


@NgModule({
  declarations: [CompaniesComponent, AddCompanyComponent, CompaniesListComponent, UploadDocumentsComponent],
  imports: [
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule.forChild([
        {
            path: '',
            component: CompaniesComponent,
            children: [
                {
                  path: '',
                  component: CompaniesListComponent,
                },
                {
                  path: 'add-company',
                  component: AddCompanyComponent,
                },
            ]
        },
    ]),
  ],
})
export class CompaniesModule {}
