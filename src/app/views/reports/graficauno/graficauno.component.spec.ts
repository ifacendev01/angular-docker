import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GaficaUnoComponent } from './graficauno.component'

describe('GaficaUnoComponent', () => {
  let component: GaficaUnoComponent
  let fixture: ComponentFixture<GaficaUnoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaficaUnoComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(GaficaUnoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
