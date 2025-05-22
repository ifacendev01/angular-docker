import { ChartOptions } from "@/app/common/apexchart.model";

export type ReportItem = {
    nombre:string;
    pregunta:string;
    fecha:Date;
    valor:number;
    dia:number;
    color:string;
}
export type ReportData = {
    data: ReportItem[];
}
export type ReportChart = {
    title:string
    config: Partial<ChartOptions>
}

export type SeriesReport = {
    name:string;
    data:number[];    
}

export type ReportDataMedicamentosItem = {
    nombre:string;
    cantidad:string;
    dias:string;
    horas:number;
    minutos:number;
    comentario:string;
    notificacion:string;
    fecha:Date;
}
export type ReportDataMedicamentos = {
    data: ReportDataMedicamentosItem[];
}