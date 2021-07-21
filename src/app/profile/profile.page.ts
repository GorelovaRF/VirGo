import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/shared/client.service';
import { Lugar,Usuario } from 'src/shared/client.model';
import { Router } from '@angular/router';
import { Storage  } from "@ionic/storage";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {



  
  public token: string;
  public usuario: Usuario;
  public lugares: Lugar[];

  lugaresToDelete: Array<string> = [];

  

  constructor(private clientService:ClientService,
    private translateService: TranslateService,
    private storage:Storage,private router:Router) {

       }

  ngOnInit() {
   
    this.storage.create();
    this.storage.get('token').then(token=>{this.token = token;})
    this.clientService.getLoggedUsuario().then(u=> {
      this.usuario = u;
      this.clientService.getFavPlaces(u.Us_id).subscribe(response=>{
        this.lugares=response;
       
        console.warn("fav places: ",this.lugares);
      })
    })



  }


  mostrarDetalleLugar(id):void{
    this.router.navigate(['/business', id]);
    }


    goToCreatePlace():void{
      this.router.navigate(['/create']);
      }


      goToSettings():void{
        this.router.navigate(['/settings']);
        }
  



  deleteFavPlace(idPlace) {

    this.lugaresToDelete.push(idPlace);

    this.clientService.getLoggedUsuario().then(u => {
      this.clientService.deleteFavPlace(u.Us_id,this.lugaresToDelete).subscribe(res => {
        console.warn("esta eliminado: ",idPlace);   
       // setInterval(function() {location.reload();},500); 
       window.location.reload();

      })
    })






}



}
