import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from '@angular/router';

import config from './app.config';
import { OKTA_CONFIG, OktaAuthGuard, OktaAuthModule, OktaCallbackComponent } from '@okta/okta-angular';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SpeakersComponent } from './speakers/speakers.component';
import { SessionsComponent } from './sessions/sessions.component';

import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule} from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [OktaAuthGuard]},
  {path: 'sessions', component: SessionsComponent, canActivate: [OktaAuthGuard]},
  {path: 'speakers', component: SpeakersComponent, canActivate: [OktaAuthGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    SpeakersComponent,
    SessionsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OktaAuthModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [
    {provide: OKTA_CONFIG, useValue: config.okta}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
