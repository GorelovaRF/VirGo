import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/shared/client.service';
import { Storage  } from "@ionic/storage";
import { CustomvalidationService } from "../_helpers/customvalidation.service";
import { TranslateService } from '@ngx-translate/core';
import { UserAlreadyExistsService } from 'src/shared/userAlreadyExists/user-already-exists.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  form :FormGroup;
  userName;
  userEmail;
  userPass;
  userPhone;

  public userType: number;
  public userPhoto: string;







  constructor(private activateRoute:ActivatedRoute,
    private translateService: TranslateService,
    private router:Router, private clientService:ClientService,private storage:Storage,private fb:FormBuilder, 
    private customVal: CustomvalidationService,
    private userAlreadyExistsService:UserAlreadyExistsService) { 
    this.createUserForm();
   
  }

  createUserForm() {

    this.form = this.fb.group({
      // coment field
      userName: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(150),
        Validators.minLength(2)])],
      userEmail: ['',Validators.compose([
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$") 
      ]),
        [this.userAlreadyExistsService.userValidator()]],
      userPass: ['',Validators.compose([
          Validators.required,this.customVal.patternValidator()])],
      userPhone: ['',Validators.compose([
            Validators.required])],
      passConfirm: ['', [Validators.required]]
    
    }, {
      validator : this.customVal.MatchPassword('userPass','passConfirm')
    });
    
  }

  get formContr() {
    return this.form.controls;
  }



 

  onInfoSubmit() {
    
    if (this.form.valid) {
      const info = {
        us_nombre:this.form.get('userName').value,
        us_email:this.form.get('userEmail').value,
        pass: this.form.get('userPass').value,
        tipoUsuario: this.userType,
        telefono: this.form.get('userPhone').value,
        us_foto: this.userPhoto
      }
  
      this.clientService.createNewUser(info).subscribe((result) =>{
        console.warn("Signed Up user: ", result);
      });
  
      this.form.reset();
  
      this.router.navigate(['/login'])

    } else {
      console.warn("not valid: ",this.form.valid)
    }
     

    
   
  }


  ngOnInit() {

    this.storage.create();

    this.userType =1;
    this.userPhoto = "https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"

  }

}
