import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { ReportData, ReportDataMedicamentos, ReportDataMedicamentosItem, ReportItem } from '@/app/store/report/report.model'
import { environment } from '@/environments/environment'

@Injectable({ providedIn: 'root' })
export class ReportService {
    constructor(private http: HttpClient) {}
    getReports(telegramId: string, templateId: string,fechainicio:string, fechafin:string) {
        return this.http.post<ReportData>(environment.apiUrl + `/api/reporte/getdata`, {"telegramid":telegramId, "templateid":templateId,"fechainicio":fechainicio,"fechafin":fechafin }).pipe(
          map((result) => {
            let reportData:ReportData = {} as ReportData
            reportData.data = result as unknown as ReportItem[]
            return reportData
          })
        )
      }

      getReportsCatGrafica1(telegramId: string, templateId: string,fechainicio:string, fechafin:string) {
        return this.http.post<ReportData>(environment.apiUrl + `/api/reporte/getdatacatg1`, {"telegramid":telegramId, "templateid":templateId,"fechainicio":fechainicio,"fechafin":fechafin }).pipe(
          map((result) => {
            let reportData:ReportData = {} as ReportData
            reportData.data = result as unknown as ReportItem[]
            return reportData
          })
        )
      }
      getReportsCatGrafica2(telegramId: string, templateId: string,fechainicio:string, fechafin:string) {
        return this.http.post<ReportData>(environment.apiUrl + `/api/reporte/getdatacatg2`, {"telegramid":telegramId, "templateid":templateId,"fechainicio":fechainicio,"fechafin":fechafin }).pipe(
          map((result) => {
            let reportData:ReportData = {} as ReportData
            reportData.data = result as unknown as ReportItem[]
            return reportData
          })
        )
      }
      getReportsCatGrafica3(telegramId: string, templateId: string,fechainicio:string, fechafin:string) {
        return this.http.post<ReportData>(environment.apiUrl + `/api/reporte/getdatacatg3`, {"telegramid":telegramId, "templateid":templateId,"fechainicio":fechainicio,"fechafin":fechafin }).pipe(
          map((result) => {
            let reportData:ReportData = {} as ReportData
            reportData.data = result as unknown as ReportItem[]
            return reportData
          })
        )
      }

      getReportsTabla4(telegramId: string, templateId: string,fechainicio:string, fechafin:string) {
        return this.http.post<ReportDataMedicamentos>(environment.apiUrl + `/api/reporte/getdatarep4`, {"telegramid":telegramId, "templateid":templateId,"fechainicio":fechainicio,"fechafin":fechafin }).pipe(
          map((result) => {
            let reportData:ReportDataMedicamentos = {} as ReportDataMedicamentos
            reportData.data = result as unknown as ReportDataMedicamentosItem[]
            return reportData
          })
        )
      }

      getReportsTabla5(telegramId: string, templateId: string,fechainicio:string, fechafin:string) {
        return this.http.post<ReportDataMedicamentos>(environment.apiUrl + `/api/reporte/getdatarep5`, {"telegramid":telegramId, "templateid":templateId,"fechainicio":fechainicio,"fechafin":fechafin }).pipe(
          map((result) => {
            let reportData:ReportDataMedicamentos = {} as ReportDataMedicamentos
            reportData.data = result as unknown as ReportDataMedicamentosItem[]
            return reportData
          })
        )
      }
      
    
      getReportsConfig(telegramId: string, templateId: string,fechainicio:string, fechafin:string) {
        return this.http.post<ReportData>(environment.apiUrl + `/api/reporte/getdatarept`, {"telegramid":telegramId, "templateid":templateId,"fechainicio":fechainicio,"fechafin":fechafin }).pipe(
          map((result) => {
            let reportData:ReportData = {} as ReportData
            reportData.data = result as unknown as ReportItem[]
            return reportData
          })
        )
      }
      getReportsConfigDolor(telegramId: string, templateId: string,fechainicio:string, fechafin:string) {
        return this.http.post<ReportData>(environment.apiUrl + `/api/reporte/getdatareptdolor`, {"telegramid":telegramId, "templateid":templateId,"fechainicio":fechainicio,"fechafin":fechafin }).pipe(
          map((result) => {
            let reportData:ReportData = {} as ReportData
            reportData.data = result as unknown as ReportItem[]
            return reportData
          })
        )
      }
}