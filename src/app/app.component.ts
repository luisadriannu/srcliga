import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './Servicios/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
constructor(private firebase : FirestoreService){}
isAuth : boolean = false;
  ngOnInit() {
   this.firebase.isLoggeed().subscribe(auth =>{
     if(auth){
       this.isAuth = true;
     }else{
       this.isAuth = false;
     }
   })
  }
  title = 'ligas';
  cerrarSesion(){
    this.firebase.cerrarSesion();
  }
}
