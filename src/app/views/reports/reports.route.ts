import { Route } from '@angular/router'
import { GeneralComponent } from './general/general.component'
import { GaficaUnoComponent } from './graficauno/graficauno.component'
import { GaficaTresComponent } from './graficatres/graficatres.component'

export const REPORTS_ROUTES: Route[] = [
  {
    path: 'general',
    component: GeneralComponent,
    data: { title: 'general' },
  },  
  {
    path: 'grafico1',
    component: GaficaUnoComponent,
    data: { title: 'Gráfico' },
  }, 
  {
    path: 'grafico2',
    component: GaficaTresComponent,
    data: { title: 'Gráfico' },
  },  
]
