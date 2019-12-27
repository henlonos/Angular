import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
  // 
@Component({
  selector: 'dynamic-form-builder',
  template:`

    <form  (ngSubmit)="onSubmit.emit(this.form.value)" [formGroup]="form" class="form-horizontal form-control-sm "  #f="ngForm">
      <div *ngFor="let field of fields" >
          <field-builder [field]="field" [form]="form"></field-builder>
      </div>
      <br>
      <div class="form-row"></div>
      <div class="form-group row">
        <div class="col-md-3"></div>
        <div class="col-md-12" *ngIf="form.valid">
          <button type="submit" [disabled]="!form.valid"  class="btn btn-outline-primary btn-block " id="btnguardar" >Guardar</button>
        </div>
      </div>
    </form>
  `,
})
export class DynamicFormBuilderComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Input() fields: any[];
  form: FormGroup;
  constructor() { }

  returnValidations(field){
    field.validators = [];
    if(field.required)
     {
        if(field.hasPattern)
          field.validators = [Validators.required, Validators.pattern(field.pattern)]
        else
          field.validators = [Validators.required]        
     }  
    return field.validators;
  }



  ngOnInit() {
    console.log(this.fields.length);
    let fieldsCtrls = {};
    // for (let f of this.fields) {
    //   if (f.type != 'checkbox') {
    //     fieldsCtrls[f.name] = new FormControl(f.value || '', 
    //     Validators.compose(f.validators))
    //     //Validators.required)
    //   } else {
    //     let opts = {};
    //     for (let opt of f.options) {
    //       opts[opt.key] = new FormControl(opt.value);
    //     }
    //     fieldsCtrls[f.name] = new FormGroup(opts)
    //   }
    // }

    for (let f of this.fields) {
      if (f.type != 'checkbox') {   
        fieldsCtrls[f.name] = new FormControl(f.value || '', 
        Validators.compose(this.returnValidations(f)))
        
        //Validators.required)
      } else {
        let opts = {};
        for (let opt of f.options) {
          opts[opt.key] = new FormControl(opt.value);
        }
        fieldsCtrls[f.name] = new FormGroup(opts)
      }
    }

    this.form = new FormGroup(fieldsCtrls);
  }

}
