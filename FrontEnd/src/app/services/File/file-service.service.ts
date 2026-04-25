import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileService {
    private httpClient = inject(HttpClient)
    private urlBackend = environment.apiUrl;

    public UploadAvatar(file:File)
    {
        const form = new FormData()
        form.append("file", file, file.name)

        let jwtToken = localStorage.getItem("JWTSession") ?? ""
        let header = new HttpHeaders({
            'Authorization': `Bearer ${jwtToken}`
        })

        return this.httpClient.post(`${this.urlBackend}/api/file/upload/avatar`, form, {headers: header, reportProgress: true, observe: "events" } )
    }
}
