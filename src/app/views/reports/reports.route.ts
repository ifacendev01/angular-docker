import { Route } from '@angular/router'
import { GeneralComponent } from './general/general.component'

export const REPORTS_ROUTES: Route[] = [
  {
    path: 'general',
    component: GeneralComponent,
    data: { title: 'general' },
  },  
]
