import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinedEventPage } from './joined-event.page';

describe('JoinedEventPage', () => {
  let component: JoinedEventPage;
  let fixture: ComponentFixture<JoinedEventPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JoinedEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
