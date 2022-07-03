import { Component, forwardRef, OnInit } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core'; // include this line
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin  from '@fullcalendar/timegrid'
import iteractionPlugin  from '@fullcalendar/interaction'

import { dtoAlbitro, dtoequipos, dtoJugador, dtoLiga, DtoPartido, dtoEvents } from 'src/app/interface/dtos-firebase';
import { FirestoreService } from 'src/app/Servicios/firestore.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  ListPartidos : DtoPartido[]=[]
  constructor(private firebase: FirestoreService) {
    const name = Calendar.name;
   }
   public events: any[] =[]
   public options : CalendarOptions;
   muestraCalendario : boolean = false;
  async ngOnInit() {
    (await this.firebase.obtenerPrtidos()).subscribe(res =>{
      this.ListPartidos = res;
      forwardRef(() => Calendar);
      console.log("LISTA de PARTIDOS", this.ListPartidos);
      this.ListPartidos.forEach(res =>{
        this.events.push(res.event)
      })   
   this.options ={
    plugins: [dayGridPlugin, timeGridPlugin ,iteractionPlugin],
    editable: true,
    height: "auto",
    headerToolbar: {
     left: 'prev,next today myCustomButton',
     center: 'title',
     right: 'dayGridMonth, timeGridWeek, timeGridDay'
   },
    events: this.events,
    eventClick(arg) {
      Swal.fire({
        title: arg.event._def.title,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
    
    },
  }
  this.muestraCalendario = true;
   })
  ;
  }

}
