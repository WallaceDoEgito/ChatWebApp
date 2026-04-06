import {inject, Injectable} from '@angular/core';
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {SignalConnectService} from "../SignalConnect/signal-connect.service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChannelCacheService {
    private ChannelCache: ChannelDTO[] = []
    private signalRConnection = inject(SignalConnectService)
    private IsConnected = false
    private cacheInitialized!:Promise<void>;

    constructor() {
        this.cacheInitialized = new Promise(resolve => {
            this.signalRConnection.IsConnected$().subscribe(async() => {
                this.IsConnected = true;
                await this.UpdateChannelCache();
                resolve()
            })
        })
        this.signalRConnection.GetNewFriendObservable$().subscribe(() => this.UpdateChannelCache())
    }

    private async UpdateChannelCache() {
        let result = await this.signalRConnection.GetChannels()
        for (let canal in result) {
            this.ChannelCache.push(new ChannelDTO(result[canal].channelName, result[canal].channelId!, result[canal].creationDate!, result[canal].users!, [], result[canal].privateChannel!, result[canal].channelProfilePic!))
        }
    }

    public async GetAllChannels() {
        if(!this.IsConnected)
        {
            await firstValueFrom(this.signalRConnection.IsConnected$())
        }
        return this.ChannelCache
    }

    public async GetChannelById(id:string)
    {
        await this.cacheInitialized;
        return this.ChannelCache.find(
            x => x.ChannelId === id
        )
    }
}
