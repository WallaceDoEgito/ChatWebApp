import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { ChatViewComponent } from './components/chat-view/chat-view.component';

export const routes: Routes = 
[
    {
        path:'',
        redirectTo: 'auth',
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
