import { Component, OnInit } from '@angular/core';
import {OktaAuthService} from '@okta/okta-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  name: string;
  email: string;
  idToken: string;
  constructor(public authService: OktaAuthService) { }

  async ngOnInit(): Promise<void> {
    const idClaims  = await this.authService.getUser();
    this.name = idClaims.name;
    this.email = idClaims.email;
    this.idToken = JSON.stringify(idClaims, null, '  ');
  }
}
