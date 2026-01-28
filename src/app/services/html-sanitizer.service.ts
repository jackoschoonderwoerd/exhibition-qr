import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class HtmlSanitizerService {
    private allowedTags = ['b', 'i', 'u', 'em', 'strong', 'p', 'ul', 'ol', 'li', 'br', 'a'];

    constructor(private sanitizer: DomSanitizer) { }

    sanitize(html: string | null): SafeHtml {
        if (!html) return '';

        const doc = new DOMParser().parseFromString(html, 'text/html');
        this.cleanNode(doc.body);
        return this.sanitizer.bypassSecurityTrustHtml(doc.body.innerHTML);
    }

    private cleanNode(node: HTMLElement) {
        // Remove disallowed child nodes recursively
        Array.from(node.children).forEach((child: any) => {
            if (!this.allowedTags.includes(child.tagName.toLowerCase())) {
                child.remove();
            } else {
                // Strip all attributes except href on <a>
                Array.from(child.attributes).forEach((attr: any) => {
                    if (!(child.tagName.toLowerCase() === 'a' && attr.name === 'href')) {
                        child.removeAttribute(attr.name);
                    }
                });
                this.cleanNode(child); // recurse
            }
        });
    }
}
// What this does:

// Keeps only a minimal set of Quill - safe tags

// Strips any onclick, style, or other unsafe attributes

// Preserves links(href) for <a>tags

// Returns SafeHtml so Angular can render it in [innerHTML]
