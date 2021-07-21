import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comentario, Lugar, SegmentoHorario, Usuario } from 'src/shared/client.model';
import { ClientService } from 'src/shared/client.service';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { DatePipe, formatDate } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

//import * as EventEmitter from 'events';



@Component({
  selector: 'app-business',
  templateUrl: './business.page.html',
  styleUrls: ['./business.page.scss'],
  providers: [DatePipe]

})
export class BusinessPage implements OnInit {

  lugar: Lugar;
  lugares: Lugar[];
  comentarios: Comentario[];
  comentario: Comentario;
  segments: SegmentoHorario[];
  segment: SegmentoHorario;

  errorMsg: string;
  alertAddFavorPlace: string;
  alertConfirm: string;






  public token: string;
  public usuario: Usuario;

  //pipe = new DatePipe('en')
  selectedSegm: boolean;




  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;

  lugaresFav: Array<string> = [];

  form;
  lugarId;
  usuarioId;
  newComent;
  medidas;

  idSeg;

 
 alertGoPrMessage = "Tienes que ser Premium para iniciar la ruta";
 textGoPrem = "Quiero ser Premium!"
 textCancel = "Cancelar"

  public isCollapsed = true;

  constructor(private activateRoute: ActivatedRoute,
    private translateService: TranslateService,
     private router: Router, private clientService: ClientService, 
     private storage: Storage, private fb: FormBuilder,
      public alertController: AlertController) {

        translateService.get('business.alertAddFavorPlace').subscribe(
          value => {
            // value is our translated string
            this.alertAddFavorPlace = value;
          }
        );
        translateService.get('business.alertConfirm').subscribe(
          value => {
            // value is our translated string
            this.alertConfirm = value;
          }
        );
    

    this.createCommentForm(); // Create comment form on start up
  // this.comDate = this.datePipe.transform(this.commentDate,'yyyy-MM-dd');
  // console.warn(this.comDate);
    
  }


  createCommentForm() {

    this.form = this.fb.group({
      // coment field
      coment: ['', Validators.compose([
       
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })

  }

  // Function to submit a new blog post
  onBlogSubmit() {

    // Create blog object from form fields
    const blog = {
      //  cualificacionLugar: this.form.get('rate').value, // Title field
      cualificacionLugar: this.selectedValue,
      com_contenido: this.form.get('coment').value,
      usuario_oid: this.usuarioId.Us_id, // CreatedBy field
      lugar_oid: this.lugarId,
    

    }

    // Function to save blog into database
    this.clientService.addComment(blog).subscribe((result) => {
      try {
        console.warn("result", result)
        this.comentarios.push(result);
        

      } catch {
        window.location.reload();

      }

    });

    this.form.reset();
  }



  ngOnInit() {


   
    this.storage.create();
    this.storage.get('token').then(token => { this.token = token; })
    this.clientService.getLoggedUsuario().then(u => {
      this.usuarioId = u;
    })
    const id = this.activateRoute.snapshot.paramMap.get('id');
    this.lugarId = id;
    this.clientService.getPlace(id).subscribe(
      (res: any) => {
        this.lugar = res

        this.clientService.getCommentsOnPlace(id).subscribe(response => {
          this.comentarios = response;
          console.warn("comentarios: ", response);

        });

        this.clientService.postCalifMedia(id).subscribe();

        this.clientService.postNivelSeguridad(id).subscribe(res => {
          if (res == "no hay medidas de seguridad") {
            this.lugar.NivelSeguridad = res
          } else {
            this.lugar.NivelSeguridad = "Nivel de seguridad " + res
          }

        });
        this.clientService.getMedidaSeguridad(id).subscribe(res => {
          console.warn("medidas de seguridad: ", res)
          this.medidas = res;

        });

        this.clientService.postIdSegmentoHorario(id).subscribe((result) => {
          this.idSeg = result;
          console.warn("esto es Id del segmento de ahora", this.idSeg)

          if (this.idSeg != 0) {
            this.clientService.postNivelOcupacion(this.idSeg).subscribe((r) => {
              console.warn("post nivel", r);
              this.lugar.DameSegmentoHorario.NivelOcupacion = "Nivel de opuacion " + r;
            });

          } else {
            this.lugar.DameSegmentoHorario.NivelOcupacion = "Esta cerado";
            console.warn("Esta cerado el sitio publico");
          }
        }
        );


      },
      (err: any) => { console.log(err); }
    );



  }

  removeComent(id) {
    this.clientService.removeComent(id).subscribe();
    window.location.reload();
    console.warn("deleted, id: ", id)
  }

  countStar(star) {
    this.selectedValue = star;
    console.warn('value of star: ', this.selectedValue);
  }

  toLogIn() {
    this.router.navigate(['/login'])



  }

  addToFavPlace() {

    const idPlace = this.activateRoute.snapshot.paramMap.get('id');

    this.lugaresFav.push(idPlace);
    this.clientService.getLoggedUsuario().then(u => {
      this.clientService.getFavPlaces(u.Us_id).subscribe(res => {
        this.lugares = res
        console.warn("son lugares fav: ", this.lugares)


        if (this.lugares != undefined) {

          console.warn("id place: ", idPlace)

          let data = this.lugares.find(ob => ob.Id === Number(idPlace));
          console.warn("es data: ", data);

          if (data === undefined) {

            this.clientService.assingFavPlace(u.Us_id, this.lugaresFav).subscribe(res => {
              console.warn("es favorito");
              this.afterAddAlert();

            });

          } else {
            console.warn("is already in list")
            this.presentAlert();
          }

        } else {

          this.clientService.assingFavPlace(u.Us_id, this.lugaresFav).subscribe(res => {
            console.warn("es favorito");
            this.afterAddAlert();
          });

        }

      })


    })




  }
  handleError(error: HttpErrorResponse) {
    console.log("el lugar ya esta anyadido a la lista")
    return throwError(error);

  }



  async presentAlert() {
    const alert = await this.alertController.create({


      message: this.alertConfirm,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }



  async afterAddAlert() {
    const alert = await this.alertController.create({


      message: this.alertAddFavorPlace,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  async alertGoPrmium() {
    const alert = await this.alertController.create({


      message: this.alertGoPrMessage,
      buttons: [
        {
          text: this.textGoPrem,
          handler: (blah) => {
            this.router.navigate(['/settings'])
            console.log('go settings');
        } }, {
          text: this.textCancel,
            role: 'cancel',
            handler: (blah) => {
             
              console.log('cencel');
            }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  


  getRuta(id): void {
    this.router.navigate(['/routes', id]);

  }

  getRutaEstandar() {
    this.alertGoPrmium();
  }




}



