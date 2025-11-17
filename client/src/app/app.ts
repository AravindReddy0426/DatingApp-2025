import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Nav } from "../layout/nav/nav";
import { AccountService } from '../core/services/account-service';
import { Home } from "../features/home/home";
import { user } from '../types/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Nav, Home]
})
export class App implements OnInit {
  private accountService = inject(AccountService);
  private http = inject(HttpClient);
  protected members = signal<user[]>([]);
  protected title = 'Dating App'

  async ngOnInit(){
   this.members.set(await this.getMembers());
    this.SetCurrentUser();
  }

  SetCurrentUser(){
    const userString=localStorage.getItem('user');
    if(!userString) return;
    const user=JSON.parse(userString);
    this.accountService.CurrentUser.set(user);

  }

  async getMembers(){
    try {
      return lastValueFrom(this.http.get<user[]>('https://localhost:5001/api/members'));
    } catch (error) {
      console.log(error);
      throw error;
    }        
  }
}


