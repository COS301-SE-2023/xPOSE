import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchImagePage } from './search-image.page';

describe('SearchImagePage', () => {
  let component: SearchImagePage;
  let fixture: ComponentFixture<SearchImagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
