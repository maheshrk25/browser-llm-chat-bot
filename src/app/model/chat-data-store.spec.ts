import { TestBed } from '@angular/core/testing';
import { ChatDataStore } from './chat-data-store';

describe('ChatDataStore', () => {
  let service: ChatDataStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatDataStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
