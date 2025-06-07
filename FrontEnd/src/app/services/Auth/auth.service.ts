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
  
  Register(request: AuthUserRequestDTO) : AuthUserResponseDTO
  {
    let response!:AuthUserResponseDTO
    this.httpReq.post<String>("http://localhost:5269/api/auth/register", request, {observe:'response'}).subscribe(ob => 
      {
        
        if(ob.status == 500) response = new AuthUserResponseDTO(ResponsesEnum.INTERNALSERVERERROR, ob.body?.toString() ?? null)
        else if(ob.status == 400) response = new AuthUserResponseDTO(ResponsesEnum.BAD_REQUEST, ob.body?.toString() ?? null)
        else response = new AuthUserResponseDTO(ResponsesEnum.CREATED, ob.body?.toString() ?? null);
      }
    ).unsubscribe();
    return response;
  }

  async Login(request: AuthUserRequestDTO) : Promise<AuthUserResponseDTO>
  {
    let response!:AuthUserResponseDTO
    let resp$ : any = await (firstValueFrom(this.httpReq.post("http://localhost:5269/api/auth/login", request, {observe:'response'}))).catch(e => 
      {
        response = new AuthUserResponseDTO(ResponsesEnum.BAD_REQUEST, e.error.msg);
      })
    if(resp$)
    {
      let bodyD : any = resp$.body;
      response = new AuthUserResponseDTO(ResponsesEnum.OK, bodyD.msg);
    }
    return response;
  }

  StoreJWTToken(token : String)
  {
    return;
  }

}
