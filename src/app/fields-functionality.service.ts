import { Injectable } from '@angular/core';


@Injectable()

export class FieldsFunctionalityService {

  constructor() { }

  validateFieldRecapture(field, form){  
 
    if(field.recapture){
      let origin = form.controls[field.validateField].value;
      let compare = form.controls[field.name].value;
      if(origin !== compare){    
          form.controls[field.name].setErrors({'noMatch': true});            
      }
    }
  }
}
