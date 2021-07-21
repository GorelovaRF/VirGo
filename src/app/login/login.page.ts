import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/shared/client.model';
import { ClientService } from 'src/shared/client.service';
import {Storage} from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  public token: String;
  public usuario: Usuario;
  public errMessage:string;
  public errorMessage: string;

  constructor(private fb: FormBuilder, 
    private router: Router,
    private translateService: TranslateService,
    private storage: Storage,
    private clienteService: ClientService) {

      // translateService.get('errMessage').subscribe(
      //   value => {
      //     // value is our translated string
      //     this.errorMessage = value;
      //   }
      // );
     }

  ngOnInit() {
    this.storage.create();
       this.loginForm = this.fb.group({
      'email': ['', Validators.compose([
        Validators.required
      ])],
      'password': ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  get f() { return this.loginForm.controls; }

  login (){
    this.clienteService.login(this.f.email.value, this.f.password.value)
          .subscribe(token => {
            this.token = token; 
            this.storage.set('token', this.token);
          /// En caso correcto se recupera el cliente registrado
            this.clienteService.getClientePorEmail (token).subscribe 
              (
                
                (usuario:Usuario) => {
                  this.usuario = usuario; 
                  this.storage.set('usuario', this.usuario);
                  console.log(this.usuario);
                  this.router.navigate(['home']);
                  console.log(token);
                }
              );
              setInterval(function() {location.reload();},200);
          
          },
          (error) => {
               this.errorMessage = "err"
               
                throw error;
          }
          );
          
      
    }


    toSingIn() {
      this.router.navigate(['/registration'])

    }

    homeGuest() {
      this.router.navigate(['/home'])
    }



}
