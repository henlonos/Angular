import { Component, ViewChild,OnInit,HostListener, ElementRef,EventEmitter, Renderer,Input,Output } from '@angular/core';
import {DocumentsService} from '../../documents.service';
import {ActivatedRoute} from '@angular/router';
import { ImageViewerModule } from 'ng2-image-viewer';
import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl,ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {
  PDFProgressData,
  PdfViewerComponent,
  PDFDocumentProxy,
  PDFSource,
} from 'ng2-pdf-viewer';



@Component({
  selector: 'app-colas-trabajo',
  templateUrl: './colas-trabajo.component.html',
  styleUrls: ['./colas-trabajo.component.scss']
})
export class ColasTrabajoComponent implements OnInit {

  // variables para formulario dinamico
  public form: FormGroup;
  unsubcribe: any;
  public fields: any[];

  // variables para visor pdf
  error: any;
  page = 1;
  rotation = 0;
  zoom = 1.0;
  originalSize = true;
  pdf: any;
  renderText = true;
  progressData: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = false;
  autoresize = true;
  fitToPage = false;
  outline: any[];
  isOutlineShown = false;
  scroll = true;

  // variables carga lote y datos necesario para mostrar la imagen  y sus campos
  pdfQuery = '';
  primerCaptura:any;
  mostrarimagen:boolean;
  mostrarFormulario: boolean;
  mostrarok:boolean;
  colas:any = [];
  tiposDocumentales:any= [];
  idTipoDocSelected:any;
  idTemplateSelected:any;
  lote:any = [];
  template:any=[];
  iddocumentosLote:any;
  NombreDocumento;
  IdLote;
  imagen ; 
  colatrabajo;
  colamsg;
  IdDocumento;
  procesoOK:any;
  ArrayTemplate:any = [];
  guardarlote:any = [];
  src$:any ;
  title = "HorusWebAngular";
  authenticate:any;
  motivosDescarte:any=[];
  categoria:any;
  motivoSelected:any;
  mensajetoast:any;
  indexDocActual:any;
  CantidadDocumentos:any;

  // variable que escucha cualquier tecla digitada. sirve para renderizar la imagen
  public keypressed;

  // se declaran para hacer focus en el ngselect1 de colas al inicio del componente.
  @ViewChild('ngselect1') select: NgSelectComponent;
  @ViewChild('ngselectTipodocumental') selectTipodoc : NgSelectComponent;
  @ViewChild('campos') formulario : NgSelectComponent;
  @ViewChild('modalDescarte') modaldescarte:ElementRef ;
  @ViewChild('descarte') NgSelectModule;
  modalOptions: NgbModalOptions = {};
  pdfSrc: string | PDFSource | ArrayBuffer;
  @ViewChild('pdfv') public target: ElementRef;
  @HostListener('paste',['$event'])blockPaste(e:KeyboardEvent)
  {
    e.preventDefault();
  }
  @HostListener('copy',['$event'])blockCopy(e:KeyboardEvent)
  {
    e.preventDefault();
  }
  @HostListener('cut',['$event'])blockCut(e:KeyboardEvent)
  {
    e.preventDefault();
  }
  @HostListener('window:keydown', ['$event'])handleKeyboardEvent(e) {
  this.keypressed = e.keyCode;
  console.log(this.keypressed);
  if(((e.shiftKey && this.keypressed == 189) || (e.shiftKey && this.keypressed == 109)) && this.pdfSrc != "" )
  {
    e.preventDefault();
     this.zoom += -0.1;

  }
  if((e.shiftKey  &&  this.keypressed == 75) && this.pdfSrc != "" )
  {
    e.preventDefault();
    this.target.nativeElement.scrollTop += 20;
  }
  if((e.shiftKey  &&  this.keypressed == 73) && this.pdfSrc != "" )
  {
    e.preventDefault();
    this.target.nativeElement.scrollTop -= 20;
  }

  if(((e.shiftKey && this.keypressed == 107) || (e.shiftKey &&this.keypressed == 187)) && this.pdfSrc != "" )
  {
    e.preventDefault();
     this.zoom += 0.1;
  }
  if((e.shiftKey && this.keypressed == 37) && this.pdfSrc != "" )
  {
     this.rotation += -90;
  }
  if((e.shiftKey &&this.keypressed == 39) && this.pdfSrc != "" )
  {
     this.rotation += 90;
  }
  if((e.altKey &&  this.keypressed == 114) && this.pdfSrc != "" )
  {
    this.modalOptions.backdrop='static';
    this.modalOptions.keyboard=false;
    
    this.modalService.open(this.modaldescarte,this.modalOptions);

  }

  if(this.keypressed == 113 && this.pdf != "")
  {
    this.page +=  1;  
  }

  if(this.keypressed == 115 && this.pdf != "")
  {
    this.page +=  -1;  
  }
  if (e.shiftKey && this.keypressed == 74 &&  this.pdfSrc != "") {
    
          e.preventDefault();      
    
          console.log(this.keypressed);
    
          this.target.nativeElement.scrollLeft -= 20;
    
        }
    
        if (e.shiftKey && this.keypressed == 76 &&  this.pdfSrc != "") {
    
          e.preventDefault();
    
          console.log(this.keypressed);
    
          this.target.nativeElement.scrollLeft += 20;
    
        }
    


}
  
  

  constructor(private toastr: ToastrService,private renderer: Renderer,  private modalService: NgbModal,private activatedRoute:ActivatedRoute, private restService: DocumentsService, private image:ImageViewerModule ) { 
 
    this.getColas();     
    this.limpiarLocalStorage();
    this.getMotivosDescarte();

  }

ngOnInit() {
 
}

limpiarLocalStorage()
{
  localStorage.removeItem("arrayDocumentos");
  localStorage.removeItem("idDocs");
  localStorage.removeItem("primerCaptura");
  localStorage.removeItem("ValorTipodoc");
}

onChange($event) {

 this.colatrabajo = $event.nombreCola;
 this.colamsg = $event.colaMsgQueue;
 this.imagen = "";
 this.getLotes($event.nombreCola,$event.colaMsgQueue)
 this.limpiarLocalStorage();
 
}
CerrarModal()
{
  this.modalService.dismissAll(this.modaldescarte);
}

guardarDescarte()
{
  this.imagen = false;
  this.mostrarFormulario = false;
   
   let datoslote = {
    datosFormulario : "",
    idlote:this.IdLote,
    idDocumento :this.IdDocumento,
    idtipodoc: this.idTipoDocSelected,
    idtempla: this.idTemplateSelected,
    usuario: localStorage.getItem("usuario"),
    proceso:'captura',
    categoria:'indexacion',
    motivoDescarte:this.motivoSelected
  
  }

  this.validarlotecantidadDocumentos('',this.motivoSelected);
  this.CerrarModal();
  // // console.log(datoslote.motivoDescarte);
  
  // this.guardarlote = this.restService.postGuardarLote(datoslote).subscribe((dataguardar: {}) => {
  // this.procesoOK = dataguardar;
  // if(this.procesoOK)
  // {
  //   this.mensajetoast = 'Documento Descartado Exitosamente!';
  //   this.showSuccess(this.mensajetoast);
  //   this.CerrarModal();
  //   this.getLotes(this.colatrabajo,this.colamsg);
    
  // }
  // else{
  //   this.mensajetoast = 'Documento no fue descartado!'
  //   this.showError(this.mensajetoast);
  // }
  

  // } );
}

displayform(f) {

  this.validarlotecantidadDocumentos(f,'');
}

validarlotecantidadDocumentos(f,movitoDescarte)
{
  let datoslote = {
    datosFormulario : f,
    idlote:this.IdLote,
    idDocumento :this.IdDocumento,
    idtipodoc: this.idTipoDocSelected,
    idtempla: this.idTemplateSelected,
    usuario: localStorage.getItem("usuario"),
    proceso:'captura',
    categoria:'indexacion',
    movitoDescarte: movitoDescarte
  }
 
  if(this.indexDocActual == this.CantidadDocumentos)
  {
    this.imagen = false;
    this.mostrarFormulario = false;
    
    this.actualizarDocumentosLS(datoslote);

    this.guardarlote = this.restService.postGuardarLote(JSON.parse(localStorage.getItem("arrayDocumentos"))).subscribe((dataguardar: {}) => {
    this.procesoOK = dataguardar;
    if(this.procesoOK)
    {
      if (this.motivosDescarte != '')
      {
        this.mensajetoast = 'Documento Descartado Exitosamente!';
      }
      else{
        this.mensajetoast = 'Lote Guardado Exitosamente!'
      }
     
    
      this.showSuccess(this.mensajetoast);
      this.getLotes(this.colatrabajo,this.colamsg);
      this.limpiarLocalStorage();


    }
    else{
      if (this.motivosDescarte != ''){
        this.mensajetoast = 'Documento no fue descartado!'
      }
      else{
        this.mensajetoast = 'No fue posible guardar el lote!'
      }
      
      this.showError(this.mensajetoast);
    }
    
  
    } );
  }
  else
  {
      this.iddocumentosLote = localStorage.getItem("idDocs");
 
      this.actualizarDocumentosLS(datoslote);
      
      if(this.iddocumentosLote == null)localStorage.setItem("idDocs",this.IdDocumento);
      else localStorage.setItem("idDocs",this.iddocumentosLote+'*'+this.IdDocumento);

      this.validarLote(localStorage.getItem("idDocs").toString(),this.IdLote);
      this.selectTipodoc.focus();
      
  }

}

actualizarDocumentosLS(datoslote)
{

  if (localStorage.getItem("arrayDocumentos") == null)
  {
    let arrayDocumentos = [];
    arrayDocumentos.push(datoslote);
    localStorage.setItem("arrayDocumentos",JSON.stringify(arrayDocumentos));
    return false;
  }
 
    let documentos = JSON.parse(localStorage.getItem("arrayDocumentos"));
    documentos.push(datoslote);
    localStorage.setItem("arrayDocumentos",JSON.stringify(documentos));
 

}

getMotivosDescarte()
{
  this.categoria = 'indexacion'
  this.motivosDescarte = [];
  this.restService.getMotivosDescarte(this.categoria).subscribe((data: {}) => {
   
    this.motivosDescarte = data;




  });
}

getColas() {
 this.colas = [];
 this.restService.getColas().subscribe((data: {}) => {
  
   this.colas = data;
   console.log(this.colas);
  
 if(this.imagen != "")
 {
  this.select.focus();
 }
  
 });

}

 validarLote(IdDocs:string, idlote:string)
 {
  this.lote = [];
  this.restService.validarLoteFull(IdDocs,idlote).subscribe((datalote: {}) => {
  this.lote = datalote;
  console.log(this.lote);
  // valores del lote obtenido
  var binaryImg = atob(this.lote.valorimagenBytes);
  var length = binaryImg.length;
  var arrayBuffer = new ArrayBuffer(length);
  var uintArray = new Uint8Array(arrayBuffer);
  this.imagen = this.lote.valorimagenBytes;
  if(this.imagen == '') this.showWarning();
  this.NombreDocumento = this.lote.NombreDocumento;
  this.IdLote = this.lote.idLote;
  this.IdDocumento= this.lote.idDocumento;
  this.indexDocActual = this.lote.indexDocActual;
  this.CantidadDocumentos = this.lote.totalDocumentos;
  for (var i = 0; i < length; i++) {uintArray[i] = binaryImg.charCodeAt(i);}
  var currentBlob = new Blob([uintArray], {type: 'application/pdf'});
  this.pdfSrc =  URL.createObjectURL(currentBlob);

    //renderiza la imagen de entrada a la pantalla
  this.zoom = 1;
  // llena la lista de tipos documentales
  this.tiposDocumentales = this.lote.tdocumentales;
  // devuelve el valor del tipodocumental ya seleccionado para el lote
  this.idTipoDocSelected = this.lote.idTipoDocumental;

  // devuelve el valor del template ya seleccionado para el lote
  this.ArrayTemplate = this.lote.getTemplates;
  this.idTemplateSelected = this.lote.idTemplate;


  // se crean los campos dinamicamente.
  this.fields = this.lote.lstKwXTemplate;
  
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {    
      this.fields = JSON.parse(update.fields);
      
     this.formulario.focus();
    });
 });

 }


getLotes( colatrabajo:string, colaMsgQueue:string)
{   
  this.lote = [];
  this.restService.getLotes(colatrabajo,colaMsgQueue).subscribe((datalote: {}) => {
  this.lote = datalote;
  console.log(this.lote);
  // valores del lote obtenido
  var binaryImg = atob(this.lote.valorimagenBytes);
  var length = binaryImg.length;
  var arrayBuffer = new ArrayBuffer(length);
  var uintArray = new Uint8Array(arrayBuffer);
  this.imagen = this.lote.valorimagenBytes;
  if(this.imagen == '') this.showWarning();
  this.NombreDocumento = this.lote.NombreDocumento;
  this.IdLote = this.lote.idLote;
  this.IdDocumento= this.lote.idDocumento;
  this.indexDocActual = this.lote.indexDocActual;
  this.CantidadDocumentos = this.lote.totalDocumentos;
  for (var i = 0; i < length; i++) {uintArray[i] = binaryImg.charCodeAt(i);}
  var currentBlob = new Blob([uintArray], {type: 'application/pdf'});
  this.pdfSrc =  URL.createObjectURL(currentBlob);
  localStorage.setItem("primerCaptura","1");
    //renderiza la imagen de entrada a la pantalla
  this.zoom = 1;
  // llena la lista de tipos documentales
  this.tiposDocumentales = this.lote.tdocumentales;
  // devuelve el valor del tipodocumental ya seleccionado para el lote
  this.idTipoDocSelected = this.lote.idTipoDocumental;

  // devuelve el valor del template ya seleccionado para el lote
  this.ArrayTemplate = this.lote.getTemplates;
  this.idTemplateSelected = this.lote.idTemplate;


  // se crean los campos dinamicamente.
  this.fields = this.lote.lstKwXTemplate;
  
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {    
      this.fields = JSON.parse(update.fields);
      
     this.formulario.focus();
    });
 });


}

ngDistroy() {
  this.unsubcribe();
}

showSuccess(mensaje) {
  this.toastr.success('', mensaje);
}

showError(mensaje)
{
  this.toastr.error('',mensaje)
}
showWarning() {
  this.toastr.warning('', 'No hay lotes disponibles!');
}


consultarLoteDisponible()
{
   this.mostrarimagen = true;
   this.mostrarFormulario = true;
}

onChangeTipoDocumental($event)
{
  
  this.primerCaptura = localStorage.getItem("primerCaptura")
  if(localStorage.getItem("primerCaptura") == "1")
  {
    localStorage.setItem("primerCaptura","2");
    localStorage.setItem("ValorTipodoc",$event.idTipoDocumental);
    this.selectTipodoc.focus();
    this.idTipoDocSelected = "";
    
    
     

 


    

  }
  else if (localStorage.getItem("primerCaptura") == "2" && (localStorage.getItem("ValorTipodoc") == $event.idTipoDocumental))
  {
    this.getTemplate($event.idTipoDocumental);
    localStorage.removeItem("primerCaptura");
    localStorage.removeItem("ValorTipodoc");
  }
  

}


getTemplate(idTipoDocumental:any)
{
  this.ArrayTemplate= [];
  this.idTemplateSelected = "";
  this.fields = [];
  this.template = [];
  this.categoria = 'indexacion'
  this.restService.getTemplate(idTipoDocumental,this.IdDocumento,this.categoria).subscribe((datatemplate: {}) => {
  this.template = datatemplate;

     // devuelve el valor del template ya seleccionado para el lote
     this.ArrayTemplate = this.template.getTemplates;
     this.idTemplateSelected = this.template.idTemplate;
     this.fields = this.template.lstKwXTemplate;
     console.log(this.fields);
       this.form = new FormGroup({
         fields: new FormControl(JSON.stringify(this.fields))
       })
       this.unsubcribe = this.form.valueChanges.subscribe((update) => {    
         this.fields = JSON.parse(update.fields);
       });
 
  });

   
}


  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;


  toggleOutline() {
    this.isOutlineShown = !this.isOutlineShown;
  }

  incrementPage(amount: number) {
    
      this.page +=  amount;  

  }

  incrementZoom(amount: number) {
    this.zoom += amount;

  }
  onKeyDown(e:any)
  {
    if(e.keyCode == 13 && e.ctrlKey)
    alert('Ctrl+Enter');

  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  /**
   * Render PDF preview on selecting file
   */
  onFileSelected() {
    const $pdf: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
       
      };

      reader.readAsArrayBuffer($pdf.files[0]);
    }
  }

  /**
   * Get pdf information after it's loaded
   * @param pdf
   */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isLoaded = true;

    this.loadOutline();
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  /**
   * Handle error callback
   *
   * @param error
   */
  onError(error: any) {
    this.error = error; // set error

    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );

      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc;
    if (this.pdfSrc instanceof ArrayBuffer) {
      newSrc = { data: this.pdfSrc };
    } else if (typeof this.pdfSrc === 'string') {
      newSrc = { url: this.pdfSrc };
    } else {
      newSrc = { ...this.pdfSrc };
    }
    newSrc.password = password;
    this.pdfSrc = newSrc;
  }

  /**
   * Pdf loading progress callback
   * @param {PDFProgressData} progressData
   */
  onProgress(progressData: PDFProgressData) {
    console.log(progressData);
    this.progressData = progressData;
    this.isLoaded = false;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.navigateTo(destination);
  }

  /**
   * Scroll view
   */
  scrollToPage() {
  
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: 3,
    });


  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param {CustomEvent} e
   */
  pageRendered(e: CustomEvent) {
    // console.log('(page-rendered)', e);
  }

  searchQueryChanged(newQuery: string) {
    if (newQuery !== this.pdfQuery) {
      this.pdfQuery = newQuery;
      this.pdfComponent.pdfFindController.executeCommand('find', {
        query: this.pdfQuery,
        highlightAll: true,
      });
    } else {
      this.pdfComponent.pdfFindController.executeCommand('findagain', {
        query: this.pdfQuery,
        highlightAll: true,
      });
    }
  }

}
