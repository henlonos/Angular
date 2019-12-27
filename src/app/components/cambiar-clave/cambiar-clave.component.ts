import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators, PatternValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SweetMessageService } from 'src/app/sweet-message.service';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  // endpoint = 'http://172.20.15.127/WebApiSegura/api/';
  endpoint = environment.endpoint;
  token;
  constructor(private router:Router, 
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private message:SweetMessageService) { }

  ngOnInit() {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required,PatternValidator],
      claveConfirm: ['',Validators.required,PatternValidator]
    });
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }
  onSubmit(formulario)
  {}

  // validar(field:string)
  // {
  //     console.log(field);
  //     if(!this.form.get(field).valid)
  //     {
  //       this.toastr.error('','La contraseña debe contener entre 8 y 16 caracteres,1 Numero, 1 Mayuscula, 1 Minuscula y 1 Caracter Especial!')
  //     }
  // }

}
