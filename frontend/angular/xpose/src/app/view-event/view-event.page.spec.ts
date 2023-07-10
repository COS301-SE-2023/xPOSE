import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewEventPage } from './view-event.page';

describe('ViewEventPage', () => {
  let component: ViewEventPage;
  let fixture: ComponentFixture<ViewEventPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
