import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageBoardPage } from './message-board.page';

describe('MessageBoardPage', () => {
  let component: MessageBoardPage;
  let fixture: ComponentFixture<MessageBoardPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MessageBoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
