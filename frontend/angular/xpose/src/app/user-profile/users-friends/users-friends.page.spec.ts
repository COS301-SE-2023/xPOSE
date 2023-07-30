import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersFriendsPage } from './users-friends.page';

describe('UsersFriendsPage', () => {
  let component: UsersFriendsPage;
  let fixture: ComponentFixture<UsersFriendsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsersFriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
