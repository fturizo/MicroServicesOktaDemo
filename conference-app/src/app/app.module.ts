import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SpeakersComponent } from './speakers/speakers.component';
import { SessionsComponent } from './sessions/sessions.component';

import { OKTA_CONFIG, OktaAuthGuard, OktaAuthModule, OktaCallbackComponent } from '@okta/okta-angular';
import config from './app.config';

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
    TopBarComponent,
    ProfileComponent,
    SpeakersComponent,
    SessionsComponent
  ],
  imports: [
    BrowserModule,
    OktaAuthModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {provide: OKTA_CONFIG, useValue: config.okta}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
