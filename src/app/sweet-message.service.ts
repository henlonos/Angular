import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
providedIn: "root"
})
export class SweetMessageService {
constructor() {}
close() {
Swal.close();
}

showLoading() {
Swal.fire({
allowOutsideClick: false,
type: "info",
text: "Procesando..."
});
Swal.showLoading();
}

showSuccess(message: string) {
Swal.fire({
allowOutsideClick: false,
type: "success",
text: message
});
}

showError(message: string) {
Swal.fire({
allowOutsideClick: false,
type: "error",
text: message
});
}

showInfo(message: string) {
Swal.fire({
allowOutsideClick: false,
type: "info",
text: message
});
}

showQuestion() {}
} 
 
