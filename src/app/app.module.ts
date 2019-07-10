import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ImageViewerModule } from 'ng2-image-viewer';
import { HttpClientModule } from '@angular/common/http';
 import {APP_ROUTING} from './app.routes';
 import { NgSelectModule } from '@ng-select/ng-select';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { ToastrModule } from 'ngx-toastr';
 import { PdfViewerModule } from 'ng2-pdf-viewer';
 import { InlineSVGModule } from 'ng-inline-svg';
 import { DynamicFormBuilderModule } from './dynamic-form-builder/dynamic-form-builder.module';
 import { Http, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { ColasTrabajoComponent } from './components/colas-trabajo/colas-trabajo.component';
import { LoginComponent } from './components/login/login.component';
import {  JwtModule } from '@auth0/angular-jwt';


import {NgbModule,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FieldsFunctionalityService } from './fields-functionality.service';
import {DocumentsService} from './documents.service';



export function tokenGetter() {
  return localStorage.getItem('token');
  } 

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ColasTrabajoComponent,
    LoginComponent
    // ,
    // MenuComponent
  ],
  imports: [
    BrowserModule,
    ImageViewerModule,
    HttpClientModule,
    NgSelectModule,
     APP_ROUTING,
     BrowserAnimationsModule,
     PdfViewerModule,
     ToastrModule.forRoot(),
     InlineSVGModule.forRoot(),
     FormsModule,
     ReactiveFormsModule,
     DynamicFormBuilderModule,
     NgbModule.forRoot(),
     JwtModule.forRoot({
      config: {
      tokenGetter: tokenGetter,
      whitelistedDomains: ['localhost:56121', '172.20.15.93:8081']
      }
      }), 
 

  ],
  providers: [FieldsFunctionalityService,DocumentsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

