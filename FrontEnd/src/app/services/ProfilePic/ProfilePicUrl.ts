import {UserInfoDTO} from "../../DTOs/UserInfoDTO";
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {Signal} from "@angular/core";

const base64WhiteImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="

export function GetProfilePicUrlFromUser(user:UserInfoDTO)
{
    return user.userProfilePicUrl == "" ? base64WhiteImage : user.userProfilePicUrl as string
}

export function GetProfilePicUrlFromUserSignal(user: Signal<UserInfoDTO>)
{
    return user().userProfilePicUrl == "" ? base64WhiteImage : user().userProfilePicUrl as string
}

export function GetProfilePicUrlFromChannel(channel:ChannelDTO | null)
{
    if(channel == null) return base64WhiteImage
    return channel.ChannelImageUrl == "" ? base64WhiteImage : channel.ChannelImageUrl as string
}

export function GetProfilePicUrlFromChannelSignal(channel: Signal<ChannelDTO>)
{
    return channel().ChannelImageUrl == "" ? base64WhiteImage : channel().ChannelImageUrl as string
}