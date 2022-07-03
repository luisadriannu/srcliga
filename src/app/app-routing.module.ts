import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './componentes/admin/admin.component';
import { CalendarioComponent } from './componentes/calendario/calendario.component';
import { EquiposComponent } from './componentes/equipos/equipos.component';
import { ErrorComponent } from './componentes/error/error.component';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { IsauthGuard } from './guardian/isauth.guard';

const routes: Routes = [
  {path:'', component: PrincipalComponent},
  {path:'login', component: LoginComponent},
  {path: 'ADMIN', component: AdminComponent, canActivate: [IsauthGuard]},
  {path: 'Celendario', component: CalendarioComponent},
  {path:'equiposRegistrados', component: EquiposComponent},
  {path: '**', component: ErrorComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
