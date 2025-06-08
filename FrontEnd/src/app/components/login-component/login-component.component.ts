import { Component, inject, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthUserRequestDTO } from '../../DTOs/AuthUserRequest';
import { AuthUserResponseDTO } from '../../DTOs/AuthUserResponseDTO';
import { AuthService } from '../../services/Auth/auth.service';
import { ResponsesEnum } from '../../Enums/ResponsesEnum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})
export class LoginComponentComponent {
  private authService = inject(AuthService);
  private routerRedirect = inject(Router)
  public RegisterClickEvent = output();
  public UserLoginSucess = output();
  public UserNameModel! : String
  public PasswordModel! : String
  public ConfirmPasswordModel! : String
  public actualPageIsRegister = false;
  public ServerResponse :any = ""
  UserNameFormControl = new FormControl('',[Validators.maxLength(32), Validators.required])
  PasswordFormControl = new FormControl('',[Validators.maxLength(128), Validators.required])

  async Login()
  {
    if(this.UserNameFormControl.hasError("maxlength") || this.UserNameFormControl.hasError("required")) return;
    if(this.PasswordFormControl.hasError("maxlength") || this.PasswordFormControl.hasError("required")) return;
    this.ServerResponse = '';

    let dtoAuthRequest = new AuthUserRequestDTO(this.UserNameModel, this.PasswordModel)
    let response : AuthUserResponseDTO = await this.authService.Login(dtoAuthRequest);
    if(response.ResponseType === ResponsesEnum.BAD_REQUEST) {;this.ServerResponse = response.MessageBody; return}
    else if(response.ResponseType === ResponsesEnum.OK) {
      console.log(response)
      this.authService.StoreJWTToken(response.MessageBody!);
      this.routerRedirect.navigate(["/hub"])
    }

  }

  AlternateToRegister()
  {
    this.RegisterClickEvent.emit();
  }
}
