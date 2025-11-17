import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, user } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  CurrentUser= signal<user | null>(null);
  
  baseUrl = 'https://localhost:5001/api/';

  register(creds: RegisterCreds) {
    return this.http.post<user>(this.baseUrl + 'account/register', creds).pipe(
      tap(user=>{
        if(user){
          this.setcurrentUser(user);
        }
      })
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<user>(this.baseUrl + 'account/login', creds).pipe(
      tap(user=>{
        if(user){
          this.setcurrentUser(user);
        }
      })
    );
  }

  setcurrentUser(User: user){
    localStorage.setItem('user', JSON.stringify(User));
    this.CurrentUser.set(User);
  }

  logout(){
    localStorage.removeItem('user');
    this.CurrentUser.set(null);
  }
}
