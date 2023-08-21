import { AbstractControl, ValidationErrors } from '@angular/forms';
  
export class WhiteSpaceValidator {
    static noWhiteSpace(control: AbstractControl) : ValidationErrors | null {
        if (control && control.value && !control.value.replace(/\s/g, '').length) {
            control.setValue('');
        }
        return null;
    }
}