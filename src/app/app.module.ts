import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { LoginComponent } from './componentes/login/login.component';
import { FormsModule } from '@angular/forms';
//firebasde Modules
import {AngularFireModule} from '@angular/fire/compat'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { AdminComponent } from './componentes/admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import { FirestoreService } from './Servicios/firestore.service';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarioComponent } from './componentes/calendario/calendario.component';
import { ErrorComponent } from './componentes/error/error.component';
import { EquiposComponent } from './componentes/equipos/equipos.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
]);
@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    LoginComponent,
    AdminComponent,
    CalendarioComponent,
    ErrorComponent,
    EquiposComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(()=> initializeApp(environment.firebase)),
    provideFirestore(()=> getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    FullCalendarModule,
    
  ],
  providers: [FirestoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
