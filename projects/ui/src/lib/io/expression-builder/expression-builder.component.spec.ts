import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionBuilderComponent } from './expression-builder.component';

describe('ExpressionBuilderComponent', () => {
  let component: ExpressionBuilderComponent;
  let fixture: ComponentFixture<ExpressionBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressionBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressionBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
