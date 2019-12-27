import {
  Component,
  ViewChild,
  OnInit,
  Inject,
  PLATFORM_ID,
  HostListener,
  ElementRef,
  EventEmitter,
  Renderer,
  Input,
  Output
} from "@angular/core";
import { DocumentsService } from "../../documents.service";
import { ActivatedRoute } from "@angular/router";
import { ImageViewerModule } from "ng2-image-viewer";
import { ToastrService } from "ngx-toastr";
import { NgSelectComponent, NgSelectModule } from "@ng-select/ng-select";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { isPlatformBrowser, DatePipe } from "@angular/common";
import { SweetMessageService } from 'src/app/sweet-message.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import {
  PDFProgressData,
  PdfViewerComponent,
  PDFDocumentProxy,
  PDFSource
} from "ng2-pdf-viewer";
import { formGroupNameProvider } from "@angular/forms/src/directives/reactive_directives/form_group_name";
import { Builder } from "protractor";
import { DynamicFormBuilderComponent } from "src/app/dynamic-form-builder/dynamic-form-builder.component";
import { __values } from "tslib";
import { Type } from "@angular/compiler";
import { Local } from 'protractor/built/driverProviders';

@Component({
  selector: "app-colas-trabajo",
  templateUrl: "./colas-trabajo.component.html",
  styleUrls: ["./colas-trabajo.component.scss"],
  providers: [DatePipe]
})
export class ColasTrabajoComponent implements OnInit {
  // variables para formulario dinamico
  public form: FormGroup;
  public formdinamico: FormGroup;
  myForm: FormGroup;
  unsubcribe: any;
  public fields: any[];
  public controls: any;
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
  pdfQuery = "";
  primerCaptura: any;
  mostrarimagen: boolean;
  mostrarFormulario: boolean;
  mostrarok: boolean;
  colas: any = [];
  tiposDocumentales: any = [];
  idTipoDocSelected: any;
  idTemplateSelected: any;
  idTipoDocCorreccionSelected: any;
  idTemplateCorreccionSelected: any;
  lote: any = [];
  dataadicional: any = [];
  template: any = [];
  iddocumentosLote: any;
  NombreDocumento;
  IdLote;
  imagen;
  imagenAdicional;
  colatrabajo;
  colamsg;
  IdDocumento;
  procesoOK: any;
  ArrayTemplate: any = [];
  arrayTiempos:any = [];
  guardarlote: any = [];
  src$: any;
  title = "HorusWebAngular";
  authenticate: any;
  motivosDescarte: any = [];
  categoria: any;
  motivoSelected: any;
  mensajetoast: any;
  indexDocActual: any;
  CantidadDocumentos: any;
  focus:any = 0;
  myDate = new Date();
  data: any = [];
  columnas: string[];
  marked = false;
  theCheckbox = false;
  formularioupdate : any;
  modalopen:boolean = false;
  TipoDocumentoAutoHereda :any;
  NDocumentoAutoHereda :any;
  PrecargaTipoDoc:any = null;
  arraydocsvalidar:any = [];
  Guardando= false;
  iddocumentoCorrecion:any;
  validar = false;
  noguardar = false;
  datacambiar : any;
  copyDate:any;
  // variable que escucha cualquier tecla digitada. sirve para renderizar la imagen
  public keypressed;
  modalOptions: NgbModalOptions = {};
  pdfSrc: string | PDFSource | ArrayBuffer;
  pdfSrcdataadicional: string | PDFSource | ArrayBuffer;

  // se declaran para hacer focus en el ngselect1 de colas al inicio del componente.
  @ViewChild("ngselect1") select: NgSelectComponent;
  @ViewChild("ngselectTipodocumental") selectTipodoc: NgSelectComponent;
  @ViewChild("ngselectTipodocumentalCorreccion") selectcorreccionTipoDoc : NgSelectComponent;
  @ViewChild("ngSelectTemplateCorreccion") selectemplateCorreccion : NgSelectComponent;
  @ViewChild("ngSelectTemplate") selectTemplate: NgSelectComponent;
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  @ViewChild("campos") formulario: NgSelectComponent;
  @ViewChild("modalDescarte") modaldescarte: ElementRef;
  @ViewChild("dataadicional") modaldataadicional : ElementRef;
  @ViewChild("corregirData") modalCorreccion : ElementRef;
  @ViewChild("descarte") NgSelectModule;
  @ViewChild("pdfv") public target: ElementRef;
  @ViewChild("idcliente") IdCliente :ElementRef;
  @ViewChild("buscarid") public buscar: ElementRef;
  @ViewChild("field") public targetFields: ElementRef;
  @ViewChild("xFechaExpedicion", { read: ElementRef }) xfecha: ElementRef;
  @ViewChild("divFormDinamico") public divDinamico: ElementRef;
  @HostListener("paste", ["$event"]) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener("copy", ["$event"]) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener("cut", ["$event"]) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener("window:keydown", ["$event"]) handleKeyboardEvent(e) {
    this.keypressed = e.keyCode;
     //console.log(this.keypressed);


    if(e.ctrlKey && this.keypressed == 117 && localStorage.getItem("arrayDocumentos") != null)
    {
      this.modalOptions.backdrop = "static";
      this.modalOptions.keyboard = false;
      this.modalOptions.size = "lg";
      this.modalService.open(this.modalCorreccion,this.modalOptions, );
      this.modalopen = true;
   
      // var values = JSON.parse(localStorage.getItem("arrayDocumentos"));

     let values = localStorage.getItem("idDocs").split('*'); 
     
     let arraydife  = [];

      values.forEach( function(item) {
      
        console.log(item);
        var Id = {IdDocumento : item}
         arraydife.push(
            Id
         )

      });
       
      this.data = arraydife;
      
      this.columnas =  [
        "IdDocumento", "VerImagen"
      ]
      console.log(this.data);
    }

    if(e.shiftKey && this.keypressed == 9)
    {
      if (this.focus > 0)
      {
        this.focus =  this.focus - 1;
      }
    }

    if (
      ((e.shiftKey && this.keypressed == 189) ||
        (e.shiftKey && this.keypressed == 109)) &&
      this.pdfSrc != ""
    ) {
      e.preventDefault();
      this.zoom += -0.1;
    }
    if (!e.ctrlKey && e.shiftKey && this.keypressed == 75 && this.pdfSrc != "") {
      e.preventDefault();
      this.target.nativeElement.scrollTop += 20;
    }
    if (
      e.shiftKey && 
      e.ctrlKey && this.keypressed == 70 && 
      this.idTemplateSelected &&
      this.idTemplateSelected
    ) {
      if (this.fields[this.focus - 1].type === "datetext") {
        var date = this.datePipe.transform(this.myDate, "MMddyyyy");
        (<HTMLInputElement>(
          document.getElementById(this.fields[this.focus - 1].name)
        )).value = date;
    
      }
    }
    if (e.shiftKey && this.keypressed == 73 && this.pdfSrc != "") {
      e.preventDefault();
      this.target.nativeElement.scrollTop -= 20;
    }

    if (
      ((e.shiftKey && this.keypressed == 107) ||
        (e.shiftKey && this.keypressed == 187)) &&
      this.pdfSrc != ""
    ) {
      e.preventDefault();
      this.zoom += 0.1;
    }
    if (e.shiftKey && this.keypressed == 37 && this.pdfSrc != "") {
      this.rotation += -90;
    }
    if (e.shiftKey && this.keypressed == 39 && this.pdfSrc != "") {
      this.rotation += 90;
    }
    if (e.altKey && this.keypressed == 114 && this.pdfSrc != "") {
      this.modalOptions.backdrop = "static";
      this.modalOptions.keyboard = false;
      this.modalService.open(this.modaldescarte, this.modalOptions);
    }


    if( this.keypressed == 118 && this.idTemplateSelected  != "")
    {
      this.modalOptions.backdrop = "static";
      this.modalOptions.keyboard = false;
      this.modalOptions.size = "lg";
      this.modalService.open(this.modaldataadicional,this.modalOptions, );
      this.modalopen = true;
      this.restService.GetDocsXlote(this.IdLote)
      .subscribe((datalote: {}) => {
        this.data = datalote;
      }
      );

      this.columnas =  [
        "IdDocumento", "TipoDocumental", "IdCliente", "NombreDocumento","VerImagen"
      ]

    }
    if (
      this.keypressed == 13 &&
      this.idTemplateSelected &&
      this.idTipoDocSelected && this.modalopen == false && this.form.valid 
    ) {
         
     

    

      //this.ctrlFocoScrollForm('');
    }

    if (this.keypressed == 113 && this.pdf != "") {
     
      if(this.page +1 <= this.pdf.numPages)
      {
        // this.page = this.page + 1;
        // incrementPage(+1);
        this.incrementPage(+1);
      }
      
      console.log(this.page);

    }
    if(e.ctrlKey && e.shiftKey && this.keypressed == 75)
    {
       this.target.nativeElement.scrollTop = this.target.nativeElement.scrollHeight;
    }

    if(e.ctrlKey && e.shiftKey && this.keypressed == 73)
    {
       this.target.nativeElement.scrollTop = 0;
    }

    if (!e.shiftKey && this.keypressed == 9 && this.idTemplateSelected && this.idTipoDocSelected && this.modalopen == false && this.PrecargaTipoDoc == null) {

      this.ctrlFocoScrollForm('focustab');
    }

    if (this.keypressed == 115 && this.pdf != "") {
      if(this.page - 1 >  0)
      {
        setInterval('',500);
        this.incrementPage(-1);
        // this.page = this.page -1;
        // console.log(this.page);

        ;
      }
      
      
    }
    if (e.shiftKey && this.keypressed == 74 && this.pdfSrc != "") {
      e.preventDefault();
      this.target.nativeElement.scrollLeft -= 20;
    }
    if (e.shiftKey && this.keypressed == 76 && this.pdfSrc != "") {
      e.preventDefault();
      this.target.nativeElement.scrollLeft += 20;
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private renderer: Renderer,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private restService: DocumentsService,
    private image: ImageViewerModule,
    private message:SweetMessageService
  ) {
    this.getColas();
    this.limpiarLocalStorage();
    this.getMotivosDescarte();

  }

  ngOnInit() {}

  copiarIdCliente(e)
  {
    if(this.idTemplateSelected != "" && this.pdfSrcdataadicional != "")
    {
     
      this.formularioupdate  = this.targetFields;
      let idcliente:string = e.srcElement.value;

      (<HTMLInputElement>(
        document.getElementById(this.fields[4].name)
      )).value = idcliente;

      (<HTMLInputElement>(
        document.getElementById(this.fields[5].name)
      )).value = idcliente;

        this.formularioupdate.form.controls["xNumeroIdentificacion"].value = idcliente;
        this.formularioupdate.form.controls["xNumeroIdentificacionrecaptura"].value = idcliente;
        this.formularioupdate.form.controls["xNumeroIdentificacionrecaptura"].status = "VALID";
        this.formularioupdate.form.controls["xNumeroIdentificacion"].status = "VALID";
        this.imagenAdicional = "";
        // this.form.get('xNumeroIdentificacion').valueChanges.subscribe(idcliente);
        this.modalService.dismissAll(this.modaldataadicional);
        this.modalopen = false;
    }
  }

  submitForm($event)
  {
         console.log($event);
         console.log(localStorage.getItem("iddocCorreccion"));
         var documentos = JSON.parse(localStorage.getItem("arrayDocumentos"));
         for(var i = 0; i < documentos.length; i++)
         {
           
           if(documentos[i].idDocumento == localStorage.getItem("iddocCorreccion")){
          
                let array:any = Object.entries(documentos[i].datosFormulario);
         
                  let arraycontroles = Object.entries($event);
                   console.log(arraycontroles);

                   for(var k = 0 ; k < arraycontroles.length; k ++)
                   {
                     
                    let value:any = arraycontroles[k][0];
                    let valor:any = arraycontroles[k][1];
                     for(var j = 0 ; j < array.length; j ++)
                     {
                      if(value === array[j][0])
                      {
                        if(documentos[i].datosFormulario.Radicado !== valor.value && value == "Radicado")
                        {
                          documentos[i].datosFormulario.Radicado = valor.value;
                          documentos[i].idtipodoc = this.idTipoDocCorreccionSelected;
                          documentos[i].idtempla = this.idTemplateCorreccionSelected;
                          localStorage.setItem("arrayDocumentos",JSON.stringify(documentos));
                        
                          
                        }
                        else if (documentos[i].idtipodoc !== this.idTipoDocCorreccionSelected)
                        {
                          documentos[i].idtipodoc = this.idTipoDocCorreccionSelected;
                          documentos[i].idtempla = this.idTemplateCorreccionSelected;
                          localStorage.setItem("arrayDocumentos",JSON.stringify(documentos));
                        }
                        else if (documentos[i].datosFormulario.xFechaExpedicion !== valor.value && value == "xFechaExpedicion")
                        {
                          documentos[i].datosFormulario.xFechaExpedicion = valor.value;
                          documentos[i].idtipodoc = this.idTipoDocCorreccionSelected;
                          documentos[i].idtempla = this.idTemplateCorreccionSelected;
                          localStorage.setItem("arrayDocumentos",JSON.stringify(documentos));
                          
                        }
                        else if (documentos[i].datosFormulario.xTipoDocumentoIdentificacion !== valor.value && value == "xTipoDocumentoIdentificacion")
                        {
                          
                          documentos[i].datosFormulario.xTipoDocumentoIdentificacion = valor.value;
                          documentos[i].idtipodoc = this.idTipoDocCorreccionSelected;
                          documentos[i].idtempla = this.idTemplateCorreccionSelected;              
                          localStorage.setItem("arrayDocumentos",JSON.stringify(documentos));
                          
                        }
                        else if (documentos[i].datosFormulario.xNumeroIdentificacion !== valor.value && value == "xNumeroIdentificacion")
                        {
                          documentos[i].datosFormulario.xNumeroIdentificacion = valor.value;
                          documentos[i].idtipodoc = this.idTipoDocCorreccionSelected;
                          documentos[i].idtempla = this.idTemplateCorreccionSelected;  
                          localStorage.setItem("arrayDocumentos",JSON.stringify(documentos));
                          
                     
                        }
                        else if (documentos[i].datosFormulario.xIdentificadorFisico !== valor.value && value == "xIdentificadorFisico")
                        {
                          documentos[i].datosFormulario.IdentificadorFisico = valor.value;
                          documentos[i].idtipodoc = this.idTipoDocCorreccionSelected;
                          documentos[i].idtempla = this.idTemplateCorreccionSelected;
                          localStorage.setItem("arrayDocumentos",JSON.stringify(documentos));
                          
                        }
                        
                        // let nombre : string = value;
                        // JSON.stringify(documentos[i].datosFormulario) +"."+ nombre == valor.value;
                        // //array[j][1] == valor.value;
                        // console.log(valor.value);
                        // console.log(    JSON.stringify(documentos[i].datosFormulario+"."+ nombre));

                   
                      }

                     }
                   
                   


           

                 

                      
             

               
                //  if($event.controls[i].name = documentos[i].datosFormulario.$event.controls[i].name)
                //  {
                //    console.log("!Son Iguales");
                //  }
               }
  
               this.showSuccess("Cambio realizado exitosamente al documento "+ documentos[i].idDocumento);
               localStorage.removeItem("iddocCorreccion");
             }
         
             
         } 

  }

  ctrlFocoScrollForm(focustab)
  {

    let divDinamico = this.divDinamico.nativeElement.scrollTop;
      if (this.focus < this.fields.length) {
        if (divDinamico === 0 || divDinamico === 1)
        this.divDinamico.nativeElement.scrollTop += 1;
        if (divDinamico === 0 || divDinamico === 1) {
            if(focustab === '' ) document.getElementById(this.fields[this.focus].name).focus();
            this.focus = this.focus + 1;
        } else {
          if(focustab ===  '' ) document.getElementById(this.fields[this.focus].name).focus();

          this.focus = this.focus + 1;
          if (divDinamico === 0 || divDinamico === 1)
            this.divDinamico.nativeElement.scrollTop += 1;
          else this.divDinamico.nativeElement.scrollTop += 30;
        }
      }
  }

  limpiarLocalStorage() {
    localStorage.removeItem("arrayDocumentos");
    localStorage.removeItem("idDocs");
    localStorage.removeItem("primerCaptura");
    localStorage.removeItem("ValorTipodoc");
    localStorage.removeItem("xNumeroIdentificacion");
    localStorage.removeItem("xTipoDocumentoIdentificacion");
    localStorage.removeItem("Radicado");
    this.focus = 0;
    this.fields = [];
    this.page = 1;
    this.arrayTiempos= "";
    this.NDocumentoAutoHereda = null;
    this.TipoDocumentoAutoHereda = null;
    
  }
  onInputChange(event:any) {
     
    let newVal = event.target.value;
    if(newVal.length === 10){
      return this.copyDate = newVal;
    }
    newVal = newVal.replace('/', '');

    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 2) {
      newVal = newVal.replace(/^(\d{0,2})/, '$1');
    } else if (newVal.length <= 5) {
      newVal = newVal.replace('/', '');
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})/, '$1/$2');
    } else{
      newVal = newVal.replace('/', '');
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})(\d{0,4})/, '$1/$2/$3');
    } 
    this.copyDate = newVal;

    
  }


  correcciones($event) {
    // this.colatrabajo = $event.nombreCola;
    // this.colamsg = $event.colaMsgQueue;
    // this.imagen = "";
    // this.getLotes($event.nombreCola, $event.colaMsgQueue);
    // this.limpiarLocalStorage();
    console.log($event);
  }

  onchangetipodoccorreccion($event)
  {
      this.buscartemplatecorreccion($event.idTipoDocumental);
  }

  buscartemplatecorreccion (idtipodocumental)
  {
    this.restService
    .getTemplate(idtipodocumental, this.IdDocumento, this.categoria,(localStorage.getItem("xNumeroIdentificacion") != null ?localStorage.getItem("xNumeroIdentificacion") : null ),(localStorage.getItem("xTipoDocumentoIdentificacion") != null ?localStorage.getItem("xTipoDocumentoIdentificacion"): null),this.arrayTiempos,   (localStorage.getItem("Radicado") != null ?localStorage.getItem("Radicado"): null))
    .subscribe((datatemplate: {}) => {
      this.template = datatemplate;
      // devuelve el valor del template ya seleccionado para el lote
      this.ArrayTemplate = this.template.getTemplates;
      this.idTemplateCorreccionSelected = this.template.idTemplate;
      this.idTipoDocCorreccionSelected = idtipodocumental;
    
    });
  }

  toggleVisibilityCorreccion(e,iddocumento:bigint){
    this.marked= e.target.checked;
 
    if(this.marked)
    {
        var documentos = JSON.parse(localStorage.getItem("arrayDocumentos"));
    
         for(var i = 0; i < documentos.length; i++)
          {


          if(documentos[i].idDocumento == iddocumento){
 

 
           this.datacambiar = Object.entries(documentos[i].datosFormulario);
   
        
           this.idTipoDocCorreccionSelected = documentos[i].idtipodoc;
       
           this.buscartemplatecorreccion(this.idTipoDocCorreccionSelected);

           this.copyDate = documentos[i].datosFormulario.xFechaExpedicion;
           localStorage.setItem("iddocCorreccion",documentos[i].idDocumento);
    }

    
} 
 

      

      this.dataadicional = [];
      this.restService
        .GetImagenxiddocumento(iddocumento)
        .subscribe((dataimagen: {}) => {
          this.dataadicional = dataimagen;
       
          // valores del lote obtenido
          var binaryImg = atob(this.dataadicional);
          var length = binaryImg.length;
          var arrayBuffer = new ArrayBuffer(length);
          var uintArray = new Uint8Array(arrayBuffer);
          this.imagenAdicional = this.lote.valorimagenBytes;
          if (this.imagenAdicional == "") this.showWarning();
          this.NombreDocumento = this.lote.NombreDocumento;
        
          for (var i = 0; i < length; i++) {
            uintArray[i] = binaryImg.charCodeAt(i);
          }
          var currentBlob = new Blob([uintArray], { type: "application/pdf" });
          this.pdfSrcdataadicional = URL.createObjectURL(currentBlob);
     
          
          //renderiza la imagen de entrada a la pantalla
          this.zoom = 1;
        });
      
    }
 
    
    this.imagenAdicional ="";
    e.checked = false;
 

  }



  toggleVisibility(e,iddocumento:bigint){
    this.marked= e.target.checked;
  
    if(this.marked)
    {
    
      this.dataadicional = [];
      this.restService
        .GetImagenxiddocumento(iddocumento)
        .subscribe((dataimagen: {}) => {
          this.dataadicional = dataimagen;
       
          // valores del lote obtenido
          var binaryImg = atob(this.dataadicional);
          var length = binaryImg.length;
          var arrayBuffer = new ArrayBuffer(length);
          var uintArray = new Uint8Array(arrayBuffer);
          this.imagenAdicional = this.lote.valorimagenBytes;
          if (this.imagenAdicional == "") this.showWarning();
          this.NombreDocumento = this.lote.NombreDocumento;
        
          for (var i = 0; i < length; i++) {
            uintArray[i] = binaryImg.charCodeAt(i);
          }
          var currentBlob = new Blob([uintArray], { type: "application/pdf" });
          this.pdfSrcdataadicional = URL.createObjectURL(currentBlob);
     
          
          //renderiza la imagen de entrada a la pantalla
          this.zoom = 1;
        });
      
    }
 
    
    this.imagenAdicional ="";
    e.checked = false;
 

  }


  onChange($event) {
    this.colatrabajo = $event.nombreCola;
    this.colamsg = $event.colaMsgQueue;
    this.imagen = "";
    this.getLotes($event.nombreCola, $event.colaMsgQueue);
    this.limpiarLocalStorage();
  }


  setFocus(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      this[id].nativeElement.focus();
    }
  }

  CerrarModal() {
    this.modalService.dismissAll(this.modaldescarte);
  }

  CerrarModalDataAdicional() {
    this.modalService.dismissAll(this.modaldataadicional);
    this.modalopen = false;
  }

  guardarDescarte() {
    this.message.showLoading();
    this.imagen = false;
    this.mostrarFormulario = false;
    let datoslote = {
      datosFormulario: [],
      idlote: this.IdLote,
      idDocumento: this.IdDocumento,
      idtipodoc: this.idTipoDocSelected,
      idtempla: this.idTemplateSelected,
      usuario: localStorage.getItem("usuario"),
      proceso: "captura",
      categoria: "indexacion",
      motivoDescarte: this.motivoSelected
    };

    this.validarlotecantidadDocumentos({}, this.motivoSelected,this.NDocumentoAutoHereda,this.TipoDocumentoAutoHereda);
    this.motivoSelected = '';
    this.CerrarModal();
  }

  displayform(f) {

    if(!this.validar)
    {
        
    // this.arraydocsvalidar =  (localStorage.getItem("idDocs") == null ? '' :localStorage.getItem("idDocs").split('*'));
    if(localStorage.getItem("idDocs")!= null)this.arraydocsvalidar = localStorage.getItem("idDocs").split('*');
    console.log(this.arraydocsvalidar);
      if(this.arraydocsvalidar != '')
      {
        for(var i = 0; i < this.arraydocsvalidar.count; i ++ )
        {
          if(this.arraydocsvalidar[i] == this.IdDocumento) this.noguardar = true;

          console.log(this.arraydocsvalidar[i]);
        }
      }
    
      this.validar = true;
      console.log(this.noguardar);
      
    }
    else if(this.validar == true  && this.noguardar==false && this.Guardando == false)
    {
     
        // this.keypressed.preventDefault();
      
      this.page = 1;
      this.pdf = "";
      this.pdfSrc = "";
      this.pdfSrcdataadicional = "";

      this.Guardando = true;
      console.log(this.Guardando);
      this.message.showLoading();

        if(!this.noguardar )
        {
          this.validar = false;
          if(this.noguardar = true) this.noguardar = false;
        
            if(this.colatrabajo == "Vinculacion Sin Herencia - Indexación")
            {
              this.validarlotecantidadDocumentos(f, "",f.xNumeroIdentificacion,f.xTipoDocumentoIdentificacion);
              localStorage.setItem("xNumeroIdentificacion",f.xNumeroIdentificacion);
              localStorage.setItem("xTipoDocumentoIdentificacion",f.xTipoDocumentoIdentificacion);
              localStorage.setItem("Radicado",f.Radicado);
            }
            else{
              this.validarlotecantidadDocumentos(f, "",f.xNumeroIdentificacion,f.xTipoDocumentoIdentificacion);
              localStorage.setItem("xNumeroIdentificacion",f.xNumeroIdentificacion);
              localStorage.setItem("xTipoDocumentoIdentificacion",f.xTipoDocumentoIdentificacion);
            }

   
   
          
        
        }
    }
  }

  validarlotecantidadDocumentos(f, motivoDescarte,numeroIdentHereda,tipoDocumentHereda) {
    let datoslote = {
      datosFormulario: f,
      idlote: this.IdLote,
      idDocumento: this.IdDocumento,
      idtipodoc: this.idTipoDocSelected,
      idtempla: this.idTemplateSelected,
      usuario: localStorage.getItem("usuario"),
      proceso: "captura",
      categoria: "indexacion",
      motivoDescarte: motivoDescarte,
      registroTiempos:this.arrayTiempos,
      colatrabajo:  this.colatrabajo
    };

    this.message.close();
    if (this.indexDocActual == this.CantidadDocumentos) {
      this.imagen = false;
      this.mostrarFormulario = false;
      this.actualizarDocumentosLS(datoslote);
      this.guardarlote = this.restService
        .postGuardarLote(JSON.parse(localStorage.getItem("arrayDocumentos")))
        .subscribe((dataguardar: {}) => {
          this.procesoOK = dataguardar;
          if (this.procesoOK) {
            if (datoslote.motivoDescarte != "") {
              this.mensajetoast = "Documento Descartado Exitosamente!";
            } else {
              this.mensajetoast = "Lote Guardado Exitosamente!";
            }
            this.showSuccess(this.mensajetoast);
            this.getLotes(this.colatrabajo, this.colamsg);
            this.Guardando = false;
            this.limpiarLocalStorage();
            
          } else {
            if (datoslote.motivoDescarte != "") {
              this.mensajetoast = "Documento no fue descartado!";
            } else {
              this.mensajetoast = "No fue posible guardar el lote!";
            }
            this.showError(this.mensajetoast);
          }
        });
    } else {
      this.NDocumentoAutoHereda = localStorage.getItem("xNumeroIdentificacion");
      this.TipoDocumentoAutoHereda = localStorage.getItem("xTipoDocumentoIdentificacion");
  
      this.iddocumentosLote = localStorage.getItem("idDocs");
      this.actualizarDocumentosLS(datoslote);
      if (this.iddocumentosLote == null)
        localStorage.setItem("idDocs", this.IdDocumento);
      else
        localStorage.setItem(
          "idDocs",
          this.iddocumentosLote + "*" + this.IdDocumento
        );
      this.validarLote(localStorage.getItem("idDocs").toString(), this.IdLote,this.NDocumentoAutoHereda,this.TipoDocumentoAutoHereda, (this.colatrabajo =="Vinculacion Sin Herencia" ? localStorage.getItem("xTipoDocumentoIdentificacion") : ''));
      localStorage.setItem("primerCaptura", "1");
      this.focus = 0;
      this.Guardando = false;
    }
  }

  actualizarDocumentosLS(datoslote) {
    if (localStorage.getItem("arrayDocumentos") == null) {
      let arrayDocumentos = [];
      arrayDocumentos.push(datoslote);
      localStorage.setItem("arrayDocumentos", JSON.stringify(arrayDocumentos));
      return false;
    }
    let documentos = JSON.parse(localStorage.getItem("arrayDocumentos"));
    documentos.push(datoslote);
    localStorage.setItem("arrayDocumentos", JSON.stringify(documentos));
  }

  getMotivosDescarte() {
    this.categoria = "indexacion";
    this.motivosDescarte = [];
    this.restService
      .getMotivosDescarte(this.categoria)
      .subscribe((data: {}) => {
        this.motivosDescarte = data;
      });
  }

  buscaridlote($event,idlote)
  {
        this.restService.getLotexidlote(this.colatrabajo,idlote.value,this.arrayTiempos).subscribe((data:{}) => {
          this.lote = data;
          // valores del lote obtenido
          var binaryImg = atob(this.lote.valorimagenBytes);
          var length = binaryImg.length;
          var arrayBuffer = new ArrayBuffer(length);
          var uintArray = new Uint8Array(arrayBuffer);
          this.imagen = this.lote.valorimagenBytes;
          if (this.imagen == "") this.showWarning();
          this.NombreDocumento = this.lote.NombreDocumento;
          this.IdLote = this.lote.idLote;
          this.IdDocumento = this.lote.idDocumento;
          this.indexDocActual = this.lote.indexDocActual;
          this.CantidadDocumentos = this.lote.totalDocumentos;
          for (var i = 0; i < length; i++) {
            uintArray[i] = binaryImg.charCodeAt(i);
          }
          var currentBlob = new Blob([uintArray], { type: "application/pdf" });
          this.pdfSrc = URL.createObjectURL(currentBlob);
          localStorage.setItem("primerCaptura", "1");
          //renderiza la imagen de entrada a la pantalla
          this.zoom = 1;
          // llena la lista de tipos documentales
          this.tiposDocumentales = this.lote.tdocumentales;
          // devuelve el valor del tipodocumental ya seleccionado para el lote
          this.idTipoDocSelected = this.lote.idTipoDocumental;
          // devuelve el valor del template ya seleccionado para el lote
          this.ArrayTemplate = this.lote.getTemplates;
          this.idTemplateSelected = this.lote.idTemplate;
          this.arrayTiempos = this.lote.registroTiempos;
          if(this.lote.idTipoDocumental != "") this.PrecargaTipoDoc = "Ok";
          // se crean los campos dinamicamente.
          this.fields = this.lote.lstKwXTemplate;
          console.log(this.fields);
          this.form = new FormGroup({
            fields: new FormControl(JSON.stringify(this.fields))
          });
          this.unsubcribe = this.form.valueChanges.subscribe(update => {
            this.fields = JSON.parse(update.fields);
          });
        });
      this.focus = 0;
      this.limpiarLocalStorage();
  }

  getColas() {
    this.colas = [];
    this.restService.getColas().subscribe((data: {}) => {
      this.colas = data;
      
      if (this.imagen != "") {
        this.select.focus();
      }
    });
  }

  validarLote(IdDocs: string, idlote: string,xNumeroIdentificacion:string, xTipoDocumentoIdentificacion:string, Radicado:string) {
    this.lote = [];
    this.restService
      .validarLoteFull(IdDocs, idlote,xNumeroIdentificacion,xTipoDocumentoIdentificacion,this.arrayTiempos,Radicado)
      .subscribe((datalote: {}) => {
        this.lote = datalote;
        // valores del lote obtenido
        var binaryImg = atob(this.lote.valorimagenBytes);
        var length = binaryImg.length;
        var arrayBuffer = new ArrayBuffer(length);
        var uintArray = new Uint8Array(arrayBuffer);
        this.imagen = this.lote.valorimagenBytes;
        if (this.imagen == "") this.showWarning();
        this.NombreDocumento = this.lote.NombreDocumento;
        this.IdLote = this.lote.idLote;
        this.IdDocumento = this.lote.idDocumento;
        this.indexDocActual = this.lote.indexDocActual;
        this.CantidadDocumentos = this.lote.totalDocumentos;
        for (var i = 0; i < length; i++) {
          uintArray[i] = binaryImg.charCodeAt(i);
        }
        var currentBlob = new Blob([uintArray], { type: "application/pdf" });
        this.pdfSrc = URL.createObjectURL(currentBlob);
        //renderiza la imagen de entrada a la pantalla
        this.zoom = 1;
        // llena la lista de tipos documentales
        this.tiposDocumentales = this.lote.tdocumentales;
        // devuelve el valor del tipodocumental ya seleccionado para el lote
        this.idTipoDocSelected = this.lote.idTipoDocumental;
        this.arrayTiempos = this.lote.registroTiempos;
        // devuelve el valor del template ya seleccionado para el lote
        this.ArrayTemplate = this.lote.getTemplates;
        this.idTemplateSelected = this.lote.idTemplate;
        console.log(this.idTipoDocSelected); console.log(this.idTemplateSelected);
        if(this.lote.idTipoDocumental != "")
        {      
          this.selectTemplate.focus();
        }
        else{
          this.selectTipodoc.focus();
        }
        if(this.lote.idTipoDocumental != "") this.PrecargaTipoDoc = "Ok";
        // se crean los campos dinamicamente.
        this.fields = this.lote.lstKwXTemplate;
        console.log(this.fields);
        this.form = new FormGroup({
          fields: new FormControl(JSON.stringify(this.fields))
        });
        this.unsubcribe = this.form.valueChanges.subscribe(update => {
          this.fields = JSON.parse(update.fields);
          this.formulario.focus();
        });
      });
  }

  getLotes(colatrabajo: string, colaMsgQueue: string) {
    this.lote = [];
    this.restService
      .getLotes(colatrabajo, colaMsgQueue)
      .subscribe((datalote: {}) => {
        this.lote = datalote;
        // valores del lote obtenido
        var binaryImg = atob(this.lote.valorimagenBytes);
        var length = binaryImg.length;
        var arrayBuffer = new ArrayBuffer(length);
        var uintArray = new Uint8Array(arrayBuffer);
        this.arrayTiempos = this.lote.registroTiempos;
        this.imagen = this.lote.valorimagenBytes;
        if (this.imagen == "") this.showWarning();
        this.NombreDocumento = this.lote.NombreDocumento;
        this.IdLote = this.lote.idLote;
        this.IdDocumento = this.lote.idDocumento;
        this.indexDocActual = this.lote.indexDocActual;
        this.CantidadDocumentos = this.lote.totalDocumentos;
        for (var i = 0; i < length; i++) {
          uintArray[i] = binaryImg.charCodeAt(i);
        }
        var currentBlob = new Blob([uintArray], { type: "application/pdf" });
        this.pdfSrc = URL.createObjectURL(currentBlob);
        localStorage.setItem("primerCaptura", "1");
        //renderiza la imagen de entrada a la pantalla
        this.zoom = 1;
        // llena la lista de tipos documentales
        this.tiposDocumentales = this.lote.tdocumentales;
        // devuelve el valor del tipodocumental ya seleccionado para el lote
        this.idTipoDocSelected = this.lote.idTipoDocumental;
        // devuelve el valor del template ya seleccionado para el lote
        this.ArrayTemplate = this.lote.getTemplates;
        this.idTemplateSelected = this.lote.idTemplate;
        if(this.lote.idTipoDocumental != "") this.PrecargaTipoDoc = "Ok";
        this.buscar.nativeElement.focus();
        // se crean los campos dinamicamente.
        this.fields = this.lote.lstKwXTemplate;
        this.form = new FormGroup({
          fields: new FormControl(JSON.stringify(this.fields))
        });
        this.unsubcribe = this.form.valueChanges.subscribe(update => {
          this.fields = JSON.parse(update.fields);
        });
      });
    this.focus = 0;
  }
   

  onChangeTemplate()
  {
    this.PrecargaTipoDoc = null;
    this.selectTemplate.close();
  }

  ngDistroy() {
    this.unsubcribe();
  }

  showSuccess(mensaje) {
    this.toastr.success("", mensaje);
  }

  showError(mensaje) {
    this.toastr.error("", mensaje);
  }

  showWarning() {
    this.toastr.warning("", "No hay lotes disponibles!");
  }

  consultarLoteDisponible() {
    this.mostrarimagen = true;
    this.mostrarFormulario = true;
  }

  onChangeTipoDocumental($event) {
    if (localStorage.getItem("primerCaptura") === null) {
      localStorage.setItem("primerCaptura", "1");
    }
    this.primerCaptura = localStorage.getItem("primerCaptura");
    if (localStorage.getItem("primerCaptura") == "1") {
      localStorage.setItem("primerCaptura", "2");
      localStorage.setItem("ValorTipodoc", $event.idTipoDocumental);
      this.selectTipodoc.focus();
      this.idTipoDocSelected = "";
    } else if (
      localStorage.getItem("primerCaptura") == "2" &&
      localStorage.getItem("ValorTipodoc") == $event.idTipoDocumental
    ) {
      this.getTemplate($event.idTipoDocumental, (localStorage.getItem("xNumeroIdentificacion") != null ?localStorage.getItem("xNumeroIdentificacion") : null ),(localStorage.getItem("xTipoDocumentoIdentificacion") != null ?localStorage.getItem("xTipoDocumentoIdentificacion"): null),(localStorage.getItem("Radicado") != null ?localStorage.getItem("Radicado"): null) );
      localStorage.removeItem("primerCaptura");
      localStorage.removeItem("ValorTipodoc");
      this.selectTemplate.focus();
      this.validar = false;
      this.focus = 0;
    }
    else if (localStorage.getItem("primerCaptura") == "2" &&
    localStorage.getItem("ValorTipodoc") != $event.idTipoDocumental)
    {
      localStorage.removeItem("primerCaptura");
    }

  }


  getTemplate(idTipoDocumental: any,xNumeroIdentificacion:string, xTipoDocumentoIdentificacion:string, Radicado:string) {
    this.ArrayTemplate = [];
    this.idTemplateSelected = "";
    this.fields = [];
    this.template = [];
    this.categoria = "indexacion";
    this.restService
      .getTemplate(idTipoDocumental, this.IdDocumento, this.categoria,xNumeroIdentificacion,xTipoDocumentoIdentificacion,this.arrayTiempos,Radicado)
      .subscribe((datatemplate: {}) => {
        this.template = datatemplate;
        // devuelve el valor del template ya seleccionado para el lote
        this.ArrayTemplate = this.template.getTemplates;
        this.idTemplateSelected = this.template.idTemplate;
        this.arrayTiempos = this.template.registroTiempos;
        this.fields = this.template.lstKwXTemplate;
        this.focus == 0;
        this.form = new FormGroup({
          fields: new FormControl(JSON.stringify(this.fields))
        });
        this.unsubcribe = this.form.valueChanges.subscribe(update => {
          this.fields = JSON.parse(update.fields);
        });
      });
  }

  toggleOutline() {
    this.isOutlineShown = !this.isOutlineShown;
  }

  incrementPage(amount: number) {
    this.page = this.page + amount;
    console.log(this.page);
  }

  incrementZoom(amount: number) {
    this.zoom = this.zoom + amount;
  }
  onKeyDown(e: any) {
    if (e.keyCode == 13 && e.ctrlKey) alert("Ctrl+Enter");
  }

  rotate(angle: number) {
    this.rotation = this.rotation + angle;
  }

  /**
   * Render PDF preview on selecting file
   */
  onFileSelected() {
    const $pdf: any = document.querySelector("#file");
    if (typeof FileReader !== "undefined") {
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
    if (error.name === "PasswordException") {
      const password = prompt(
        "This document is password protected. Enter the password:"
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
    } else if (typeof this.pdfSrc === "string") {
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
      pageNumber: 3
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
      this.pdfComponent.pdfFindController.executeCommand("find", {
        query: this.pdfQuery,
        highlightAll: true
      });
    } else {
      this.pdfComponent.pdfFindController.executeCommand("findagain", {
        query: this.pdfQuery,
        highlightAll: true
      });
    }
  }
}
