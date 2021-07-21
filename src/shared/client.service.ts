import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Usuario,Lugar,Comentario,SegmentoHorario, PuntoMapa,MedidaDeSeguridad} from './client.model';
import { from, Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Storage} from '@ionic/storage';
import { GoogleMap, LatLng, MarkerOptions } from '@ionic-native/google-maps';


const httpOptionsCreate = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
};

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin' : 'http://localhost:8100'

  })
};

const httpOptionsLogin = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  }) 
};

@Injectable({
  providedIn: 'root'
}) 

export class ClientService {

  private readonly HS_API_URL = 'http://localhost:16209/api';
  private token : string;
  private headers = new HttpHeaders;
  private usuario: Usuario; 
  


  constructor(private http: HttpClient,
    private storage: Storage) {

   }

   public RecuperarToken (){
    
    var promise = this.storage.get('token').then (token => {
      this.token = token;
      this.headers = new HttpHeaders ({'Authorization': this.token});
    });
    return promise;
  }

  public login(email: string, password: string): Observable<any> {
 
    let cli:Usuario = {Us_email: email, Pass: password};
   
     return this.http.post<any>(`${this.HS_API_URL}/UsuarioAnonimo/Login`, cli, httpOptionsLogin)
    .pipe(
        catchError((err) => {
          console.log("Error en el login");
          console.error(err);
          return throwError(err);
        }
        )
      );
  }

  logout() {
    this.token = null;
    this.usuario = null;
    this.storage.clear();
  }

  public createNewUser(info):Observable<Usuario>{
  
    return this.http.post<Usuario>(`${this.HS_API_URL}/Usuario/CrearUsuario`, info,  {headers:this.headers});
  }


  public getLoggedUsuario(): Promise<Usuario> {
    return this.storage.get('usuario');
  }

  public getClientePorEmail(token:string): Observable<Usuario>{

    this.headers = new HttpHeaders ({'Authorization': token});
    return this.http.get<Usuario>(`${this.HS_API_URL}/UsuarioRegistrado`, {headers:this.headers});   
}

public getAllUsers():Observable<Usuario[]>{
  return this.http.get<Usuario[]>(`${this.HS_API_URL}/Usuario/ReadAll`,{headers:this.headers});
}


updateInfoUser(id,info,token:string):Observable<Usuario> {
  this.headers = new HttpHeaders ({'Authorization': token});  // Create headers
  return this.http.put<Usuario>(`${this.HS_API_URL}/Usuario/ModificarUsuario?idUsuario=${id}`, info,  {headers:this.headers});
}

updatePass(id,newPass,token:string):Observable<Usuario> {
  this.headers = new HttpHeaders ({'Authorization': token});  // Create headers
  return this.http.put<Usuario>(`${this.HS_API_URL}/Usuario/CambiarContrasena?idUsuario=${id}`, newPass,  {headers:this.headers});
}

public postPlace(lugName, lugType,lugDirection, lugOpenTime,
  lugWebsite, lugEmail, lugTel, lugDescription, lugFoto, idPuntoMapa, idPropietario, dateCreate): Observable<Lugar> {
 //this.headers = new HttpHeaders({ 'Authorization': token });
 return this.http.post<Lugar>(`${this.HS_API_URL}/Lugar/CrearLugar?p_puntomapa=${idPuntoMapa}&p_lugname=${lugName}&p_tipolugar=${lugType}&p_direccion=${lugDirection}&p_propietario=${idPropietario}&p_descripcion=${lugDescription}&p_websiteurl=${lugWebsite}&p_fechacreacion=${dateCreate}&p_telefono=${lugTel}&p_email=${lugEmail}&p_horarioapertura=${lugOpenTime}&p_foto=${lugFoto}`,  httpOptionsCreate);
}


deleteUsuario(id) {
  return this.http.delete<Usuario[]>(`${this.HS_API_URL}/Usuario/EliminarUsuario?p_usuario_oid=${id}`, {headers:this.headers});

}

public getUserById(id):Observable<Usuario>{
  return this.http.get<Usuario>(`${this.HS_API_URL}/Usuario/${id}`,{headers:this.headers});
}


public getAllPlaces():Observable<Lugar[]>{
  return this.http.get<Lugar[]>(`${this.HS_API_URL}/Lugar/ReadAll`,{headers:this.headers});
}

public getPlace(id):Observable<Lugar>{
  return this.http.get<Lugar>(`${this.HS_API_URL}/Lugar/${id}`, {headers:this.headers});
}

public getFavPlaces(id):Observable<Lugar[]> {
  return this.http.get<Lugar[]>(`${this.HS_API_URL}/Lugar/DameLugaresFavoritosPorUsuario?p_usuario=${id}`, {headers:this.headers});
}

public assingFavPlace(id,idLugares):Observable<Lugar> {
  return this.http.put<Lugar>(`${this.HS_API_URL}/Usuario_2/AnyadirLugarFavorito?p_usuario_oid=${id}`, idLugares, {headers:this.headers});
}

public deleteFavPlace(id,idLugares):Observable<Lugar> {
  return this.http.put<Lugar>(`${this.HS_API_URL}/Usuario_2/BorrarLugFav?p_usuario_oid=${id}`,idLugares, {headers:this.headers});
}



public getPlacesByDir(direction):Observable<Lugar[]> {
  return this.http.get<Lugar[]>(`${this.HS_API_URL}/Lugar/DameLugarPorDireccion?p_direccion=${direction}`, {headers:this.headers});
}



public getPlacesByType(type):Observable<Lugar[]> {
  return this.http.get<Lugar[]>(`${this.HS_API_URL}/Lugar/DameLugarPorTipo?p_tipolugar=${type}`, {headers:this.headers});
}




public getCommentsOnPlace(id):Observable<Comentario[]>{
  return this.http.get<Comentario[]>(`${this.HS_API_URL}/Comentario/DameComentariosLugar?idLugar=${id}`, {headers:this.headers});
}


public getSegmentosHorario():Observable<SegmentoHorario[]>{
  return this.http.get<SegmentoHorario[]>(`${this.HS_API_URL}/SegmentoHorario/ReadAll`, {headers:this.headers});
}

public postIdSegmentoHorario(id):Observable<SegmentoHorario[]>{
  return this.http.post<SegmentoHorario[]>(`${this.HS_API_URL}/Lugar/DameSegmentoDeAhora?p_luagr=${id}`, {headers:this.headers});
}



public postNivelOcupacion(idSegmHorario):Observable<any>{
  return this.http.post<any>(`${this.HS_API_URL}/SegmentoHorario/SegmentoHorario_dameNivelOcupacion?p_oid=${idSegmHorario}`, {headers:this.headers});
}

public getSegmentById(id):Observable<SegmentoHorario>{
  return this.http.get<SegmentoHorario>(`${this.HS_API_URL}/SegmentoHorario/DameSegmentoPorId?p_seg_id=${id}`, {headers:this.headers});
}


public postCalifMedia(id):Observable<any>{
  return this.http.post<any>(`${this.HS_API_URL}/Lugar/Lugar_dameCualificacionMedia?p_lugar=${id}`, {headers:this.headers});
}


public addComment(blog):Observable<Comentario>{
  
  return this.http.post<Comentario>(`${this.HS_API_URL}/Comentario/CrearComentario`, blog,  {headers:this.headers});
}

removeComent(id) {
  return this.http.delete<Comentario[]>(`${this.HS_API_URL}/Comentario/BorrarComentario?p_comentario_oid=${id}`, {headers:this.headers});

}



public getLocation(): Promise<any> 
{
  return new Promise((resolve, reject) => {

    navigator.geolocation.getCurrentPosition(resp => {

        resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
      },
      err => {
        reject(err);
      });
  });

}


public postPuntoMapa(pMapa): Observable<PuntoMapa> {
  return this.http.post<PuntoMapa>(`${this.HS_API_URL}/PuntoMapa/CrearPuntoMapa`, pMapa, { headers: this.headers })
}


public getMedidaSeguridad(id):Observable<MedidaDeSeguridad[]>{
  return this.http.get<MedidaDeSeguridad[]>(`${this.HS_API_URL}/MedidaDeSeguridad/DameMedidasDeLugar?p_lugar=${id}`, {headers:this.headers});
}

public postNivelSeguridad(id):Observable<any>{
  return this.http.post<any>(`${this.HS_API_URL}/Lugar/DameNivelSeguridad?p_oid=${id}`, {headers:this.headers});
}








}
