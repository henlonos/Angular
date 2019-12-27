import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldsFunctionalityService } from 'src/app/fields-functionality.service';

// text,email,tel,textarea,password, 
@Component({
    selector: 'textbox',
    template: `
      <div [formGroup]="form">
        <input *ngIf="!field.multiline" autocomplete="off" [attr.type]="field.type" class="form-control form-control-sm"  
        [id]="field.name" [name]="field.name" [formControlName]="field.name" maxlength="100" (keyup)="this.fieldService.validateFieldRecapture(field, form)" (keypress)="this.fieldService.validateFieldRecapture(field, form)" (keydown)="this.fieldService.validateFieldRecapture(field, form)" 
         #field.name oninput="this.value=this.value.toUpperCase()" >
        <textarea *ngIf="field.multiline" [class.is-invalid]="isDirty && !isValid" 
        [formControlName]="field.name" [id]="field.name"
        rows="9" class="form-control" [placeholder]="field.placeholder" #field.name></textarea>
      </div> 
    `
})
export class TextBoxComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;
    get isValid() { return this.form.controls[this.field.name].valid; }
    get isDirty() { return this.form.controls[this.field.name].dirty; }
    
    constructor(public fieldService: FieldsFunctionalityService) {
    }

}