import { Component, inject, Inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';


@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected accountService=inject(AccountService);
  protected creds: any={}
  // protected LoggedIn= signal(false);


   login(){
    this.accountService.login(this.creds).subscribe({
      next: result => {
        console.log(result);
        // this.LoggedIn.set(true);
        this.creds={};
      },
      error: error => alert(error.message)
  });

}
logout(){
  // this.LoggedIn.set(false);
  this.accountService.logout();
}

}
