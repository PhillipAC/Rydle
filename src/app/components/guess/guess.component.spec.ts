import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessComponent } from './guess.component';
import { HttpClientModule } from '@angular/common/http';

describe('GuessComponent', () => {
  let component: GuessComponent;
  let fixture: ComponentFixture<GuessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessComponent,
                HttpClientModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
