import { Paquete } from './paquete'; 
import { Excursion } from './excursion'; 

export interface paqueteExcursion {
    id: number;
    paquete: Paquete;
    excursion: Excursion;
    precio: number;
    dia: string;
    hora: string;
}
