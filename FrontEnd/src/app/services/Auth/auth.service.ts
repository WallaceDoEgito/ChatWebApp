import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUserRequestDTO } from '../../DTOs/AuthUserRequest';
import { ResponsesEnum } from '../../Enums/ResponsesEnum';
import { AuthUserResponseDTO } from '../../DTOs/AuthUserResponseDTO';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpReq = inject(HttpClient);
  
  async Register(request: AuthUserRequestDTO) : Promise<AuthUserResponseDTO>
  {
    let response!:AuthUserResponseDTO
    let resp$ : any = await (firstValueFrom(this.httpReq.post("http://localhost:5269/api/auth/register", request, {observe:'response'}))).catch(e => 
      {
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
      let bodyD : any = resp$.body;
      response = new AuthUserResponseDTO(ResponsesEnum.CREATED, bodyD.msg);
    }
    console.log(response);
    return response;
  }

  async Login(request: AuthUserRequestDTO) : Promise<AuthUserResponseDTO>
  {
    let response!:AuthUserResponseDTO
    let resp$ : any = await (firstValueFrom(this.httpReq.post("http://192.168.1.20:5269/api/auth/login", request, {observe:'response'}))).catch(e =>
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
    localStorage.removeItem('JwtSession')
    localStorage.setItem('JWTSession', token);
  }

}
