import { TestBed } from '@angular/core/testing';
import { LlmResponseHandler } from './llm-response-handler';

describe('LlmResponseHandler', () => {
  let service: LlmResponseHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlmResponseHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
