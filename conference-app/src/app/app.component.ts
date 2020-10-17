import {Component, OnInit} from '@angular/core';
import { OktaAuthService} from '@okta/okta-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public isAuthenticated = false;

  constructor(public authService: OktaAuthService) {
    this.authService.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
  }

  async ngOnInit(): Promise<void> {
    this.isAuthenticated = await this.authService.isAuthenticated();
  }
}
