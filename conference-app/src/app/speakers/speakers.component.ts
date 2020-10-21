import { Component, OnInit } from '@angular/core';
import config from  '../app.config';
import {OktaAuthService} from "@okta/okta-angular";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {$} from "protractor";

export interface Speaker{
  id: number;
  name: string;
  organization: string;
  accepted: boolean;
}

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})
export class SpeakersComponent implements OnInit {

  speakers: Array<Speaker>[];
  registerForm;
  constructor(public authService: OktaAuthService, private http: HttpClient, private formBuilder: FormBuilder) {
    this.speakers = [];
    this.registerForm = formBuilder.group({
      name: '',
      organization: '',
    });
  }

  async ngOnInit(): Promise<void> {
    const token = await this.authService.getAccessToken();
    this.http.get(config.serviceURLs.speaker + 'speaker/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe((data: Array<Speaker>) => {
      [].push.apply(this.speakers, data);
    });
  }

  acceptSpeaker(speaker: Speaker): void {

  }

  async openRegisterSpeaker(){
    const userClaims = await this.authService.getUser();
    this.registerForm.patchValue({
      name : userClaims.name,
      organization: ''
    });
    //$('#registerSpeakerModal').modal('show');
  }

  async registerSpeaker(data : Speaker){
    const token = await this.authService.getAccessToken();
    this.http.post(config.serviceURLs.speaker + 'speaker/', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      observe: "response"
    }).subscribe((response) => {
      if(response.status == 201){
        this.registerForm.reset();

      }else{

      }
    });
  }
}
