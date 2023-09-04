import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsSettingsPage } from './events-settings.page';

describe('EventsSettingsPage', () => {
  let component: EventsSettingsPage;
  let fixture: ComponentFixture<EventsSettingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventsSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
