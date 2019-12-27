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

    // if(!field.recapture && (form.controls[field.validateField].value != form.controls[field.name].value ))
    // {
    //   console.log("entro");
    // }


      // 
      // console.log(origin);
      // let compare = form.controls[field.name].value;
      // if(origin !== compare){   
      //   console.log(origin);
      //   form.controls[field.validateField].setErrors({'noMatch': true});    
       

      // }
    


  }
}
