
  export interface Usuario{
    Us_id?:number;
    Us_nombre?:string;
    Us_email?:string;
    Pass?:string;
    Telefono?:string;
    Us_foto?:string;
    TipoUsuario?:number;
    EsPropietario?: boolean;
    DameComentariosDeUsuario?:  Comentario[];

  }
  
  export interface Lugar {
    Id?: number;
    LugName: string;
    CualificacionMedia?: number;
    Foto?: string;
    Direccion: string;
    Descripcion: string;
    TipoLugar: number;
    WebsiteUrl: string;
    FechaCreacion?: Date;
    Telefono: string;
    Email:string;
    HorarioApertura:string;
    PuntoMapa?: PuntoMapa;
    Comentarios?: Comentario[];
    DameSegmentoHorario?: SegmentoHorario;
    esFavorito?: boolean;
    Propietario?: Usuario;
    DameMedidaDeSeguridadDeLugar? : MedidaDeSeguridad;
    NivelSeguridad: string;
  
  }
  
  export interface PuntoMapa{
    Id?:number;
    Latitud:number;
    Longitud:number;
  }
  
  export interface Comentario{
    Id?:number;
    Com_contenido: string;
    CualificacionLugar: number;
    DateCreacion:Date;
    UsuarioComProp?: Usuario;
    LugarID?: Lugar;
   
  }
  
  export interface SegmentoHorario{
    Id:number;
    HoraInicio:Date;
    HoraFin:Date;
    NumeroPersonas:number;
    NivelOcupacion:string;
  }

  export interface MedidaDeSeguridad{
    Id:number;
    Medida:number;
  }
  