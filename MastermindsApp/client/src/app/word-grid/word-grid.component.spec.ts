import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordGridComponent } from './word-grid.component';

describe('WordGridComponent', () => {
  let component: WordGridComponent;
  let fixture: ComponentFixture<WordGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
