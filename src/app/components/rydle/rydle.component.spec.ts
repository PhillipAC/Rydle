import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RydleComponent } from './rydle.component';

describe('RydleComponent', () => {
  let component: RydleComponent;
  let fixture: ComponentFixture<RydleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RydleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RydleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
