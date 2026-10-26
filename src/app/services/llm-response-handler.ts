import { Service } from '@angular/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Service()
export class LlmResponseHandler {
    formattedResponse(llmResponse: string): string {
        const htmlResponse = marked.parse(llmResponse) as string;
        return DOMPurify.sanitize(htmlResponse);
    }
}
