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
  imports: [NgApexchartsModule,NgForOf,NgClass,NgIf


  ],
  templateUrl: './graficauno.component.html',
  styleUrl: './graficauno.component.css',
})
export class GaficaUnoComponent {
    @ViewChild('pdfGrafic') pdfGrafic!: ElementRef;

    loading:boolean = false
    reportList:ReportChart[] = []
    mesActual:string = ""
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
    this.reportList = []
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

    let reportData:ReportChart = {} as ReportChart
    reportData.title = "Gráfica 1"
    reportData.config = {}
    reportData.config.stroke = {
        width: [3,3,3, 3,3]
    }
    reportData.config.chart = {
        height: 313,
        type: 'line',
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },      
    }
    reportData.config.plotOptions = {
        bar: {
            columnWidth: '100%',
        }
    },

    reportData.config.yaxis= {
        min: 0,
        axisBorder: {
            show: false,
        },
    },
    reportData.config.grid = {
        show: true,
        strokeDashArray: 1,
        xaxis: {
            lines: {
            show: false,
            },
        },
        yaxis: {
            lines: {
            show: true,
            },
        },
        padding: {
            top: 0,
            right: -2,
            bottom: 0,
            left: 0,
        },
    }
    reportData.config.legend = {
        show: true,
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 5,
        floating: true,
        itemMargin: {
            horizontal: 10,
            vertical: 0,
        },
    }

    reportData.config.xaxis = {}
    reportData.config.xaxis.categories = this.obtenerDiasEntreFechas(inicioMes,finMes)
    
    this.reportService.getReportsConfig(this.telegramId,this.templateId,this.fechaIni,this.fechaEnd).subscribe({
      next: (data) => {
        if(data.data.length>0)
        {
            var lastCategoria = data.data[0].nombre
            var dataCat: { [key: string]: any } = {};
            var itemsCat:ReportItem[] = [] 
            data.data.forEach((element:ReportItem) => {            
                if(lastCategoria!=element.nombre){                                
                    dataCat[lastCategoria] = itemsCat
                    lastCategoria=element.nombre
                    itemsCat = [];
                }
                itemsCat.push(element)
            });
            dataCat[lastCategoria] = itemsCat
            console.log(dataCat)
            

            var serieDias = this.obtenerDiasEntreFechas(inicioMes,finMes) // this.getDiasDelMesActual()
            reportData.config.series = reportData.config.series || [] as ApexAxisChartSeries;
            for (let claveSerie in dataCat) {
                console.log(dataCat[claveSerie])
                
                var resultado = serieDias.map(dia => {
                    const encontrado =  dataCat[claveSerie].find((v:ReportItem) => v.dia.toString() === dia);
                    return encontrado ? encontrado.valor : 0;
                });
                console.log(resultado)
                const serieValida: ApexAxisChartSeries[number] = {
                name: claveSerie,
                data: resultado,
                color: dataCat[claveSerie][0]["color"],
                type:"line"
                };
                (reportData.config.series as ApexAxisChartSeries).push(serieValida);
            }
            console.log(serieDias)            
        }

        this.reportService.getReportsCatGrafica1(this.telegramId,this.templateId,this.fechaIni,this.fechaEnd).subscribe({
            next: (data) => {
                if(data.data.length>0)
                {
                    var lastCategoria = data.data[0].nombre
                    var dataCat: { [key: string]: any } = {};
                    var itemsCat:ReportItem[] = [] 
                    data.data.forEach((element:ReportItem) => {            
                        if(lastCategoria!=element.nombre){                                
                            dataCat[lastCategoria] = itemsCat
                            lastCategoria=element.nombre
                            itemsCat = [];
                        }
                        itemsCat.push(element)
                    });
                    dataCat[lastCategoria] = itemsCat
                    console.log(dataCat)
                    for (let clave in dataCat) {
                        
                        var dataSeries: { [key: string]: any } = {};
                        var itemsCatSeries:ReportItem[] = [] 
                        var dataSerieR =  dataCat[clave] as ReportItem[]
                        var lastSerie =dataSerieR[0].pregunta            

                        dataSerieR.forEach((element:ReportItem) => {            
                            if(lastSerie!=element.pregunta){                                
                                dataSeries[lastSerie] = itemsCatSeries
                                lastSerie=element.pregunta
                                itemsCatSeries = [];
                            }
                            itemsCatSeries.push(element)
                        });
                        var serieDias = this.obtenerDiasEntreFechas(inicioMes,finMes)//this.getDiasDelMesActual()
                        dataSeries[lastSerie] = itemsCatSeries
                        
                        for (let claveSerie in dataSeries) {
                            console.log(dataSeries[claveSerie])
                            
                            var resultado = serieDias.map(dia => {
                                const encontrado =  dataSeries[claveSerie].find((v:ReportItem) => v.dia.toString() === dia);
                                return encontrado ? encontrado.valor : 0;
                            });
                            const serieValida: ApexAxisChartSeries[number] = {
                            name: claveSerie,
                            data: resultado,
                            type: "column",
                            };
                            (reportData.config.series as ApexAxisChartSeries).push(serieValida);
                        }
                        
                    }
                    //this.reportList.push(reportData)
                }
            },error: (err) => {
                console.error('Error al cargar reportes:', err);
                },
            })                
      },error: (err) => {
        console.error('Error al cargar reportes:', err);
        },
    }) 

    let reportData2:ReportChart = {} as ReportChart
    reportData2.title = "Gráfica 2"
    reportData2.config = {}
    reportData2.config.stroke = {
        width: [3,3,3, 3,3]
    }
    reportData2.config.chart = {
        height: 313,
        type: 'line',
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },      
    }
    reportData2.config.plotOptions = {
        bar: {
            columnWidth: '100%',
        }
    },

    reportData2.config.yaxis= {
        min: 0,
        axisBorder: {
            show: false,
        },
    },
    reportData2.config.grid = {
        show: true,
        strokeDashArray: 1,
        xaxis: {
            lines: {
            show: false,
            },
        },
        yaxis: {
            lines: {
            show: true,
            },
        },
        padding: {
            top: 0,
            right: -2,
            bottom: 0,
            left: 0,
        },
    }
    reportData2.config.legend = {
        show: true,
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 5,
        floating: true,
        itemMargin: {
            horizontal: 10,
            vertical: 0,
        },
    }

    reportData2.config.xaxis = {}
    reportData2.config.xaxis.categories = this.obtenerDiasEntreFechas(inicioMes,finMes)

    this.reportService.getReportsConfigDolor(this.telegramId,this.templateId,this.fechaIni,this.fechaEnd).subscribe({
      next: (data) => {
            if(data.data.length>0)
            {
                var lastCategoria = data.data[0].nombre
                var dataCat: { [key: string]: any } = {};
                var itemsCat:ReportItem[] = [] 
                data.data.forEach((element:ReportItem) => {            
                    if(lastCategoria!=element.nombre){                                
                        dataCat[lastCategoria] = itemsCat
                        lastCategoria=element.nombre
                        itemsCat = [];
                    }
                    itemsCat.push(element)
                });
                dataCat[lastCategoria] = itemsCat
                console.log(dataCat)
                

                var serieDias = this.obtenerDiasEntreFechas(inicioMes,finMes) // this.getDiasDelMesActual()
                reportData2.config.series = reportData2.config.series || [] as ApexAxisChartSeries;
                for (let claveSerie in dataCat) {
                    console.log(dataCat[claveSerie])
                    
                    var resultado = serieDias.map(dia => {
                        const encontrado =  dataCat[claveSerie].find((v:ReportItem) => v.dia.toString() === dia);
                        return encontrado ? encontrado.valor : 0;
                    });
                    console.log(resultado)
                    const serieValida: ApexAxisChartSeries[number] = {
                    name: claveSerie,
                    data: resultado,
                    color: dataCat[claveSerie][0]["color"],
                    type:"line"
                    };
                    (reportData2.config.series as ApexAxisChartSeries).push(serieValida);
                }
            }

            this.reportService.getReportsCatGrafica2(this.telegramId,this.templateId,this.fechaIni,this.fechaEnd).subscribe({
            next: (data) => {
                if(data.data.length>0)
                {
                    var lastCategoria = data.data[0].nombre
                    var dataCat: { [key: string]: any } = {};
                    var itemsCat:ReportItem[] = [] 
                    data.data.forEach((element:ReportItem) => {            
                        if(lastCategoria!=element.nombre){                                
                            dataCat[lastCategoria] = itemsCat
                            lastCategoria=element.nombre
                            itemsCat = [];
                        }
                        itemsCat.push(element)
                    });
                    dataCat[lastCategoria] = itemsCat
                    console.log(dataCat)
                    for (let clave in dataCat) {
                        
                        var dataSeries: { [key: string]: any } = {};
                        var itemsCatSeries:ReportItem[] = [] 
                        var dataSerieR =  dataCat[clave] as ReportItem[]
                        var lastSerie =dataSerieR[0].pregunta            

                        dataSerieR.forEach((element:ReportItem) => {            
                            if(lastSerie!=element.pregunta){                                
                                dataSeries[lastSerie] = itemsCatSeries
                                lastSerie=element.pregunta
                                itemsCatSeries = [];
                            }
                            itemsCatSeries.push(element)
                        });
                        var serieDias = this.obtenerDiasEntreFechas(inicioMes,finMes)//this.getDiasDelMesActual()
                        dataSeries[lastSerie] = itemsCatSeries
                        
                        for (let claveSerie in dataSeries) {
                            console.log(dataSeries[claveSerie])
                            
                            var resultado = serieDias.map(dia => {
                                const encontrado =  dataSeries[claveSerie].find((v:ReportItem) => v.dia.toString() === dia);
                                return encontrado ? encontrado.valor : 0;
                            });
                            const serieValida: ApexAxisChartSeries[number] = {
                            name: claveSerie,
                            data: resultado,
                            type: "column",
                            };
                            (reportData2.config.series as ApexAxisChartSeries).push(serieValida);
                        }
                        
                    }                    
                }
                //this.reportList.push(reportData2)
            },error: (err) => {
                console.error('Error al cargar reportes:', err);
                },
            })  
        },error: (err) => {
        console.error('Error al cargar reportes:', err);
        },
    })

    let reportData3:ReportChart = {} as ReportChart
    reportData3.title = "Gráfica 3"
    reportData3.config = {}
    reportData3.config.stroke = {
        width: [3,3,3, 3,3]
    }
    reportData3.config.chart = {
        height: 313,
        type: 'line',
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },      
    }
    reportData3.config.plotOptions = {
        bar: {
            columnWidth: '100%',
        }
    },

    reportData3.config.yaxis= {
        min: 0,
        axisBorder: {
            show: false,
        },
    },
    reportData3.config.grid = {
        show: true,
        strokeDashArray: 1,
        xaxis: {
            lines: {
            show: false,
            },
        },
        yaxis: {
            lines: {
            show: true,
            },
        },
        padding: {
            top: 0,
            right: -2,
            bottom: 0,
            left: 0,
        },
    }
    reportData3.config.legend = {
        show: true,
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 5,
        floating: true,
        itemMargin: {
            horizontal: 10,
            vertical: 0,
        },
    }

    reportData3.config.xaxis = {}
    reportData3.config.xaxis.categories = this.obtenerDiasEntreFechas(inicioMes,finMes)

    this.reportService.getReportsConfigDolor(this.telegramId,this.templateId,this.fechaIni,this.fechaEnd).subscribe({
      next: (data) => {
            if(data.data.length>0)
            {
                var lastCategoria = data.data[0].nombre
                var dataCat: { [key: string]: any } = {};
                var itemsCat:ReportItem[] = [] 
                data.data.forEach((element:ReportItem) => {            
                    if(lastCategoria!=element.nombre){                                
                        dataCat[lastCategoria] = itemsCat
                        lastCategoria=element.nombre
                        itemsCat = [];
                    }
                    itemsCat.push(element)
                });
                dataCat[lastCategoria] = itemsCat
                console.log(dataCat)
                

                var serieDias = this.obtenerDiasEntreFechas(inicioMes,finMes) // this.getDiasDelMesActual()
                reportData3.config.series = reportData3.config.series || [] as ApexAxisChartSeries;
                for (let claveSerie in dataCat) {
                    console.log(dataCat[claveSerie])
                    
                    var resultado = serieDias.map(dia => {
                        const encontrado =  dataCat[claveSerie].find((v:ReportItem) => v.dia.toString() === dia);
                        return encontrado ? encontrado.valor : 0;
                    });
                    console.log(resultado)
                    const serieValida: ApexAxisChartSeries[number] = {
                    name: claveSerie,
                    data: resultado,
                    color: dataCat[claveSerie][0]["color"],
                    type:"line"
                    };
                    (reportData3.config.series as ApexAxisChartSeries).push(serieValida);
                }
            }

            this.reportService.getReportsCatGrafica3(this.telegramId,this.templateId,this.fechaIni,this.fechaEnd).subscribe({
            next: (data) => {
                if(data.data.length>0)
                {
                    var lastCategoria = data.data[0].nombre
                    var dataCat: { [key: string]: any } = {};
                    var itemsCat:ReportItem[] = [] 
                    data.data.forEach((element:ReportItem) => {            
                        if(lastCategoria!=element.nombre){                                
                            dataCat[lastCategoria] = itemsCat
                            lastCategoria=element.nombre
                            itemsCat = [];
                        }
                        itemsCat.push(element)
                    });
                    dataCat[lastCategoria] = itemsCat
                    console.log(dataCat)
                    for (let clave in dataCat) {
                        
                        var dataSeries: { [key: string]: any } = {};
                        var itemsCatSeries:ReportItem[] = [] 
                        var dataSerieR =  dataCat[clave] as ReportItem[]
                        var lastSerie =dataSerieR[0].pregunta            

                        dataSerieR.forEach((element:ReportItem) => {            
                            if(lastSerie!=element.pregunta){                                
                                dataSeries[lastSerie] = itemsCatSeries
                                lastSerie=element.pregunta
                                itemsCatSeries = [];
                            }
                            itemsCatSeries.push(element)
                        });
                        var serieDias = this.obtenerDiasEntreFechas(inicioMes,finMes)//this.getDiasDelMesActual()
                        dataSeries[lastSerie] = itemsCatSeries
                        
                        for (let claveSerie in dataSeries) {
                            console.log(dataSeries[claveSerie])
                            
                            var resultado = serieDias.map(dia => {
                                const encontrado =  dataSeries[claveSerie].find((v:ReportItem) => v.dia.toString() === dia);
                                return encontrado ? encontrado.valor : 0;
                            });
                            const serieValida: ApexAxisChartSeries[number] = {
                            name: claveSerie,
                            data: resultado,
                            type: "column",
                            };
                            (reportData3.config.series as ApexAxisChartSeries).push(serieValida);
                        }
                        
                    }                    
                }
                this.reportList.push(reportData)
                this.reportList.push(reportData2)
                this.reportList.push(reportData3)

                this.loading = false
            },error: (err) => {
                console.error('Error al cargar reportes:', err);
                },
            })  
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
    var hoy = new Date();
    const options = {
      margin:       0.5,
      filename:     this.getNamePdf() + '.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }//portrait
    };

    const content = this.pdfGrafic.nativeElement;
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
