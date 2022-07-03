import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import firebase from 'firebase/compat/app';
import Swal from 'sweetalert2'
import 'firebase/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { dtoAlbitro, dtoequipos, dtoJugador, dtoLiga, DtoPartido } from '../interface/dtos-firebase';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  storageRegt = firebase.app().storage().ref();
private CollectionLigas : AngularFirestoreCollection<dtoLiga>;
private CollectionEquipos : AngularFirestoreCollection<dtoequipos>;
private CollectionJugador : AngularFirestoreCollection<dtoJugador>;
private CollectioAlbitro : AngularFirestoreCollection<dtoAlbitro>;
private CollecionPartido : AngularFirestoreCollection<DtoPartido>;
  constructor(private readonly afs: AngularFirestore, private fireAuth: AngularFireAuth, private router: Router) {
    this.CollectionLigas = this.afs.collection('Ligas');
    this.CollectionEquipos = this.afs.collection('Equipos');
    this.CollectionJugador = this.afs.collection('Jugador');
    this.CollectioAlbitro = this.afs.collection('Albitros');
   }

  //sesiones estados
  iniciarSesion(email : string, pwd : string){
      this.fireAuth.signInWithEmailAndPassword(email, pwd).then(res=>{
           this.router.navigate(['']);
      }).catch(err =>{
        console.log(err.message);
      })
  }

  isLoggeed(){
    return this.fireAuth.authState.pipe(auth => auth);
  }

  cerrarSesion(){
    this.fireAuth.signOut();
  }

  //ligas metodos
listaLIga : dtoLiga[]=[]
  async setLigas(dtoLiga : dtoLiga){
    var id = dtoLiga.nombre+"-"+dtoLiga.deporte+"-"+dtoLiga.categoria+"-"+dtoLiga.genero;
    id = id.toUpperCase().trim().replace(/ /g, "");
    dtoLiga.id = id;
   return await this.CollectionLigas.doc(dtoLiga.id).set(dtoLiga).then(()=>{
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Liga registrada',
      showConfirmButton: false,
      timer: 1500
    })
    }).catch(err =>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'ocurrio un error al registrar liga',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("Ocurrio un error al registrar liga", err.message);
    });
  }
  async getLigas(){
   return await this.CollectionLigas.valueChanges();
  }

  async updateLiga(liga : dtoLiga){
    return await  this.CollectionLigas.doc(liga.id).delete().then(async ()=>{
     await  this.setLigas(liga);
    })
  }

  //metodos equipos

  async registraEquipo(img : string, equipo : dtoequipos){
      const id = this.afs.createId();
      let url = await this.storageRegt.child('ImagenesEquipos/'+id).putString(img, 'data_url');
      const urlImg = await url.ref.getDownloadURL();
      equipo.img = urlImg;
      equipo.id = id;
      return await this.CollectionEquipos.doc(id).set(equipo).then(()=>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Equipo registrado',
          showConfirmButton: false,
          timer: 1500
        })
      }).catch(err =>{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'ocurrio un error al registrar equipo',
          showConfirmButton: false,
          timer: 1500
        })
        console.log("Ocurrio un error al registrar liga", err.message);
      });

  }

  async getEquipos(){
    return await this.CollectionEquipos.valueChanges()
  }

  async updateEquipo(img : string, equipo : dtoequipos){
    let url = await this.storageRegt.child('ImagenesEquipos/'+equipo.id).putString(img, 'data_url');
      const urlImg = await url.ref.getDownloadURL();
      equipo.img = urlImg;
      return await this.CollectionEquipos.doc(equipo.id).update(equipo).then(()=>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Equipo actualizado',
          showConfirmButton: false,
          timer: 1500
        })
      }).catch(err =>{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'ocurrio un error al actualizar equipo',
          showConfirmButton: false,
          timer: 1500
        })
        console.log("Ocurrio un error al registrar liga", err.message);
      });

  }

  async ActualizaEquipo(equipo : dtoequipos){
    return await this.CollectionEquipos.doc(equipo.id).update(equipo).then(()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Equipo actualizado',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(err =>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'ocurrio un error al actualizar equipo',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("Ocurrio un error al registrar liga", err.message);
    });
  }

  //metodos jugador 
  async setJugador(img : string, dtoJugador : dtoJugador){
    let url = await this.storageRegt.child('ImagenesJugadores/'+dtoJugador.imss).putString(img, 'data_url');
    const urlImg = await url.ref.getDownloadURL();
    dtoJugador.img = urlImg;
    return await this.CollectionJugador.doc(dtoJugador.imss).set(dtoJugador).then(()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'jugador registrado',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(err =>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'ocurrio un error al registrar jugador',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("Ocurrio un error al registrar liga", err.message);
    });
  }
  async actualizaJUgador(dtoJugador : dtoJugador){
    return await this.CollectionJugador.doc(dtoJugador.imss).update(dtoJugador).then(()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'jugador registrado',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(err =>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'ocurrio un error al registrar jugador',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("Ocurrio un error al registrar liga", err.message);
    });

  }
  getJugadores(){
    return this.CollectionJugador.valueChanges();
  }

  async updateJugador(img : string, dtoJugador : dtoJugador){
    let url = await this.storageRegt.child('ImagenesJugadores/'+dtoJugador.imss).putString(img, 'data_url');
    const urlImg = await url.ref.getDownloadURL();
    dtoJugador.img = urlImg;
    return await this.CollectionJugador.doc(dtoJugador.imss).update(dtoJugador).then(()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'jugador registrado',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(err =>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'ocurrio un error al registrar jugador',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("Ocurrio un error al registrar liga", err.message);
    });
  }

  //TODO: albitro metodos
  async setAlbitro(img : string, dtoalbitro : dtoAlbitro ){
    let url = await this.storageRegt.child('ImagenesAlbitros/'+dtoalbitro.imss).putString(img, 'data_url');
    const urlImg = await url.ref.getDownloadURL();
    dtoalbitro.img = urlImg;

    this.CollectioAlbitro.doc(dtoalbitro.imss).set(dtoalbitro).then(()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Albitro registrado',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(err =>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'ocurrio un error al registrar jugador',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("Ocurrio un error al registrar liga", err.message);
    });
  }
  async getAlbitros(){
    return await this.CollectioAlbitro.valueChanges();
  }
  async updateAlbitro(img : string, dtoalbitro : dtoAlbitro){
    let url = await this.storageRegt.child('ImagenesAlbitros/'+dtoalbitro.imss).putString(img, 'data_url');
    const urlImg = await url.ref.getDownloadURL();
    dtoalbitro.img = urlImg;

    this.CollectioAlbitro.doc(dtoalbitro.imss).update(dtoalbitro).then(()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Albitro actualizado',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(err =>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'ocurrio un error al actualizar albitro',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("Ocurrio un error al actualizar albitro", err.message);
    });
  }

  async actualizaAlbitroSInimg(dtoalbitro : dtoAlbitro){
    this.CollectioAlbitro.doc(dtoalbitro.imss).update(dtoalbitro).then(()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Albitro actualizado',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(err =>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'ocurrio un error al actualizar albitro',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("Ocurrio un error al actualizar albitro", err.message);
    });
  }

  async obtenerLigaSelect(name : string){
    return await this.afs.collection('Ligas', ref => ref.where('deporte','==',name)).valueChanges();
  }

  async obtenerEquiposSelect(name : string){
    return await this.afs.collection('Equipos', ref => ref.where('liga','==',name)).valueChanges();
  }

  async obtenerAlbitrosSelect(name : string){
    return await this.afs.collection('Albitros', ref => ref.where('equipo','==',name)).valueChanges();
  }

  regustraPartido(dtoPartido : DtoPartido){
    dtoPartido.id = this.afs.createId();
    return this.afs.collection<DtoPartido>('Partidos/').doc(dtoPartido.id).set(dtoPartido).then(()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Partido Registrado',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(err =>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'ocurrio un error al FRegistrar partido',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }

  async obtenerPrtidos(){
    return await  this.afs.collection<DtoPartido>('Partidos').valueChanges();
  }
}
