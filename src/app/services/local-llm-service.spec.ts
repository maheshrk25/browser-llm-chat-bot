import { TestBed } from '@angular/core/testing';
import { LocalLlmService } from './local-llm-service';

describe('LocalLlmService', () => {
  let service: LocalLlmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalLlmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
