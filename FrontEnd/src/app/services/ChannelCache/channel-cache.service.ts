import {inject, Injectable} from '@angular/core';
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {SignalConnectService} from "../SignalConnect/signal-connect.service";

@Injectable({
    providedIn: 'root'
})
export class ChannelCacheService {
    private ChannelCache: ChannelDTO[] = []
    private signalRConnection = inject(SignalConnectService)
    private cacheInitialized!: Promise<void>;
    private cacheUpdated!:Promise<void>

    constructor() {
        this.cacheInitialized = new Promise(async resolve => {
            await this.signalRConnection.whenConnected();
            await this.UpdateChannelCache();
            resolve()
        })
        this.signalRConnection.GetNewFriendObservable$().subscribe(() => this.UpdateChannelCache())
        this.signalRConnection.GetFriendProfileChangeObservable().subscribe(() => this.UpdateChannelCache())
    }

    private async UpdateChannelCache() {
        this.cacheUpdated = new Promise<void>(async (resolve) =>
        {
            let result = await this.signalRConnection.GetChannels()
            this.ChannelCache = []
            for (let canal in result) {
                this.ChannelCache.push(new ChannelDTO(result[canal].channelName, result[canal].channelId!, result[canal].creationDate!, result[canal].users!, [], result[canal].privateChannel!, result[canal].channelProfilePic!))
            }
            resolve();
        })

    }

    public async GetAllChannels() {
        await this.cacheInitialized;
        await this.cacheUpdated;
        return this.ChannelCache
    }

    public async GetChannelById(id: string) {
        await this.cacheInitialized;
        await this.cacheUpdated;
        return this.ChannelCache.find(
            x => x.ChannelId === id
        )
    }
}
