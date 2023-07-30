import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersEventsPage } from './users-events.page';

describe('UsersEventsPage', () => {
  let component: UsersEventsPage;
  let fixture: ComponentFixture<UsersEventsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsersEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
