import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lugar } from 'src/shared/client.model';
import { ClientService } from 'src/shared/client.service';
import { Storage  } from "@ionic/storage";
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  public lugares: Lugar[];
  public lugar: Lugar;
  idSeg;
  form;

  searchValue: string;
  language: string = this.translateService.currentLang;

  types:any[] = [
    {id:1,name:'Centro comercial'},
    {id:2,name:'Parque'},
    {id:3,name:'Playa'},
    {id:4,name:'Restaurante'},
    {id:5,name:'Cafe'},
    {id:6,name:'Museo'},
    {id:7,name:'Tienda'},
   
  ]

  constructor(private clientService:ClientService,
    private translateService: TranslateService,
    private storage:Storage, private router:Router,private fb:FormBuilder) {

  //   this.form = this.fb.group({
  //  }) 
  }

  searchPorDir(dir:string,type:number) {    
    this.clientService.getPlacesByDir(dir).subscribe(res => {
      console.log(res)
      this.lugares = res;
      this.clientService.getPlacesByType(type).subscribe(r => {
        console.warn(r);
        
      })

    })

    
  }

  
  mostrarDetalleLugar(id):void{
    this.router.navigate(['/business', id]);
    }



  ngOnInit() {


    this.storage.create();

    this.clientService.getAllPlaces().subscribe(response=>{
      this.lugares=response;   

      
    // console.warn("son lugares",this.lugares); 

      this.lugares.forEach(element => {
       this.lugar = element;
       console.warn(element);
       this.clientService.getPlace(element.Id).subscribe(result => {
         this.clientService.postIdSegmentoHorario(result.Id).subscribe(res => {
           this.idSeg = res;
               if (this.idSeg != 0 ) {
                 this.clientService.postNivelOcupacion(this.idSeg).subscribe(r => {
                   element.DameSegmentoHorario.NivelOcupacion =r;             
                 })
                 
               } else {
                 element.DameSegmentoHorario.NivelOcupacion = "Esta cerado";
               }
           
         
         })
       })

      })
   });

    
  }


 
}
