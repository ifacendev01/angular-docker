import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GaficaTresComponent } from './graficatres.component'

describe('GaficaUnoComponent', () => {
  let component: GaficaTresComponent
  let fixture: ComponentFixture<GaficaTresComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaficaTresComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(GaficaTresComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
