import {inject, Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteUtilsService {
  private ActivatedRoute = inject(ActivatedRoute)

  public GetCurrentChannelIdIfActive(): string | undefined
  {
    let snapshot = this.ActivatedRoute.snapshot;
    let childRoute = snapshot.firstChild?.firstChild;
    
    return childRoute?.params["ChannelID"];
  }
}
