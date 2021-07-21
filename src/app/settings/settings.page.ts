import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/shared/client.service';
import { Storage  } from "@ionic/storage";
import { Comentario, Usuario } from 'src/shared/client.model';
import { CustomvalidationService } from "../_helpers/customvalidation.service";
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public token: string;
  public usuario: Usuario;

 

  updateForm: FormGroup;
  updatePassForm: FormGroup;

  alertMessage = "Estas seguro que quieres eliminar tu cuenta?";
  textCancel = "Cancelar";
  textOK = "Si";

  selectedValue


info;
id; 


  
  constructor(private storage:Storage, 
    private translateService: TranslateService,
     private clientService:ClientService, private fb:FormBuilder,private customVal: CustomvalidationService,public alertController: AlertController,  private router: Router) { }



  

  ngOnInit() {
   
    this.storage.create();
    this.storage.get('token').then(token=>{this.token = token;})
    this.clientService.getLoggedUsuario().then(u=> {
      this.usuario = u; 


          this.updateForm = this.fb.group({
      userName: [this.usuario.Us_nombre, Validators.compose([
        Validators.required ])],
      // userPass: [this.usuario.Pass,Validators.compose([
      //     Validators.required,this.customVal.patternValidator()])],
      userPhone: [this.usuario.Telefono,Validators.compose([
            Validators.required])],
      userPhoto: [this.usuario.Us_foto,Validators.compose([
        Validators.required])],
      userType: [this.usuario.TipoUsuario,Validators.compose([
        Validators.required])],
      cardHolder: ['',Validators.compose([
        Validators.required])],
      cardNumber: ['',Validators.compose([
          Validators.required])],
      exprDate: ['',Validators.compose([
            Validators.required, Validators.pattern('[0-9]{2}/[0-9]{2}')])],
      cvv: ['',Validators.compose([
              Validators.required])],
        

    }
    // ,{
    //   validator : this.customVal.MatchPassword('userPass','passConfirm')
    // }
    );


    this.updatePassForm = this.fb.group({

      userPass: ['',Validators.compose([
        Validators.required,this.customVal.patternValidator()])],
      passConfirm: ['', [Validators.required]]

    },{
        validator : this.customVal.MatchPassword('userPass','passConfirm')
      })

      
    });

      

  }

  get formContr() {
    return this.updatePassForm.controls;
    
  }

  get formContr1() {
    return this.updateForm.controls;
  }



  async presentAlert() {
    const alert = await this.alertController.create({
     
      
      message: 'La informacion se ha cambiado correctamente',
      buttons: ['OK']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

  }


  async passAlert() {
    const alert = await this.alertController.create({
     
      
      message: 'La contraseña se ha cambiado correctamente',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

  }



  
  updateUserInfo() {  
    
    this.id = this.usuario.Us_id;

    


      const info = {
     
       // us_id:this.usuario.Us_id,
        us_nombre:this.updateForm.get('userName').value,
       //pass: this.usuario.Pass,
       // pass: this.updateForm.get('userPass').value,
        telefono: this.updateForm.get('userPhone').value,
        tipoUsuario: this.updateForm.get('userType').value,
        us_foto: this.updateForm.get('userPhoto').value,
        
      }
    
      this.clientService.updateInfoUser(this.id,info,this.token).subscribe(res =>{
        console.warn(res);
      // this.usuario.Us_id = info.us_id;
        this.usuario.Us_nombre = info.us_nombre;
      //  this.usuario.Pass = info.pass;
        this.usuario.Telefono = info.telefono;
        this.usuario.TipoUsuario = info.tipoUsuario;
        this.usuario.Us_foto = info.us_foto;
        this.storage.set("usuario",this.usuario);
        this.presentAlert();
        setInterval(function(){ location.reload(); }, 1000);
        
      });


    
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({

      message: this.alertMessage,
      buttons: [
        {
          text: this.textCancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.textOK,
          handler: () => {
            this.delete(this.usuario.Us_id);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  updatePass() {

    this.id = this.usuario.Us_id;

       if(this.usuario.Pass == this.updatePassForm.get('userPass').value || this.updatePassForm.valid) {

    const newPass = { 
       pass: this.updatePassForm.get('userPass').value,
    }

    this.clientService.updatePass(this.id,newPass,this.token).subscribe(res => {
      this.usuario.Pass = newPass.pass;
      
    }) 
    this.passAlert();
    console.warn("se ha cambiado la contrasenya");

    setInterval(function(){ location.reload(); }, 1000);


  } 

  }

  delete(id) {

 this.clientService.getUserById(id).subscribe(res => {
   let comentarios = [res.DameComentariosDeUsuario]
   console.warn(comentarios);
   if (comentarios != null) {
      for (var c of comentarios) {
        console.log(c);
        for (var idComment of c) {
          console.log(idComment.Id);
          try {
            this.clientService.removeComent(idComment.Id).subscribe((result) => {
              console.log("delete Comments", result)
            });
            console.log("hey")
          } catch (error) {
            console.log("comment null");
          }
        }
      }
    }

 })

   this.clientService.deleteUsuario(id).subscribe(res => {
    console.warn("deleted, id: ",id)
    this.clientService.logout();
    this.router.navigate(['/home']);
    setInterval(function() {location.reload();},200);
    
   })
   
  
  }


  onChange(event) {
    // set 'predefined' or 'opentype' based on selected value of the form
     this.selectedValue = event.target.value;
   }


}
