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
//  import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth, AuthModule } from 'angular2-jwt/angular2-jwt';
 import { Http, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { ColasTrabajoComponent } from './components/colas-trabajo/colas-trabajo.component';
import { LoginComponent } from './components/login/login.component';


import {NgbModule,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FieldsFunctionalityService } from './fields-functionality.service';
import {DocumentsService} from './documents.service';



// export function authHttpServiceFactory(http: Http, options: RequestOptions) {
//   return new AuthHttp(new AuthConfig({
//     tokenGetter: (() => localStorage.getItem('token'))
//   }), http, options);
// }

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
     NgbModule.forRoot()//,
    //  AuthModule.forRoot(new AuthConfig({
    //   headerName: 'Authorization',
    //   headerPrefix: 'Bearer',
    //   tokenName: 'token',
    //   tokenGetter: (() => localStorage.getItem('token') || ''),
    //   globalHeaders: [{ 'Content-Type': 'application/json' }],
    //   noJwtError: true
    // }))

  ],
  providers: [FieldsFunctionalityService,DocumentsService//,AuthHttp//,
  // {
  //         provide: AuthHttp,
  //         useFactory: authHttpServiceFactory,
  //         deps: [Http, RequestOptions]
  //         
  //  }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

