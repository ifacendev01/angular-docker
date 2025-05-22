
import { Component, ViewChild, ElementRef } from '@angular/core'
import { PageTitleComponent } from '@/app/components/page-title.component'

import type { ChartOptions } from '@/app/common/apexchart.model'
import { NgApexchartsModule } from 'ng-apexcharts'
import { ReportService } from '@/app/core/services/reports.service'
import { ReportChart, ReportDataMedicamentos, ReportItem, SeriesReport } from '@/app/store/report/report.model'
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import html2pdf from 'html2pdf.js'

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [NgApexchartsModule,NgForOf,NgClass,DatePipe,NgIf


  ],
  templateUrl: './graficatres.component.html',
  styleUrl: './graficatres.component.css',
})
export class GaficaTresComponent {
    @ViewChild('pdfGrafic') pdfGrafic!: ElementRef;
    @ViewChild('pdfMedicamentos') pdfMedicamentos!: ElementRef;
    @ViewChild('pdfComentarios') pdfComentarios!: ElementRef;

    mesActual:string = ""
    loading:boolean = false

    reportDataMedicamentos:ReportDataMedicamentos = {} as ReportDataMedicamentos
    reportDataMedicamentosCom:ReportDataMedicamentos = {} as ReportDataMedicamentos
    constructor(private reportService: ReportService,private route: ActivatedRoute) {    
        const hoy = new Date();   
        this.mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(hoy).toUpperCase();        
    }    
    fechaIni = ""
    fechaEnd = ""
    telegramId = ""
    templateId = ""
    typeFilter = "7"

    ngOnInit(): void {    
    
    
    this.route.queryParams.subscribe(params => {
        this.telegramId = params['telegramId'];
        this.templateId = params['templateId'];
    });

    if(this.telegramId==undefined || this.templateId==undefined){
        return
    }

    this.reloadfilterByDate('7')
  }
  getClassesByType(type:string){
    var allclass = 'btn btn-sm btn-outline-light '
    var addclass = 'me-1'
    switch(type){
        case "GRAF1_" + this.typeFilter:
            addclass = "active"
            break        
    }
    return allclass +  addclass
  }
  reloadfilterByDate(type:string){
    this.loading = true
    var hoy = new Date();
    hoy = this.restarDias(hoy,1)
    var antes = this.restarDias(hoy,-8)
    this.typeFilter = type
    switch(type){
        case "15":
            antes = this.restarDias(hoy,-16)
            break
        case "30":
            antes = this.restarDias(hoy,-31)
            break
        case "365":
            antes = this.restarDias(hoy,-365)
            break
    }
    

    const finMes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const inicioMes = new Date(antes.getFullYear(), antes.getMonth(), antes.getDate());

    const formato = (fecha: Date): string => fecha.toISOString().slice(0, 10);

    this.fechaIni = formato(inicioMes)
    this.fechaEnd = formato(finMes)
    
    //reporte tabla
    this.reportService.getReportsTabla4(this.telegramId,this.templateId,this.fechaIni,this.fechaEnd).subscribe({
        next: (data) => {
            this.reportDataMedicamentos = data
        },error: (err) => {
            console.error('Error al cargar reportes:', err);
            },
        })
    this.reportService.getReportsTabla5(this.telegramId,this.templateId,this.fechaIni,this.fechaEnd).subscribe({
        next: (data) => {
            this.reportDataMedicamentosCom = data
            this.loading = false
        },error: (err) => {
            console.error('Error al cargar reportes:', err);
            },
        })

    
  }
  restarDias(fecha: Date, dias: number): Date {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + dias);
    return nueva;
  }
  getDiasDelMesActual(): string[] {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();

    const ultimoDia = new Date(año, mes + 1, 0).getDate();

    return Array.from({ length: ultimoDia }, (_, i) => (i + 1).toString());
  }
  obtenerDiasPorRango(inicio: Date, fin: Date):Array<string>{
    return Array.from({ length: 10 }, (_, i) => (12 + i).toString())
  }
  obtenerDiasEntreFechas(inicio: Date, fin: Date): string[] {
    const dias: string[] = [];
    const actual = new Date(inicio);

    console.log(inicio,fin)

    while (actual <= fin) {
        const dia = actual.toISOString().split('T')[0]; // formato: yyyy-MM-dd
        dias.push(actual.getDate().toString());
        actual.setDate(actual.getDate() + 1);
    }
    return dias;
  }
  generarPDFGrafica() {
    const options = {
      margin:       0.5,
      filename:     'reporte.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }//portrait
    };

    const content = this.pdfGrafic.nativeElement;
    html2pdf().from(content).set(options).save();
  }
  generarPDFMedicamentos() {
    var hoy = new Date();
    const options = {
      margin:       0.5,
      filename:     this.getNamePdf() + '.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }//portrait
    };

    const content = this.pdfMedicamentos.nativeElement;
    html2pdf().from(content).set(options).save();
  }
  generarPDFComentarios() {
    const options = {
      margin:       0.5,
      filename:     this.getNamePdf() + '.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }//portrait
    };

    const content = this.pdfComentarios.nativeElement;
    html2pdf().from(content).set(options).save();
  }
  getNamePdf(){
    const hoy = new Date();
    return hoy.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    }).replace(/\//g, '-');
  }
}
