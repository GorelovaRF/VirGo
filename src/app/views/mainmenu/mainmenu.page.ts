import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/shared/client.model';
import { Storage  } from "@ionic/storage";
import { ClientService } from 'src/shared/client.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.page.html',
  styleUrls: ['./mainmenu.page.scss'],
})
export class MainmenuPage implements OnInit {

  public token: string;
  public usuario: Usuario;

  constructor(private router:Router,
    private translateService: TranslateService,
    private clientService:ClientService,private storage:Storage) { }

  ngOnInit() {
    this.storage.create();
    this.storage.get('token').then(token=>{this.token = token;})
    this.clientService.getLoggedUsuario().then(u=> {
      this.usuario = u;
      console.warn("usuario: ", u)
    })


    
  }

  toLogIn() {
    this.router.navigate(['/login'])
   // setInterval(function() {location.reload();},100);
   
  
  }

  goToProfile() {
    this.router.navigate(['profile'])
   // setInterval(function() {location.reload();},100);
  }


  goToSearch() {
    this.router.navigate(['search'])
  }

}
