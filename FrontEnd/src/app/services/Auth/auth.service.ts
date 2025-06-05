import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUserRequestDTO } from '../../DTOs/AuthUserRequest';
import { ResponsesEnum } from './ResponsesEnum';
import { AuthUserResponseDTO } from '../../DTOs/AuthUserResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpReq = inject(HttpClient);
  
  Register(request: AuthUserRequestDTO)
  {
    this.httpReq.post("localhost:5269", request, {observe:'response'}).subscribe(ob => 
      {
        if(ob.status == 500) return new AuthUserResponseDTO(ResponsesEnum.INTERNALSERVERERROR, ob.body?.toString() ?? null)
        else if(ob.status == 400) return new AuthUserResponseDTO(ResponsesEnum.BAD_REQUEST, ob.body?.toString() ?? null)
        else return new AuthUserResponseDTO(ResponsesEnum.CREATED, ob.body?.toString() ?? null);
      }
    )
  }

  Login(request: AuthUserRequestDTO)
  {
    this.httpReq.post("localhost:5269", request, {observe:'response'}).subscribe(ob =>
    {
      if(ob.status == 400) return new AuthUserResponseDTO(ResponsesEnum.BAD_REQUEST, ob.body?.toString() ?? null);
      else return new AuthUserResponseDTO(ResponsesEnum.OK, ob.body?.toString() ?? null);
    }
    )
  }

}
