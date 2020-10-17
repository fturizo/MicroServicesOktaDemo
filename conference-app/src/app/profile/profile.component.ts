import { Component, OnInit } from '@angular/core';
import {OktaAuthService} from '@okta/okta-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userName: string;
  fullName: string;
  constructor(public authService: OktaAuthService) { }

  async ngOnInit(): Promise<void> {
    const userClaims = await this.authService.getUser();
    this.userName = userClaims.sub;
    this.fullName = userClaims.name;
  }

}
