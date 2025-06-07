import { Component, inject, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUserRequestDTO } from '../../DTOs/AuthUserRequest';
import { AuthUserResponseDTO } from '../../DTOs/AuthUserResponseDTO';
import { AuthService } from '../../services/Auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ResponsesEnum } from '../../Enums/ResponsesEnum';

@Component({
  selector: 'app-register-component',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './register-component.component.html',
  styleUrl: './register-component.component.css'
})
export class RegisterComponentComponent {
  private authService = inject(AuthService);
  public LoginClickEvent = output();
  public UserNameModel! : String
  public PasswordModel! : String
  public RequestError:any = ''
  public RequestSucess:any = ''
  public ConfirmPasswordModel! : String

  public actualPageIsRegister = false;
  UserNameFormControl = new FormControl('',[Validators.maxLength(32), Validators.required])
  PasswordFormControl = new FormControl('',[Validators.maxLength(128), Validators.required])

  async SendRegister()
  {
    if(this.UserNameFormControl.hasError("maxlength") || this.UserNameFormControl.hasError("required")) return;
    if(this.PasswordFormControl.hasError("maxlength") || this.PasswordFormControl.hasError("required")) return;
    if(this.PasswordModel != this.ConfirmPasswordModel) this.PasswordFormControl

    let dtoAuthRequest = new AuthUserRequestDTO(this.UserNameModel, this.PasswordModel)
    let response : AuthUserResponseDTO = await this.authService.Register(dtoAuthRequest);
    if(response.ResponseType === ResponsesEnum.BAD_REQUEST || response.ResponseType === ResponsesEnum.INTERNALSERVERERROR) {this.RequestError = response.MessageBody; return;}
    if(response.ResponseType === ResponsesEnum.CREATED) this.RequestSucess = "Usuario criado com sucesso!"
  }

  AlternateToLogin()
  {
    this.LoginClickEvent.emit();
  }
}
