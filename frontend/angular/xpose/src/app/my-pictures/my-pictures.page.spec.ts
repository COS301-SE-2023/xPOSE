import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPicturesPage } from './my-pictures.page';

describe('MyPicturesPage', () => {
  let component: MyPicturesPage;
  let fixture: ComponentFixture<MyPicturesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyPicturesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
