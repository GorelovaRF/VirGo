import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, pluck } from 'rxjs/operators';
import { ClientService } from '../client.service';
import {
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Usuario } from '../client.model';

@Injectable({
  providedIn: 'root'
})
export class UserAlreadyExistsService {

usuarios: Usuario[] 


//emailsResgistrados: string[]

emailsResgistrados = ["test"]
  constructor(private clientService: ClientService) { 
        
this.clientService.getAllUsers().subscribe(res => {
  this.usuarios = res
 // console.warn(res)
 for (var e of this.usuarios) {
   this.emailsResgistrados.push(e.Us_email)
 }
 console.warn(this.emailsResgistrados)
  
 
})

  }


  checkIfUserExists(emailIntro: string): Observable<boolean> {
    // normally, this is where you will connect to your backend for validation lookup
    // using http, we simulate an internet connection by delaying it by a second
    return of(this.emailsResgistrados.includes(emailIntro)).pipe(delay(1000));
  }



  userValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfUserExists(control.value).pipe(
        map(res => {
          console.log(res);
          // if res is true, username exists, return true
          return res ? { userExists: true } : null;
          // NB: Return null if there is no error
        })
      );
    };
  }

}
