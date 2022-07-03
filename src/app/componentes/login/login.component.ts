import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/Servicios/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private firestore : FirestoreService) { }
Email : string = ""
Pwd : string = ""
  ngOnInit(): void {
  }

  iniciarSesion(){

    this.firestore.iniciarSesion(this.Email , this.Pwd)

  }
}
