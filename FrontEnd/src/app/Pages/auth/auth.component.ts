import { Component, inject, output } from '@angular/core';
import { RegisterComponentComponent } from "../../components/register-component/register-component.component";
import { LoginComponentComponent } from '../../components/login-component/login-component.component';

@Component({
  selector: 'app-auth',
  imports: [RegisterComponentComponent, LoginComponentComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  public IsLogin = true;

  SwapLoginAndRegisterPage()
  {
    this.IsLogin = !this.IsLogin
  }
}
