import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PicturesPage } from './pictures.page';

describe('PicturesPage', () => {
  let component: PicturesPage;
  let fixture: ComponentFixture<PicturesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PicturesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
