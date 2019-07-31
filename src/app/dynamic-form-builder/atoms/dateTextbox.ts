import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldsFunctionalityService } from 'src/app/fields-functionality.service';

// text,email,tel,textarea,password, 
@Component({
    selector: 'datetextbox',
    template: `
      <div [formGroup]="form">
        <input *ngIf="!field.multiline" [attr.type]="field.type" class="form-control form-control-sm"  
        [id]="field.name" [name]="field.name" [formControlName]="field.name" 
        maxlength="10"  (keypress)="this.fieldService.validateFieldRecapture(field, form)" (keyup)="onInputChange($event);this.fieldService.validateFieldRecapture(field, form)" 
   
        [(ngModel)]="copyDate" >
      </div> 
    `
})
export class DateTextBoxComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;
    get isValid() { return this.form.controls[this.field.name].valid; }
    get isDirty() { return this.form.controls[this.field.name].dirty; }


    copyDate:any;
    
    constructor(public fieldService: FieldsFunctionalityService) {
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
}