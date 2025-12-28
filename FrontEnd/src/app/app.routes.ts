import { Routes } from '@angular/router';
import { AuthComponent } from './Pages/auth/auth.component';
import { ChatViewComponent } from './Pages/chat-view/chat-view.component';
import {DefaultChatPageComponent} from "./components/Hub/default-chat-page/default-chat-page.component";
import {ChannelPageComponent} from "./components/Hub/channel-page/channel-page.component";

export const routes: Routes = 
[
    {
        path:'',
        redirectTo: 'hub',
        pathMatch: 'full'
    },
    {
        path:'auth',
        component:AuthComponent
    },
    {
        path:'hub',
        component:ChatViewComponent,
        children: [
            {
                path:'', component: DefaultChatPageComponent
            },
            {
                path:'channel/:ChannelID', component: ChannelPageComponent
            }
        ]
    }
];
