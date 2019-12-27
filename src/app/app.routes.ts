import {RouterModule, Routes } from '@angular/router'
import {ColasTrabajoComponent} from './components/colas-trabajo/colas-trabajo.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './auth-guard.service';


const APP_ROUTES: Routes = [


     { path: 'colas', component:ColasTrabajoComponent,canActivate:[AuthGuard]},
     { path: 'Login', component:LoginComponent},
    // { path: '**', pathMatch: 'full' , redirectTo:'home'}

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);