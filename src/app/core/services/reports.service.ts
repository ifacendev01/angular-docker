import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { ReportData, ReportItem } from '@/app/store/report/report.model'
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
}