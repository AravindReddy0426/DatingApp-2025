import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected members = signal<any[]>([]);
  protected title = 'Dating App';

  async ngOnInit(){
    this.members.set(await this.getMembers())
  }

  async getMembers(){
    try {
      return lastValueFrom(this.http.get<any[]>('https://localhost:5001/api/members'));      
    } catch (error) {
      console.log(error);
      throw error;
    }    
  }
}
