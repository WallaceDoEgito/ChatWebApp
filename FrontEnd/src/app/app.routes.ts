import { Routes } from '@angular/router';
import { AuthComponent } from './Pages/auth/auth.component';
import { ChatViewComponent } from './Pages/chat-view/chat-view.component';

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
        component:ChatViewComponent
    }
];
