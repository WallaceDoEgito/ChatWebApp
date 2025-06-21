import {Component, inject, output, signal, WritableSignal} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators, FormGroup
} from '@angular/forms';
import { AuthService } from '../../services/Auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AuthUserRequestDTO} from "../../DTOs/AuthUserRequest";
import {AuthUserResponseDTO} from "../../DTOs/AuthUserResponseDTO";
import {ResponsesEnum} from "../../Enums/ResponsesEnum";

@Component({
  selector: 'app-register-component',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './register-component.component.html',
  styleUrl: './register-component.component.css'
})
export class RegisterComponentComponent {
  private authService = inject(AuthService);
  public LoginClickEvent = output();
  public RequestError:WritableSignal<String | undefined | null> = signal('');
  public RequestSuccess:WritableSignal<String | undefined | null> =  signal('');
  public loading = false;

  RegistroGroup = new FormGroup
  (
      {
        UserName: new FormControl('',[Validators.maxLength(32), Validators.required]),
        Password: new FormControl('',[Validators.maxLength(128), Validators.required]),
        ConfirmPassword: new FormControl('',[Validators.maxLength(128), Validators.required])
      },
      PasswordsDontMatch()
  )

  get UserNameFormControl():FormControl<any>
  {
    return this.RegistroGroup.get("UserName") as FormControl
  }
  get PasswordFormControl():FormControl<any>
  {
    return this.RegistroGroup.get('Password') as FormControl
  }
  get ConfirmPasswordFormControl()
  {
    return this.RegistroGroup.get('ConfirmPassword') as FormControl
  }

  async SendRegister()
  {
    if(this.RegistroGroup.hasError("maxlength")) return;
    if(this.RegistroGroup.hasError("required")) return;
    if(this.RegistroGroup.hasError("mismatch")) return;
    this.loading = true;
    this.RequestError.set('');
    let dtoAuthRequest = new AuthUserRequestDTO(this.RegistroGroup.get('UserName')?.value!, this.RegistroGroup.get('Password')?.value!)
    let response : AuthUserResponseDTO = await this.authService.Register(dtoAuthRequest);
    this.loading = false;
    if(response.ResponseType === ResponsesEnum.BAD_REQUEST || response.ResponseType === ResponsesEnum.INTERNALSERVERERROR) {this.RequestError.set(response.MessageBody); return;}
    if(response.ResponseType == ResponsesEnum.CREATED) this.RequestSuccess.set("Usuario criado com sucesso!");
  }

  AlternateToLogin()
  {
    this.LoginClickEvent.emit();
  }

}

  export function PasswordsDontMatch():ValidatorFn
  {
    return (group: AbstractControl): ValidationErrors | null =>
      {
        const password = group.get('Password')?.value
        const confirm = group.get('ConfirmPassword')?.value
        if(password !== confirm)
        {
          group.get("Password")?.setErrors({mismatch: true})
          group.get("ConfirmPassword")?.setErrors({mismatch: true})
          return password === confirm ? null : {mismatch:true}
        }
        return null;
      }
  }
