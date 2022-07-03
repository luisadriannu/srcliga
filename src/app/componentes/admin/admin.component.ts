import { AfterViewInit, Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { dtoAlbitro, dtoequipos, dtoJugador, dtoLiga, DtoPartido, dtoEvents } from 'src/app/interface/dtos-firebase';
import { FirestoreService } from 'src/app/Servicios/firestore.service';
import { Calendar, CalendarOptions } from '@fullcalendar/core'; // include this line
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin  from '@fullcalendar/timegrid'
import iteractionPlugin, { ThirdPartyDraggable }  from '@fullcalendar/interaction'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit{
  calendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth'
  };
  // colums dataTable
  columsLiga : string[] = ["Nombre", "Deporte", "Encargado" , "Categoria", "Genero", "Opciones"]
  columsEquipos : string[] = ["nombre", "img", "liga","Representante", "opciones"];
  columsjugador : string[] = ["nombre", "img", "equipo","imss", "numeroC","genero","opciones"];
  columsAlbitro : string[] = ["nombre", "img", "equipo","imss","genero","opciones"];
  dataSourceLIga : MatTableDataSource<dtoLiga>;
  dataSourceEquipos : MatTableDataSource<dtoequipos>;
  dataSourceJugadores : MatTableDataSource<dtoJugador>;
  dataSourceAlbitros : MatTableDataSource<dtoAlbitro>;
  @ViewChild('MatPaginatorLigas', {static: false}) paginatorLigas: MatPaginator;
  @ViewChild('MatPaginatorequipos', {static: false}) paginatorEquipos: MatPaginator;
  @ViewChild('MatPaginatorJugador', {static: false}) paginatorJugadores: MatPaginator;
  @ViewChild('MatPaginatorAlbitro', {static: false}) paginatorAlbitro: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
loader: boolean = false;
equipos : any[]=[]
datosLiga : dtoLiga = {
  id: '',
  nombre: '',
  deporte: 'Futbol',
  encargado: '',
  genero: 'H',
  categoria: 'Primera',
  isactiva: true
}
ligas : dtoLiga[] = [];
Equipos : dtoequipos[] = []
Jugadores : dtoJugador[]=[]
Albitros : dtoAlbitro[]=[]
ListPartidos : DtoPartido[]=[]
selectLIga : any[]=[];
isEditaJugador : boolean = false;
isLIgaPArtido: boolean = false;
  constructor(private firebase: FirestoreService) {
    this.dataSourceLIga = new MatTableDataSource(this.ligas);
    
    this.dataSourceEquipos = new MatTableDataSource(this.Equipos);
    this.dataSourceJugadores = new MatTableDataSource(this.Jugadores);

    const name = Calendar.name;
   }
  ngAfterViewInit() {
    this.dataSourceLIga.paginator =this.paginatorLigas;
    this.dataSourceLIga.sort = this.sort;
  }

  muestraCalendario : boolean = false;
 public events: any[] =[]
 public options : CalendarOptions;
  async ngOnInit() {
   (await  this.firebase.getLigas()).subscribe(res =>{
     console.log(res)
     this.ligas = res;
     this.dataSourceLIga = new MatTableDataSource(this.ligas);
     this.dataSourceLIga.paginator =this.paginatorLigas;
    this.dataSourceLIga.sort = this.sort;
   });
   (await this.firebase.getEquipos()).subscribe(res =>{
      this.Equipos = res;
      this.dataSourceEquipos = new MatTableDataSource(this.Equipos);
      this.dataSourceEquipos.paginator = this.paginatorEquipos;
      
   });
   (await this.firebase.getJugadores()).subscribe(res =>{
      this.Jugadores = res;
      this.dataSourceJugadores = new MatTableDataSource(this.Jugadores);
      this.dataSourceJugadores.paginator =this.paginatorJugadores;
   });
   (await this.firebase.getAlbitros()).subscribe(res =>{
        this.Albitros = res;
        this.dataSourceAlbitros =  new MatTableDataSource(this.Albitros);
        this.dataSourceAlbitros.paginator = this.paginatorAlbitro;
   });

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
    selectable: true,
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
   
   (await this.firebase.obtenerLigaSelect("Futbol")).subscribe(async res =>{
    this.selectLIga = res;
    (await this.firebase.obtenerEquiposSelect(this.selectLIga[0].id)).subscribe(res =>{
      this.selectEquipos = res;
      console.log(this.selectEquipos)
    });
    (await this.firebase.obtenerAlbitrosSelect(this.selectLIga[0].id)).subscribe(res =>{
      this.selectAlbitros = res;
      console.log("ALbitros",this.selectAlbitros)
     })
   });
  
  }

  
eventoFullcalendar(event){
  console.log(event, "EVENT")
}
  registraLIga(){
    this.loader = true;
    this.firebase.setLigas(this.datosLiga).then(()=>{
      this.loader = false;
      this.reseteformLiga()
      
    })
  }
  reseteformLiga(){
    this.datosLiga.nombre ="";
    this.datosLiga.deporte = "Futbol";
    this.datosLiga.encargado = "";
    this.datosLiga.genero = "H"
    this.datosLiga.categoria = "Primera"

  }
  editaLIga(liga :dtoLiga){
    this.isEditaJugador = true;
      this.datosLiga = liga;
  }

  actualizaLiga(){
    this.firebase.updateLiga(this.datosLiga).then(()=>{
      this.isEditaJugador = false;
      this.reseteformLiga();
    })
  }

  //filtro para ligas
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLIga.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceLIga.paginator) {
      this.dataSourceLIga.paginator.firstPage();
    }
  }

  //crud Equipos
  img : string = ""
  isEditaEquipo : boolean = false;
  isvisibleIMg : boolean = false;
  dtoequipo : dtoequipos = {
    id: '',
    nombre: '',
    representante: '',
    img: '',
    liga: ''
  }
  cargaImgequipo(e : any){
    let archivos  = e.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = () =>{
      this.img = reader.result.toString();
      this.isvisibleIMg = true;
      console.log(this.img)
    }
  }

  registraEquipo(){
    this.firebase.registraEquipo(this.img,this.dtoequipo).then(()=>{
      this.resetForluarioEquipo()
    })
  }
  resetForluarioEquipo(){
    this.isvisibleIMg = false;
    this.dtoequipo.nombre = ""
    this.dtoequipo.representante = ""
    this.dtoequipo.img = ""

  }

  applyFilterEquipos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEquipos.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceEquipos.paginator) {
      this.dataSourceEquipos.paginator.firstPage();
    }
  }
  editaEquipo(equipo : dtoequipos){
      this.dtoequipo = equipo;
      this.img = equipo.img;
      this.isvisibleIMg = true;
      this.isEditaEquipo = true;
  }
  actualizaEquipo(){
    if(this.img != ""){
      this.firebase.updateEquipo(this.img , this.dtoequipo).then(()=>{
        this.isEditaEquipo = false;
        this. resetForluarioEquipo();
      });
    }else{
      this.firebase.ActualizaEquipo(this.dtoequipo).then(res =>{
        this.isEditaEquipo = false;
        this. resetForluarioEquipo();
      })
    }
   
  }

  dtojugador : dtoJugador ={
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    edad: 12,
    imss: '',
    telefono: '',
    img: '',
    genero: 'M',
    equipo: '',
    numeroCamisa: ''
  }
  imgJugador : string = "";
  isvisibleIMgJ : boolean = false;
  cargaImgJugador(e : any){
    let archivos  = e.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = () =>{
      this.imgJugador = reader.result.toString();
      this.isvisibleIMgJ = true;
      console.log(this.imgJugador)
    }
  }

  reseFormJugador(){
    this.dtojugador.nombre = ""
    this.dtojugador.apellidoP =""
    this.dtojugador.apellidoM = ""
    this.dtojugador.imss = ""
    this.dtojugador.telefono = ""
    this.dtojugador.img = ""
    this.isvisibleIMgJ = false;
   
  }
  registraJugador(){
    this.firebase.setJugador(this.imgJugador, this.dtojugador).then(()=>{

      this.reseFormJugador();
    })
  }

  applyFilterJugador(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceJugadores.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceJugadores.paginator) {
      this.dataSourceJugadores.paginator.firstPage();
    }
  }

  editaJugador(jugador : dtoJugador){
    this.dtojugador = jugador;
    this.isEditaJugador = true;

  }

  ActualizaJugador(){
    if(this.imgJugador !="" && this.imgJugador != null && this.imgJugador != undefined){
      this.firebase.updateJugador(this.imgJugador, this.dtojugador).then(()=>{
        this.isEditaJugador = false;
        this.reseFormJugador();
      });
    }else{
      this.firebase.actualizaJUgador(this.dtojugador).then(res =>{
        this.isEditaJugador = false;
        this.reseFormJugador();
      })
    }
     
  }

  //albitro metodos

  dtoalbitro : dtoAlbitro = {
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    edad: 18,
    imss: '',
    telefono: '',
    img: '',
    genero: 'M',
    equipo: ''
  }
  imgAlbitro : string = "";
  muestraImgAlbitro : boolean = false;
  isEditaAlbitro : boolean = false;
  cargaImgAlbitro(e : any){
    let archivos  = e.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = () =>{
      this.imgAlbitro = reader.result.toString();
      this.muestraImgAlbitro = true;
      console.log(this.imgAlbitro)
    }
  }

  resetFormAlbitro(){
    this.dtoalbitro.nombre = ""
    this.dtoalbitro.apellidoM = ""
    this.dtoalbitro.apellidoP = ""
    this.dtoalbitro.imss = ""
    this.dtoalbitro.telefono = ""
    this.isEditaAlbitro = false;
  }

  registraAlbitro(){
    this.firebase.setAlbitro(this.imgAlbitro, this.dtoalbitro).then(()=>{
      this.muestraImgAlbitro = false;
        this.resetFormAlbitro();
    })
  }

  applyFilterAlbitro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAlbitros.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceAlbitros.paginator) {
      this.dataSourceAlbitros.paginator.firstPage();
    }
  }

  editaAlbitro(dtoalbitro : dtoAlbitro){
      this.dtoalbitro = dtoalbitro;
      this.isEditaAlbitro = true;
     
  }
  ActualizaAlbitro(){
    if(this.imgAlbitro!="" && this.imgAlbitro != null && this.imgAlbitro != undefined){
      this.firebase.updateAlbitro(this.imgAlbitro, this.dtoalbitro).then(()=>{
        this.resetFormAlbitro();
      })
    }else{
      this.firebase.actualizaAlbitroSInimg(this.dtoalbitro).then(()=>{
        this.resetFormAlbitro();
      })
    }
   
  }

  //partidos
  
  async BuscaLiga(event){
    (await this.firebase.obtenerLigaSelect(event.target.value)).subscribe(async res =>{
      this.selectLIga = res;
      console.log(this.selectLIga);
      (await this.firebase.obtenerEquiposSelect(this.selectLIga[0].id)).subscribe(res =>{
        this.selectEquipos = res;
        console.log(this.selectEquipos)
      });
      (await this.firebase.obtenerAlbitrosSelect(this.selectLIga[0].id)).subscribe(res =>{
        console.log("ALbitros",this.selectAlbitros);
       this.selectAlbitros = res;
      })
     });
  }

  selectEquipos : any[]=[]
  selectAlbitros : any[]=[]
  async BuscaEquipo(event){
   (await this.firebase.obtenerEquiposSelect(event.target.value)).subscribe(res =>{
     this.selectEquipos = res;
     console.log(this.selectEquipos)
   });

   (await this.firebase.obtenerAlbitrosSelect(event.target.value)).subscribe(res =>{
     console.log("ALbitros",this.selectAlbitros);
    this.selectAlbitros = res;
   })
  }

  disables1P : string = "";
  disables2P : string = "";
  cargaP2(event){
      this.disables2P = event.target.value
  }
  cargaP1(event){
    this.disables1P = event.target.value
}
dtoPartido : DtoPartido={
  id: '',
  deporte: '',
  liga: '',
  albitro: '',
  equipo1: '',
  equipo2: '',
  lugar: '',
  fecha: '',
  event: {
    initialView: '',
    title: '',
    start : '',
    description: ''
  }
}

registraPartido(){
  this.dtoPartido.event.title="Partido de "+this.dtoPartido.deporte+" "+this.dtoPartido.equipo1 + " VS "+this.dtoPartido.equipo2
  this.dtoPartido.event.initialView= 'dayGridMonth'
  this.dtoPartido.event.start = this.dtoPartido.fecha;
  this.dtoPartido.event.description = this.dtoPartido.equipo1 + " VS "+this.dtoPartido.equipo2
  this.firebase.regustraPartido(this.dtoPartido).then(()=>{
    this.abreORcloseModal();
  })
}

abreORcloseModal(){
  document.querySelector('.modalContenedor').classList.toggle('star')
}
}
