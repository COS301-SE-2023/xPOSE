import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCollectionPage } from './view-collection.page';

describe('ViewCollectionPage', () => {
  let component: ViewCollectionPage;
  let fixture: ComponentFixture<ViewCollectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewCollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
