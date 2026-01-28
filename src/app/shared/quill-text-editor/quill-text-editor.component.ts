import {
    Component,
    ElementRef,
    effect,
    viewChild,
    signal,
    input,
    output,
    AfterViewInit,
} from '@angular/core';
import Quill from 'quill';

@Component({
    standalone: true,
    selector: 'app-quill-text-editor',
    templateUrl: './quill-text-editor.component.html',
    styleUrl: './quill-text-editor.component.scss',
})
export class QuillTextEditorComponent implements AfterViewInit {

    valueChange = output<string>();
    changedValue = input<string>('');

    editorRef = viewChild<ElementRef<HTMLDivElement>>('editor');

    private quillReady = signal(false);
    private quill!: Quill;

    constructor() {
        effect(() => {
            const incoming = this.changedValue();
            const ready = this.quillReady();

            // if (!ready || incoming == null) return;

            if (!ready || incoming == null) return;

            // 🔄 RESET editor
            if (incoming === '') {
                if (this.quill.root.innerHTML !== '<p><br></p>') {
                    this.quill.setText(''); // ✅ canonical Quill reset
                }
                return;
            }

            // ⛔ guard against polluted HTML
            if (incoming.includes('error loading dynamically imported module')) {
                console.warn('Blocked polluted HTML content');
                return;
            }

            const current = this.quill.root.innerHTML;
            if (current !== incoming) {
                this.quill.clipboard.dangerouslyPasteHTML(incoming);
            }
        });

    }

    ngAfterViewInit() {
        this.quill = new Quill(this.editorRef()!.nativeElement, {
            theme: 'snow',
        });

        this.quill.on('text-change', () => {
            this.valueChange.emit(this.quill.root.innerHTML);
        });

        this.quillReady.set(true);
    }
}





