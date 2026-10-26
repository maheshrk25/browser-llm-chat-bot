import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversationView } from './conversation-view';

describe('ConversationView', () => {
  let component: ConversationView;
  let fixture: ComponentFixture<ConversationView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationView],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
