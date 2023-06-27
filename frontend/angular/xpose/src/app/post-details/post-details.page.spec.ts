import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailsPage } from './post-details.page';

describe('PostDetailsPage', () => {
  let component: PostDetailsPage;
  let fixture: ComponentFixture<PostDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PostDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
