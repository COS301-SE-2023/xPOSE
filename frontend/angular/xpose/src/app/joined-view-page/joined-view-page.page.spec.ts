import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinedViewPagePage } from './joined-view-page.page';

describe('JoinedViewPagePage', () => {
  let component: JoinedViewPagePage;
  let fixture: ComponentFixture<JoinedViewPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JoinedViewPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
