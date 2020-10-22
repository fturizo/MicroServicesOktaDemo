import { Component, OnInit } from '@angular/core';
import config from  '../app.config';
import {OktaAuthService} from "@okta/okta-angular";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {MessagesService} from "../messages.service";

export interface Speaker{
  id: number;
  name: string;
  organization: string;
  accepted: boolean;
  identity: string;
}

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})
export class SpeakersComponent implements OnInit {

  speakers: Array<Speaker>;
  isUserRegistered: boolean;
  currentModal: NgbModalRef;
  registerForm;
  constructor(public authService: OktaAuthService,
              private http: HttpClient,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private messagesService : MessagesService) {
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
      },
      observe: "response"
    }).subscribe(response => {
      if(response.status == 202){
        [].push.apply(this.speakers, response.body);
        this.checkIfUserRegistered();
      }
    }, error => {
      if(error.status == 403) {
        this.messagesService.addMessage('danger', 'Not authorized to view speakers');
      }
    });
  }

  private async checkIfUserRegistered(){
    const user = await this.authService.getUser();
    this.isUserRegistered = this.speakers.findIndex(speaker => speaker.identity == user.sub) > -1;
  }

  async acceptSpeaker(speaker: Speaker): Promise<void> {
    const token = await this.authService.getAccessToken();
    this.http.post(config.serviceURLs.speaker + `speaker/accept/${speaker.id}`,{},{
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: "response"
    }).subscribe(response => {
      if(response.status == 202){
        this.resetSpeakers();
        this.messagesService.addMessage('success','Speaker accepted successfully');
      }
    }, error => {
      if(error.status == 403){
        this.messagesService.addMessage('danger','Not authorized to accept speakers');
      }
    });
  }

  async openRegisterSpeaker(speakerTemplate){
    const userClaims = await this.authService.getUser();
    this.registerForm.patchValue({
      name : userClaims.name,
      organization: ''
    });
    this.currentModal = this.modalService.open(speakerTemplate, {
      centered: true,
      ariaLabelledBy: 'modal-basic-title'
    });
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
        this.resetSpeakers();
        this.registerForm.reset();
        this.currentModal.dismiss();
        this.messagesService.addMessage('success','You are registered as a speaker');
      }
    }, error => {
      if(error.status == 403){
        this.currentModal.dismiss();
        this.messagesService.addMessage('danger','Not authorized to add yourself as a speaker');
      }
    });
  }

  private async resetSpeakers(){
    this.speakers = [];
    await this.ngOnInit();
  }
}
