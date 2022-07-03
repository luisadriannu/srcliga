export interface dtoLiga {
    id:string
    nombre:string
    deporte:string
    encargado:string
    genero:string
    categoria:string
    isactiva:boolean
}

export interface dtoequipos {
    id:string
    nombre:string;
    representante:string;
    img: string;
    liga:string;
}

export interface dtoJugador{
    
    nombre: string;
    apellidoP:string;
    apellidoM: string;
    edad:number;
    imss: string;
    telefono:string;
    img: string;
    genero: string;
    equipo: string;
    numeroCamisa: string;
}

export interface dtoAlbitro{
    nombre: string;
    apellidoP:string;
    apellidoM: string;
    edad:number;
    imss: string;
    telefono:string;
    img: string;
    genero: string;
    equipo: string;
}

export interface dtoEvents{
    initialView: string
    title: string
    start : any
    description: string;

}

export interface DtoPartido{
    id: string;
    deporte: string;
    liga: string;
    albitro: string;
    equipo1: string;
    equipo2: string;
    lugar:string;
    fecha: string;
    event: dtoEvents
}
