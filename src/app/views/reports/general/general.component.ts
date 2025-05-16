import { Component } from '@angular/core'
import { PageTitleComponent } from '@/app/components/page-title.component'

import type { ChartOptions } from '@/app/common/apexchart.model'
import { NgApexchartsModule } from 'ng-apexcharts'
import { ReportService } from '@/app/core/services/reports.service'
import { ReportChart, ReportItem, SeriesReport } from '@/app/store/report/report.model'
import { NgForOf } from '@angular/common'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [NgApexchartsModule,NgForOf],
  templateUrl: './general.component.html',
  styles: ``,
})
export class GeneralComponent {
    reportList:ReportChart[] = []
    mesActual:string = ""
    constructor(private reportService: ReportService,private route: ActivatedRoute) {    
        const hoy = new Date();   
        this.mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(hoy).toUpperCase();        
    }    

  ngOnInit(): void {    
    let telegramId = ""
    let templateId = ""
    const hoy = new Date();

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);

    const formato = (fecha: Date): string => fecha.toISOString().slice(0, 10);

    let fechaIni = formato(inicioMes)
    let fechaEnd = formato(finMes)

    this.route.queryParams.subscribe(params => {
        telegramId = params['telegramId'];
        templateId = params['templateId'];
    });

    if(telegramId==undefined || templateId==undefined){
        return
    }
    
    this.reportService.getReports(telegramId,templateId,fechaIni,fechaEnd).subscribe({
      next: (data) => {
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
            let reportData:ReportChart = {} as ReportChart
            reportData.title = clave.trim().toUpperCase()
            reportData.config = {}
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

            reportData.config.yaxis= {
                min: 0,
                axisBorder: {
                    show: false,
                },
            },
            reportData.config.grid = {
                show: true,
                strokeDashArray: 3,
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
                    left: 10,
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
            var serieDias = this.getDiasDelMesActual()
            dataSeries[lastSerie] = itemsCatSeries
            reportData.config.series = reportData.config.series || [] as ApexAxisChartSeries;
            for (let claveSerie in dataSeries) {
                console.log(dataSeries[claveSerie])
                
                var resultado = serieDias.map(dia => {
                    const encontrado =  dataSeries[claveSerie].find((v:ReportItem) => v.dia.toString() === dia);
                    return encontrado ? encontrado.valor : 0;
                });
                const serieValida: ApexAxisChartSeries[number] = {
                name: 'Carne',
                data: resultado
                };
                (reportData.config.series as ApexAxisChartSeries).push(serieValida);
            }

            if(reportData.config.xaxis!=undefined)
                reportData.config.xaxis.categories = serieDias
            this.reportList.push(reportData)
        }
      },error: (err) => {
        console.error('Error al cargar reportes:', err);
        },
    })

    /*if(this.performanceChart.xaxis!=undefined)
        this.performanceChart.xaxis.categories = this.getDiasDelMesActual()*/
  }
  getDiasDelMesActual(): string[] {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();

  const ultimoDia = new Date(año, mes + 1, 0).getDate();

  return Array.from({ length: ultimoDia }, (_, i) => (i + 1).toString());
}
}
