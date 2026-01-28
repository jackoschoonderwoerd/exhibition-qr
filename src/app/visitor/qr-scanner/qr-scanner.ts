import {
    Component,
    OnDestroy,
    AfterViewInit,
    inject,
    signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
    standalone: true,
    selector: 'app-qr-scanner',
    templateUrl: './qr-scanner.html',
    styleUrls: ['./qr-scanner.scss'],
    template: `
    <!-- <div class="scanner">
      <div id="qr-reader"></div>

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
    </div> -->
  `,
    styles: [`
    // .scanner {
    //   display: flex;
    //   justify-content: center;
    //   padding: 1rem;
    // }
    // #qr-reader {
    //   width: 100%;
    //   max-width: 320px;
    // }
  `],
})
export class QrScanner implements AfterViewInit, OnDestroy {
    private router = inject(Router);
    private scanner?: Html5Qrcode;

    error = signal<string | null>(null);
    private scanned = false;

    async ngAfterViewInit() {
        try {
            this.scanner = new Html5Qrcode('qr-reader');

            await this.scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                text => this.onScan(text),
                () => { }
            );
        } catch {
            this.error.set('Camera access denied or unavailable');
        }
    }

    async onScan(text: string) {
        if (this.scanned) return;
        this.scanned = true;

        navigator.vibrate?.(150);

        await this.stop();

        const artifactId = this.extractArtifactId(text);

        if (!artifactId) {
            this.error.set('Invalid QR code');
            return;
        }

        this.router.navigate(['/artifact', artifactId]);
    }

    extractArtifactId(value: string): string | null {
        try {
            const url = new URL(value);
            const parts = url.pathname.split('/');
            return parts.at(-1) ?? null;
        } catch {
            return value || null;
        }
    }

    async stop() {
        if (this.scanner && this.scanner.isScanning) {
            await this.scanner.stop();
            await this.scanner.clear();
        }
    }

    ngOnDestroy() {
        this.stop();
    }
}
