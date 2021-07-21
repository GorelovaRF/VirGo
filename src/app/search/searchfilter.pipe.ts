import { Pipe, PipeTransform } from '@angular/core';
import { from } from 'rxjs';
import { Lugar} from 'src/shared/client.model';

@Pipe({
  name: 'searchfilter'
  
})
export class SearchfilterPipe implements PipeTransform {

  transform(Lugares: Lugar[],searchValue: string): Lugar[] {
    if (!Lugares || !searchValue) {
      return Lugares;
    }
    return Lugares.filter(lugar => 
      lugar.LugName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
    //  lugar.TipoLugar.toString().toLocaleLowerCase().includes(searchType.toLocaleLowerCase()) ||
      lugar.Direccion.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      lugar.CualificacionMedia.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      lugar.DameSegmentoHorario.NivelOcupacion.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      lugar.NivelSeguridad.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) 
    
    );
  }

}
