import { Component, OnInit } from '@angular/core';
import {OktaAuthService} from "@okta/okta-angular";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {MessagesService} from "../messages.service";
import config from "../app.config";

interface Session{
  id: number,
  title: string,
  venue: string,
  date: Date,
  duration: string
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {

  sessions: Array<Session>;
  private registeredSessionIds: Array<number>;
  currentModal: NgbModalRef;
  createForm;

  constructor(public authService: OktaAuthService,
              private http: HttpClient,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private messagesService : MessagesService) {
    this.sessions = [];
    this.registeredSessionIds = [];
    this.createForm = formBuilder.group({
      title: '',
      venue: '',
      date: '',
      duration: ''
    });
  }

  async ngOnInit(): Promise<void> {
    const token = await this.authService.getAccessToken();
    this.http.get(config.serviceURLs.session + 'session/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe((data: Array<Session>) => {
      [].push.apply(this.sessions, data);
      this.loadRegisteredIds(token);
    }, error => {
      if(error.status == 403){
        this.messagesService.addMessage("danger", "Not authorized to view sessions");
      }
    });
  }

  private loadRegisteredIds(token: string){
    this.http.get(config.serviceURLs.session + 'register/current', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe((data: Array<Session>) => {
        this.registeredSessionIds = data.map(session => session.id);
    });
  }

  private resetSessions(): void{
    this.sessions = [];
    this.ngOnInit();
  }

  checkRegisteredSession(session : Session): boolean{
    return this.registeredSessionIds.indexOf(session.id) > -1;
  }

  async openCreateSession(sessionTemplate){
    this.createForm.reset();
    this.currentModal = this.modalService.open(sessionTemplate, {
      centered: true,
      ariaLabelledBy: 'modal-basic-title'
    });
  }

  async createSession(data){
    const token = await this.authService.getAccessToken();
    this.http.post(config.serviceURLs.session + 'session/', {
      title: data.title,
      venue: data.venue,
      date: `${data.date.year}-${data.date.month}-${data.date.day}`,
      duration: data.duration,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe(() => {
      this.resetSessions();
      this.createForm.reset();
      this.currentModal.dismiss();
      this.messagesService.addMessage('success','Successfully added new session');
    }, error => {
      if(error.status == 403){
        this.currentModal.dismiss();
        this.messagesService.addMessage('danger','Not authorized to create new sessions');
      }
    });
  }

  async attendSession(session : Session): Promise<void>{
    const token = await this.authService.getAccessToken();
    this.http.post(config.serviceURLs.session + `register/${session.id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(() => {
      this.resetSessions();
      this.messagesService.addMessage('success', `You are attending the "${session.title}" session`);
    }, error => {
      if(error.status == 403){
        this.messagesService.addMessage("danger", 'Not authorized to attend sessions');
      }
    });
  }

  async deleteSession(session : Session): Promise<void>{
    const token = await this.authService.getAccessToken();
    this.http.delete(config.serviceURLs.session + `session/${session.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: "response"
    }).subscribe(() => {
      this.resetSessions();
      this.messagesService.addMessage('success', 'Session deleted successfully');
    }, error => {
      if(error.status == 403){
        this.messagesService.addMessage("danger", "Not authorized to delete sessions");
      }
    });
  }
}
