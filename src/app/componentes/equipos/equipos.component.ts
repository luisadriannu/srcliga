import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { dtoequipos } from 'src/app/interface/dtos-firebase';
import { FirestoreService } from 'src/app/Servicios/firestore.service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  columsEquipos : string[] = ["nombre", "img", "liga","Representante"];
  Equipos : dtoequipos[] = []
  dataSourceEquipos : MatTableDataSource<dtoequipos>;
  @ViewChild('MatPaginatorequipos', {static: false}) paginatorEquipos: MatPaginator;
  constructor(private firebase : FirestoreService) {
    this.dataSourceEquipos = new MatTableDataSource(this.Equipos);
   }

  async ngOnInit() {
    (await this.firebase.getEquipos()).subscribe(res =>{
      this.Equipos = res;
      this.dataSourceEquipos = new MatTableDataSource(this.Equipos);
      this.dataSourceEquipos.paginator = this.paginatorEquipos;
      
   });
  }

  applyFilterEquipos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEquipos.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceEquipos.paginator) {
      this.dataSourceEquipos.paginator.firstPage();
    }
  }

}
