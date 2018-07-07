import { AuthService } from './../../auth/auth.service';
import { Router } from '@angular/router';
import { ApiService } from './../../core/api.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserFormService } from '../../form/user-form.service';
import { UserModel, FormUserModel } from '../../core/models/user.model';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { EMAIL_REGEX } from '../../core/forms/form-utils';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [ UserFormService ]
})
export class UserFormComponent implements OnInit, OnDestroy {

  @Input() isSignup: boolean;

  // FormBuilder form
  userForm: FormGroup;
  // Model storing initial form values
  formUser: FormUserModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitUserObj: UserModel;
  submitUserSub: Subscription;
  error: boolean;
  submitting: boolean;
  submitBtnText: string;
  switchModeText: string;
  errorText: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    public uf: UserFormService,
    private router: Router) { }

  ngOnInit() {
    this.formErrors = this.uf.formErrors;
    this.submitBtnText = this.isSignup ? 'Signup' : 'Login';
    this.switchModeText = this.isSignup ? 'Login' : 'Signup';
    this.error = false;
    // Set initial form data
    this.formUser = this._setFormUser();
    // Use FormBuilder to construct the form
    this._buildForm();
  }

  private _setFormUser() {
    return new FormUserModel(null, null, false);
  }

  private _buildForm() {
    this.userForm = this.fb.group({
      email: [this.formUser.email, [
        Validators.required,
        Validators.pattern(EMAIL_REGEX)
      ]],
      password: [this.formUser.password, [
        Validators.required,
        Validators.minLength(this.uf.passwordMin)
      ]],
      /* agreementAccepted: [this.formUser.agreementAccepted,
        Validators.requiredTrue
      ] */
    });
    if (this.isSignup) {
      this.userForm.addControl('agreementAccepted', new FormControl(this.formUser.agreementAccepted, Validators.requiredTrue));
    }

    // Subscribe to form value changes
    this.formChangeSub = this.userForm
      .valueChanges
      .subscribe(data => this._onValueChanged());

    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.userForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.uf.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] += messages[key] + '<br>';
          }
        }
      }
    };

    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // Set errors for fields
        // Clear previous error message (if any)
        this.formErrors[field] = '';
        _setErrMsgs(this.userForm.get(field), this.formErrors, field);
      }
    }
  }

  private _getSubmitObj() {
    return new UserModel(
      this.userForm.get('email').value,
      this.userForm.get('password').value,
    );
  }

  onSubmit() {
    this.submitting = true;
    this.submitUserObj = this._getSubmitObj();

    if (!this.isSignup) {
      this.auth.login$(this.submitUserObj.email, this.submitUserObj.password)
        .subscribe(
          success => {
            this._handleSubmitSuccess();
          },
          err => {
            this._handleSubmitError(err);
          }
        );
    } else {
      this.auth.signup$(this.submitUserObj.email, this.submitUserObj.password)
        .subscribe(
          success => {
            this._handleSubmitSuccess();
          },
          err => {
            this._handleSubmitError(err);
          }
        );
    }
  }

  private _handleSubmitSuccess() {
    this.error = false;
    this.submitting = false;

    this.router.navigate(['/']);
  }

  private _handleSubmitError(err) {
    if (err.error.error_description === 'Bad credentials') {
      this.errorText = 'Bad Credential';
    } else {
      this.errorText = 'There was a problem logging in. Please try again.';
    }
    this.submitting = false;
    this.error = true;
  }

  resetForm() {
    this.userForm.reset();
  }

  switchMode() {
    this.isSignup = !this.isSignup;
    this.ngOnInit();
  }

  ngOnDestroy() {
    if (this.submitUserSub) {
      this.submitUserSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}
