import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


//const endpoint1 = 'http://localhost:56121/api/';
const endpoint = environment.endpoint;

//  const endpoint = 'http://172.20.15.127/WebApiSegura/api/';
const httpOptions = {

};

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {


 httpOptions = {
  headers: new HttpHeaders({
   "Content-Type":"application/json",

  
  })
};


private extractDataTemplate(res: Response) {
  let body = res;
  return body || { };
}

private extractData(res: Response) {
  let body = res;
  return body || { };
}
private extractDataLote(res: Response) {
  let body = res;
  return body || { };
}
private extractGuardarlote(res:Response)
{
  let body = res;
  return body || {};
}
 constructor(private http: HttpClient) { }


 getColas(): Observable<any> {
    return this.http.get(endpoint+"cargueinicial/ConsultaColasIndexacion",httpOptions).pipe(
      map(this.extractData));
  }


  getMotivosDescarte(modulo):Observable<any>{
    return this.http.get(endpoint+"cargueinicial/MotivosDescarte?modulo="+modulo,this.httpOptions).pipe(
      map(this.extractData)
    );
  }

  getTemplate(idTipoDocumental,iddocumento,categoria,xnumeroIdentificacion,xtipoIdentificacion,arrayTiempos,radicado)
  {

    let datoslote = {
      idTipodocumental: idTipoDocumental,
      iddocumento: iddocumento,
      categoria: categoria,
      xNumeroIdentificacion: xnumeroIdentificacion,
      xtipoIdentificacion: xtipoIdentificacion,
      registrarTiempos: arrayTiempos,
      radicado : radicado
    };
   // return this.http.get(endpoint+ 'TipoDocXTemplate/getTemplate?idTipoDocumental='+idTipoDocumental+"&idDocumento="+iddocumento+"&categoria="+categoria+'&xNumeroIdentificacion='+xnumeroIdentificacion+"&xTipoDocumentoIdentificacion="+xtipoIdentificacion+"&registrarTiempos="+json,httpOptions).pipe(
      return this.http.post(endpoint+ 'TipoDocXTemplate/getTemplate',datoslote).pipe(map(this.extractDataTemplate));
  }
  
  getLotes( nombreCola,colaMsgqueue)
  {
     let usuario = localStorage.getItem("usuario");
    return this.http.get(endpoint+ 'Lote/obtenerLoteIndexacion?colaTrabajo='+nombreCola+'&colaMsgQueue='+colaMsgqueue+'&usuario='+usuario,httpOptions).pipe(
      map(this.extractDataLote));
  }

  getLotexidlote(nombreCola,idlote,registrarTiempos)
  {
    let data = {
      idLote : idlote,
      colatrabajo: nombreCola,
      usuario:  localStorage.getItem("usuario"),
      registrarTiempos:registrarTiempos
    }
    
    //return this.http.get(endpoint+ 'Lote/ObtenerLotexIdLote?idlote='+idlote+'&usuario='+usuario+'&colaTrabajo='+nombreCola,httpOptions).pipe(
    return this.http.post(endpoint+ 'Lote/ObtenerLotexIdLote',data,httpOptions).pipe(
    map(this.extractDataLote));
  }

  validarLoteFull(iddocumentos,idlote,xnumeroIdentificacion,xtipoIdentificacion,registrarTiempos,Radicado)
  {
    let datosLote = {
      IdDocs : iddocumentos,
      idLote :idlote,
      xNumeroIdentificacion :xnumeroIdentificacion,
      xTipoDocumentoIdentificacion : xtipoIdentificacion,
      registrarTiempos: registrarTiempos,
      Radicado:Radicado


    }
   // return this.http.get(endpoint+ 'Lote/ValidarLoteFull?IdDocs='+iddocumentos+'&idlote='+idlote+'&xNumeroIdentificacion='+xnumeroIdentificacion+"&xTipoDocumentoIdentificacion="+xtipoIdentificacion ,httpOptions).pipe(
    return this.http.post(endpoint+ 'Lote/ValidarLoteFull',datosLote,httpOptions).pipe(
     map(this.extractDataLote));
  }

  GetDocsXlote(idlote)
  {
    return this.http.get(endpoint+ 'Lote/getDocsxlote?idlote='+idlote ,httpOptions).pipe(
      map(this.extractDataLote));
  }

  GetImagenxiddocumento (iddocumento)
  {
    return this.http.get(endpoint+ 'Imagen/getImagenxdocumento?iddocumento='+iddocumento ,httpOptions).pipe(
      map(this.extractDataLote));
  }
  postGuardarLote(datosLote)
  {
  
    let json = JSON.stringify(datosLote);
      console.log(datosLote);
    //El backend recogerá un parametro jso

    let params = "json="+json;
    return this.http.post(endpoint + 'Lote/guardar', datosLote).pipe(map(this.extractData));
  }

isloggedin()
{
    if(localStorage.getItem("usuario") != null) 
    return true;

    return false;
}


GuardarLote(){

} 
 


  
  }

  export interface User {
    userName: string;
    password: string;
  }
