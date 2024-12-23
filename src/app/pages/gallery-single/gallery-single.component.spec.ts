import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerySingleComponent } from './gallery-single.component';

describe('GallerySingleComponent', () => {
  let component: GallerySingleComponent;
  let fixture: ComponentFixture<GallerySingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GallerySingleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GallerySingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
