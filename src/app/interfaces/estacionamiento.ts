export interface Estacionamiento{
    id:number,
    patente: string, 
    horaIngreso: string,
    horaEgreso:string|null,
    costo: number|null, 
    idUsuareoIngreso: string,
    idUsuareoEgreso: string|null,
    idCochera: number, 
    eliminado: null,


}