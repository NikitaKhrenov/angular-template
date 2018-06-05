import { Injectable } from '@angular/core';

@Injectable()
export class UserFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    email: '',
    password: '',
    agreementAccepted: ''
  };

  // Min/maxlength validation
  passwordMin = 3;

  constructor() {
    this.validationMessages = {
      email: {
        required: `Email is <strong>required</strong>.`,
        pattern: `Must be valid email.`
      },
      password: {
        required: `Password is <strong>required</strong>.`,
        minlength: `Password must be ${this.passwordMin} characters or more.`
      },
      agreementAccepted: {
        required: `You <strong>must</strong> accept terms and conditions of agreement.`,
      },
    };
  }

}
