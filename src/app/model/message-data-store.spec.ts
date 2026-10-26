import { TestBed } from '@angular/core/testing';
import { MessageDataStore } from './message-data-store';

describe('MessageDataStore', () => {
  let service: MessageDataStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageDataStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
