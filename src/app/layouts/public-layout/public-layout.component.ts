import { Component, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterModule],
  template: `<div class="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  </div>`,
  styles: ``,
})
export class PublicLayoutComponent {
  layoutType: any

  private store = inject(Store)

  ngOnInit(): void {
    
  }
}
