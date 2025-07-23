import { HttpClient, HttpHeaders} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUserRequestDTO } from '../../DTOs/AuthUserRequest';
import { ResponsesEnum } from '../../Enums/ResponsesEnum';
import { AuthUserResponseDTO } from '../../DTOs/AuthUserResponseDTO';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpReq = inject(HttpClient);
  private url = ""
  
  async Register(request: AuthUserRequestDTO) : Promise<AuthUserResponseDTO>
  {
    let response!:AuthUserResponseDTO
    let resp$ : any = await (firstValueFrom(this.httpReq.post(`${this.url}/api/auth/register`, request,
      {
        observe:'response',
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }))).catch(e =>
      {
        console.log(e)
        if(e.status == 201)
        {
          response = new AuthUserResponseDTO(ResponsesEnum.CREATED, e.error.text);
        }
        if(e.status == 400)
        {
          response = new AuthUserResponseDTO(ResponsesEnum.BAD_REQUEST, e.error.msg);
        }
        else if(e.status == 500)
        {
          response = new AuthUserResponseDTO(ResponsesEnum.INTERNALSERVERERROR, e.error.msg);
        }
      })
    if(resp$)
    {
      console.log(resp$)
      let bodyD : any = resp$.body;
      response = new AuthUserResponseDTO(ResponsesEnum.CREATED, bodyD.msg);
    }
    console.log(response);
    return response;
  }

  async Login(request: AuthUserRequestDTO) : Promise<AuthUserResponseDTO>
  {
    localStorage.clear()
    let response!:AuthUserResponseDTO
    let resp$ : any = await (firstValueFrom(this.httpReq.post(`${this.url}/api/auth/login`, request,
      {
        observe:'response',
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        withCredentials: true
      }))).catch(e =>
      {
        console.log(e);
        response = new AuthUserResponseDTO(ResponsesEnum.BAD_REQUEST, e.error.msg);
      })
    if(resp$)
    {
      let bodyD : any = resp$.body;
      response = new AuthUserResponseDTO(ResponsesEnum.OK, bodyD.msg);
    }
    return response;
  }

  StoreJWTToken(token : string)
  {
    localStorage.clear()
    localStorage.setItem('JWTSession', token);
  }

}
