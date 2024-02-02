import { Routes } from '@angular/router';
import { RydleComponent }  from './components/rydle/rydle.component';

export const routes: Routes = [
    {path: '', component: RydleComponent},
    {path: 'random', component: RydleComponent}
];
