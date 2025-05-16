import { ChartOptions } from "@/app/common/apexchart.model";

export type ReportItem = {
    nombre:string;
    pregunta:string;
    fecha:Date;
    valor:number;
    dia:number;
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