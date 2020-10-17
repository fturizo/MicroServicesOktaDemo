import {Component, Input, OnInit} from '@angular/core';
import {OktaAuthService} from '@okta/okta-angular';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  @Input() isAuthenticated: boolean;

  constructor(public authService: OktaAuthService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.loginRedirect();
  }

  logout(): void {
    this.authService.logout('/');
  }

}
